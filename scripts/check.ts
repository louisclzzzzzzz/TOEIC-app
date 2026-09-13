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
import {
  HANDS_FREE_PARTS,
  PART_PRESETS,
  buildChapters,
  buildHandsFreeSession,
  handsFreeLines,
  speakable,
  spokenSeconds,
} from '../src/lib/handsFree';
import { addVocabHints, reviewVocab, vocabId, vocabStats } from '../src/lib/vocab';
import { DEFAULT_STATE } from '../src/lib/storage';
import { nextIndex, renumber, setToSource } from '../src/lib/seedExport';
import type { Attempt, AppState, QuestionSet } from '../src/types';

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

// L'export TypeScript est le seul chemin entre une question générée et le
// dépôt : s'il produit du code faux, la perte est silencieuse. On relit donc ce
// qu'il écrit et on le compare à la source.
console.log('\n— Export vers le dépôt —');
const sample = ['p1-01', 'p2-01', 'p3-01', 'p6-01', 'p7-02'].map(
  (id) => QUESTION_BANK.find((s) => s.id === id)!,
);
const emitted = sample.map(setToSource).join('\n');
let reparsed: QuestionSet[] = [];
try {
  // Les littéraux émis sont du JS valide : on peut les relire tels quels.
  reparsed = new Function(`return [\n${emitted}\n];`)() as QuestionSet[];
  check('le code émis se relit sans erreur', reparsed.length === sample.length);
} catch (err) {
  check('le code émis se relit sans erreur', false, err);
}
// L'émetteur écrit les clés dans un ordre fixe, là où les fichiers rédigés à la
// main varient (`speaker, voice, text` ici, `text, voice` là). On compare donc
// les données, pas leur mise en forme.
const stable = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.entries(value as Record<string, unknown>)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => [k, stable(v)]),
        )
      : value;

check(
  'aucune donnée perdue à l’aller-retour',
  JSON.stringify(stable(reparsed)) ===
    JSON.stringify(stable(sample.map((s) => ({ ...s, source: 'seed' })))),
);
check(
  'les trous de Part 6 survivent au gabarit multiligne',
  reparsed.find((s) => s.part === 6)!.passages![0].body.includes('___(4)___'),
);
const renumbered = renumber(sample[1], 41);
check(
  'la renumérotation suit la convention pN-XX',
  renumbered.id === 'p2-41' && renumbered.items[0].id === 'p2-41-q1',
);
check('le prochain index part du dernier utilisé', nextIndex(QUESTION_BANK, 5) === 41);

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

console.log('\n— Mode Écoute (mains libres) —');
const hfOpts = { thinkSec: 5, rate: 0.95 };
const hfChapters = QUESTION_BANK.flatMap((s) => buildChapters(s, hfOpts));
const hfSpoken = hfChapters.flatMap((c) => c.beats.flatMap((b) => (b.line ? [b.line.text] : [])));

check('la Part 1 est écartée (les photos ne s’écoutent pas)', hfChapters.every((c) => c.part !== 1));
check(
  'chaque question de Part 2 à 7 devient un chapitre',
  hfChapters.filter((c) => c.itemId).length ===
    QUESTION_BANK.filter((s) => s.part !== 1).reduce((n, s) => n + s.items.length, 0),
);
check(
  'chaque chapitre de question porte sa correction',
  hfChapters
    .filter((c) => c.itemId)
    .every((c) => !!c.reveal?.text && !!c.reveal.explanation && !!c.question?.choices.length),
);
check(
  'chaque question laisse un temps de réflexion puis annonce la réponse',
  hfChapters
    .filter((c) => c.itemId)
    .every((c) => {
      const think = c.beats.findIndex((b) => b.role === 'think');
      return think > 0 && c.beats.slice(think).some((b) => b.role === 'answer');
    }),
);
// Ce qui part à la synthèse est lu tel quel : un marqueur de mise en page qui
// survit ici s'entendra (« underscore, underscore, two »).
check('aucune réplique vide', hfSpoken.every((t) => t.trim().length > 1));
check(
  'aucun marqueur de mise en page prononcé',
  hfSpoken.every((t) => !/_{2,}|-{2,}|\|/.test(t)),
  hfSpoken.find((t) => /_{2,}|-{2,}|\|/.test(t)),
);
check('« ---- » devient « blank »', speakable('submit it ---- Friday') === 'submit it blank Friday.');
check('trou numéroté', speakable('will ___(2)___ work') === 'will blank two work.');
check('en-tête d’email', speakable('To: All staff | From: HR') === 'To: All staff. From: HR.');
check('plage horaire', speakable('9:30–11:30 on 22 May') === '9:30 to 11:30 on 22 May.');
check('ponctuation finale ajoutée une seule fois', speakable('Room B2') === 'Room B2.');

check(
  'les trous se prononcent « blank »',
  buildChapters(QUESTION_BANK.find((s) => s.part === 6)!, hfOpts)[0].beats.some((b) =>
    b.line?.text.includes('blank one'),
  ),
);
const p5 = buildChapters(QUESTION_BANK.find((s) => s.id === 'p5-01')!, hfOpts)[0];
check(
  'Part 5 : la correction relit la phrase complétée',
  p5.beats.at(-1)!.line!.text.includes('will have completed'),
);
// Les trois réponses de Part 2 sont déjà enregistrées par de vraies voix :
// les faire relire au narrateur doublerait les clips ET changerait l'exercice.
const p2 = QUESTION_BANK.filter((s) => s.part === 2);
check(
  'Part 2 : les propositions réutilisent les clips existants',
  p2.every((s) =>
    buildChapters(s, hfOpts)[0].beats
      .filter((b) => b.role === 'choice' || (b.role === 'answer' && b.line?.voice !== 'narrator'))
      .every((b) => s.items[0].audio!.some((l) => l.text === b.line!.text)),
  ),
);

