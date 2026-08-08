/**
 * Vérifications de la logique métier et de l'intégrité de la banque.
 *
 *   npm run check
 *
 * Volontairement sans framework de test : un fichier, des assertions lisibles,
 * exécuté via esbuild + node. Sert de garde-fou quand on étend la banque de
 * questions ou qu'on touche aux règles Leitner.
 */
import { applyReview, createErrorEntry, dueEntries } from '../src/lib/leitner';
import { currentStreak, dayKey, partStats, weakestPart } from '../src/lib/stats';
import { buildExamSession, examDurationSec, partWeights, buildMixedSession, buildPracticeSession, buildReviewSession } from '../src/lib/selection';
import { QUESTION_BANK } from '../src/data/questions';
import { addVocabHints, reviewVocab, vocabId, vocabStats } from '../src/lib/vocab';
import { DEFAULT_STATE } from '../src/lib/storage';
import type { Attempt, AppState } from '../src/types';

let failures = 0;
const check = (label: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    failures++;
    console.log(`  ✗ ${label}`, extra ?? '');
  } else console.log(`  ✓ ${label}`);
};

const DAY = 86_400_000;
const now = Date.now();

console.log('\n— Banque —');
const ids = QUESTION_BANK.flatMap((s) => s.items.map((i) => i.id));
check('ids uniques', new Set(ids).size === ids.length);
check(
  'réponse toujours dans les propositions',
  QUESTION_BANK.every((s) => s.items.every((i) => i.choices.some((c) => c.id === i.answer))),
);
check(
  'Part 2 → 3 propositions, autres → 4',
  QUESTION_BANK.every((s) => s.items.every((i) => i.choices.length === (s.part === 2 ? 3 : 4))),
);
check(
  'toute question de listening a un script audio',
  QUESTION_BANK.filter((s) => s.part <= 4).every((s) => s.audio || s.items.every((i) => i.audio)),
);
check(
  'Parts 1 et 2 : aucun énoncé imprimé',
  QUESTION_BANK.filter((s) => s.part <= 2).every((s) => s.items.every((i) => !i.prompt)),
);
check(
  'Parts 3 à 7 : énoncé imprimé partout',
  QUESTION_BANK.filter((s) => s.part >= 3).every((s) => s.items.every((i) => !!i.prompt)),
);
check(
  'chaque question a une explication',
  QUESTION_BANK.every((s) => s.items.every((i) => i.explanation.length > 40)),
);
check(
  'Part 6 : 4 trous numérotés présents dans le passage',
  QUESTION_BANK.filter((s) => s.part === 6).every((s) =>
    s.items.every((_, n) => s.passages![0].body.includes(`___(${n + 1})___`)),
  ),
);
console.log(`  → ${QUESTION_BANK.length} blocs, ${ids.length} questions`);

console.log('\n— Vocabulaire —');
const allHints = QUESTION_BANK.flatMap((s) => s.items.flatMap((i) => i.vocab ?? []));
check('chaque terme a une traduction', allHints.every((h) => h.term.trim() && h.translation.trim()));
const withVocab = QUESTION_BANK.flatMap((s) => s.items).filter((i) => i.vocab?.length);
check(
  'toutes les questions portent du vocabulaire',
  withVocab.length === QUESTION_BANK.flatMap((s) => s.items).length,
  `${withVocab.length} questions couvertes`,
);
const normalized = allHints.map((h) => vocabId(h.term));
check('aucun terme vide après normalisation', normalized.every((id) => id.length > 1));
check(
  'les doublons de termes se replient sur une seule fiche',
  new Set(normalized).size ===
    Object.keys(addVocabHints({}, allHints, 'missed', now)).length,
);

// Un mot déjà connu ne doit pas repartir de zéro parce qu'il réapparaît ailleurs.
const deck0 = addVocabHints({}, [allHints[0]], 'missed', now);
const advanced = { ...deck0, [allHints[0].term && vocabId(allHints[0].term)]: reviewVocab(Object.values(deck0)[0], true, now) };
const deck1 = addVocabHints(advanced, [allHints[0]], 'missed', now);
check('un terme déjà au carnet conserve sa progression', Object.values(deck1)[0].box === 1);
check('une fiche fraîche est révisable tout de suite', Object.values(deck0)[0].dueAt <= now);

const v0 = Object.values(deck0)[0];
const vKnown = reviewVocab(reviewVocab(v0, true, now), true, now);
check('2 « je savais » consécutifs → acquis', vKnown.mastered && vKnown.reviews === 2);
const vLapse = reviewVocab(vKnown, false, now);
check('un oubli ramène en boîte 0 et compte le lapse', vLapse.box === 0 && vLapse.lapses === 1);
check('les stats du carnet comptent les échus', vocabStats(deck0, now).due === 1);

console.log('\n— Leitner —');
const set = QUESTION_BANK[0];
const item = set.items[0];
let e = createErrorEntry(set, item, 'A', now);
check('création → boîte 0, échéance J+1', e.box === 0 && e.dueAt > now && e.dueAt < now + 2 * DAY);
check('non maîtrisé à la création', !e.mastered && e.streak === 0);

