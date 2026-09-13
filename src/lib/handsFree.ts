/**
 * Mode « Écoute » : le fil audio d'une séance mains libres.
 *
 * L'usage visé est le tapis de course ou la marche : le téléphone est posé (ou
 * dans la poche), rien n'est touché, tout passe par l'oreille. Une question
 * s'entend, un silence laisse répondre dans sa tête, la réponse tombe
 * immédiatement — pas de validation à taper, pas de note à prendre.
 *
 * Conséquence : TOUT doit être audible, y compris ce qui est imprimé à
 * l'examen (énoncés, propositions, passages de lecture). Ce module transforme
 * donc un `QuestionSet` en une suite de répliques à prononcer, exactement comme
 * un enregistrement d'examen dicterait la feuille de réponses.
 *
 * Ce fichier est le point de vérité partagé entre l'app et
 * `scripts/synthesize-audio.ts` : le script de synthèse collecte les répliques
 * en appelant ce même constructeur, donc le texte pré-synthétisé hors-ligne et
 * le texte demandé au runtime ne peuvent pas diverger (ils ont le même hash,
 * voir `staticAudio.ts`).
 *
 * La Part 1 est absente : ses questions décrivent une photo, elles n'ont aucun
 * sens sans l'image.
 */

import type {
  AppState,
  AudioLine,
  Choice,
  HandsFreeScope,
  Letter,
  PartId,
  Passage,
  QuestionItem,
  QuestionSet,
} from '../types';
import { allSets, byFreshness } from './selection';

/* ------------------------------------------------------------------ */
/* Modèle                                                              */
/* ------------------------------------------------------------------ */

export type BeatRole =
  | 'lead' // « Part three. » — annonce de la partie
  | 'stimulus' // conversation, monologue, document lu
  | 'marker' // « Question two. », « Blank one. »
  | 'question' // l'énoncé
  | 'choice' // une proposition
  | 'think' // silence : à toi de répondre
  | 'answer'; // « The correct answer is B. » puis la bonne proposition

/**
 * Un battement du fil : au plus une réplique, puis au plus un silence.
 *
 * Les silences sont des battements comme les autres — et joués comme de vrais
 * clips silencieux, pas des `setTimeout` : un minuteur est bridé quand l'écran
 * se verrouille, alors que la file audio, elle, continue de tourner.
 */
export interface Beat {
  role: BeatRole;
  line?: AudioLine;
  /** Silence après la réplique, en ms (ou silence seul pour `think`). */
  silenceMs?: number;
  /** Bref repère sonore avant le silence : signale « à toi » sans regarder. */
  tick?: boolean;
  /** Proposition en cours de lecture, pour la surligner à l'écran. */
  focus?: Letter;
  /**
   * Texte à afficher quand il diffère de ce qui est prononcé — un passage se
   * lit à l'écran dans sa mise en page d'origine, pas avec ses « blank two ».
   */
  display?: string;
}

/**
 * Unité de navigation (⏭ / ⏮) et unité d'affichage : le stimulus d'un bloc, ou
 * une question. Découper au stimulus permet de réécouter une conversation sans
 * réécouter ses trois questions.
 */
export interface Chapter {
  id: string;
  part: PartId;
  setId: string;
  itemId?: string;
  /** Titre affiché : « Conversation », « Question 2 sur 3 », « Document 1 ». */
  label: string;
  beats: Beat[];
  /** Énoncé et propositions imprimés. Absents en Part 2 : tout y est audio. */
  question?: { prompt?: string; choices: Choice[]; printed: boolean };
  /** Ce que l'écran révèle quand la réponse tombe. */
  reveal?: { answer: Letter; text: string; explanation: string; category: string };
  /**
   * Transcription de ce qui a été prononcé, montrée avec la réponse.
   *
   * Pendant la question, l'écran s'en tient à ce que l'examen imprime. Une fois
   * la réponse donnée, la règle n'a plus lieu d'être : c'est le moment où l'on
   * veut relire la phrase qu'on n'a pas comprise, et le document ne tient plus
   * sous les yeux puisque la question a défilé.
   */
  transcript?: {
    /** Part 2, 3, 4 : les répliques entendues, dans l'ordre. */
    lines?: AudioLine[];
    /** Part 6, 7 : le ou les documents, dans leur mise en page. */
    passages?: Passage[];
    /** Part 6 : trou concerné, mis en évidence dans le document. */
    blank?: number;
    /** Part 5 : la phrase une fois complétée par la bonne réponse. */
    sentence?: string;
  };
  /** Durée estimée, en secondes (voir `CHARS_PER_SECOND`). */
  seconds: number;
}

