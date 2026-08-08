/**
 * Banque de questions de départ.
 *
 * 100 % écrite pour cette app, dans le style TOEIC (contextes professionnels :
 * emails, réunions, logistique, voyages d'affaires). Aucun contenu ETS n'est
 * repris — ni énoncés, ni distracteurs, ni passages.
 *
 * Le contenu est réparti par partie dans `part1.ts` … `part7.ts` : c'est le seul
 * découpage qui tient à l'échelle (une partie = un fichier qu'on peut étendre
 * sans relire les autres). Ce module ne fait que les recoller dans l'ordre de
 * l'examen.
 *
 * Pour étendre la banque : ajouter un `QuestionSet` à la fin du fichier de la
 * partie concernée. Conventions à respecter —
 *  - Part 1 : `scene` + 1 item sans `prompt`, 4 choix, `item.audio` = les 4 énoncés.
 *  - Part 2 : 1 item sans `prompt`, 3 choix (A/B/C), `item.audio` = question + réponses.
 *  - Part 3/4 : `audio` sur le set, 3 items avec `prompt` visible.
 *  - Part 5 : 1 item, phrase à trou dans `prompt` (trou noté « ---- »).
 *  - Part 6 : `passages` avec des trous `___(1)___`, 1 item par trou.
 *  - Part 7 : `passages` (1 à 3 documents) + 2 à 5 items.
 *
 * Champ `vocab` : 1 à 3 mots ou expressions clés par question. Ils sont versés
 * automatiquement au carnet de vocabulaire quand la question est ratée, et
 * proposés à l'ajout manuel après chaque correction. Y mettre ce qui fait
 * vraiment trébucher — collocation figée, faux ami, paraphrase testée — et non
 * les mots transparents.
 *
 * `npm run check` valide l'intégrité de l'ensemble (ids uniques, nombre de
 * propositions, énoncés imprimés ou non, trous de Part 6, vocabulaire présent).
 */

import type { QuestionSet } from '../types';
import { PART1 } from './part1';
import { PART2 } from './part2';
import { PART3 } from './part3';
import { PART4 } from './part4';
import { PART5 } from './part5';
import { PART6 } from './part6';
import { PART7 } from './part7';

export const QUESTION_BANK: QuestionSet[] = [
  ...PART1,
  ...PART2,
  ...PART3,
  ...PART4,
  ...PART5,
  ...PART6,
  ...PART7,
];

/** Nombre total de questions notées disponibles dans la banque de départ. */
export const SEED_ITEM_COUNT = QUESTION_BANK.reduce((n, s) => n + s.items.length, 0);
