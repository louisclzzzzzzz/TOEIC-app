/**
 * Persistance locale.
 *
 * localStorage suffit largement ici : l'état complet (tentatives + journal
 * d'erreurs + questions générées) reste de l'ordre de quelques centaines de Ko
 * même après un mois d'usage intensif, et la lecture est synchrone — donc
 * aucun écran de chargement au démarrage.
 */

import type { AppState, VoiceRole } from '../types';
import { DEFAULT_TTS_MODEL, DEFAULT_VOICES } from './mistralTts';

const KEY = 'toeic-trainer:v1';

export const DEFAULT_STATE: AppState = {
  version: 1,
  generated: [],
  attempts: [],
  errors: {},
  vocab: {},
  activeDays: [],
  settings: {
    // Mistral par défaut : c'est le moteur voulu. Sans clé, `tts.ts` bascule
    // tout seul sur les voix du système, donc l'app reste utilisable telle quelle.
    ttsEngine: 'mistral',
    mistralTtsModel: DEFAULT_TTS_MODEL,
    mistralVoices: DEFAULT_VOICES,
    speechRate: 0.95,
    autoPlay: true,
    sessionLength: 10,
    mistralApiKey: '',
    mistralModel: 'mistral-large-latest',
  },
};

/** Complète les rôles sans voix par les voix préréglées. */
function withDefaultVoices(saved?: Partial<Record<VoiceRole, string>>): Record<VoiceRole, string> {
  const out = { ...DEFAULT_VOICES };
  for (const role of Object.keys(out) as VoiceRole[]) {
    const value = saved?.[role]?.trim();
    if (value) out[role] = value;
  }
  return out;
}

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
        // Objet imbriqué : fusion explicite, sinon un état sauvegardé avant
        // l'arrivée du TTS Mistral écraserait les rôles par `undefined`.
        // Une valeur vide (état écrit par une version antérieure) est remplacée
        // par la voix par défaut : un rôle sans voix n'a pas de sens.
        mistralVoices: withDefaultVoices(parsed.settings?.mistralVoices),
      },
      errors: parsed.errors ?? {},
      vocab: parsed.vocab ?? {},
      attempts: parsed.attempts ?? [],
      generated: parsed.generated ?? [],
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

/**
 * Export JSON (sauvegarde manuelle avant un reset, transfert vers un autre appareil).
 *
 * La clé API est retirée : ce fichier finit souvent dans un dossier partagé, une
 * pièce jointe ou un dépôt Git, et une clé Mistral en clair n'y a rien à faire.
 * À la réimportation, il suffit de la ressaisir dans les réglages.
 */
export function exportState(state: AppState): string {
  const { mistralApiKey: _omitted, ...settings } = state.settings;
  return JSON.stringify({ ...state, settings }, null, 2);
}
