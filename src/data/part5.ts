/**
 * Part 5 — Incomplete Sentences.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART5: QuestionSet[] = [
  {
    id: 'p5-01',
    part: 5,
    title: 'Part 5 — temps verbal',
    source: 'seed',
    items: [
      {
        id: 'p5-01-q1',
        vocab: [
          { term: "by the time", translation: "au moment où, d'ici à ce que", example: "By the time the auditors arrive...", note: "Déclenche le futur antérieur quand la suite est au futur." },
          { term: "an auditor", translation: "un auditeur, un commissaire aux comptes" },
        ],
        category: 'Grammaire — temps verbaux',
        prompt:
          'By the time the auditors arrive next Monday, the finance team ---- all of the quarterly reports.',
        choices: [
          { id: 'A', text: 'completes' },
          { id: 'B', text: 'will have completed' },
          { id: 'C', text: 'had completed' },
          { id: 'D', text: 'is completing' },
        ],
        answer: 'B',
        explanation:
          "« By the time… next Monday » projette dans le futur une action qui sera TERMINÉE à ce moment-là → futur antérieur « will have completed ». Règle à mémoriser : « by the time + futur » ⇒ will have + participe passé.",
      },
    ],
  },
  {
    id: 'p5-02',
    part: 5,
    title: 'Part 5 — nature du mot',
    source: 'seed',
    items: [
      {
        id: 'p5-02-q1',
        vocab: [
          { term: "efficiency", translation: "l'efficacité", note: "Famille : efficient (adj.), efficiently (adv.), efficiency (nom)." },
        ],
        category: 'Grammaire — formation des mots',
        prompt:
          'The new scheduling software has improved the ---- of the maintenance department considerably.',
        choices: [
          { id: 'A', text: 'efficient' },
          { id: 'B', text: 'efficiently' },
          { id: 'C', text: 'efficiency' },
          { id: 'D', text: 'efficiencies' },
        ],
        answer: 'C',
        explanation:
          "Après « the » et avant « of », il faut un NOM : « efficiency » (indénombrable ici, donc pas le pluriel D). Méthode Part 5 : regarde les mots juste avant et après le trou — article + of ⇒ nom. Tu peux répondre sans lire toute la phrase.",
      },
    ],
  },
  {
    id: 'p5-03',
    part: 5,
    title: 'Part 5 — préposition',
    source: 'seed',
    items: [
      {
        id: 'p5-03-q1',
        vocab: [
          { term: "by + date", translation: "au plus tard le, d'ici à", example: "submitted by the fifth", note: "À opposer à « until » = jusqu'à (action qui dure)." },
          { term: "an expense claim", translation: "une note de frais" },
        ],
        category: 'Grammaire — prépositions',
        prompt: 'All expense claims must be submitted ---- the fifth of the following month.',
        choices: [
          { id: 'A', text: 'until' },
          { id: 'B', text: 'by' },
          { id: 'C', text: 'during' },
          { id: 'D', text: 'since' },
        ],
        answer: 'B',
        explanation:
          "« by + date » = au plus tard à cette date (échéance). « until » exprime une action qui CONTINUE jusqu'à une date (ex. « the office is closed until Monday »). Confusion by/until : un grand classique du TOEIC, à ancrer une fois pour toutes.",
      },
    ],
  },
  {
    id: 'p5-04',
    part: 5,
    title: 'Part 5 — connecteur',
    source: 'seed',
    items: [
      {
        id: 'p5-04-q1',
        vocab: [
          { term: "on schedule", translation: "dans les temps, à l'heure prévue", example: "it reached the distribution centre on schedule", note: "Voisins : ahead of schedule (en avance), behind schedule (en retard)." },
        ],
        category: 'Grammaire — connecteurs',
        prompt:
          '---- the shipment left the port two days late, it reached the distribution centre on schedule.',
        choices: [
          { id: 'A', text: 'Although' },
          { id: 'B', text: 'Because' },
          { id: 'C', text: 'Despite' },
          { id: 'D', text: 'Therefore' },
        ],
        answer: 'A',
        explanation:
          "Les deux propositions s'opposent (parti en retard MAIS arrivé à l'heure) → concession. « Despite » est aussi concessif mais se construit avec un nom/gérondif, pas avec une proposition sujet + verbe. « Although » + S + V : c'est la seule forme correcte ici.",
      },
    ],
  },
  {
    id: 'p5-05',
    part: 5,
    title: 'Part 5 — vocabulaire',
    source: 'seed',
    items: [
      {
        id: 'p5-05-q1',
        vocab: [
          { term: "to be promoted to", translation: "être promu à (un poste)", example: "She was promoted to regional director.", note: "Collocation figée : promoted TO + intitulé de poste." },
          { term: "a branch", translation: "une agence, une succursale", note: "Aussi : une branche. Au TOEIC, c'est presque toujours l'agence." },
        ],
        category: 'Vocabulaire — mots proches',
        prompt:
          'Ms Okafor was ---- to regional director after leading the most profitable branch for three years.',
        choices: [
          { id: 'A', text: 'promoted' },
          { id: 'B', text: 'advanced' },
          { id: 'C', text: 'raised' },
          { id: 'D', text: 'elevated' },
        ],
        answer: 'A',
        explanation:
          "« be promoted to + poste » est la collocation figée pour une promotion. Les autres verbes existent mais ne se combinent pas avec un intitulé de poste. Au TOEIC, les questions de vocabulaire testent la COLLOCATION : apprends les mots en groupe (promoted to, in charge of, responsible for).",
      },
    ],
  },
  {
    id: 'p5-06',
    part: 5,
    title: 'Part 5 — pronom / relatif',
    source: 'seed',
    items: [
      {
        id: 'p5-06-q1',
        vocab: [
          { term: "whose", translation: "dont, de qui", example: "The consultant whose report we discussed", note: "Toujours suivi d'un nom sans article." },
          { term: "a board meeting", translation: "une réunion du conseil d'administration" },
        ],
        category: 'Grammaire — pronoms relatifs',
        prompt:
          'The consultant ---- report we discussed yesterday will join the board meeting on Thursday.',
        choices: [
          { id: 'A', text: 'who' },
          { id: 'B', text: 'whom' },
          { id: 'C', text: 'whose' },
          { id: 'D', text: 'which' },
        ],
        answer: 'C',
        explanation:
          "Le rapport appartient au consultant → relatif possessif « whose », immédiatement suivi d'un nom sans article. Test rapide : si le mot après le trou est un NOM nu, c'est « whose ».",
      },
    ],
  },
  {
    id: 'p5-07',
    part: 5,
    title: 'Part 5 — accord sujet-verbe',
    source: 'seed',
    items: [
      {
        id: 'p5-07-q1',
        vocab: [
          { term: "a subsidiary", translation: "une filiale", note: "La maison mère se dit « the parent company »." },
          { term: "to be located in", translation: "être situé à", example: "the subsidiaries located in Asia" },
        ],
        category: 'Grammaire — accord sujet-verbe',
        prompt:
          'The list of suppliers approved by the procurement team ---- reviewed every six months.',
        choices: [
          { id: 'A', text: 'are' },
          { id: 'B', text: 'is' },
          { id: 'C', text: 'were' },
          { id: 'D', text: 'have been' },
        ],
        answer: 'B',
        explanation:
          "Le sujet réel est « The list » (singulier), pas « suppliers ». Le groupe « of suppliers approved by… » n'est qu'un complément intercalé. Méthode : barre mentalement tout ce qui est entre le sujet et le verbe, l'accord devient évident.",
      },
    ],
  },
  {
    id: 'p5-08',
    part: 5,
    title: 'Part 5 — gérondif après préposition',
    source: 'seed',
    items: [
      {
        id: 'p5-08-q1',
        vocab: [
          { term: "to be responsible for", translation: "être chargé de", note: "Suivi d'un NOM ou d'un GÉRONDIF, jamais d'un infinitif." },
          { term: "to monitor", translation: "surveiller, suivre", example: "responsible for monitoring energy use" },
        ],
        category: 'Grammaire — gérondif / infinitif',
        prompt:
          'The facilities team is responsible for ---- energy consumption across all three buildings.',
        choices: [
          { id: 'A', text: 'monitor' },
          { id: 'B', text: 'to monitor' },
          { id: 'C', text: 'monitoring' },
          { id: 'D', text: 'monitored' },
        ],
        answer: 'C',
        explanation:
          "Après une PRÉPOSITION (« for »), le verbe se met toujours au gérondif en -ing. Règle sans exception : préposition + V-ing. Attention, le « to » de « responsible for » n'existe pas — ne confonds pas avec « used to ».",
      },
    ],
  },
  {
    id: 'p5-09',
    part: 5,
    title: 'Part 5 — voix passive',
    source: 'seed',
    items: [
      {
        id: 'p5-09-q1',
        vocab: [
          { term: "to notify", translation: "informer, aviser", example: "Applicants will be notified by email." },
          { term: "an applicant", translation: "un candidat", note: "Famille : to apply, an application, an applicant." },
        ],
        category: 'Grammaire — voix passive',
        prompt: 'All applicants ---- by email as soon as a decision has been made.',
        choices: [
          { id: 'A', text: 'will notify' },
          { id: 'B', text: 'will be notified' },
          { id: 'C', text: 'notifying' },
          { id: 'D', text: 'have notified' },
        ],
        answer: 'B',
        explanation:
          "Les candidats SUBISSENT l'action (on les informe) → passif « will be notified ». Test rapide : si le sujet ne fait pas l'action lui-même, il faut be + participe passé. Ici, ce ne sont pas les candidats qui informent.",
      },
    ],
  },
  {
    id: 'p5-10',
    part: 5,
    title: 'Part 5 — comparatif',
    source: 'seed',
    items: [
      {
        id: 'p5-10-q1',
        vocab: [
          { term: "to outperform", translation: "faire mieux que, surpasser" },
          { term: "considerably", translation: "considérablement, nettement", note: "Renforce un comparatif : considerably higher." },
        ],
        category: 'Grammaire — comparatifs',
        prompt: 'Sales in the eastern region were considerably ---- than those in the south this quarter.',
        choices: [
          { id: 'A', text: 'strong' },
          { id: 'B', text: 'strongest' },
          { id: 'C', text: 'stronger' },
          { id: 'D', text: 'as strong' },
        ],
        answer: 'C',
        explanation:
          "La présence de « than » impose un COMPARATIF : « stronger ». Réflexe Part 5 : dès que tu vois « than » dans la phrase, cherche la forme en -er ou « more + adjectif ». Un superlatif appellerait « the » et « in/of ».",
      },
    ],
  },
  {
    id: 'p5-11',
    part: 5,
    title: 'Part 5 — superlatif',
    source: 'seed',
    items: [
      {
        id: 'p5-11-q1',
        vocab: [
          { term: "a venue", translation: "un lieu (d'événement), une salle", example: "the most convenient venue" },
          { term: "convenient", translation: "pratique, commode", note: "Faux ami : ne veut pas dire « convenable »." },
        ],
        category: 'Grammaire — superlatifs',
        prompt: 'Of the four sites we visited, the Hartley Centre is the ---- convenient for our clients.',
        choices: [
          { id: 'A', text: 'more' },
          { id: 'B', text: 'most' },
          { id: 'C', text: 'much' },
          { id: 'D', text: 'very' },
        ],
        answer: 'B',
        explanation:
          "« Of the four sites » + article « the » → SUPERLATIF : « the most convenient ». Le couple « the … est / of + groupe » est la signature du superlatif ; « more » servirait à comparer deux éléments seulement.",
      },
    ],
  },
  {
    id: 'p5-12',
    part: 5,
    title: 'Part 5 — conditionnel hypothétique',
    source: 'seed',
    items: [
      {
        id: 'p5-12-q1',
        vocab: [
          { term: "to relocate", translation: "délocaliser, déménager", example: "if the company relocated its headquarters" },
          { term: "headquarters", translation: "le siège social", note: "Toujours avec un « s », même au singulier. Abrégé HQ." },
        ],
        category: 'Grammaire — conditionnel',
        prompt: 'If the company relocated its headquarters, many employees ---- to move house.',
        choices: [
          { id: 'A', text: 'will have' },
          { id: 'B', text: 'would have' },
          { id: 'C', text: 'have had' },
          { id: 'D', text: 'had' },
        ],
        answer: 'B',
        explanation:
          "Le prétérit « relocated » après « if » signale un conditionnel de type 2 (hypothèse) : la principale prend « would + base verbale ». Schéma à mémoriser : If + prétérit, … would + V. Avec un présent, ce serait « will ».",
      },
    ],
  },
  {
    id: 'p5-13',
    part: 5,
    title: 'Part 5 — modal de déduction',
    source: 'seed',
    items: [
      {
        id: 'p5-13-q1',
        vocab: [
          { term: "a shipment", translation: "une expédition", example: "The shipment must have left the depot." },
          { term: "to leave the depot", translation: "quitter l'entrepôt" },
        ],
        category: 'Grammaire — modaux',
        prompt:
          'The tracking page shows the parcel in Lyon, so it ---- have left the warehouse yesterday.',
        choices: [
          { id: 'A', text: 'must' },
          { id: 'B', text: 'should' },
          { id: 'C', text: 'would' },
          { id: 'D', text: 'need' },
        ],
        answer: 'A',
        explanation:
          "« must + have + participe » exprime une déduction quasi certaine à propos du passé : « il a forcément quitté l'entrepôt ». Le raisonnement s'appuie sur une preuve (« the tracking page shows »). « should have » exprimerait un reproche.",
      },
    ],
  },
  {
    id: 'p5-14',
    part: 5,
    title: 'Part 5 — pronom réfléchi',
    source: 'seed',
    items: [
      {
        id: 'p5-14-q1',
        vocab: [
          { term: "to familiarise oneself with", translation: "se familiariser avec", note: "Verbe pronominal en anglais : oneself obligatoire." },
          { term: "guidelines", translation: "des directives, des consignes", note: "Toujours au pluriel dans ce sens." },
        ],
        category: 'Grammaire — pronoms',
        prompt: 'New employees should familiarise ---- with the safety guidelines during their first week.',
        choices: [
          { id: 'A', text: 'them' },
          { id: 'B', text: 'their' },
          { id: 'C', text: 'themselves' },
          { id: 'D', text: 'theirs' },
        ],
        answer: 'C',
        explanation:
          "« to familiarise oneself with » est un verbe réfléchi : le sujet et le complément désignent la même personne, d'où « themselves ». Autres verbes réfléchis à connaître : pride oneself on, avail oneself of, help oneself to.",
      },
    ],
  },
  {
    id: 'p5-15',
    part: 5,
    title: 'Part 5 — cas du pronom',
    source: 'seed',
    items: [
      {
        id: 'p5-15-q1',
        vocab: [
          { term: "to be divided between", translation: "être réparti entre", example: "divided between her and the assistant manager" },
          { term: "a workload", translation: "une charge de travail" },
        ],
        category: 'Grammaire — pronoms',
        prompt: 'The workload will be shared between Ms Aliyev and ---- until a replacement is hired.',
        choices: [
          { id: 'A', text: 'I' },
          { id: 'B', text: 'me' },
          { id: 'C', text: 'my' },
          { id: 'D', text: 'mine' },
        ],
        answer: 'B',
        explanation:
          "Après la préposition « between », il faut un pronom COMPLÉMENT : « me ». L'erreur « between you and I » est courante même chez les anglophones, mais elle est fausse. Test : supprime « Ms Aliyev and » — on dit « between me », pas « between I ».",
      },
    ],
  },
  {
    id: 'p5-16',
    part: 5,
    title: 'Part 5 — quantifieur',
    source: 'seed',
    items: [
      {
        id: 'p5-16-q1',
        vocab: [
          { term: "feedback", translation: "des retours, des commentaires", note: "INDÉNOMBRABLE : « much feedback », jamais « feedbacks »." },
          { term: "a rollout", translation: "un déploiement", example: "since the rollout of the new interface" },
        ],
        category: 'Grammaire — quantifieurs',
        prompt: 'We have received surprisingly ---- feedback since the new interface was launched.',
        choices: [
          { id: 'A', text: 'few' },
          { id: 'B', text: 'many' },
          { id: 'C', text: 'little' },
          { id: 'D', text: 'a number of' },
        ],
        answer: 'C',
        explanation:
          "« feedback » est INDÉNOMBRABLE en anglais, donc « little » et non « few ». Liste à connaître par cœur : information, advice, equipment, luggage, furniture, research, staff — tous indénombrables, contrairement au français.",
      },
    ],
  },
  {
    id: 'p5-17',
    part: 5,
    title: 'Part 5 — participe adjectival',
    source: 'seed',
    items: [
      {
        id: 'p5-17-q1',
        vocab: [
          { term: "disappointing", translation: "décevant (la chose)", note: "-ING décrit la chose, -ED décrit la personne qui ressent." },
          { term: "quarterly results", translation: "les résultats trimestriels" },
        ],
        category: 'Grammaire — participes adjectivaux',
        prompt: 'The quarterly results were ---- , which is why the board called an emergency meeting.',
        choices: [
          { id: 'A', text: 'disappointed' },
          { id: 'B', text: 'disappointing' },
          { id: 'C', text: 'disappoint' },
          { id: 'D', text: 'disappointment' },
        ],
        answer: 'B',
        explanation:
          "Les résultats PROVOQUENT la déception → forme en -ING. La forme en -ED décrirait celui qui ressent (« the board was disappointed »). Retiens le couple : the news is boring / I am bored.",
      },
    ],
  },
  {
    id: 'p5-18',
    part: 5,
    title: 'Part 5 — verbe + infinitif',
    source: 'seed',
    items: [
      {
        id: 'p5-18-q1',
        vocab: [
          { term: "to intend to", translation: "avoir l'intention de", note: "Suivi de l'INFINITIF, contrairement à « consider » (+ V-ing)." },
          { term: "to expand into", translation: "se développer sur (un marché)", example: "intends to expand into eastern Europe" },
        ],
        category: 'Grammaire — gérondif / infinitif',
        prompt: 'Sandmark Ltd intends ---- into three new markets before the end of the financial year.',
        choices: [
          { id: 'A', text: 'expanding' },
          { id: 'B', text: 'to expand' },
          { id: 'C', text: 'expanded' },
          { id: 'D', text: 'expansion' },
        ],
        answer: 'B',
        explanation:
          "« intend » se construit avec l'infinitif. Apprends les deux familles : + TO (plan, decide, agree, refuse, offer, manage) et + V-ING (consider, avoid, suggest, recommend, postpone, mind). C'est du pur par cœur, très rentable en Part 5.",
      },
    ],
  },
  {
    id: 'p5-19',
    part: 5,
    title: 'Part 5 — verbe + gérondif',
    source: 'seed',
    items: [
      {
        id: 'p5-19-q1',
        vocab: [
          { term: "to recommend + V-ing", translation: "recommander de", note: "JAMAIS « recommend to do ». Piège fréquent pour les francophones." },
          { term: "to book in advance", translation: "réserver à l'avance" },
        ],
        category: 'Grammaire — gérondif / infinitif',
        prompt: 'The travel desk recommends ---- accommodation at least six weeks in advance.',
        choices: [
          { id: 'A', text: 'to book' },
          { id: 'B', text: 'book' },
          { id: 'C', text: 'booking' },
          { id: 'D', text: 'to booking' },
        ],
        answer: 'C',
        explanation:
          "« recommend » se construit avec le GÉRONDIF, jamais avec l'infinitif — piège classique pour un francophone qui pense « recommander DE faire ». Même famille : suggest, avoid, consider, involve, deny.",
      },
    ],
  },
  {
    id: 'p5-20',
    part: 5,
    title: 'Part 5 — adverbe',
    source: 'seed',
    items: [
      {
        id: 'p5-20-q1',
        vocab: [
          { term: "thoroughly", translation: "minutieusement, en profondeur", example: "Each unit is thoroughly tested." },
          { term: "to be dispatched", translation: "être expédié", note: "Synonyme soutenu de « to be shipped »." },
        ],
        category: 'Grammaire — formation des mots',
        prompt: 'Every unit is ---- tested before it is dispatched to the customer.',
        choices: [
          { id: 'A', text: 'thorough' },
          { id: 'B', text: 'thoroughly' },
          { id: 'C', text: 'thoroughness' },
          { id: 'D', text: 'more thorough' },
        ],
        answer: 'B',
        explanation:
          "Le trou modifie le verbe « tested » → il faut un ADVERBE en -ly. Méthode : identifie ce que le mot manquant qualifie. Verbe ou adjectif ⇒ adverbe ; nom ⇒ adjectif. Tu réponds sans même comprendre la phrase.",
      },
    ],
  },
  {
    id: 'p5-21',
    part: 5,
    title: 'Part 5 — adjectif',
    source: 'seed',
    items: [
      {
        id: 'p5-21-q1',
        vocab: [
          { term: "comprehensive", translation: "complet, exhaustif", note: "Faux ami : ne veut PAS dire « compréhensif » (= understanding)." },
          { term: "an overview", translation: "un aperçu, une vue d'ensemble" },
        ],
        category: 'Grammaire — formation des mots',
        prompt: 'The consultant provided a ---- overview of the risks facing the sector.',
        choices: [
          { id: 'A', text: 'comprehend' },
          { id: 'B', text: 'comprehensively' },
          { id: 'C', text: 'comprehension' },
          { id: 'D', text: 'comprehensive' },
        ],
        answer: 'D',
        explanation:
          "Entre l'article « a » et le nom « overview », il faut un ADJECTIF. Retiens aussi le faux ami : « comprehensive » = exhaustif, alors que « compréhensif » se dit « understanding ».",
      },
    ],
  },
  {
    id: 'p5-22',
    part: 5,
    title: 'Part 5 — préposition de lieu',
    source: 'seed',
    items: [
      {
        id: 'p5-22-q1',
        vocab: [
          { term: "on the corner of", translation: "à l'angle de", note: "on the corner (extérieur) vs in the corner (dans un coin de pièce)." },
          { term: "to be situated", translation: "être situé" },
        ],
        category: 'Grammaire — prépositions',
        prompt: 'The new showroom is situated ---- the corner of Meadow Street and Park Lane.',
        choices: [
          { id: 'A', text: 'in' },
          { id: 'B', text: 'on' },
          { id: 'C', text: 'at' },
          { id: 'D', text: 'to' },
        ],
        answer: 'B',
        explanation:
          "« on the corner of X and Y » désigne l'angle de deux rues. « in the corner » s'emploie pour un coin de pièce (« the plant in the corner »). Une seule lettre change, mais le TOEIC teste précisément cette différence.",
      },
    ],
  },
  {
    id: 'p5-23',
    part: 5,
    title: 'Part 5 — verbe + préposition',
    source: 'seed',
    items: [
      {
        id: 'p5-23-q1',
        vocab: [
          { term: "to result in", translation: "aboutir à, entraîner", note: "result IN = conséquence ; result FROM = cause. Ne pas inverser." },
          { term: "a merger", translation: "une fusion (d'entreprises)" },
        ],
        category: 'Grammaire — prépositions',
        prompt: 'The merger is expected to result ---- savings of around two million euros a year.',
        choices: [
          { id: 'A', text: 'from' },
          { id: 'B', text: 'in' },
          { id: 'C', text: 'to' },
          { id: 'D', text: 'with' },
        ],
        answer: 'B',
        explanation:
          "« result IN » introduit la CONSÉQUENCE, « result FROM » la CAUSE. Ici les économies découlent de la fusion, donc « result in ». Mémorise la paire dans les deux sens : A results in B = B results from A.",
      },
    ],
  },
  {
    id: 'p5-24',
    part: 5,
    title: 'Part 5 — adverbe de liaison',
    source: 'seed',
    items: [
      {
        id: 'p5-24-q1',
        vocab: [
          { term: "nevertheless", translation: "néanmoins, pourtant", note: "Adverbe : se place entre deux phrases, souvent après un point-virgule." },
          { term: "a setback", translation: "un revers, un contretemps" },
        ],
        category: 'Grammaire — connecteurs',
        prompt:
          'The pilot project ran over budget; ----, the board agreed to fund a second phase.',
        choices: [
          { id: 'A', text: 'therefore' },
          { id: 'B', text: 'nevertheless' },
          { id: 'C', text: 'moreover' },
          { id: 'D', text: 'for instance' },
        ],
        answer: 'B',
        explanation:
          "Les deux propositions s'OPPOSENT (dépassement de budget mais financement accordé) → « nevertheless ». « therefore » marquerait une conséquence, « moreover » un ajout. Classe tes connecteurs par fonction : opposition / cause / addition / exemple.",
      },
    ],
  },
  {
    id: 'p5-25',
    part: 5,
    title: 'Part 5 — subordonnant conditionnel',
    source: 'seed',
    items: [
      {
        id: 'p5-25-q1',
        vocab: [
          { term: "unless", translation: "à moins que, sauf si", note: "Contient déjà la négation : unless = if … not." },
          { term: "in writing", translation: "par écrit", example: "unless cancelled in writing" },
        ],
        category: 'Grammaire — connecteurs',
        prompt: 'The subscription renews automatically ---- it is cancelled in writing thirty days beforehand.',
        choices: [
          { id: 'A', text: 'unless' },
          { id: 'B', text: 'if' },
          { id: 'C', text: 'whether' },
          { id: 'D', text: 'while' },
        ],
        answer: 'A',
        explanation:
          "« unless » = « if … not » : l'abonnement se renouvelle SAUF SI on l'annule. Avec « if », le sens s'inverserait absurdement. Attention, on ne met jamais de négation après « unless » : la négation est déjà dedans.",
      },
    ],
  },
  {
    id: 'p5-26',
    part: 5,
    title: 'Part 5 — relatif non défini',
    source: 'seed',
    items: [
      {
        id: 'p5-26-q1',
        vocab: [
          { term: "to take effect", translation: "prendre effet, entrer en vigueur" },
          { term: "an amendment", translation: "un avenant, une modification", example: "the amendment, which takes effect in June" },
        ],
        category: 'Grammaire — pronoms relatifs',
        prompt: 'The revised policy, ---- takes effect in June, applies to all part-time staff.',
        choices: [
          { id: 'A', text: 'that' },
          { id: 'B', text: 'which' },
          { id: 'C', text: 'who' },
          { id: 'D', text: 'what' },
        ],
        answer: 'B',
        explanation:
          "Après une VIRGULE, la relative est explicative : elle exige « which » (pour une chose) ou « who » (pour une personne). « that » est interdit dans ce cas. Repère la virgule avant le trou, elle élimine « that » à elle seule.",
      },
    ],
  },
  {
    id: 'p5-27',
    part: 5,
    title: 'Part 5 — present perfect',
    source: 'seed',
    items: [
      {
        id: 'p5-27-q1',
        vocab: [
          { term: "since + point de départ", translation: "depuis (une date)", note: "Déclenche le present perfect : since 2019, since April." },
          { term: "a workforce", translation: "l'effectif, le personnel", note: "Indénombrable : « the workforce has grown »." },
        ],
        category: 'Grammaire — temps verbaux',
        prompt: 'The company ---- its workforce by forty percent since it opened the Porto office.',
        choices: [
          { id: 'A', text: 'expands' },
          { id: 'B', text: 'expanded' },
          { id: 'C', text: 'has expanded' },
          { id: 'D', text: 'will expand' },
        ],
        answer: 'C',
        explanation:
          "« since » relie un point du passé au présent → PRESENT PERFECT obligatoire. Trio à retenir : since / for / so far ⇒ have + participe. Un prétérit simple exigerait une date fermée (« in 2019 », « last year »).",
      },
    ],
  },
  {
    id: 'p5-28',
    part: 5,
    title: 'Part 5 — subordonnée de temps au futur',
    source: 'seed',
    items: [
      {
        id: 'p5-28-q1',
        vocab: [
          { term: "as soon as", translation: "dès que", note: "Jamais suivi de « will » : as soon as we receive, pas « will receive »." },
          { term: "to process an order", translation: "traiter une commande" },
        ],
        category: 'Grammaire — temps verbaux',
        prompt: 'We will process your order as soon as we ---- confirmation from the bank.',
        choices: [
          { id: 'A', text: 'will receive' },
          { id: 'B', text: 'receive' },
          { id: 'C', text: 'received' },
          { id: 'D', text: 'would receive' },
        ],
        answer: 'B',
        explanation:
          "Après « as soon as », « when », « until », « before », « after », on n'emploie JAMAIS « will » : le présent suffit à exprimer le futur. C'est l'inverse du français (« dès que nous recevrons »), d'où l'erreur systématique.",
      },
    ],
  },
  {
    id: 'p5-29',
    part: 5,
    title: 'Part 5 — structure causative',
    source: 'seed',
    items: [
      {
        id: 'p5-29-q1',
        vocab: [
          { term: "to have something done", translation: "faire faire qqch", note: "Structure causative : have + COD + participe passé." },
          { term: "to service equipment", translation: "réviser, entretenir du matériel", note: "Ici « service » est un VERBE : entretenir." },
        ],
        category: 'Grammaire — structures causatives',
        prompt: 'We need to have the air-conditioning units ---- before the summer season begins.',
        choices: [
          { id: 'A', text: 'service' },
          { id: 'B', text: 'servicing' },
          { id: 'C', text: 'serviced' },
          { id: 'D', text: 'to service' },
        ],
        answer: 'C',
        explanation:
          "Structure causative « have + chose + participe passé » : on FAIT FAIRE l'entretien par quelqu'un d'autre. Compare : « have the units serviced » (on le fait faire) et « service the units » (on le fait soi-même).",
      },
    ],
  },
  {
    id: 'p5-30',
    part: 5,
    title: 'Part 5 — inversion après négation',
    source: 'seed',
    items: [
      {
        id: 'p5-30-q1',
        vocab: [
          { term: "not only … but also", translation: "non seulement … mais aussi", note: "En tête de phrase, « not only » impose l'inversion." },
          { term: "to cut delivery times", translation: "réduire les délais de livraison" },
        ],
        category: 'Grammaire — inversion',
        prompt: 'Not only ---- the new depot reduce delivery times, but it also lowered storage costs.',
        choices: [
          { id: 'A', text: 'did' },
          { id: 'B', text: 'it did' },
          { id: 'C', text: 'has' },
          { id: 'D', text: 'was' },
        ],
        answer: 'A',
        explanation:
          "Quand une expression négative ouvre la phrase (Not only, Never, Rarely, Seldom, No sooner), on inverse comme dans une question : auxiliaire + sujet. D'où « did the new depot reduce » — et le verbe reste à la base verbale.",
      },
    ],
  },
  {
    id: 'p5-31',
    part: 5,
    title: 'Part 5 — collocation verbale',
    source: 'seed',
    items: [
      {
        id: 'p5-31-q1',
        vocab: [
          { term: "to make a decision", translation: "prendre une décision", note: "MAKE, jamais « take a decision » en anglais standard." },
          { term: "to take steps", translation: "prendre des mesures", note: "Autre collocation à connaître : take measures / take action." },
        ],
        category: 'Vocabulaire — collocations',
        prompt: 'The committee will ---- a final decision on the tender at its meeting on 14 June.',
        choices: [
          { id: 'A', text: 'take' },
          { id: 'B', text: 'make' },
          { id: 'C', text: 'do' },
          { id: 'D', text: 'give' },
        ],
        answer: 'B',
        explanation:
          "On dit « make a decision » et non « take a decision », alors que le français dit « prendre ». Les collocations avec make/do/take sont un gisement de points : make an offer, do research, take action, make progress.",
      },
    ],
  },
  {
    id: 'p5-32',
    part: 5,
    title: 'Part 5 — rise / raise',
    source: 'seed',
    items: [
      {
        id: 'p5-32-q1',
        vocab: [
          { term: "to raise prices", translation: "augmenter les prix", note: "RAISE est transitif (on augmente qqch). RISE est intransitif." },
          { term: "to rise", translation: "augmenter, monter (tout seul)", example: "Costs have risen sharply." },
        ],
        category: 'Vocabulaire — mots proches',
        prompt: 'Because energy costs have ---- sharply, the supplier has revised its price list.',
        choices: [
          { id: 'A', text: 'raised' },
          { id: 'B', text: 'risen' },
          { id: 'C', text: 'arisen' },
          { id: 'D', text: 'rose' },
        ],
        answer: 'B',
        explanation:
          "« rise » est INTRANSITIF (rise / rose / risen) : quelque chose monte tout seul. « raise » est TRANSITIF : on augmente quelque chose. Ici les coûts montent d'eux-mêmes, donc « have risen ». Même logique pour lie / lay.",
      },
    ],
  },
  {
    id: 'p5-33',
    part: 5,
    title: 'Part 5 — affect / effect',
    source: 'seed',
    items: [
      {
        id: 'p5-33-q1',
        vocab: [
          { term: "to affect", translation: "affecter, avoir un impact sur", note: "VERBE. Le nom correspondant est « an effect »." },
          { term: "an outage", translation: "une panne, une interruption de service" },
        ],
        category: 'Vocabulaire — mots proches',
        prompt: 'The outage did not ---- customers outside the Paris region.',
        choices: [
          { id: 'A', text: 'effect' },
          { id: 'B', text: 'affect' },
          { id: 'C', text: 'affection' },
          { id: 'D', text: 'effective' },
        ],
        answer: 'B',
        explanation:
          "« affect » est le VERBE (avoir un effet sur), « effect » le NOM (l'effet). Après l'auxiliaire « did not », il faut un verbe. Astuce mnémotechnique : Affect = Action (verbe), Effect = End result (nom).",
      },
    ],
  },
  {
    id: 'p5-34',
    part: 5,
    title: 'Part 5 — economic / economical',
    source: 'seed',
    items: [
      {
        id: 'p5-34-q1',
        vocab: [
          { term: "economical", translation: "économique au sens d'« économe »", note: "economic = relatif à l'économie ; economical = peu coûteux." },
          { term: "fuel consumption", translation: "la consommation de carburant" },
        ],
        category: 'Vocabulaire — mots proches',
        prompt: 'The hybrid vans are far more ---- to run than the diesel models they replaced.',
        choices: [
          { id: 'A', text: 'economic' },
          { id: 'B', text: 'economical' },
          { id: 'C', text: 'economy' },
          { id: 'D', text: 'economics' },
        ],
        answer: 'B',
        explanation:
          "« economical » = peu coûteux à l'usage ; « economic » = relatif à l'économie d'un pays (economic growth). Le contexte parle de coût d'exploitation, donc « economical ». Même piège avec historic / historical et classic / classical.",
      },
    ],
  },
  {
    id: 'p5-35',
    part: 5,
    title: 'Part 5 — nom indénombrable',
    source: 'seed',
    items: [
      {
        id: 'p5-35-q1',
        vocab: [
          { term: "information", translation: "des informations", note: "INDÉNOMBRABLE : jamais d'« informations », jamais « an information »." },
          { term: "a piece of information", translation: "une information", note: "Pour compter un indénombrable : a piece of / an item of." },
        ],
        category: 'Grammaire — dénombrables / indénombrables',
        prompt: 'The brochure contains all the ---- you need about visa requirements.',
        choices: [
          { id: 'A', text: 'informations' },
          { id: 'B', text: 'information' },
          { id: 'C', text: 'informative' },
          { id: 'D', text: 'informed' },
        ],
        answer: 'B',
        explanation:
          "« information » est indénombrable et n'a pas de pluriel — l'erreur « informations » est le réflexe francophone par excellence. Même famille : advice, news, luggage, equipment, furniture, progress, research.",
      },
    ],
  },
  {
    id: 'p5-36',
    part: 5,
    title: 'Part 5 — despite / although',
    source: 'seed',
    items: [
      {
        id: 'p5-36-q1',
        vocab: [
          { term: "despite + nom / V-ing", translation: "malgré", note: "Jamais suivi d'une proposition sujet + verbe." },
          { term: "a downturn", translation: "un ralentissement, une récession", example: "despite the downturn in the sector" },
        ],
        category: 'Grammaire — connecteurs',
        prompt: '---- the downturn in the sector, the firm reported a small profit last year.',
        choices: [
          { id: 'A', text: 'Although' },
          { id: 'B', text: 'Even though' },
          { id: 'C', text: 'Despite' },
          { id: 'D', text: 'However' },
        ],
        answer: 'C',
        explanation:
          "Le trou est suivi d'un GROUPE NOMINAL (« the downturn »), pas d'une proposition : il faut « Despite » ou « In spite of ». « Although » exigerait un sujet et un verbe. Regarde ce qui suit le trou avant de choisir un concessif.",
      },
    ],
  },
  {
    id: 'p5-37',
    part: 5,
    title: 'Part 5 — adjectif + préposition',
    source: 'seed',
    items: [
      {
        id: 'p5-37-q1',
        vocab: [
          { term: "to be eligible for", translation: "avoir droit à, être éligible à", note: "Collocation figée : eligible FOR + nom." },
          { term: "a bonus scheme", translation: "un dispositif de primes" },
        ],
        category: 'Vocabulaire — collocations',
        prompt: 'Employees become eligible ---- the annual bonus after twelve months of service.',
        choices: [
          { id: 'A', text: 'to' },
          { id: 'B', text: 'for' },
          { id: 'C', text: 'of' },
          { id: 'D', text: 'with' },
        ],
        answer: 'B',
        explanation:
          "« eligible FOR » est une collocation figée. Constitue-toi une liste d'adjectifs + préposition : responsible for, capable of, familiar with, subject to, similar to, aware of. Elles tombent à chaque session.",
      },
    ],
  },
  {
    id: 'p5-38',
    part: 5,
    title: 'Part 5 — too / enough',
    source: 'seed',
    items: [
      {
        id: 'p5-38-q1',
        vocab: [
          { term: "enough + nom", translation: "assez de", note: "enough se place APRÈS l'adjectif mais AVANT le nom." },
          { term: "storage capacity", translation: "la capacité de stockage" },
        ],
        category: 'Grammaire — quantifieurs',
        prompt: 'The server does not have ---- capacity to store three years of transaction records.',
        choices: [
          { id: 'A', text: 'too much' },
          { id: 'B', text: 'enough' },
          { id: 'C', text: 'so much' },
          { id: 'D', text: 'as much' },
        ],
        answer: 'B',
        explanation:
          "« not enough capacity » = pas assez de capacité. Retiens la place de « enough » : AVANT un nom (enough time) mais APRÈS un adjectif (big enough). Cette double règle est régulièrement testée.",
      },
    ],
  },
  {
    id: 'p5-39',
    part: 5,
    title: 'Part 5 — so / such',
    source: 'seed',
    items: [
      {
        id: 'p5-39-q1',
        vocab: [
          { term: "such a + adjectif + nom", translation: "un(e) si … que", note: "SO + adjectif seul ; SUCH + (a) + adjectif + nom." },
          { term: "a turnout", translation: "une affluence, un taux de participation" },
        ],
        category: 'Grammaire — structures emphatiques',
        prompt: 'There was ---- a large turnout that we had to open the second hall.',
        choices: [
          { id: 'A', text: 'so' },
          { id: 'B', text: 'very' },
          { id: 'C', text: 'such' },
          { id: 'D', text: 'too' },
        ],
        answer: 'C',
        explanation:
          "Devant « a + adjectif + NOM », on emploie « such » : such a large turnout. « so » s'emploie devant un adjectif SEUL : so large. Les deux se traduisent par « si », d'où la confusion — c'est la présence du nom qui tranche.",
      },
    ],
  },
  {
    id: 'p5-40',
    part: 5,
    title: 'Part 5 — vocabulaire contextuel',
    source: 'seed',
    items: [
      {
        id: 'p5-40-q1',
        vocab: [
          { term: "to meet a deadline", translation: "respecter une échéance", note: "MEET, pas « respect ». Aussi : meet a target, meet requirements." },
          { term: "tight", translation: "serré, juste (délai, budget)", example: "a tight deadline" },
        ],
        category: 'Vocabulaire — collocations',
        prompt: 'Despite a very tight schedule, the construction team managed to ---- every deadline.',
        choices: [
          { id: 'A', text: 'meet' },
          { id: 'B', text: 'reach' },
          { id: 'C', text: 'respect' },
          { id: 'D', text: 'arrive' },
        ],
        answer: 'A',
        explanation:
          "« to meet a deadline » est la collocation figée pour « respecter une échéance ». « respect » est un calque du français qui ne s'emploie pas ici. Même verbe pour : meet a target, meet a requirement, meet expectations.",
      },
    ],
  },
];
