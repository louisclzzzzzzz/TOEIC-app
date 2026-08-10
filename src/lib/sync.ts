/**
 * Synchronisation cloud (Supabase) de l'état applicatif.
 *
 * Une seule ligne par utilisateur (`progress`, colonne `state` en jsonb) : pas
 * de schéma relationnel, on rejoue simplement le même blob que `storage.ts`
 * persistait déjà en localStorage.
 *
 * `mergeState` ne sert qu'à la connexion sur un nouvel appareil (état local
 * vide ou partiel face à un état distant existant) : ensuite, un seul appareil
 * à la fois pousse ses écritures, donc un merge complet à chaque changement
 * serait inutile.
 */

import type { AppState, Attempt, ErrorEntry, VocabEntry } from '../types';
import { supabase } from './supabaseClient';

export async function fetchRemoteState(userId: string): Promise<AppState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('progress')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.warn('[sync] lecture distante impossible', error);
    return null;
  }
  return (data?.state as AppState | undefined) ?? null;
}

export async function pushState(userId: string, state: AppState): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('progress')
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
  if (error) console.warn('[sync] écriture distante impossible', error);
}

const attemptKey = (a: Attempt) => `${a.itemId}:${a.at}:${a.chosen}`;

function mergeById<T extends { lastReviewedAt: number }>(
  a: Record<string, T>,
  b: Record<string, T>,
): Record<string, T> {
  const out = { ...a };
  for (const [id, entry] of Object.entries(b)) {
    out[id] = !out[id] || entry.lastReviewedAt >= out[id].lastReviewedAt ? entry : out[id];
  }
  return out;
}

/** Fusionne l'état local (appareil courant) avec l'état distant au moment de la connexion. */
export function mergeState(local: AppState, remote: AppState): AppState {
  const attempts = [...local.attempts, ...remote.attempts]
    .reduce((map, a) => map.set(attemptKey(a), a), new Map<string, Attempt>())
    .values();

  return {
    ...local,
    attempts: [...attempts].sort((x, y) => x.at - y.at),
    errors: mergeById<ErrorEntry>(local.errors, remote.errors),
    vocab: mergeById<VocabEntry>(local.vocab, remote.vocab),
    activeDays: [...new Set([...local.activeDays, ...remote.activeDays])].sort(),
    // Un nouvel appareil (pas encore d'historique local) hérite des réglages
    // distants plutôt que des valeurs par défaut.
    settings: local.attempts.length === 0 ? remote.settings : local.settings,
  };
}
