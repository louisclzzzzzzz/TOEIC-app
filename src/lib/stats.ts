/** Statistiques dérivées des tentatives : précision, progression, streak. */

import type { Attempt, AppState, PartId } from '../types';
import { ALL_PARTS, PARTS, sectionOf } from './toeic';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Clé de jour locale (et non UTC : une session de 23 h doit compter pour ce jour-là). */
export function dayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export interface PartStat {
  part: PartId;
  attempts: number;
  correct: number;
  /** null quand la partie n'a jamais été travaillée. */
  accuracy: number | null;
  /** Temps de réponse médian, en secondes. */
  medianSec: number | null;
}

export function partStats(attempts: Attempt[]): PartStat[] {
  return ALL_PARTS.map((part) => {
    const list = attempts.filter((a) => a.part === part);
    const correct = list.filter((a) => a.correct).length;
    const times = list.map((a) => a.ms).sort((a, b) => a - b);
    return {
      part,
      attempts: list.length,
      correct,
      accuracy: list.length ? correct / list.length : null,
      medianSec: times.length ? Math.round(times[Math.floor(times.length / 2)] / 100) / 10 : null,
    };
  });
}

/** Précision par catégorie fine, triée du pire au meilleur (min. 2 tentatives). */
export function categoryStats(
  attempts: Attempt[],
  minAttempts = 2,
): { category: string; part: PartId; attempts: number; accuracy: number }[] {
  const map = new Map<string, { part: PartId; n: number; ok: number }>();
  for (const a of attempts) {
    const cur = map.get(a.category) ?? { part: a.part, n: 0, ok: 0 };
    cur.n += 1;
    if (a.correct) cur.ok += 1;
    map.set(a.category, cur);
  }
  return [...map.entries()]
    .filter(([, v]) => v.n >= minAttempts)
    .map(([category, v]) => ({ category, part: v.part, attempts: v.n, accuracy: v.ok / v.n }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export interface DayPoint {
  key: string;
  label: string;
  attempts: number;
  correct: number;
  accuracy: number | null;
}

/** Série journalière sur `days` jours glissants, pour la courbe de progression. */
export function dailySeries(attempts: Attempt[], days = 30): DayPoint[] {
  const buckets = new Map<string, { n: number; ok: number }>();
  for (const a of attempts) {
    const k = dayKey(a.at);
    const cur = buckets.get(k) ?? { n: 0, ok: 0 };
    cur.n += 1;
    if (a.correct) cur.ok += 1;
    buckets.set(k, cur);
  }

  const out: DayPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const k = dayKey(d.getTime());
    const b = buckets.get(k);
    out.push({
      key: k,
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      attempts: b?.n ?? 0,
      correct: b?.ok ?? 0,
      accuracy: b && b.n ? b.ok / b.n : null,
    });
  }
  return out;
}

/**
 * Streak = nombre de jours consécutifs avec au moins une session, en remontant
 * depuis aujourd'hui. Une journée en cours non encore travaillée ne casse pas
 * le streak tant qu'hier est présent.
 */
export function currentStreak(activeDays: string[], now = Date.now()): number {
  const set = new Set(activeDays);
  let streak = 0;
  let cursor = now;
  if (!set.has(dayKey(now))) {
    cursor = now - DAY_MS; // rien fait aujourd'hui : on part d'hier
    if (!set.has(dayKey(cursor))) return 0;
  }
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

export interface GlobalStats {
  totalAttempts: number;
  accuracy: number | null;
  listeningAccuracy: number | null;
  readingAccuracy: number | null;
  streak: number;
  dueCount: number;
  activeCount: number;
  masteredCount: number;
}

export function globalStats(state: AppState, now = Date.now()): GlobalStats {
  const acc = (list: Attempt[]) =>
    list.length ? list.filter((a) => a.correct).length / list.length : null;
  const errors = Object.values(state.errors);
  return {
    totalAttempts: state.attempts.length,
    accuracy: acc(state.attempts),
    listeningAccuracy: acc(state.attempts.filter((a) => sectionOf(a.part) === 'listening')),
    readingAccuracy: acc(state.attempts.filter((a) => sectionOf(a.part) === 'reading')),
    streak: currentStreak(state.activeDays, now),
    dueCount: errors.filter((e) => !e.mastered && e.dueAt <= now).length,
    activeCount: errors.filter((e) => !e.mastered).length,
    masteredCount: errors.filter((e) => e.mastered).length,
  };
}

/**
 * Partie la plus faible : la moins bonne précision parmi celles travaillées au
 * moins 3 fois. Sert au ciblage de la génération IA et au conseil du jour.
 */
export function weakestPart(attempts: Attempt[], minAttempts = 3): PartId | null {
  const candidates = partStats(attempts).filter(
    (s) => s.attempts >= minAttempts && s.accuracy !== null,
  );
  if (!candidates.length) return null;
  return candidates.sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0].part;
}

export const partLabel = (p: PartId) => PARTS[p].label;