export interface ScriptOptions {
  /** Temps de réflexion laissé après chaque question, en secondes. */
  thinkSec: number;
  /** Vitesse de lecture, appliquée à l'estimation comme à la lecture. */
  rate: number;
}

export const DEFAULT_SCRIPT_OPTIONS: ScriptOptions = { thinkSec: 5, rate: 0.95 };

/** Parts jouables en mains libres — la Part 1 exige de voir la photo. */
export const HANDS_FREE_PARTS: PartId[] = [2, 3, 4, 5, 6, 7];

/* ------------------------------------------------------------------ */
/* Estimation de durée                                                 */
/* ------------------------------------------------------------------ */

/**
 * Durée d'un clip, en secondes : une constante, plus le texte débité à vitesse
 * constante. Régression sur 1 075 clips réellement synthétisés — l'erreur reste
 * sous 5 % de 10 à 800 caractères.
 *
 * La constante n'est pas un artefact : chaque clip Mistral commence et finit
 * par un silence d'environ une seconde au total. L'ignorer (un simple
 * caractères/seconde) sous-estimait une séance d'un quart — vingt clips courts
 * par question, c'est vingt fois ce silence.
 *
 * Sert à remplir une séance jusqu'à la durée visée sans avoir à télécharger
 * l'audio pour le mesurer. L'écran affiche donc un temps restant approché
 * (« ≈ 6 min ») plutôt qu'un décompte au dixième qui serait faussement précis.
 */
export const CHARS_PER_SECOND = 17.5;
export const CLIP_PADDING_SEC = 1.14;

export const spokenSeconds = (text: string, rate: number): number =>
  (CLIP_PADDING_SEC + text.length / CHARS_PER_SECOND) / rate;

/**
 * Coût d'une bascule d'une source à l'autre sur l'élément `<audio>` : environ
 * 20 ms pour un clip, 85 ms pour un silence court (mesuré en navigateur). Deux
 * bascules par battement, une vingtaine de battements par question : l'ignorer
 * allongeait la séance de plusieurs pour cent.
 */
const SWITCH_SEC = 0.06;

export function beatSeconds(beat: Beat, rate: number): number {
  return (
    (beat.line ? SWITCH_SEC + spokenSeconds(beat.line.text, rate) : 0) +
    (beat.silenceMs ? SWITCH_SEC + beat.silenceMs / 1000 : 0)
  );
}

const chapterSeconds = (beats: Beat[], rate: number): number =>
  beats.reduce((n, b) => n + beatSeconds(b, rate), 0);

/* ------------------------------------------------------------------ */
/* Normalisation du texte à prononcer                                  */
/* ------------------------------------------------------------------ */

const NUMERALS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/** Marqueur du trou de Part 5 dans la banque (`----`). */
export const BLANK_MARK = /-{2,}/;

/**
 * Rend un texte écrit prononçable.
 *
 * Les documents de la banque sont mis en page pour l'œil : trous numérotés,
 * en-têtes d'email séparés par des barres verticales, plages horaires au tiret
 * cadratin. Lus tels quels, une voix de synthèse ânonne « underscore » ou
 * s'arrête au milieu d'une date.
 *
 * ATTENTION : le nom du clip est un hash du texte final. Changer une règle ici
 * invalide les fichiers déjà synthétisés — il faut relancer `npm run synthesize`.
 */
export function speakable(text: string): string {
  const out = text
    .replace(/\r\n/g, '\n')
    // Trous de Part 6 : ___(2)___ → « blank two ».
    .replace(/_{2,}\((\d)\)_{2,}/g, (_m, n: string) => `blank ${NUMERALS[Number(n)] ?? n}`)
    // Trou de Part 5 : ---- (jamais numéroté, il n'y en a qu'un).
    .replace(new RegExp(BLANK_MARK.source, 'g'), 'blank')
    // En-tête d'email : « To: … | From: … » se lit comme des phrases.
    .replace(/\s*\|\s*/g, '. ')
    // Plage de valeurs : « 9:30–11:30 », « 22–24 May ».
    .replace(/(\d)\s*[–—-]\s*(?=\d)/g, '$1 to ')
    // Tiret d'incise restant : une virgule suffit à marquer la pause.
    .replace(/\s+[–—]\s+/g, ', ')
    .replace(/[ \t]+/g, ' ')
    .trim();
  // Une réplique sans ponctuation finale s'achève sur une intonation suspendue.
  return /[.!?:,]$/.test(out) ? out : `${out}.`;
}

