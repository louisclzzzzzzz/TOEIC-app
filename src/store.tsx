/**
 * État global de l'app (React context + useReducer) et persistance localStorage.
 *
 * Volontairement sans librairie d'état : l'app n'a qu'un seul réducteur, et le
 * chargement synchrone de localStorage évite tout écran d'attente au démarrage.
 */

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type {
  AppState,
  Letter,
  PartId,
  QuestionItem,
  QuestionSet,
  SessionMode,
  Settings,
  VocabEntry,
  VocabHint,
} from './types';
import { DEFAULT_STATE, loadState, saveState } from './lib/storage';
import { applyReview, createErrorEntry } from './lib/leitner';
import { addVocabHints, reviewVocab } from './lib/vocab';
import { dayKey } from './lib/stats';
import { supabase } from './lib/supabaseClient';
import { fetchRemoteState, mergeState, pushState } from './lib/sync';

interface AnswerPayload {
  set: QuestionSet;
  item: QuestionItem;
  chosen: Letter;
  ms: number;
  mode: SessionMode;
}

type Action =
  | { type: 'answer'; payload: AnswerPayload }
  | { type: 'settings'; payload: Partial<Settings> }
  | {
      type: 'addVocab';
      payload: {
        hints: VocabHint[];
        source?: { itemId: string; part: PartId };
        origin?: VocabEntry['origin'];
      };
    }
  | { type: 'reviewVocab'; payload: { id: string; known: boolean } }
  | { type: 'removeVocab'; payload: string }
  | { type: 'reset' }
  | { type: 'hydrate'; payload: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'answer': {
      const { set, item, chosen, ms, mode } = action.payload;
      const now = Date.now();
      const correct = chosen === item.answer;

      // 1. Journal des tentatives (base de toutes les statistiques).
      const attempts = [
        ...state.attempts,
        {
          itemId: item.id,
          setId: set.id,
          part: set.part,
          category: item.category,
          correct,
          chosen,
          ms,
          at: now,
          mode,
        },
      ];

      // 2. Journal d'erreurs + Leitner.
      //    Un item n'entre dans la file que par une faute ; ensuite, chaque
      //    nouvelle rencontre (practice ou révision) fait évoluer sa boîte.
      const errors = { ...state.errors };
      const existing = errors[item.id];
      if (existing) {
        errors[item.id] = applyReview(existing, correct, now);
      } else if (!correct) {
        errors[item.id] = createErrorEntry(set, item, chosen, now);
      }

      // 3. Streak d'utilisation.
      const today = dayKey(now);
      const activeDays = state.activeDays.includes(today)
        ? state.activeDays
        : [...state.activeDays, today];

      // Le vocabulaire n'entre plus jamais tout seul au carnet : une faute
      // affiche ses mots clés dans la correction, mais c'est toujours un tap
      // (ou une saisie manuelle) qui les y verse — voir `VocabSheet`.
      return { ...state, attempts, errors, activeDays };
    }

    case 'addVocab': {
      const { hints, source, origin } = action.payload;
      return {
        ...state,
        vocab: addVocabHints(state.vocab, hints, origin ?? 'manual', Date.now(), source),
      };
    }

    case 'reviewVocab': {
      const entry = state.vocab[action.payload.id];
      if (!entry) return state;
      return {
        ...state,
        vocab: {
          ...state.vocab,
          [entry.id]: reviewVocab(entry, action.payload.known, Date.now()),
        },
      };
    }

    case 'removeVocab': {
      const next = { ...state.vocab };
      delete next[action.payload];
      return { ...state, vocab: next };
    }

    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'reset':
      // Les réglages (vitesse de voix, etc.) survivent à une remise à zéro.
      return { ...DEFAULT_STATE, settings: state.settings };

    case 'hydrate':
      // Remplacement complet après fusion avec l'état distant (connexion sur
      // un appareil qui avait déjà de la progression locale).
      return action.payload;
  }
}

export type SyncStatus = 'disabled' | 'idle' | 'syncing' | 'synced' | 'error';

interface AuthCtx {
  configured: boolean;
  session: Session | null;
  status: SyncStatus;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

interface Ctx {
  state: AppState;
  answer: (payload: AnswerPayload) => void;
  setSettings: (patch: Partial<Settings>) => void;
  addVocab: (
    hints: VocabHint[],
    source?: { itemId: string; part: PartId },
    origin?: VocabEntry['origin'],
  ) => void;
  reviewVocabEntry: (id: string, known: boolean) => void;
  removeVocab: (id: string) => void;
  reset: () => void;
  auth: AuthCtx;
}

const AppContext = createContext<Ctx | null>(null);

/**
 * Sync cloud : au chargement, on repart toujours du localStorage (lecture
 * synchrone, pas d'écran d'attente). Si un compte se connecte, on va chercher
 * l'état distant et on le fusionne une fois avec l'état local (voir
 * `mergeState` — utile surtout au premier login sur un nouvel appareil).
 * Ensuite, chaque changement d'état est repoussé vers Supabase (débounce),
 * sans nouvelle fusion : un seul appareil à la fois écrit.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SyncStatus>(supabase ? 'idle' : 'disabled');
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Session initiale + écoute des changements (connexion, déconnexion, refresh).
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Fusion à la connexion : une seule fois par utilisateur (pas à chaque render).
  const mergedFor = useRef<string | null>(null);
  useEffect(() => {
    const userId = session?.user.id;
    if (!supabase || !userId || mergedFor.current === userId) return;
    mergedFor.current = userId;
    setStatus('syncing');
    fetchRemoteState(userId)
      .then((remote) => {
        if (remote) dispatch({ type: 'hydrate', payload: mergeState(stateRef.current, remote) });
        setStatus('synced');
      })
      .catch(() => setStatus('error'));
  }, [session]);

  // Écriture distante à chaque changement d'état, une fois connecté (débounce).
  useEffect(() => {
    const userId = session?.user.id;
    if (!supabase || !userId || mergedFor.current !== userId) return;
    const timer = setTimeout(() => {
      pushState(userId, state).then(
        () => setStatus('synced'),
        () => setStatus('error'),
      );
    }, 1200);
    return () => clearTimeout(timer);
  }, [state, session]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      answer: (payload) => dispatch({ type: 'answer', payload }),
      setSettings: (patch) => dispatch({ type: 'settings', payload: patch }),
      addVocab: (hints, source, origin) =>
        dispatch({ type: 'addVocab', payload: { hints, source, origin } }),
      reviewVocabEntry: (id, known) => dispatch({ type: 'reviewVocab', payload: { id, known } }),
      removeVocab: (id) => dispatch({ type: 'removeVocab', payload: id }),
      reset: () => dispatch({ type: 'reset' }),
      auth: {
        configured: !!supabase,
        session,
        status,
        signInWithEmail: async (email) => {
          if (!supabase) return { error: 'Sync cloud non configurée' };
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
          });
          return { error: error?.message };
        },
        signOut: async () => {
          if (!supabase) return;
          await supabase.auth.signOut();
          mergedFor.current = null;
        },
      },
    }),
    [state, session, status],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}
