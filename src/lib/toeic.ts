/** Métadonnées du format TOEIC Listening & Reading et helpers dérivés. */

import type { PartId, QuestionSet, Section } from '../types';

export interface PartMeta {
  id: PartId;
  section: Section;
  /** Nom officiel anglais de la partie. */
  name: string;
  label: string;
  /** Description courte affichée dans le menu practice. */
  hint: string;
  /** Nombre de questions dans l'examen réel — sert au poids de l'examen blanc. */
  realCount: number;
  /** Nombre de propositions (3 en Part 2, 4 ailleurs). */
  choices: 3 | 4;
}

export const PARTS: Record<PartId, PartMeta> = {
  1: {
    id: 1,
    section: 'listening',
    name: 'Photographs',
    label: 'Part 1 · Photos',
    hint: 'Choisir la phrase qui décrit correctement une image',
    realCount: 6,
    choices: 4,
  },
  2: {
    id: 2,
    section: 'listening',
    name: 'Question-Response',
    label: 'Part 2 · Questions-Réponses',
    hint: '100 % audio : une question, trois réponses possibles',
    realCount: 25,
    choices: 3,
  },
  3: {
    id: 3,
    section: 'listening',
    name: 'Conversations',
    label: 'Part 3 · Conversations',
    hint: 'Un dialogue, trois questions',
    realCount: 39,
    choices: 4,
  },
  4: {
    id: 4,
    section: 'listening',
    name: 'Talks',
    label: 'Part 4 · Monologues',
    hint: 'Annonce ou message vocal, trois questions',
    realCount: 30,
    choices: 4,
  },
  5: {
    id: 5,
    section: 'reading',
    name: 'Incomplete Sentences',
    label: 'Part 5 · Phrases à trous',
    hint: 'Grammaire et vocabulaire, une phrase à compléter',
    realCount: 30,
    choices: 4,
  },
  6: {
    id: 6,
    section: 'reading',
    name: 'Text Completion',
    label: 'Part 6 · Textes à trous',
    hint: 'Un court document, quatre trous dont une phrase entière',
    realCount: 16,
    choices: 4,
  },
  7: {
    id: 7,
    section: 'reading',
    name: 'Reading Comprehension',
    label: 'Part 7 · Compréhension écrite',
    hint: 'Passages simples, doubles ou triples',
    realCount: 54,
    choices: 4,
  },
};

export const ALL_PARTS: PartId[] = [1, 2, 3, 4, 5, 6, 7];

export const sectionOf = (part: PartId): Section => PARTS[part].section;

/**
 * Vrai si les propositions ne sont diffusées qu'à l'oral (Parts 1 et 2).
 * Dans ce cas rien n'est affiché avant la réponse : on ne montre que A / B / C.
 */
export const hasSpokenChoices = (part: PartId): boolean => part === 1 || part === 2;

/** Vrai si le set comporte un stimulus audio (set-level ou item-level). */
export const isListening = (set: QuestionSet): boolean => sectionOf(set.part) === 'listening';

/**
 * Rythme réel de l'examen, utilisé pour chronométrer l'examen blanc :
 * 45 min pour 100 questions de listening, 75 min pour 100 de reading.
 */
export const SECONDS_PER_QUESTION: Record<Section, number> = {
  listening: (45 * 60) / 100, // 27 s
  reading: (75 * 60) / 100, // 45 s
};

/** Couleur d'accent par partie (cohérente dans tous les graphiques). */
export const PART_COLOR: Record<PartId, string> = {
  1: '#60a5fa',
  2: '#38bdf8',
  3: '#22d3ee',
  4: '#2dd4bf',
  5: '#a78bfa',
  6: '#c084fc',
  7: '#f472b6',
};
