/**
 * Persistance locale.
 *
 * localStorage suffit largement ici : l'état complet (tentatives + journal
 * d'erreurs) reste de l'ordre de quelques centaines de Ko même après un mois
 * d'usage intensif, et la lecture est synchrone — donc aucun écran de
 * chargement au démarrage.
 */

import type { AppState } from '../types';

const KEY = 'toeic-trainer:v1';

export const DEFAULT_STATE: AppState = {
  version: 1,
  attempts: [],
  errors: {},
  vocab: {},
  activeDays: [],
  settings: {
    // Mistral par défaut : l'audio pré-synthétisé est livré avec le build.
    // Un clip manquant fait basculer `tts.ts` tout seul sur les voix du
    // système, donc l'app reste utilisable telle quelle.
    ttsEngine: 'mistral',
    speechRate: 0.95,
    autoPlay: true,
    sessionLength: 10,
  },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Fusion défensive : un état sauvegardé par une version antérieure de l'app
    // peut manquer de champs. On ne perd jamais les données existantes.
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: {
        ...DEFAULT_STATE.settings,
        ...(parsed.settings ?? {}),
      },
      errors: parsed.errors ?? {},
      vocab: parsed.vocab ?? {},
      attempts: parsed.attempts ?? [],
      activeDays: parsed.activeDays ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    // Quota dépassé : on préfère perdre l'historique ancien qu'échouer en silence.
    console.warn('[storage] écriture impossible', err);
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY);
}

/** Export JSON (sauvegarde manuelle avant un reset, transfert vers un autre appareil). */
export function exportState(state: AppState): string {
  return JSON.stringify(state, null, 2);
}
