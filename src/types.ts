/**
 * Modèle de données de l'app.
 *
 * Vocabulaire :
 *  - `QuestionSet` = un « bloc » d'examen : un stimulus (photo, audio, passage)
 *    + 1..n questions rattachées. C'est l'unité de tirage d'une session.
 *  - `QuestionItem` = une question réellement notée (l'unité statistique).
 *
 * Le format TOEIC impose ce découpage : une conversation de Part 3 porte
 * 3 questions, un passage de Part 6 porte 4 trous, etc.
 */

export type PartId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Section = 'listening' | 'reading';
export type Letter = 'A' | 'B' | 'C' | 'D';

/** Voix logiques utilisées par la synthèse vocale (mappées sur de vraies voix en_US). */
export type VoiceRole = 'narrator' | 'male' | 'female';

export interface Choice {
  id: Letter;
  text: string;
}

/**
 * Mot ou expression clé d'une question.
 *
 * Rattaché à la question dès la rédaction (plutôt qu'extrait automatiquement du
 * texte) : c'est la seule façon d'obtenir un vocabulaire vraiment utile — la
 * collocation exacte, la paraphrase que le TOEIC teste, le faux-ami du piège.
 * En cas de mauvaise réponse, ces termes entrent tout seuls dans le carnet.
 */
export interface VocabHint {
  term: string;
  translation: string;
  /** Phrase d'exemple, idéalement celle de l'audio ou du passage. */
  example?: string;
  /** Précision d'usage : collocation figée, piège classique, registre… */
  note?: string;
}

export interface QuestionItem {
  id: string;
  /** Sous-catégorie fine, sert au ciblage des révisions (ex. « Temps verbaux »). */
  category: string;
  /**
   * Énoncé imprimé. Absent en Part 1 et 2 : la question y est uniquement audio,
   * donc rien ne doit être affiché avant la réponse.
   */
  prompt?: string;
  choices: Choice[];
  answer: Letter;
  /** Explication en français : c'est le cœur de la valeur pédagogique. */
  explanation: string;
  /**
   * Script audio propre à la question (Part 1 : les 4 énoncés ; Part 2 : la
   * question + les 3 réponses). Pour Part 3/4 le script est porté par le set.
   */
  audio?: AudioLine[];
  /** Vocabulaire clé, versé au carnet en cas d'erreur (ou ajouté à la main). */
  vocab?: VocabHint[];
}

export interface AudioLine {
  /** Étiquette affichée dans la transcription une fois la réponse donnée. */
  speaker?: string;
  text: string;
  voice?: VoiceRole;
}

/** Passage de lecture (Part 6 / 7). Un set Part 7 « double » en contient 2. */
export interface Passage {
  /** Type de document, affiché en tête comme sur l'examen. */
  kind: 'email' | 'notice' | 'article' | 'ad' | 'letter' | 'memo' | 'chat' | 'schedule';
  heading?: string;
  /** Corps du texte. Les trous de Part 6 sont notés `___(1)___`, `___(2)___`… */
  body: string;
}

/** Illustration vectorielle intégrée, utilisée en secours par la Part 1. */
export type SceneId = 'office-desk' | 'warehouse' | 'meeting-room' | 'cafe-street' | 'airport';

/**
 * « Photo » d'une question de Part 1.
 *
 * Deux sources possibles, dans cet ordre :
 *  1. `image` — une vraie photo posée dans `public/photos/` (chemin `/photos/x.jpg`) ;
 *  2. `id` — l'illustration vectorielle intégrée, utilisée si aucune photo n'est
 *     fournie ou si le fichier est introuvable.
 *
 * ATTENTION : les 4 énoncés d'une question de Part 1 décrivent UNE image précise.
 * Changer la photo sans réécrire les énoncés casse la question.
 */
export interface ScenePicture {
  image?: string;
  id?: SceneId;
  /** Description textuelle : sert d'`alt` et de secours si l'image manque. */
  alt: string;
  /** Crédit / licence, affiché sous la photo quand la banque l'exige. */
  credit?: string;
}

export interface QuestionSet {
  id: string;
  part: PartId;
  /** Libellé interne, jamais montré pendant la question (peut divulguer la réponse). */
  title: string;
  /** Part 1 uniquement : la « photo ». */
  scene?: ScenePicture;
  /** Part 3/4 : conversation ou monologue diffusé avant les questions. */
  audio?: AudioLine[];
  /** Part 6/7 : document(s) à lire. */
  passages?: Passage[];
  items: QuestionItem[];
  /** `seed` = banque codée en dur, `ai` = généré via Mistral. */
  source: 'seed' | 'ai';
  createdAt?: number;
}

