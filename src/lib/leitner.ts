/**
 * Révision espacée — système de Leitner à 3 boîtes.
 *
 *   box 0 → revoir le lendemain   (J+1)
 *   box 1 → revoir dans 3 jours   (J+3)
 *   box 2 → revoir dans 7 jours   (J+7)
 *
 * Deux bonnes réponses CONSÉCUTIVES sur un item ⇒ « maîtrisé », il sort de la
 * file active. Une erreur renvoie l'item en boîte 0 et remet le compteur à zéro
 * (y compris sur un item déjà maîtrisé : il redevient actif).
 */

import type { ErrorEntry, LeitnerBox, QuestionItem, QuestionSet } from '../types';

export const BOX_INTERVAL_DAYS: Record<LeitnerBox, number> = { 0: 1, 1: 3, 2: 7 };
export const MASTERY_STREAK = 2;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Échéance = début du jour cible, pour qu'un item de J+1 soit dispo dès le réveil. */
function dueDate(from: number, days: number): number {
  const d = new Date(from + days * DAY_MS);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Champs de planification, communs au journal d'erreurs et au carnet de vocabulaire. */
export interface Scheduled {
  box: LeitnerBox;
  streak: number;
  mastered: boolean;
  dueAt: number;
}

/**
 * Cœur de l'algorithme, partagé par les deux paquets.
 *
 * Bonne réponse → montée d'une boîte (plafond 2), streak +1, maîtrise à 2.
 * Mauvaise réponse → retour boîte 0, streak remis à zéro, démaîtrise.
 */
export function schedule(current: Scheduled, correct: boolean, now: number): Scheduled {
  if (!correct) {
    return { box: 0, streak: 0, mastered: false, dueAt: dueDate(now, BOX_INTERVAL_DAYS[0]) };
  }
  const streak = current.streak + 1;
  const box = Math.min(2, current.box + 1) as LeitnerBox;
  const mastered = streak >= MASTERY_STREAK;
  return {
    box,
    streak,
    mastered,
    // Un item maîtrisé n'a plus d'échéance utile : on le pousse loin.
    dueAt: mastered ? Number.MAX_SAFE_INTEGER : dueDate(now, BOX_INTERVAL_DAYS[box]),
  };
}

/** Sélecteurs génériques : « échu », « à venir », « maîtrisé ». */
export const isDue = (e: Scheduled, now: number) => !e.mastered && e.dueAt <= now;
export const isUpcoming = (e: Scheduled, now: number) => !e.mastered && e.dueAt > now;

/** Crée l'entrée du journal à la première erreur sur un item. */
export function createErrorEntry(
  set: QuestionSet,
  item: QuestionItem,
  chosen: string,
  now: number,
): ErrorEntry {
  const correctChoice = item.choices.find((c) => c.id === item.answer);
  const chosenChoice = item.choices.find((c) => c.id === chosen);
  return {
    itemId: item.id,
    setId: set.id,
    part: set.part,
    category: item.category,
    // Un énoncé court (« Trou (3) ») ne veut rien dire hors contexte : on le
    // préfixe du titre du bloc pour que le journal reste lisible seul.
    promptSnippet: !item.prompt
      ? set.title
      : item.prompt.length < 32
        ? `${set.title} — ${item.prompt}`
        : item.prompt,
    correctAnswer: `${item.answer}. ${correctChoice?.text ?? ''}`,
    chosenAnswer: chosenChoice ? `${chosen}. ${chosenChoice.text}` : chosen,
    explanation: item.explanation,
    createdAt: now,
    lastReviewedAt: now,
    box: 0,
    streak: 0,
    mastered: false,
    dueAt: dueDate(now, BOX_INTERVAL_DAYS[0]),
    attempts: 1,
    timesWrong: 1,
  };
}

/**
 * Applique une réponse à une entrée existante.
 * Bonne réponse → montée d'une boîte (plafonnée à 2) et streak +1.
 * Mauvaise réponse → retour en boîte 0, streak remis à 0, démaîtrise.
 */
export function applyReview(entry: ErrorEntry, correct: boolean, now: number): ErrorEntry {
  return {
    ...entry,
    ...schedule(entry, correct, now),
    lastReviewedAt: now,
    attempts: entry.attempts + 1,
    timesWrong: entry.timesWrong + (correct ? 0 : 1),
  };
}

/** Entrées à revoir maintenant (non maîtrisées et échues). */
export function dueEntries(errors: Record<string, ErrorEntry>, now = Date.now()): ErrorEntry[] {
  return Object.values(errors)
    .filter((e) => !e.mastered && e.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || b.timesWrong - a.timesWrong);
}

/** Entrées actives mais pas encore échues (affichées comme « à venir »). */
export function upcomingEntries(errors: Record<string, ErrorEntry>, now = Date.now()): ErrorEntry[] {
  return Object.values(errors)
    .filter((e) => !e.mastered && e.dueAt > now)
    .sort((a, b) => a.dueAt - b.dueAt);
}

export function masteredEntries(errors: Record<string, ErrorEntry>): ErrorEntry[] {
  return Object.values(errors).filter((e) => e.mastered);
}

/** Libellé humain d'une échéance (« aujourd'hui », « dans 3 j »…). */
export function dueLabel(dueAt: number, now = Date.now()): string {
  if (dueAt === Number.MAX_SAFE_INTEGER) return 'maîtrisé';
  if (dueAt <= now) return "à revoir";
  const days = Math.ceil((dueAt - now) / DAY_MS);
  if (days <= 1) return 'demain';
  return `dans ${days} j`;
}
