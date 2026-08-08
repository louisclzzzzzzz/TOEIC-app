/**
 * Construction des sessions : practice ciblé, mixte pondéré, révision, examen blanc.
 *
 * Principe : l'unité de tirage est le SET (on ne coupe jamais une conversation
 * de Part 3 en deux), sauf en mode révision où l'on ne rejoue que les items
 * réellement échus.
 */

import { QUESTION_BANK } from '../data/questions';
import type { Attempt, AppState, ErrorEntry, PartId, QuestionItem, QuestionSet } from '../types';
import { ALL_PARTS, PARTS, SECONDS_PER_QUESTION, sectionOf } from './toeic';
import { dueEntries } from './leitner';

/** Bloc de session : un stimulus + les questions à poser pour ce stimulus. */
export interface SessionBlock {
  set: QuestionSet;
  items: QuestionItem[];
}

/** Banque complète = questions codées en dur + questions générées par IA. */
export function allSets(state: AppState): QuestionSet[] {
  return [...QUESTION_BANK, ...state.generated];
}

export function findSet(sets: QuestionSet[], setId: string): QuestionSet | undefined {
  return sets.find((s) => s.id === setId);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function countItems(blocks: SessionBlock[]): number {
  return blocks.reduce((n, b) => n + b.items.length, 0);
}

/**
 * Ordonne les sets d'une partie : d'abord ceux jamais vus, puis les plus anciens.
 * Évite de retomber sur la même conversation deux sessions de suite.
 */
function byFreshness(sets: QuestionSet[], attempts: Attempt[]): QuestionSet[] {
  const lastSeen = new Map<string, number>();
  for (const a of attempts) {
    lastSeen.set(a.setId, Math.max(lastSeen.get(a.setId) ?? 0, a.at));
  }
  return shuffle(sets).sort((a, b) => (lastSeen.get(a.id) ?? 0) - (lastSeen.get(b.id) ?? 0));
}

/** Ajoute des sets entiers d'une partie jusqu'à atteindre `targetItems`. */
function takeSets(
  sets: QuestionSet[],
  part: PartId,
  targetItems: number,
  attempts: Attempt[],
  used: Set<string>,
): SessionBlock[] {
  const pool = byFreshness(
    sets.filter((s) => s.part === part && !used.has(s.id)),
    attempts,
  );
  const blocks: SessionBlock[] = [];
  for (const set of pool) {
    if (countItems(blocks) >= targetItems) break;
    used.add(set.id);
    blocks.push({ set, items: set.items });
  }
  return blocks;
}

/* ------------------------------------------------------------------ */
/* Mode practice ciblé                                                 */
/* ------------------------------------------------------------------ */

export function buildPracticeSession(
  state: AppState,
  parts: PartId[],
  targetItems: number,
): SessionBlock[] {
  const sets = allSets(state);
  const blocks: SessionBlock[] = [];

  // Une file par partie, ordonnée « jamais vu d'abord ».
  const pools = new Map<PartId, QuestionSet[]>();
  for (const part of parts) {
    const pool = byFreshness(
      sets.filter((s) => s.part === part),
      state.attempts,
    );
    if (pool.length) pools.set(part, pool);
  }

  // Tour de rôle entre les parties demandées, pour un mélange équilibré.
  const rotation = shuffle([...pools.keys()]);
  let i = 0;
  while (countItems(blocks) < targetItems && pools.size) {
    const part = rotation[i++ % rotation.length];
    const pool = pools.get(part);
    if (!pool) continue; // partie déjà épuisée
    const set = pool.shift()!;
    if (!pool.length) pools.delete(part);
    blocks.push({ set, items: set.items });
  }
  // La session peut être plus courte que demandé si la banque est petite :
  // c'est volontaire, mieux vaut ça que rejouer deux fois le même bloc.
  return blocks;
}

/* ------------------------------------------------------------------ */
/* Mode mixte pondéré                                                  */
/* ------------------------------------------------------------------ */

/**
 * Poids d'une partie dans le tirage mixte.
 *
 *  - jamais travaillée      → 1.6 (on veut d'abord mesurer le niveau)
 *  - travaillée             → 0.5 + 3 × taux d'erreur
 *
 * Une partie à 100 % de réussite garde donc un poids de 0.5 (elle réapparaît
 * de temps en temps), une partie à 50 % d'erreur monte à 2.0.
 */
export function partWeights(attempts: Attempt[]): Record<PartId, number> {
  const weights = {} as Record<PartId, number>;
  for (const part of ALL_PARTS) {
    const list = attempts.filter((a) => a.part === part);
    if (list.length < 2) {
      weights[part] = 1.6;
      continue;
    }
    const errorRate = list.filter((a) => !a.correct).length / list.length;
    weights[part] = 0.5 + 3 * errorRate;
  }
  return weights;
}

function weightedPick(weights: Record<PartId, number>, available: PartId[]): PartId {
  const total = available.reduce((s, p) => s + weights[p], 0);
  let r = Math.random() * total;
  for (const p of available) {
    r -= weights[p];
    if (r <= 0) return p;
  }
  return available[available.length - 1];
}

export function buildMixedSession(state: AppState, targetItems: number): SessionBlock[] {
  const sets = allSets(state);
  const weights = partWeights(state.attempts);
  const used = new Set<string>();
  const blocks: SessionBlock[] = [];

  let guard = 0;
  while (countItems(blocks) < targetItems && guard < 200) {
    guard += 1;
    const available = ALL_PARTS.filter((p) => sets.some((s) => s.part === p && !used.has(s.id)));
    if (!available.length) break;
    const part = weightedPick(weights, available);
    blocks.push(...takeSets(sets, part, 1, state.attempts, used));
  }
  return blocks;
}

/* ------------------------------------------------------------------ */
/* Mode révision (Leitner)                                             */
/* ------------------------------------------------------------------ */

/**
 * Rejoue uniquement les items échus. Les items d'un même set sont regroupés
 * pour ne diffuser l'audio / afficher le passage qu'une seule fois.
 */
export function buildReviewSession(
  state: AppState,
  limit = 20,
  now = Date.now(),
): SessionBlock[] {
  const sets = allSets(state);
  const due: ErrorEntry[] = dueEntries(state.errors, now).slice(0, limit);
  const bySet = new Map<string, QuestionItem[]>();

  for (const entry of due) {
    const set = findSet(sets, entry.setId);
    const item = set?.items.find((i) => i.id === entry.itemId);
    if (!set || !item) continue; // set supprimé entre-temps : on ignore
    bySet.set(entry.setId, [...(bySet.get(entry.setId) ?? []), item]);
  }

  return [...bySet.entries()].map(([setId, items]) => ({
    set: findSet(sets, setId)!,
    items,
  }));
}

/* ------------------------------------------------------------------ */
/* Examen blanc chronométré                                            */
/* ------------------------------------------------------------------ */

/** Fraction d'examen réel simulée (0.2 ⇒ ~20 questions par section). */
export const EXAM_SCALE = 0.2;

/** Objectif de questions par partie, proportionnel à l'examen réel. */
export function examBlueprint(): Record<PartId, number> {
  const bp = {} as Record<PartId, number>;
  for (const part of ALL_PARTS) {
    bp[part] = Math.max(1, Math.round(PARTS[part].realCount * EXAM_SCALE));
  }
  return bp;
}

export function buildExamSession(state: AppState): SessionBlock[] {
  const sets = allSets(state);
  const bp = examBlueprint();
  const used = new Set<string>();
  const blocks: SessionBlock[] = [];
  // Ordre d'examen : Part 1 → 7, sans mélange entre les parties.
  for (const part of ALL_PARTS) {
    blocks.push(...takeSets(sets, part, bp[part], state.attempts, used));
  }
  return blocks;
}

/** Durée allouée à une section, dérivée du rythme réel de l'examen. */
export function sectionDurationSec(blocks: SessionBlock[], section: 'listening' | 'reading'): number {
  const n = blocks
    .filter((b) => sectionOf(b.set.part) === section)
    .reduce((s, b) => s + b.items.length, 0);
  return Math.round(n * SECONDS_PER_QUESTION[section]);
}

/** Durée totale de l'examen blanc, en secondes. */
export function examDurationSec(blocks: SessionBlock[]): number {
  return sectionDurationSec(blocks, 'listening') + sectionDurationSec(blocks, 'reading');
}
