/**
 * Part 1 — Photographs.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART1: QuestionSet[] = [
  {
    id: 'p1-01',
    part: 1,
    title: 'Bureau — femme au téléphone',
    source: 'seed',
    scene: {
      id: 'office-desk',
      alt: "Une femme assise à un bureau, un téléphone à l'oreille, devant un ordinateur portable ; des dossiers empilés à côté.",
    },
    items: [
      {
        id: 'p1-01-q1',
        vocab: [
          { term: "to file documents", translation: "classer des documents", example: "She is filing documents in a cabinet.", note: "Rien à voir avec « remplir » : to fill / to file sont deux verbes différents." },
          { term: "to hand something to someone", translation: "tendre, remettre qqch à qqn", example: "She is handing a folder to a colleague." },
          { term: "to unplug", translation: "débrancher", note: "Contraire : to plug in." },
        ],
        category: 'Photo — personne seule',
        choices: [
          { id: 'A', text: 'She is filing documents in a cabinet.' },
          { id: 'B', text: 'She is speaking on the phone at her desk.' },
          { id: 'C', text: 'She is handing a folder to a colleague.' },
          { id: 'D', text: 'She is unplugging a computer monitor.' },
        ],
        answer: 'B',
        explanation:
          "La femme est assise à son bureau, combiné à l'oreille : « speaking on the phone at her desk ». Piège classique de la Part 1 : (A) et (C) reprennent des objets visibles (dossiers) mais avec une action fausse. Écoute d'abord le VERBE, puis vérifie l'objet.",
        audio: [
          { text: 'A. She is filing documents in a cabinet.', voice: 'female' },
          { text: 'B. She is speaking on the phone at her desk.', voice: 'female' },
          { text: 'C. She is handing a folder to a colleague.', voice: 'female' },
          { text: 'D. She is unplugging a computer monitor.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p1-02',
    part: 1,
    title: 'Entrepôt — chargement',
    source: 'seed',
    scene: {
      id: 'warehouse',
      alt: "Un entrepôt : des cartons empilés sur des palettes, un chariot élévateur à l'arrêt, un homme avec un casque tenant une tablette.",
    },
    items: [
      {
        id: 'p1-02-q1',
        vocab: [
          { term: "to stack", translation: "empiler", example: "Boxes have been stacked on pallets." },
          { term: "a pallet", translation: "une palette (de manutention)", note: "Ne pas confondre avec « palette » de couleurs = a palette." },
          { term: "to sweep", translation: "balayer", example: "The warehouse floor is being swept." },
        ],
        category: 'Photo — lieu / objets',
        choices: [
          { id: 'A', text: 'Boxes have been stacked on pallets.' },
          { id: 'B', text: 'A truck is being loaded with furniture.' },
          { id: 'C', text: 'Workers are assembling shelves.' },
          { id: 'D', text: 'The warehouse floor is being swept.' },
        ],
        answer: 'A',
        explanation:
          "« Boxes have been stacked » (present perfect passif) décrit un ÉTAT résultant — parfait pour une photo sans action en cours. Les options B et D utilisent « is being + participe », qui exigent qu'une action soit visiblement en train de se faire : ce n'est pas le cas ici.",
        audio: [
          { text: 'A. Boxes have been stacked on pallets.', voice: 'male' },
          { text: 'B. A truck is being loaded with furniture.', voice: 'male' },
          { text: 'C. Workers are assembling shelves.', voice: 'male' },
          { text: 'D. The warehouse floor is being swept.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p1-03',
    part: 1,
    title: 'Salle de réunion — présentation',
    source: 'seed',
    scene: {
      id: 'meeting-room',
      alt: "Une salle de réunion : trois personnes assises autour d'une table, une quatrième debout devant un écran de projection.",
    },
    items: [
      {
        id: 'p1-03-q1',
        vocab: [
          { term: "to rearrange", translation: "réorganiser, déplacer", example: "They are rearranging the chairs around the table." },
          { term: "to pour", translation: "verser", example: "One of the men is pouring coffee into a cup." },
        ],
        category: 'Photo — groupe de personnes',
        choices: [
          { id: 'A', text: 'They are rearranging the chairs around the table.' },
          { id: 'B', text: 'One of the men is pouring coffee into a cup.' },
          { id: 'C', text: 'A presenter is standing in front of a screen.' },
          { id: 'D', text: 'The participants are leaving the conference room.' },
        ],
        answer: 'C',
        explanation:
          "Une seule personne est debout devant l'écran : « A presenter is standing in front of a screen ». Attention au sujet : « They / The participants » impose que TOUT le groupe fasse l'action, ce qui élimine (A) et (D).",
        audio: [
          { text: 'A. They are rearranging the chairs around the table.', voice: 'female' },
          { text: 'B. One of the men is pouring coffee into a cup.', voice: 'female' },
          { text: 'C. A presenter is standing in front of a screen.', voice: 'female' },
          { text: 'D. The participants are leaving the conference room.', voice: 'female' },
        ],
      },
    ],
  },
];