/**
 * Découpe un document en clips : l'en-tête, puis un clip par paragraphe.
 *
 * Un paragraphe et pas le document entier, pour trois raisons : les clips
 * restent courts (et la synthèse ne bute pas sur une limite de longueur),
 * l'écran peut surligner le paragraphe en cours de lecture, et une reprise
 * repart d'un début de paragraphe.
 *
 * Les retours à la ligne simples (adresse, liste de dates) sont recollés en
 * phrases : sans ponctuation entre eux, la voix enchaînerait « Room B two
 * Riverside office the workshop covers ».
 */
export function passageLines(passage: Passage): { text: string; display: string }[] {
  const paragraphs = passage.body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => ({
      display: para,
      text: speakable(
        para
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .reduce((acc, l) => (!acc ? l : `${acc}${/[.!?:,;]$/.test(acc) ? '' : '.'} ${l}`), ''),
      ),
    }));

  return passage.heading
    ? [{ text: speakable(passage.heading), display: passage.heading }, ...paragraphs]
    : paragraphs;
}

/* ------------------------------------------------------------------ */
/* Répliques de narration (réutilisées d'une question à l'autre)       */
/* ------------------------------------------------------------------ */

const narrate = (text: string): AudioLine => ({ text, voice: 'narrator' });

const partLine = (part: PartId) => narrate(`Part ${NUMERALS[part]}.`);
const questionLine = (n: number) => narrate(`Question ${NUMERALS[n] ?? n}.`);
const blankLine = (n: number) => narrate(`Blank ${NUMERALS[n] ?? n}.`);
const documentLine = (n: number) => narrate(`Document ${NUMERALS[n] ?? n}.`);
const answerLine = (letter: Letter) => narrate(`The correct answer is ${letter}.`);

/** « B. Actually, it was postponed until Thursday. » — lettre comprise. */
const choiceText = (choice: Choice): string => speakable(`${choice.id}. ${choice.text}`);

/**
 * Réplique d'une proposition.
 *
 * En Part 2 les trois réponses sont déjà jouées par de vraies voix dans
 * `item.audio` : on réutilise ce clip plutôt que d'en faire relire le texte au
 * narrateur — c'est la même phrase, et l'exercice consiste justement à la
 * reconnaître à l'oreille.
 */
function choiceLine(item: QuestionItem, choice: Choice): AudioLine {
  const spoken = item.audio?.find((l) => l.text.startsWith(`${choice.id}.`));
  return spoken ?? narrate(choiceText(choice));
}

/* ------------------------------------------------------------------ */
/* Construction du fil                                                 */
/* ------------------------------------------------------------------ */

/** Respirations : assez pour séparer, trop peu pour donner l'impression d'un bug. */
const GAP = { line: 320, choice: 260, beforeAnswer: 500, afterAnswer: 1100, afterStimulus: 900 };

function questionBeats(
  set: QuestionSet,
  item: QuestionItem,
  opts: ScriptOptions,
  lead: AudioLine[],
): Beat[] {
  const beats: Beat[] = lead.map((line) => ({ role: 'lead' as const, line, silenceMs: GAP.line }));

  if (set.part === 2) {
    // Part 2 : question et réponses sont l'enregistrement lui-même.
    for (const [i, line] of (item.audio ?? []).entries()) {
      beats.push({
        role: i === 0 ? 'question' : 'choice',
        line,
        silenceMs: i === 0 ? GAP.line : GAP.choice,
        focus: i === 0 ? undefined : item.choices[i - 1]?.id,
      });
    }
  } else {
    if (set.part !== 6 && item.prompt) {
      // Part 5 : la phrase à trou se lit avec « blank » à la place du trou.
      beats.push({ role: 'question', line: narrate(speakable(item.prompt)), silenceMs: GAP.line });
    }
    for (const choice of item.choices) {
      beats.push({
        role: 'choice',
        line: narrate(choiceText(choice)),
        silenceMs: GAP.choice,
        focus: choice.id,
      });
    }
  }

  beats.push({ role: 'think', silenceMs: opts.thinkSec * 1000, tick: true });
  beats.push({ role: 'answer', line: answerLine(item.answer), silenceMs: GAP.beforeAnswer });

  const right = item.choices.find((c) => c.id === item.answer)!;
  if (set.part === 5 && item.prompt) {
    // Part 5 : entendre la phrase complète vaut tous les commentaires — c'est
    // la forme correcte qu'on veut graver, pas la lettre.
    beats.push({
      role: 'answer',
      line: narrate(speakable(item.prompt.replace(BLANK_MARK, right.text))),
      silenceMs: GAP.afterAnswer,
    });
  } else {
    beats.push({ role: 'answer', line: choiceLine(item, right), silenceMs: GAP.afterAnswer });
  }

  return beats;
}

