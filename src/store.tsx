/**
 * État global de l'app (React context + useReducer) et persistance localStorage.
 *
 * Volontairement sans librairie d'état : l'app n'a qu'un seul réducteur, et le
 * chargement synchrone de localStorage évite tout écran d'attente au démarrage.
 */

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState,
  Letter,
  PartId,
  QuestionItem,
  QuestionSet,
  SessionMode,
  Settings,
  VocabHint,
} from './types';
import { DEFAULT_STATE, loadState, saveState } from './lib/storage';
import { applyReview, createErrorEntry } from './lib/leitner';
import { addVocabHints, reviewVocab } from './lib/vocab';
import { hasServerKey, probeServerKey } from './lib/mistralApi';
import { dayKey } from './lib/stats';

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
  | { type: 'addGenerated'; payload: QuestionSet }
  | { type: 'removeGenerated'; payload: string }
  | {
      type: 'addVocab';
      payload: { hints: VocabHint[]; source?: { itemId: string; part: PartId } };
    }
  | { type: 'reviewVocab'; payload: { id: string; known: boolean } }
  | { type: 'removeVocab'; payload: string }
  | { type: 'reset' };

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

      // 3. Vocabulaire : les mots clés d'une question ratée entrent au carnet.
      //    Un mot déjà présent garde sa progression (voir `addVocabHints`).
      const vocab = correct
        ? state.vocab
        : addVocabHints(state.vocab, item.vocab ?? [], 'missed', now, {
            itemId: item.id,
            part: set.part,
          });

      // 4. Streak d'utilisation.
      const today = dayKey(now);
      const activeDays = state.activeDays.includes(today)
        ? state.activeDays
        : [...state.activeDays, today];

      return { ...state, attempts, errors, vocab, activeDays };
    }

    case 'addVocab': {
      const { hints, source } = action.payload;
      return {
        ...state,
        vocab: addVocabHints(state.vocab, hints, 'manual', Date.now(), source),
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

    case 'addGenerated':
      return { ...state, generated: [...state.generated, action.payload] };

    case 'removeGenerated':
      return { ...state, generated: state.generated.filter((s) => s.id !== action.payload) };

    case 'reset':
      // Les réglages (clé API, vitesse de voix) survivent à une remise à zéro.
      return { ...DEFAULT_STATE, settings: state.settings };
  }
}

interface Ctx {
  state: AppState;
  answer: (payload: AnswerPayload) => void;
  setSettings: (patch: Partial<Settings>) => void;
  addGenerated: (set: QuestionSet) => void;
  removeGenerated: (id: string) => void;
  addVocab: (hints: VocabHint[], source?: { itemId: string; part: PartId }) => void;
  reviewVocabEntry: (id: string, known: boolean) => void;
  removeVocab: (id: string) => void;
  reset: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      answer: (payload) => dispatch({ type: 'answer', payload }),
      setSettings: (patch) => dispatch({ type: 'settings', payload: patch }),
      addGenerated: (set) => dispatch({ type: 'addGenerated', payload: set }),
      removeGenerated: (id) => dispatch({ type: 'removeGenerated', payload: id }),
      addVocab: (hints, source) => dispatch({ type: 'addVocab', payload: { hints, source } }),
      reviewVocabEntry: (id, known) => dispatch({ type: 'reviewVocab', payload: { id, known } }),
      removeVocab: (id) => dispatch({ type: 'removeVocab', payload: id }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}

/**
 * Les fonctions Mistral sont-elles utilisables ?
 *
 * Deux sources possibles : la clé saisie dans les réglages, ou celle de
 * l'hébergeur (`MISTRAL_API_KEY`), que le client découvre via une sonde. D'où
 * ce hook plutôt qu'un simple test sur les réglages : la réponse du serveur
 * arrive après le premier rendu et doit provoquer un re-render.
 */
export function useMistralAccess(): boolean {
  const { state } = useApp();
  const [serverKey, setServerKey] = useState(hasServerKey);

  useEffect(() => {
    void probeServerKey().then(setServerKey);
  }, []);

  return Boolean(state.settings.mistralApiKey.trim()) || serverKey;
}