e = applyReview(e, true, now);
check('1re bonne réponse → boîte 1, streak 1', e.box === 1 && e.streak === 1 && !e.mastered);
// L'échéance est calée sur MINUIT du jour cible : on compare des jours, pas des ms.
check('échéance = J+3 à minuit', dayKey(e.dueAt) === dayKey(now + 3 * DAY) && new Date(e.dueAt).getHours() === 0);
check('non échu avant le jour cible', dueEntries({ x: e }, now + 2 * DAY).length === 0);
check('échu le jour cible', dueEntries({ x: e }, now + 3 * DAY).length === 1);

e = applyReview(e, true, now);
check('2e bonne réponse consécutive → maîtrisé', e.mastered && e.streak === 2);
check('sort de la file active', dueEntries({ x: e }, now + 400 * DAY).length === 0);

e = applyReview(e, false, now);
check('erreur → retour boîte 0 et démaîtrise', e.box === 0 && !e.mastered && e.streak === 0);
check('compteurs cumulés', e.attempts === 4 && e.timesWrong === 2);

const e2 = applyReview(applyReview(createErrorEntry(set, item, 'A', now), true, now), false, now);
check('streak cassé par une erreur', e2.streak === 0);
const e3 = applyReview(applyReview(e2, true, now), true, now);
check('deux bonnes après une rechute → maîtrisé', e3.mastered);

console.log('\n— Streak d’utilisation —');
const d = (n: number) => dayKey(now - n * DAY);
check('3 jours consécutifs', currentStreak([d(0), d(1), d(2)], now) === 3);
check('rien aujourd’hui mais hier → streak conservé', currentStreak([d(1), d(2)], now) === 2);
check('trou de 2 jours → streak nul', currentStreak([d(2), d(3)], now) === 0);
check('aucune activité → 0', currentStreak([], now) === 0);

console.log('\n— Pondération du mode mixte —');
const mk = (part: 1 | 5, correct: boolean, i: number): Attempt => ({
  itemId: `x${i}`,
  setId: 's',
  part,
  category: 'c',
  correct,
  chosen: 'A',
  ms: 1000,
  at: now,
  mode: 'practice',
});
const attempts: Attempt[] = [
  ...Array.from({ length: 10 }, (_, i) => mk(1, false, i)), // 100 % d'erreur
  ...Array.from({ length: 10 }, (_, i) => mk(5, true, i + 10)), // 100 % de réussite
];
const w = partWeights(attempts);
check('partie ratée plus lourde que partie réussie', w[1] > w[5], w);
check('partie jamais vue gardée à un poids moyen', w[3] === 1.6, w[3]);
check('partie la plus faible détectée', weakestPart(attempts) === 1);
check('précision par partie correcte', partStats(attempts).find((s) => s.part === 1)!.accuracy === 0);

console.log('\n— Construction des sessions —');
const state: AppState = { ...DEFAULT_STATE, attempts };
const practice = buildPracticeSession(state, [5], 6);
check(
  'practice ciblé ne sort que la partie demandée',
  practice.every((b) => b.set.part === 5),
);
check('practice atteint la taille demandée', practice.reduce((n, b) => n + b.items.length, 0) >= 6);

const mixed = buildMixedSession(state, 10);
check('mixte atteint la taille demandée', mixed.reduce((n, b) => n + b.items.length, 0) >= 10);
check('mixte ne répète aucun bloc', new Set(mixed.map((b) => b.set.id)).size === mixed.length);

const exam = buildExamSession(state);
const examItems = exam.reduce((n, b) => n + b.items.length, 0);
check('examen : ordre des parties croissant', exam.every((b, i) => i === 0 || exam[i - 1].set.part <= b.set.part));
check('examen : durée cohérente avec le rythme réel', Math.abs(examDurationSec(exam) / examItems - 35) < 12);
console.log(`  → examen : ${examItems} questions, ${Math.round(examDurationSec(exam) / 60)} min`);

const withErrors: AppState = {
  ...state,
  errors: {
    [item.id]: createErrorEntry(set, item, 'A', now - 3 * DAY),
    [QUESTION_BANK[10].items[0].id]: createErrorEntry(
      QUESTION_BANK[10],
      QUESTION_BANK[10].items[0],
      'A',
      now - 3 * DAY,
    ),
  },
};
const review = buildReviewSession(withErrors, 20, now);
check('révision ne rejoue que les items échus', review.reduce((n, b) => n + b.items.length, 0) === 2);
check(
  'révision regroupe les items par bloc',
  new Set(review.map((b) => b.set.id)).size === review.length,
);

console.log(failures ? `\n${failures} vérification(s) en échec\n` : '\nToutes les vérifications passent\n');
// Code de sortie non nul en cas d'échec (déclaré ici pour éviter @types/node).
declare const process: { exitCode: number };
process.exitCode = failures ? 1 : 0;