/** Le fil complet d'un bloc : son stimulus, puis chacune de ses questions. */
export function buildChapters(set: QuestionSet, opts: ScriptOptions): Chapter[] {
  if (set.part === 1) return [];
  const chapters: Chapter[] = [];
  /** Annonce de la partie : portée par le tout premier chapitre du bloc. */
  let lead: AudioLine[] = [partLine(set.part)];

  const push = (chapter: Omit<Chapter, 'seconds'>) => {
    chapters.push({ ...chapter, seconds: chapterSeconds(chapter.beats, opts.rate) });
    lead = [];
  };

  // --- Stimulus : conversation, monologue, document(s) ---------------
  if (set.audio?.length) {
    push({
      id: `${set.id}-audio`,
      part: set.part,
      setId: set.id,
      label: set.part === 3 ? 'Conversation' : 'Monologue',
      beats: [
        ...lead.map((line) => ({ role: 'lead' as const, line, silenceMs: GAP.line })),
        ...set.audio.map((line, i) => ({
          role: 'stimulus' as const,
          line,
          silenceMs: i === set.audio!.length - 1 ? GAP.afterStimulus : GAP.line,
        })),
      ],
    });
  }

  const passages = set.passages ?? [];
  for (const [i, passage] of passages.entries()) {
    const parts = passageLines(passage);
    const beats: Beat[] = lead.map((line) => ({ role: 'lead' as const, line, silenceMs: GAP.line }));
    if (passages.length > 1) {
      beats.push({ role: 'marker', line: documentLine(i + 1), silenceMs: GAP.line });
    }
    for (const [n, part] of parts.entries()) {
      beats.push({
        role: 'stimulus',
        line: narrate(part.text),
        display: part.display,
        silenceMs: n === parts.length - 1 ? GAP.afterStimulus : GAP.line,
      });
    }

    push({
      id: `${set.id}-doc${i + 1}`,
      part: set.part,
      setId: set.id,
      label: passages.length > 1 ? `Document ${i + 1}` : 'Document',
      beats,
    });
  }

  // --- Questions ------------------------------------------------------
  for (const [i, item] of set.items.entries()) {
    // Part 6 : le repère utile n'est pas « question 2 » mais « trou 2 ».
    const marker =
      set.items.length > 1 ? (set.part === 6 ? blankLine(i + 1) : questionLine(i + 1)) : undefined;
    const beats = questionBeats(set, item, opts, lead);
    if (marker) {
      beats.splice(lead.length, 0, { role: 'marker', line: marker, silenceMs: GAP.line });
    }

    push({
      id: item.id,
      part: set.part,
      setId: set.id,
      itemId: item.id,
      label:
        set.items.length > 1
          ? `${set.part === 6 ? 'Trou' : 'Question'} ${i + 1} sur ${set.items.length}`
          : 'Question',
      beats,
      question: {
        // Part 6 : l'énoncé de la banque est « Trou (2) », ce que le titre du
        // chapitre dit déjà — l'écran n'a que les propositions à montrer.
        prompt: set.part === 6 ? undefined : item.prompt,
        choices: item.choices,
        // Parts 1 et 2 : rien n'est imprimé à l'examen, rien ne s'affiche ici.
        printed: set.part !== 2,
      },
      reveal: {
        answer: item.answer,
        text: item.choices.find((c) => c.id === item.answer)!.text,
        explanation: item.explanation,
        category: item.category,
      },
      transcript: transcriptOf(set, item, i),
    });
  }

  return chapters;
}

/**
 * Ce que la correction donne à relire : le texte de tout ce qui a été prononcé
 * avant la question. En Part 2 c'est la question elle-même (jamais imprimée),
 * en Part 3/4 la conversation, en Part 5 la phrase enfin complète, en Part 6/7
 * le document — qui a défilé depuis longtemps quand la réponse tombe.
 */
