/**
 * Carnet de vocabulaire.
 *
 * Toujours alimenté à la main (un tap ou une saisie) : `origin` distingue
 * seulement le contexte de l'ajout —
 *  - « missed » : un mot clé ajouté depuis la correction d'une question ratée ;
 *  - « manual » : un mot saisi à la main, ici ou pendant une session.
 *
 * La planification réutilise telle quelle la mécanique Leitner du journal
 * d'erreurs (`lib/leitner.ts`), mais le paquet est distinct : on révise des
 * mots, pas des questions.
 */

import type { PartId, VocabEntry, VocabHint } from '../types';
import { isDue, isUpcoming, schedule } from './leitner';

/**
 * Identifiant normalisé : c'est lui qui évite les doublons entre « To postpone »,
 * « postpone » et « postpone, ». L'orthographe affichée reste celle saisie.
 */
export function vocabId(term: string): string {
  return term
    .toLowerCase()
    .trim()
    .replace(/^(to|a|an|the)\s+/, '')
    .replace(/[.,;:!?"'’]/g, '')
    .replace(/\s+/g, ' ');
}

export function createVocabEntry(
  hint: VocabHint,
  origin: VocabEntry['origin'],
  now: number,
  source?: { itemId: string; part: PartId },
): VocabEntry {
  return {
    id: vocabId(hint.term),
    term: hint.term.trim(),
    translation: hint.translation.trim(),
    example: hint.example?.trim(),
    note: hint.note?.trim(),
    origin,
    sourceItemId: source?.itemId,
    sourcePart: source?.part,
    createdAt: now,
    lastReviewedAt: 0,
    box: 0,
    streak: 0,
    mastered: false,
    // Échéance immédiate, contrairement au journal d'erreurs : un mot qu'on
    // vient de rater ou de signaler doit pouvoir être travaillé dans la foulée.
    dueAt: now,
    reviews: 0,
    lapses: 0,
  };
}

/** Applique une réponse de révision (« je savais » / « à revoir »). */
export function reviewVocab(entry: VocabEntry, known: boolean, now: number): VocabEntry {
  return {
    ...entry,
    ...schedule(entry, known, now),
    lastReviewedAt: now,
    reviews: entry.reviews + 1,
    lapses: entry.lapses + (known ? 0 : 1),
  };
}

/**
 * Ajoute des termes au carnet sans écraser ce qui existe.
 * Un mot déjà connu conserve sa progression : le revoir dans une autre question
 * ne doit pas remettre son compteur à zéro.
 */
export function addVocabHints(
  current: Record<string, VocabEntry>,
  hints: VocabHint[],
  origin: VocabEntry['origin'],
  now: number,
  source?: { itemId: string; part: PartId },
): Record<string, VocabEntry> {
  if (!hints.length) return current;
  const next = { ...current };
  for (const hint of hints) {
    if (!hint.term?.trim() || !hint.translation?.trim()) continue;
    const id = vocabId(hint.term);
    if (next[id]) continue;
    next[id] = createVocabEntry(hint, origin, now, source);
  }
  return next;
}

/* --- Sélecteurs ---------------------------------------------------- */

const byDue = (a: VocabEntry, b: VocabEntry) => a.dueAt - b.dueAt || b.lapses - a.lapses;

export const dueVocab = (vocab: Record<string, VocabEntry>, now = Date.now()): VocabEntry[] =>
  Object.values(vocab)
    .filter((e) => isDue(e, now))
    .sort(byDue);

export const upcomingVocab = (vocab: Record<string, VocabEntry>, now = Date.now()): VocabEntry[] =>
  Object.values(vocab)
    .filter((e) => isUpcoming(e, now))
    .sort(byDue);

export const masteredVocab = (vocab: Record<string, VocabEntry>): VocabEntry[] =>
  Object.values(vocab)
    .filter((e) => e.mastered)
    .sort((a, b) => b.lastReviewedAt - a.lastReviewedAt);

export interface VocabStats {
  total: number;
  due: number;
  active: number;
  mastered: number;
  /** Mots oubliés au moins deux fois : les plus coriaces. */
  stubborn: number;
}

export function vocabStats(vocab: Record<string, VocabEntry>, now = Date.now()): VocabStats {
  const all = Object.values(vocab);
  return {
    total: all.length,
    due: all.filter((e) => isDue(e, now)).length,
    active: all.filter((e) => !e.mastered).length,
    mastered: all.filter((e) => e.mastered).length,
    stubborn: all.filter((e) => e.lapses >= 2 && !e.mastered).length,
  };
}

/** Tire une file de révision, les mots les plus oubliés en premier. */
export function buildVocabSession(
  vocab: Record<string, VocabEntry>,
  limit = 20,
  now = Date.now(),
): VocabEntry[] {
  return dueVocab(vocab, now).slice(0, limit);
}