const hfLines = handsFreeLines(QUESTION_BANK);
const bankLines = new Set(
  QUESTION_BANK.flatMap((s) => [...(s.audio ?? []), ...s.items.flatMap((i) => i.audio ?? [])]).map(
    (l) => `${l.voice ?? 'narrator'}|${l.text}`,
  ),
);
check(
  'toute réplique jouée est bien collectée pour la synthèse',
  new Set(hfLines.map((l) => `${l.voice ?? 'narrator'}|${l.text}`)).size ===
    new Set(
      hfChapters.flatMap((c) =>
        c.beats.flatMap((b) => (b.line ? [`${b.line.voice ?? 'narrator'}|${b.line.text}`] : [])),
      ),
    ).size,
);
const extra = hfLines.filter((l) => !bankLines.has(`${l.voice ?? 'narrator'}|${l.text}`));
console.log(
  `  → ${hfLines.length} répliques, dont ${extra.length} à synthétiser en plus de la banque` +
    ` (${Math.round(extra.reduce((n, l) => n + l.text.length, 0) / 1000)} k caractères,` +
    ` ≈ ${Math.round(extra.reduce((n, l) => n + spokenSeconds(l.text, 1), 0) / 60)} min d’audio)`,
);

// Une séance doit tomber près de la durée demandée : trop courte, elle finit
// avant la fin de la marche ; trop longue, elle ne tient pas dans la pause.
const ALL_HF = HANDS_FREE_PARTS;
for (const minutes of [5, 10, 20] as const) {
  const plan = buildHandsFreeSession(DEFAULT_STATE, { minutes, parts: ALL_HF, ...hfOpts });
  check(
    `séance de ${minutes} min : durée estimée dans la cible`,
    plan.seconds >= minutes * 60 * 0.8 && plan.seconds <= minutes * 60 * 1.2,
    `${Math.round(plan.seconds / 60)} min, ${plan.questionCount} questions`,
  );
  check(`séance de ${minutes} min : aucun bloc en double`, new Set(plan.setIds).size === plan.setIds.length);
}
for (const preset of PART_PRESETS) {
  const plan = buildHandsFreeSession(DEFAULT_STATE, { minutes: 10, parts: preset.parts, ...hfOpts });
  check(
    `raccourci « ${preset.label} » : aucune partie hors sélection`,
    plan.chapters.every((c) => preset.parts.includes(c.part)),
  );
}
// Le choix à la carte : une séance d'un seul type d'exercice doit tenir debout.
for (const part of ALL_HF) {
  const plan = buildHandsFreeSession(DEFAULT_STATE, { minutes: 10, parts: [part], ...hfOpts });
  check(
    `Part ${part} seule : séance non vide et homogène`,
    plan.questionCount > 0 && plan.chapters.every((c) => c.part === part),
    `${plan.questionCount} questions, ${Math.round(plan.seconds / 60)} min`,
  );
}
check(
  'sélection vide → séance vide (le bouton reste désactivé)',
  buildHandsFreeSession(DEFAULT_STATE, { minutes: 10, parts: [], ...hfOpts }).chapters.length === 0,
);
// L'alternance audio/lecture survit à n'importe quel sous-ensemble.
const twoParts = buildHandsFreeSession(DEFAULT_STATE, { minutes: 10, parts: [2, 7], ...hfOpts });
check(
  'deux parties choisies : les deux sortent',
  new Set(twoParts.chapters.map((c) => c.part)).size === 2,
  [...new Set(twoParts.chapters.map((c) => c.part))],
);

// Un bloc déjà entendu passe en fin de file, comme après une session répondue.
const firstPlan = buildHandsFreeSession(DEFAULT_STATE, { minutes: 5, parts: ALL_HF, ...hfOpts });
const afterHeard = buildHandsFreeSession(
  { ...DEFAULT_STATE, heard: Object.fromEntries(firstPlan.setIds.map((id) => [id, now])) },
  { minutes: 5, parts: ALL_HF, ...hfOpts },
);
check(
  'une séance ne resert pas ce qui vient d’être entendu',
  afterHeard.setIds.every((id) => !firstPlan.setIds.includes(id)),
);

// La correction doit pouvoir montrer le texte de ce qui a été prononcé : sans
// ça, une conversation de Part 3 ne se relit nulle part.
const questions = hfChapters.filter((c) => c.itemId);
check(
  'chaque question porte la transcription de ce qui a été lu',
  questions.every((c) => {
    const t = c.transcript;
    if (!t) return false;
    if (c.part === 2 || c.part === 3 || c.part === 4) return !!t.lines?.length;
    if (c.part === 5) return !!t.sentence;
    return !!t.passages?.length;
  }),
  questions.find((c) => !c.transcript)?.id,
);
check(
  'Part 5 : la phrase transcrite est complétée, sans trou',
  questions
    .filter((c) => c.part === 5)
    .every((c) => !!c.transcript?.sentence && !/-{2,}/.test(c.transcript.sentence)),
);
check(
  'Part 6 : la transcription pointe le bon trou',
  questions
    .filter((c) => c.part === 6)
    .every((c) => !!c.transcript?.blank && c.label.startsWith(`Trou ${c.transcript.blank} `)),
);
check(
  'Part 2 : la transcription contient la question, jamais imprimée',
  questions
    .filter((c) => c.part === 2)
    .every((c) => (c.transcript?.lines?.length ?? 0) === 4),
);

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