/* ------------------------------------------------------------------ */
/* Progression                                                         */
/* ------------------------------------------------------------------ */

export type SessionMode = 'practice' | 'mixed' | 'review' | 'exam';

/** Une réponse donnée. Toutes les stats du dashboard dérivent de cette liste. */
export interface Attempt {
  itemId: string;
  setId: string;
  part: PartId;
  category: string;
  correct: boolean;
  chosen: Letter;
  /** Temps de réponse en ms (utile pour repérer les parties qui coûtent cher). */
  ms: number;
  at: number;
  mode: SessionMode;
}

/** Boîtes Leitner : 0 → J+1, 1 → J+3, 2 → J+7. */
export type LeitnerBox = 0 | 1 | 2;

/**
 * Entrée du journal d'erreurs. Créée à la première faute sur un item,
 * puis mise à jour à chaque passage en révision.
 */
export interface ErrorEntry {
  itemId: string;
  setId: string;
  part: PartId;
  category: string;
  /** Copie de l'énoncé : le journal reste lisible même si la banque évolue. */
  promptSnippet: string;
  correctAnswer: string;
  chosenAnswer: string;
  explanation: string;
  createdAt: number;
  lastReviewedAt: number;
  box: LeitnerBox;
  /** Bonnes réponses consécutives ; 2 → maîtrisé. */
  streak: number;
  mastered: boolean;
  /** Timestamp à partir duquel l'item revient dans la file. */
  dueAt: number;
  attempts: number;
  timesWrong: number;
}

/**
 * Entrée du carnet de vocabulaire.
 *
 * Deux provenances :
 *  - `missed` : versée automatiquement quand la question qui la porte est ratée ;
 *  - `manual` : ajoutée à la main pendant une session ou depuis le carnet.
 *
 * La planification suit exactement les mêmes règles que le journal d'erreurs
 * (boîtes 0/1/2, 2 bonnes réponses consécutives → maîtrisé), mais le paquet est
 * séparé : on révise du vocabulaire, pas des questions.
 */
export interface VocabEntry {
  /** Terme normalisé (minuscules, sans article) — sert de clé, évite les doublons. */
  id: string;
  term: string;
  translation: string;
  example?: string;
  note?: string;
  origin: 'missed' | 'manual';
  /** Question d'origine, pour retrouver le contexte. */
  sourceItemId?: string;
  sourcePart?: PartId;
  createdAt: number;
  lastReviewedAt: number;
  box: LeitnerBox;
  streak: number;
  mastered: boolean;
  dueAt: number;
  reviews: number;
  /** Nombre d'oublis : un mot qui revient souvent ici mérite une fiche à part. */
  lapses: number;
}

export interface Settings {
  /**
   * Moteur de synthèse vocale.
   *  - `mistral` : API Mistral, voix naturelles et identiques d'un appareil à
   *    l'autre ; nécessite une clé et le proxy du serveur de dev.
   *  - `system`  : Web Speech API du navigateur, hors ligne et gratuite.
   * Le repli sur `system` est automatique si Mistral échoue.
   */
  ttsEngine: 'system' | 'mistral';
  /** Modèle TTS Mistral (ex. `voxtral-mini-tts-2603`). */
  mistralTtsModel: string;
  /** Voix Mistral par rôle ; chaîne vide = voix par défaut de l'API. */
  mistralVoices: Record<VoiceRole, string>;
  /** Vitesse de la synthèse vocale (0.7 = lent, 1 = rythme examen). */
  speechRate: number;
  /** Lecture automatique de l'audio à l'arrivée sur un bloc. */
  autoPlay: boolean;
  /** Nombre de questions par session de practice. */
  sessionLength: number;
  /** Clé API Mistral (stockée en local uniquement — voir README). */
  mistralApiKey: string;
  mistralModel: string;
}

export interface AppState {
  version: number;
  /** Sets générés par IA, fusionnés avec la banque codée en dur. */
  generated: QuestionSet[];
  attempts: Attempt[];
  errors: Record<string, ErrorEntry>;
  /** Carnet de vocabulaire, indexé par terme normalisé. */
  vocab: Record<string, VocabEntry>;
  /** Jours d'activité au format YYYY-MM-DD, pour le streak. */
  activeDays: string[];
  settings: Settings;
}
