/**
 * Part 2 — Question-Response.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART2: QuestionSet[] = [
  {
    id: 'p2-01',
    part: 2,
    title: 'Question en WHERE',
    source: 'seed',
    items: [
      {
        id: 'p2-01-q1',
        vocab: [
          { term: "extra", translation: "supplémentaire, en réserve", example: "the box of extra badges", note: "Faux ami : ne veut pas dire « extra » au sens de génial." },
        ],
        category: 'Question-réponse — WH (where)',
        choices: [
          { id: 'A', text: 'On the third floor, next to the copy room.' },
          { id: 'B', text: 'Yes, I moved it yesterday.' },
          { id: 'C', text: 'About forty euros, I think.' },
        ],
        answer: 'A',
        explanation:
          "La question commence par « Where » : elle appelle un LIEU. (B) est un piège fréquent — une question en WH ne se répond jamais par yes/no. (C) répond à « How much ». Réflexe : identifie le mot interrogatif dans les 2 premières secondes.",
        audio: [
          { text: 'Where did you put the box of extra badges?', voice: 'male' },
          { text: 'A. On the third floor, next to the copy room.', voice: 'female' },
          { text: 'B. Yes, I moved it yesterday.', voice: 'female' },
          { text: 'C. About forty euros, I think.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-02',
    part: 2,
    title: 'Question négative',
    source: 'seed',
    items: [
      {
        id: 'p2-02-q1',
        vocab: [
          { term: "to postpone", translation: "reporter, décaler", example: "It was postponed until Thursday.", note: "Synonymes TOEIC : to put off, to push back, to reschedule." },
          { term: "actually", translation: "en fait, en réalité", note: "Faux ami majeur : ne veut PAS dire « actuellement » (= currently)." },
        ],
        category: 'Question-réponse — question négative',
        choices: [
          { id: 'A', text: "No, the printer is out of paper again." },
          { id: 'B', text: "Actually, it was postponed until Thursday." },
          { id: 'C', text: "She works in the accounting department." },
        ],
        answer: 'B',
        explanation:
          "« Wasn't the training session scheduled for this morning? » = l'interlocuteur pense que oui. La bonne réponse corrige l'information : « it was postponed until Thursday ». Les réponses indirectes sont très fréquentes en Part 2 — ne cherche pas forcément un yes/no.",
        audio: [
          { text: "Wasn't the training session scheduled for this morning?", voice: 'female' },
          { text: 'A. No, the printer is out of paper again.', voice: 'male' },
          { text: 'B. Actually, it was postponed until Thursday.', voice: 'male' },
          { text: 'C. She works in the accounting department.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-03',
    part: 2,
    title: 'Question alternative (or)',
    source: 'seed',
    items: [
      {
        id: 'p2-03-q1',
        vocab: [
          { term: "whichever", translation: "celui/celle que, peu importe lequel", example: "Whichever is cheaper for the company.", note: "Réponse d'esquive typique de la Part 2, avec « Either is fine »." },
        ],
        category: 'Question-réponse — alternative',
        choices: [
          { id: 'A', text: "Whichever is cheaper for the company." },
          { id: 'B', text: "Yes, the flight was delayed." },
          { id: 'C', text: "At the reception desk, please." },
        ],
        answer: 'A',
        explanation:
          "Question alternative « X or Y ? » : on ne répond pas par yes/no, ce qui élimine (B). « Whichever is cheaper » est une réponse d'esquive — extrêmement courante au TOEIC (avec « Either is fine », « It doesn't matter »). Apprends-les par cœur : elles sont souvent correctes.",
        audio: [
          { text: 'Should we take the train to Lyon, or should we drive?', voice: 'male' },
          { text: 'A. Whichever is cheaper for the company.', voice: 'female' },
          { text: 'B. Yes, the flight was delayed.', voice: 'female' },
          { text: 'C. At the reception desk, please.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-04',
    part: 2,
    title: 'Demande indirecte',
    source: 'seed',
    items: [
      {
        id: 'p2-04-q1',
        vocab: [
          { term: "to forward", translation: "transférer (un email)", example: "Could you forward me the updated budget?" },
        ],
        category: 'Question-réponse — requête / suggestion',
        choices: [
          { id: 'A', text: "Sure, I'll send it over before noon." },
          { id: 'B', text: "It's on the second shelf." },
          { id: 'C', text: "He signed the contract last week." },
        ],
        answer: 'A',
        explanation:
          "« Could you forward me the updated budget? » est une REQUÊTE, pas une question d'information : on attend une acceptation ou un refus. « Sure, I'll… » est le schéma type. Repère les amorces « Could you / Would you mind / Why don't we ».",
        audio: [
          { text: 'Could you forward me the updated budget before the meeting?', voice: 'female' },
          { text: "A. Sure, I'll send it over before noon.", voice: 'male' },
          { text: "B. It's on the second shelf.", voice: 'male' },
          { text: 'C. He signed the contract last week.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-05',
    part: 2,
    title: 'Question en WHEN',
    source: 'seed',
    items: [
      {
        id: 'p2-05-q1',
        vocab: [
          { term: "a performance review", translation: "un entretien annuel d'évaluation", note: "Aussi : an appraisal. Vocabulaire RH récurrent au TOEIC." },
          { term: "no later than", translation: "au plus tard", example: "no later than the end of the month" },
        ],
        category: 'Question-réponse — WH (when)',
        choices: [
          { id: 'A', text: 'In the meeting room on the fourth floor.' },
          { id: 'B', text: 'No later than the end of the month.' },
          { id: 'C', text: 'Yes, it went very well.' },
        ],
        answer: 'B',
        explanation:
          "« When » appelle un MOMENT : « no later than the end of the month ». (A) répond à « Where » et (C) est un yes/no impossible après un mot interrogatif. Le piège est de se laisser attirer par (C) qui reprend le thème de l'évaluation.",
        audio: [
          { text: 'When do the performance reviews have to be completed?', voice: 'female' },
          { text: 'A. In the meeting room on the fourth floor.', voice: 'male' },
          { text: 'B. No later than the end of the month.', voice: 'male' },
          { text: 'C. Yes, it went very well.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-06',
    part: 2,
    title: 'Question en WHO',
    source: 'seed',
    items: [
      {
        id: 'p2-06-q1',
        vocab: [
          { term: "to be in charge of", translation: "être responsable de", example: "Who's in charge of the booth?", note: "Collocation figée : in charge OF. Ne pas dire « in charge for »." },
          { term: "a trade fair", translation: "un salon professionnel", note: "Aussi : a trade show." },
        ],
        category: 'Question-réponse — WH (who)',
        choices: [
          { id: 'A', text: 'Because the budget was approved late.' },
          { id: 'B', text: 'For three days in September.' },
          { id: 'C', text: "Someone from the marketing team, I believe." },
        ],
        answer: 'C',
        explanation:
          "« Who » appelle une PERSONNE. « Someone from the marketing team » est une réponse vague, et c'est justement ce que le TOEIC valorise : une réponse imprécise mais du bon type vaut mieux qu'une réponse précise hors sujet.",
        audio: [
          { text: "Who's in charge of setting up our booth at the trade fair?", voice: 'male' },
          { text: 'A. Because the budget was approved late.', voice: 'female' },
          { text: 'B. For three days in September.', voice: 'female' },
          { text: 'C. Someone from the marketing team, I believe.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-07',
    part: 2,
    title: 'Question en WHY',
    source: 'seed',
    items: [
      {
        id: 'p2-07-q1',
        vocab: [
          { term: "a power outage", translation: "une coupure de courant", example: "There was a power outage overnight." },
          { term: "overnight", translation: "pendant la nuit", note: "Adverbe très courant : « the system rebooted overnight »." },
        ],
        category: 'Question-réponse — WH (why)',
        choices: [
          { id: 'A', text: 'There was a power outage overnight.' },
          { id: 'B', text: 'On the shelf above the printer.' },
          { id: 'C', text: 'Around two hundred copies.' },
        ],
        answer: 'A',
        explanation:
          "« Why » appelle une CAUSE, donnée ici sans « because » — c'est très fréquent : la cause peut être exprimée par une simple phrase déclarative. Ne rejette pas une réponse parce qu'elle ne commence pas par « because ».",
        audio: [
          { text: 'Why is the server down this morning?', voice: 'female' },
          { text: 'A. There was a power outage overnight.', voice: 'male' },
          { text: 'B. On the shelf above the printer.', voice: 'male' },
          { text: 'C. Around two hundred copies.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-08',
    part: 2,
    title: 'Question en HOW LONG',
    source: 'seed',
    items: [
      {
        id: 'p2-08-q1',
        vocab: [
          { term: "a couple of", translation: "deux ou trois, quelques", example: "A couple of weeks at most." },
          { term: "at most", translation: "au maximum", note: "Contraire : at least (au minimum)." },
        ],
        category: 'Question-réponse — WH (how long)',
        choices: [
          { id: 'A', text: 'The technician from Voltek.' },
          { id: 'B', text: 'A couple of weeks at most.' },
          { id: 'C', text: 'In the basement storage room.' },
        ],
        answer: 'B',
        explanation:
          "« How long » appelle une DURÉE, pas un moment : « a couple of weeks ». Distingue bien « How long » (durée) de « When » (date) — les deux se ressemblent à l'oral quand on n'écoute pas les deux premiers mots.",
        audio: [
          { text: 'How long will the renovation of the lobby take?', voice: 'male' },
          { text: 'A. The technician from Voltek.', voice: 'female' },
          { text: 'B. A couple of weeks at most.', voice: 'female' },
          { text: 'C. In the basement storage room.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-09',
    part: 2,
    title: 'Question en HOW OFTEN',
    source: 'seed',
    items: [
      {
        id: 'p2-09-q1',
        vocab: [
          { term: "twice a month", translation: "deux fois par mois", note: "once / twice / three times A month : article « a » obligatoire." },
          { term: "an inventory", translation: "un inventaire", example: "How often is the inventory checked?" },
        ],
        category: 'Question-réponse — WH (how often)',
        choices: [
          { id: 'A', text: 'It took about four hours.' },
          { id: 'B', text: 'By the warehouse supervisor.' },
          { id: 'C', text: 'Twice a month, usually on a Friday.' },
        ],
        answer: 'C',
        explanation:
          "« How often » appelle une FRÉQUENCE : « twice a month ». (A) donne une durée (« How long »), (B) un agent (« Who by »). Ces trois questions se répondent avec des expressions de temps proches : c'est là qu'on perd des points.",
        audio: [
          { text: 'How often is the inventory checked at the warehouse?', voice: 'female' },
          { text: 'A. It took about four hours.', voice: 'male' },
          { text: 'B. By the warehouse supervisor.', voice: 'male' },
          { text: 'C. Twice a month, usually on a Friday.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-10',
    part: 2,
    title: 'Question en WHAT',
    source: 'seed',
    items: [
      {
        id: 'p2-10-q1',
        vocab: [
          { term: "an agenda", translation: "un ordre du jour", note: "Faux ami : ce n'est PAS un agenda-carnet (= a diary, a planner)." },
          { term: "a rollout", translation: "un déploiement, un lancement", example: "the rollout of the new payroll system" },
        ],
        category: 'Question-réponse — WH (what)',
        choices: [
          { id: 'A', text: 'Mainly the rollout of the new payroll system.' },
          { id: 'B', text: 'Yes, I put it on your desk.' },
          { id: 'C', text: 'She left about ten minutes ago.' },
        ],
        answer: 'A',
        explanation:
          "« What's on the agenda? » demande le CONTENU de la réunion. (B) est un yes/no, impossible après « What ». Attention au faux ami « agenda » : c'est l'ordre du jour, pas le carnet de rendez-vous.",
        audio: [
          { text: "What's on the agenda for tomorrow's management meeting?", voice: 'male' },
          { text: 'A. Mainly the rollout of the new payroll system.', voice: 'female' },
          { text: 'B. Yes, I put it on your desk.', voice: 'female' },
          { text: 'C. She left about ten minutes ago.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-11',
    part: 2,
    title: 'Question en WHICH',
    source: 'seed',
    items: [
      {
        id: 'p2-11-q1',
        vocab: [
          { term: "a supplier", translation: "un fournisseur", example: "Which supplier did we use?", note: "Aussi : a vendor (surtout en anglais américain)." },
          { term: "the one + relative", translation: "celui qui / celle que", example: "The one based in Lille." },
        ],
        category: 'Question-réponse — WH (which)',
        choices: [
          { id: 'A', text: 'It cost slightly more than expected.' },
          { id: 'B', text: 'The one based in Lille.' },
          { id: 'C', text: 'Every second Tuesday.' },
        ],
        answer: 'B',
        explanation:
          "« Which supplier » demande de choisir dans un ensemble : la réponse identifie un élément, d'où le pronom « the one ». Mémorise ce schéma « Which… ? → The one that/who… » : il tombe presque à chaque examen.",
        audio: [
          { text: 'Which supplier did we use for the office furniture last year?', voice: 'female' },
          { text: 'A. It cost slightly more than expected.', voice: 'male' },
          { text: 'B. The one based in Lille.', voice: 'male' },
          { text: 'C. Every second Tuesday.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-12',
    part: 2,
    title: 'Question en HOW MANY',
    source: 'seed',
    items: [
      {
        id: 'p2-12-q1',
        vocab: [
          { term: "to sign up", translation: "s'inscrire", example: "Twelve have signed up so far.", note: "Synonymes : to register, to enrol." },
          { term: "so far", translation: "jusqu'à présent", note: "Va avec le present perfect : « twelve have signed up so far »." },
        ],
        category: 'Question-réponse — WH (how many)',
        choices: [
          { id: 'A', text: 'In the training room downstairs.' },
          { id: 'B', text: 'It lasts two full days.' },
          { id: 'C', text: 'Twelve have signed up so far.' },
        ],
        answer: 'C',
        explanation:
          "« How many » appelle un NOMBRE : « twelve ». Les distracteurs donnent un lieu et une durée — deux informations plausibles sur une formation, mais qui ne répondent pas à la question posée. Le type d'information prime sur le thème.",
        audio: [
          { text: 'How many people have registered for the safety training?', voice: 'male' },
          { text: 'A. In the training room downstairs.', voice: 'female' },
          { text: 'B. It lasts two full days.', voice: 'female' },
          { text: 'C. Twelve have signed up so far.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-13',
    part: 2,
    title: 'Question fermée (yes/no)',
    source: 'seed',
    items: [
      {
        id: 'p2-13-q1',
        vocab: [
          { term: "to go over something", translation: "passer en revue, vérifier qqch", example: "Have you gone over the figures?" },
          { term: "figures", translation: "les chiffres (comptables)", note: "Au pluriel, « figures » = les données chiffrées d'un rapport." },
        ],
        category: 'Question-réponse — question fermée',
        choices: [
          { id: 'A', text: "Not yet — I'll do it this afternoon." },
          { id: 'B', text: 'The finance department, on the sixth floor.' },
          { id: 'C', text: 'Because the deadline was moved.' },
        ],
        answer: 'A',
        explanation:
          "Question fermée « Have you… ? » : on attend une confirmation ou une négation. « Not yet » est la forme négative naturelle avec un present perfect. Retiens le couple « Have you…? → Not yet », omniprésent en Part 2.",
        audio: [
          { text: 'Have you gone over the figures in the quarterly report?', voice: 'female' },
          { text: "A. Not yet — I'll do it this afternoon.", voice: 'male' },
          { text: 'B. The finance department, on the sixth floor.', voice: 'male' },
          { text: 'C. Because the deadline was moved.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-14',
    part: 2,
    title: 'Question-tag',
    source: 'seed',
    items: [
      {
        id: 'p2-14-q1',
        vocab: [
          { term: "to relocate", translation: "déménager, être muté", example: "The team is relocating to the new site." },
          { term: "as far as I know", translation: "à ma connaissance", note: "Formule d'esquive très fréquente en Part 2." },
        ],
        category: 'Question-réponse — question-tag',
        choices: [
          { id: 'A', text: 'I moved there myself last spring.' },
          { id: 'B', text: "As far as I know, yes — in October." },
          { id: 'C', text: 'The relocation costs were quite high.' },
        ],
        answer: 'B',
        explanation:
          "Un tag « …, isn't it? » demande de confirmer. « As far as I know, yes » confirme en nuançant. (A) et (C) reprennent le mot « relocate / relocation » avec un sens décalé : c'est le piège phonétique classique — un mot répété n'est presque jamais la bonne réponse.",
        audio: [
          { text: "The design team is relocating to the new site, isn't it?", voice: 'male' },
          { text: 'A. I moved there myself last spring.', voice: 'female' },
          { text: 'B. As far as I know, yes — in October.', voice: 'female' },
          { text: 'C. The relocation costs were quite high.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-15',
    part: 2,
    title: 'Suggestion (Why don’t we)',
    source: 'seed',
    items: [
      {
        id: 'p2-15-q1',
        vocab: [
          { term: "Why don't we…?", translation: "Et si nous… ?", note: "Amorce de SUGGESTION, jamais une vraie question en « why »." },
          { term: "That sounds good", translation: "Ça me va, bonne idée", note: "Réponse type à une suggestion, avec « That works for me »." },
        ],
        category: 'Question-réponse — requête / suggestion',
        choices: [
          { id: 'A', text: 'Because the client cancelled.' },
          { id: 'B', text: 'It was a very productive discussion.' },
          { id: 'C', text: "That sounds good — I'll book a table." },
        ],
        answer: 'C',
        explanation:
          "« Why don't we…? » n'est PAS une question en « why » : c'est une suggestion, à laquelle on répond en acceptant ou en refusant. Le piège (A) répond au mot « why » pris au pied de la lettre — erreur très fréquente.",
        audio: [
          { text: "Why don't we discuss this over lunch?", voice: 'female' },
          { text: 'A. Because the client cancelled.', voice: 'male' },
          { text: 'B. It was a very productive discussion.', voice: 'male' },
          { text: "C. That sounds good — I'll book a table.", voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-16',
    part: 2,
    title: 'Proposition d’aide (offer)',
    source: 'seed',
    items: [
      {
        id: 'p2-16-q1',
        vocab: [
          { term: "to give someone a hand", translation: "donner un coup de main à qqn", example: "Would you like me to give you a hand?" },
          { term: "I can manage", translation: "je m'en sors, ça ira", note: "Refus poli d'une aide proposée." },
        ],
        category: 'Question-réponse — requête / suggestion',
        choices: [
          { id: 'A', text: "Thanks, but I can manage on my own." },
          { id: 'B', text: 'They arrived on Tuesday morning.' },
          { id: 'C', text: 'About thirty boxes in total.' },
        ],
        answer: 'A',
        explanation:
          "« Would you like me to…? » est une OFFRE d'aide : on l'accepte ou on la décline. « Thanks, but I can manage » est un refus poli. Note que la bonne réponse commence par « Thanks » sans pour autant accepter : ne t'arrête pas au premier mot.",
        audio: [
          { text: 'Would you like me to help you carry those files?', voice: 'male' },
          { text: 'A. Thanks, but I can manage on my own.', voice: 'female' },
          { text: 'B. They arrived on Tuesday morning.', voice: 'female' },
          { text: 'C. About thirty boxes in total.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-17',
    part: 2,
    title: 'Phrase déclarative',
    source: 'seed',
    items: [
      {
        id: 'p2-17-q1',
        vocab: [
          { term: "to run out of", translation: "être à court de", example: "We've run out of printer paper." },
          { term: "to place an order", translation: "passer une commande", example: "I'll place an order this afternoon." },
        ],
        category: 'Question-réponse — phrase déclarative',
        choices: [
          { id: 'A', text: 'Yes, the printer is on the second floor.' },
          { id: 'B', text: "I'll place an order this afternoon." },
          { id: 'C', text: 'She ran to catch the train.' },
        ],
        answer: 'B',
        explanation:
          "Ce n'est pas une question mais un CONSTAT : la bonne réponse propose une solution. Environ un tiers des items de Part 2 sont des phrases déclaratives. (C) joue sur « run out of » / « ran » : piège sonore pur.",
        audio: [
          { text: "We've run out of printer paper again.", voice: 'female' },
          { text: 'A. Yes, the printer is on the second floor.', voice: 'male' },
          { text: "B. I'll place an order this afternoon.", voice: 'male' },
          { text: 'C. She ran to catch the train.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-18',
    part: 2,
    title: 'Réponse d’esquive (I don’t know)',
    source: 'seed',
    items: [
      {
        id: 'p2-18-q1',
        vocab: [
          { term: "to be announced", translation: "être annoncé, communiqué", example: "The winner hasn't been announced yet." },
          { term: "I haven't heard", translation: "je n'en ai pas entendu parler", note: "Esquive type : souvent la BONNE réponse en Part 2." },
        ],
        category: 'Question-réponse — réponse indirecte',
        choices: [
          { id: 'A', text: 'Yes, congratulations to the whole team.' },
          { id: 'B', text: 'In the main auditorium at six.' },
          { id: 'C', text: "I haven't heard anything yet." },
        ],
        answer: 'C',
        explanation:
          "« I haven't heard anything yet » ne donne aucune information, et c'est pourtant la bonne réponse : les esquives (« I'm not sure », « Let me check », « Ask Diane ») sont systématiquement correctes quand les autres options sont hors sujet. Ne les écarte jamais.",
        audio: [
          { text: 'Who won the contract for the airport project?', voice: 'male' },
          { text: 'A. Yes, congratulations to the whole team.', voice: 'female' },
          { text: 'B. In the main auditorium at six.', voice: 'female' },
          { text: "C. I haven't heard anything yet.", voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-19',
    part: 2,
    title: 'Question alternative (deux dates)',
    source: 'seed',
    items: [
      {
        id: 'p2-19-q1',
        vocab: [
          { term: "Either one works", translation: "L'un ou l'autre me convient", note: "Esquive type des questions alternatives." },
          { term: "a deadline", translation: "une échéance, une date limite", example: "whichever fits the deadline" },
        ],
        category: 'Question-réponse — alternative',
        choices: [
          { id: 'A', text: 'Either one works for me.' },
          { id: 'B', text: 'No, I sent it last night.' },
          { id: 'C', text: 'The report is forty pages long.' },
        ],
        answer: 'A',
        explanation:
          "Question en « X or Y ? » : (B) est éliminé d'office car on ne répond pas par yes/no. « Either one works » esquive le choix — apprends ce trio par cœur : « Either is fine », « Whichever you prefer », « It doesn't matter ».",
        audio: [
          { text: 'Should we send the proposal on Monday or wait until Wednesday?', voice: 'female' },
          { text: 'A. Either one works for me.', voice: 'male' },
          { text: 'B. No, I sent it last night.', voice: 'male' },
          { text: 'C. The report is forty pages long.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-20',
    part: 2,
    title: 'Question négative (confirmation)',
    source: 'seed',
    items: [
      {
        id: 'p2-20-q1',
        vocab: [
          { term: "to be due", translation: "être attendu, devoir arriver", example: "The auditor is due at nine." },
          { term: "to be held up", translation: "être retardé, bloqué", example: "He was held up in traffic.", note: "Sens « retenu, retardé » — rien à voir avec « tenir »." },
        ],
        category: 'Question-réponse — question négative',
        choices: [
          { id: 'A', text: 'Yes, the room is fully booked.' },
          { id: 'B', text: 'He called to say he was held up in traffic.' },
          { id: 'C', text: 'Nine copies should be enough.' },
        ],
        answer: 'B',
        explanation:
          "« Isn't the auditor supposed to be here by now? » exprime la surprise. La bonne réponse EXPLIQUE l'absence sans dire ni yes ni no. Face à une question négative, cherche l'option qui justifie ou corrige, pas celle qui commence par yes/no.",
        audio: [
          { text: "Isn't the auditor supposed to be here by now?", voice: 'male' },
          { text: 'A. Yes, the room is fully booked.', voice: 'female' },
          { text: 'B. He called to say he was held up in traffic.', voice: 'female' },
          { text: 'C. Nine copies should be enough.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-21',
    part: 2,
    title: 'Requête polie (Would you mind)',
    source: 'seed',
    items: [
      {
        id: 'p2-21-q1',
        vocab: [
          { term: "Would you mind + V-ing", translation: "Cela vous dérangerait-il de… ?", note: "Toujours suivi du GÉRONDIF. Accepter se dit « Not at all »." },
          { term: "Not at all", translation: "Pas du tout, volontiers", note: "Accepte la demande malgré la forme négative : piège logique." },
        ],
        category: 'Question-réponse — requête / suggestion',
        choices: [
          { id: 'A', text: 'It was quite a long presentation.' },
          { id: 'B', text: 'Yes, I minded the last time.' },
          { id: 'C', text: 'Not at all, when do you need them?' },
        ],
        answer: 'C',
        explanation:
          "Avec « Would you mind…? », accepter se dit « Not at all » ou « Of course not » : la forme est négative mais le sens est positif. C'est contre-intuitif en français — mémorise-le, il tombe très régulièrement.",
        audio: [
          { text: 'Would you mind printing the handouts for the seminar?', voice: 'female' },
          { text: 'A. It was quite a long presentation.', voice: 'male' },
          { text: 'B. Yes, I minded the last time.', voice: 'male' },
          { text: 'C. Not at all, when do you need them?', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-22',
    part: 2,
    title: 'WHERE avec piège sonore',
    source: 'seed',
    items: [
      {
        id: 'p2-22-q1',
        vocab: [
          { term: "a storage room", translation: "un local de rangement, une réserve" },
          { term: "spare", translation: "de rechange, en réserve", example: "the spare projector", note: "a spare part = une pièce détachée." },
        ],
        category: 'Question-réponse — WH (where)',
        choices: [
          { id: 'A', text: 'In the storage room next to the kitchen.' },
          { id: 'B', text: "They wear safety helmets on site." },
          { id: 'C', text: 'It was repaired two weeks ago.' },
        ],
        answer: 'A',
        explanation:
          "« Where » appelle un LIEU. Le piège (B) repose sur l'homophonie where / wear, très proche à l'oral. En Part 2, une option qui sonne comme la question est presque toujours fausse : c'est un réflexe à installer.",
        audio: [
          { text: 'Where do we keep the spare projector?', voice: 'male' },
          { text: 'A. In the storage room next to the kitchen.', voice: 'female' },
          { text: 'B. They wear safety helmets on site.', voice: 'female' },
          { text: 'C. It was repaired two weeks ago.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-23',
    part: 2,
    title: 'WHEN au futur',
    source: 'seed',
    items: [
      {
        id: 'p2-23-q1',
        vocab: [
          { term: "to take effect", translation: "entrer en vigueur", example: "The new policy takes effect in January." },
          { term: "as soon as", translation: "dès que", example: "as soon as the board signs off on it" },
          { term: "to sign off on", translation: "valider, donner son feu vert à", note: "Verbe à particule très fréquent en entreprise." },
        ],
        category: 'Question-réponse — WH (when)',
        choices: [
          { id: 'A', text: 'About fifty employees are affected.' },
          { id: 'B', text: 'As soon as the board signs off on it.' },
          { id: 'C', text: 'Yes, the policy was very clear.' },
        ],
        answer: 'B',
        explanation:
          "« When » peut se répondre par un ÉVÉNEMENT et non par une date : « as soon as the board signs off on it ». Élargis ta définition d'une réponse temporelle — « after the audit », « once we hear back » sont des réponses valides à « When ».",
        audio: [
          { text: 'When will the new expense policy take effect?', voice: 'female' },
          { text: 'A. About fifty employees are affected.', voice: 'male' },
          { text: 'B. As soon as the board signs off on it.', voice: 'male' },
          { text: 'C. Yes, the policy was very clear.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-24',
    part: 2,
    title: 'WHO au passif',
    source: 'seed',
    items: [
      {
        id: 'p2-24-q1',
        vocab: [
          { term: "to draw up a contract", translation: "rédiger un contrat", note: "Collocation figée : draw up + document officiel." },
          { term: "legal counsel", translation: "le service juridique, un conseil juridique", note: "« counsel » (juriste) ≠ « council » (conseil, assemblée)." },
        ],
        category: 'Question-réponse — WH (who)',
        choices: [
          { id: 'A', text: 'Sometime before the end of the week.' },
          { id: 'B', text: 'Two signed copies, please.' },
          { id: 'C', text: 'Our legal counsel drew it up.' },
        ],
        answer: 'C',
        explanation:
          "« Who was the contract drawn up by? » cherche l'AGENT d'une phrase passive. La réponse repasse à l'actif : « Our legal counsel drew it up ». Quand la question est au passif, attends-toi à une réponse active — le TOEIC teste ce basculement.",
        audio: [
          { text: 'Who was the distribution contract drawn up by?', voice: 'male' },
          { text: 'A. Sometime before the end of the week.', voice: 'female' },
          { text: 'B. Two signed copies, please.', voice: 'female' },
          { text: 'C. Our legal counsel drew it up.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-25',
    part: 2,
    title: 'HOW (moyen)',
    source: 'seed',
    items: [
      {
        id: 'p2-25-q1',
        vocab: [
          { term: "to commute", translation: "faire le trajet domicile-travail", example: "How do you commute to the office?" },
          { term: "to catch a train", translation: "prendre un train", note: "On dit catch / take a train, jamais « take the train » au sens de le rattraper." },
        ],
        category: 'Question-réponse — WH (how)',
        choices: [
          { id: 'A', text: 'I catch the seven-fifteen train.' },
          { id: 'B', text: 'About forty minutes each way.' },
          { id: 'C', text: 'Because the parking lot is full.' },
        ],
        answer: 'A',
        explanation:
          "« How do you commute? » demande le MOYEN de transport. (B) répond à « How long » et reste très tentant car il parle aussi de trajet. Le mot interrogatif doit primer sur le champ lexical de la réponse.",
        audio: [
          { text: 'How do you commute to the office every day?', voice: 'female' },
          { text: 'A. I catch the seven-fifteen train.', voice: 'male' },
          { text: 'B. About forty minutes each way.', voice: 'male' },
          { text: 'C. Because the parking lot is full.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-26',
    part: 2,
    title: 'Suggestion (How about)',
    source: 'seed',
    items: [
      {
        id: 'p2-26-q1',
        vocab: [
          { term: "How about + V-ing", translation: "Et si on… ?", note: "Suivi du gérondif. Variante : What about + V-ing." },
          { term: "to push back a meeting", translation: "repousser une réunion", example: "How about pushing the meeting back?" },
        ],
        category: 'Question-réponse — requête / suggestion',
        choices: [
          { id: 'A', text: 'It was pushed to the back of the room.' },
          { id: 'B', text: "Good idea — I'll let the others know." },
          { id: 'C', text: 'About twenty people attended.' },
        ],
        answer: 'B',
        explanation:
          "« How about…? » introduit une suggestion : on répond en acceptant (« Good idea ») ou en objectant. (A) reprend « pushed » et « back » dans un sens littéral, (C) rebondit sur « about » : deux pièges purement sonores.",
        audio: [
          { text: 'How about pushing the meeting back to three?', voice: 'male' },
          { text: 'A. It was pushed to the back of the room.', voice: 'female' },
          { text: "B. Good idea — I'll let the others know.", voice: 'female' },
          { text: 'C. About twenty people attended.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-27',
    part: 2,
    title: 'Constat / plainte',
    source: 'seed',
    items: [
      {
        id: 'p2-27-q1',
        vocab: [
          { term: "the air conditioning", translation: "la climatisation", note: "Abrégé « the AC » à l'oral." },
          { term: "to look into something", translation: "se pencher sur, examiner qqch", example: "I'll look into it right away." },
        ],
        category: 'Question-réponse — phrase déclarative',
        choices: [
          { id: 'A', text: 'Yes, it is quite a large conference room.' },
          { id: 'B', text: 'The air fare was surprisingly low.' },
          { id: 'C', text: "I'll ask maintenance to look into it." },
        ],
        answer: 'C',
        explanation:
          "Une plainte appelle une ACTION corrective, pas un commentaire. (B) est un piège sonore sur « air ». Réflexe Part 2 : face à un problème énoncé, cherche l'option où quelqu'un propose de faire quelque chose.",
        audio: [
          { text: "The air conditioning in the conference room isn't working properly.", voice: 'female' },
          { text: 'A. Yes, it is quite a large conference room.', voice: 'male' },
          { text: 'B. The air fare was surprisingly low.', voice: 'male' },
          { text: "C. I'll ask maintenance to look into it.", voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-28',
    part: 2,
    title: 'WHAT TIME',
    source: 'seed',
    items: [
      {
        id: 'p2-28-q1',
        vocab: [
          { term: "to board", translation: "embarquer", example: "What time does boarding start?" },
          { term: "a gate", translation: "une porte d'embarquement", note: "Vocabulaire aéroport : gate, boarding pass, carousel, layover." },
        ],
        category: 'Question-réponse — WH (what time)',
        choices: [
          { id: 'A', text: 'Forty minutes before departure.' },
          { id: 'B', text: 'At gate twenty-two, I think.' },
          { id: 'C', text: 'Yes, I checked in online.' },
        ],
        answer: 'A',
        explanation:
          "« What time…? » appelle un repère horaire, ici exprimé relativement : « forty minutes before departure ». (B) répond à « Where ». Une réponse temporelle n'est pas forcément une heure précise — accepte les formulations relatives.",
        audio: [
          { text: 'What time does boarding start for the Frankfurt flight?', voice: 'male' },
          { text: 'A. Forty minutes before departure.', voice: 'female' },
          { text: 'B. At gate twenty-two, I think.', voice: 'female' },
          { text: 'C. Yes, I checked in online.', voice: 'female' },
        ],
      },
    ],
  },
  {
    id: 'p2-29',
    part: 2,
    title: 'Question fermée à réponse indirecte',
    source: 'seed',
    items: [
      {
        id: 'p2-29-q1',
        vocab: [
          { term: "a receipt", translation: "un reçu, un ticket de caisse", note: "Le « p » est MUET : /rɪˈsiːt/. Piège d'écoute classique." },
          { term: "to reimburse", translation: "rembourser", example: "Expenses are reimbursed within a month." },
        ],
        category: 'Question-réponse — réponse indirecte',
        choices: [
          { id: 'A', text: 'The accountant received it yesterday.' },
          { id: 'B', text: "Do I need to keep them for tax purposes?" },
          { id: 'C', text: 'It cost about ninety euros.' },
        ],
        answer: 'B',
        explanation:
          "Répondre à une question PAR une question est parfaitement valide en Part 2, et c'est même un schéma privilégié. (A) joue sur receipt / received. Ne cherche pas systématiquement une réponse affirmative.",
        audio: [
          { text: 'Should I throw away these old receipts?', voice: 'female' },
          { text: 'A. The accountant received it yesterday.', voice: 'male' },
          { text: 'B. Do I need to keep them for tax purposes?', voice: 'male' },
          { text: 'C. It cost about ninety euros.', voice: 'male' },
        ],
      },
    ],
  },
  {
    id: 'p2-30',
    part: 2,
    title: 'Tag de confirmation (négatif)',
    source: 'seed',
    items: [
      {
        id: 'p2-30-q1',
        vocab: [
          { term: "a branch office", translation: "une antenne, une succursale" },
          { term: "to be up and running", translation: "être opérationnel", example: "The Lyon office is up and running." },
        ],
        category: 'Question-réponse — question-tag',
        choices: [
          { id: 'A', text: 'She runs about five kilometres a day.' },
          { id: 'B', text: 'The branches were trimmed last week.' },
          { id: 'C', text: "It opened in March and it's fully staffed now." },
        ],
        answer: 'C',
        explanation:
          "Le tag « …, hasn't it? » cherche une confirmation ; la réponse confirme en ajoutant un détail. (A) et (B) exploitent les doubles sens de « running » (courir) et « branch » (branche d'arbre) : deux pièges lexicaux à repérer d'emblée.",
        audio: [
          { text: "The Lyon branch has been up and running for a while, hasn't it?", voice: 'male' },
          { text: 'A. She runs about five kilometres a day.', voice: 'female' },
          { text: 'B. The branches were trimmed last week.', voice: 'female' },
          { text: "C. It opened in March and it's fully staffed now.", voice: 'female' },
        ],
      },
    ],
  },
];