function transcriptOf(set: QuestionSet, item: QuestionItem, index: number): Chapter['transcript'] {
  if (set.part === 2) return { lines: item.audio };
  if (set.part === 3 || set.part === 4) return { lines: set.audio };
  if (set.part === 5 && item.prompt) {
    const right = item.choices.find((c) => c.id === item.answer)!;
    return { sentence: item.prompt.replace(BLANK_MARK, right.text) };
  }
  if (set.passages?.length) {
    return { passages: set.passages, blank: set.part === 6 ? index + 1 : undefined };
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Composition d'une séance                                            */
/* ------------------------------------------------------------------ */

/**
 * Ordre de rotation entre les parties.
 *
 * Volontairement alterné (audio, lecture, audio, lecture…) plutôt que dans
 * l'ordre de l'examen : dix minutes de Part 7 d'affilée dans les oreilles, en
 * marchant, ne tiennent pas. L'alternance relance l'attention. Filtrer cet
 * ordre par la sélection la préserve quel que soit le sous-ensemble choisi.
 */
const ROTATION: PartId[] = [2, 5, 3, 6, 4, 7];

/** Sélections courantes, proposées en raccourci devant le choix par partie. */
export const PART_PRESETS: { id: HandsFreeScope; label: string; parts: PartId[] }[] = [
  { id: 'all', label: 'Tout', parts: [2, 3, 4, 5, 6, 7] },
  { id: 'listening', label: 'Écoute', parts: [2, 3, 4] },
  { id: 'reading', label: 'Lecture', parts: [5, 6, 7] },
];

export interface HandsFreePlan {
  chapters: Chapter[];
  /** Blocs joués : notés « entendus » à la fin, pour ne pas les resservir. */
  setIds: string[];
  questionCount: number;
  /** Durée estimée de la séance, en secondes. */
  seconds: number;
}

export interface PlanOptions extends ScriptOptions {
  /** Durée visée, en minutes. */
  minutes: number;
  /** Parties tirées. Les raccourcis (tout / écoute / lecture) la remplissent. */
  parts: PartId[];
}

/**
 * Remplit une séance jusqu'à la durée visée.
 *
 * Les blocs sont pris « le moins récemment entendu d'abord » (en tenant compte
 * des sessions classiques : ce qu'on vient de travailler à l'écran n'a pas
 * besoin de repasser dans les oreilles dix minutes plus tard).
 */
export function buildHandsFreeSession(state: AppState, opts: PlanOptions): HandsFreePlan {
  const sets = allSets(state);
  const target = opts.minutes * 60;

  const wanted = ROTATION.filter((p) => opts.parts.includes(p));
  const pools = new Map<PartId, QuestionSet[]>();
  for (const part of wanted) {
    const pool = byFreshness(
      sets.filter((s) => s.part === part),
      state.attempts,
      state.heard,
    );
    if (pool.length) pools.set(part, pool);
  }

  const chapters: Chapter[] = [];
  const setIds: string[] = [];
  let seconds = 0;
  let cursor = 0;
  let guard = 0;

  while (seconds < target && pools.size && guard < 300) {
    guard += 1;
    const rotation = wanted.filter((p) => pools.has(p));
    const part = rotation[cursor++ % rotation.length];
    const pool = pools.get(part)!;
    const set = pool.shift()!;
    if (!pool.length) pools.delete(part);

    const next = buildChapters(set, opts);
    const length = next.reduce((n, c) => n + c.seconds, 0);
    // Un passage double de Part 7 pèse quatre minutes : il a sa place dans une
    // séance de dix, pas dans les deux dernières minutes de celle-ci.
    if (chapters.length && seconds + length > target * 1.15) continue;

    chapters.push(...next);
    setIds.push(set.id);
    seconds += length;
  }

  return {
    chapters,
    setIds,
    questionCount: chapters.filter((c) => c.itemId).length,
    seconds,
  };
}

/**
 * Toutes les répliques que le mode peut avoir à prononcer, dédupliquées.
 *
 * Appelée par `scripts/synthesize-audio.ts` : puisqu'elle passe par le même
 * constructeur que l'app, aucun texte ne peut manquer à l'appel ni différer
 * d'un caractère (ce qui suffirait à changer le hash, donc le nom du fichier).
 */
export function handsFreeLines(sets: QuestionSet[]): AudioLine[] {
  const seen = new Map<string, AudioLine>();
  for (const set of sets) {
    for (const chapter of buildChapters(set, DEFAULT_SCRIPT_OPTIONS)) {
      for (const beat of chapter.beats) {
        if (!beat.line) continue;
        const key = `${beat.line.voice ?? 'narrator'}|${beat.line.text}`;
        if (!seen.has(key)) seen.set(key, beat.line);
      }
    }
  }
  return [...seen.values()];
}
