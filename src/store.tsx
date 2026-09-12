/**
 * État global de l'app (React context + useReducer) et persistance localStorage.
 *
 * Volontairement sans librairie d'état : l'app n'a qu'un seul réducteur, et le
 * chargement synchrone de localStorage évite tout écran d'attente au démarrage.
 */

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
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
  | { type: 'heard'; payload: string[] }
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

    /**
     * Fin d'une séance en mode Écoute.
     *
     * Aucune réponse n'est saisie, donc rien n'entre dans les statistiques ni
     * dans les boîtes Leitner — mesurer une précision sur des réponses données
     * dans sa tête serait une invention. On retient seulement les blocs
     * entendus (pour ne pas les resservir) et le fait que la journée a servi :
     * dix minutes d'écoute en marchant, c'est du travail, la série le compte.
     */
    case 'heard': {
      // Séance ouverte puis quittée aussitôt : rien n'a été écouté, rien à noter.
      if (!action.payload.length) return state;
      const now = Date.now();
      const today = dayKey(now);
      return {
        ...state,
        heard: { ...state.heard, ...Object.fromEntries(action.payload.map((id) => [id, now])) },
        activeDays: state.activeDays.includes(today)
          ? state.activeDays
          : [...state.activeDays, today],
      };
    }

    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'reset':
      // Les réglages (vitesse de voix, etc.) survivent à une remise à zéro.
      return { ...DEFAULT_STATE, settings: state.settings };
  }
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
  /** Clôt une séance du mode Écoute : blocs entendus + jour actif. */
  markHeard: (setIds: string[]) => void;
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
      addVocab: (hints, source, origin) =>
        dispatch({ type: 'addVocab', payload: { hints, source, origin } }),
      reviewVocabEntry: (id, known) => dispatch({ type: 'reviewVocab', payload: { id, known } }),
      removeVocab: (id) => dispatch({ type: 'removeVocab', payload: id }),
      markHeard: (setIds) => dispatch({ type: 'heard', payload: setIds }),
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
