/**
 * Banque de questions de départ.
 *
 * 100 % écrite pour cette app, dans le style TOEIC (contextes professionnels :
 * emails, réunions, logistique, voyages d'affaires). Aucun contenu ETS n'est
 * repris — ni énoncés, ni distracteurs, ni passages.
 *
 * Pour étendre la banque : ajouter un `QuestionSet` dans le tableau ci-dessous.
 * Conventions à respecter —
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
 */

import type { QuestionSet } from '../types';

export const QUESTION_BANK: QuestionSet[] = [
  /* =============================== PART 1 =============================== */
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

  /* =============================== PART 2 =============================== */
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

  /* =============================== PART 3 =============================== */
  {
    id: 'p3-01',
    part: 3,
    title: 'Conversation — livraison en retard',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Hi Daniel, I'm calling about the order of desk chairs we placed on the ninth. The delivery was supposed to arrive this morning, but nothing has come in yet.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "I'm sorry about that. Let me check the tracking. Ah, I see the problem — the shipment is still at our regional depot because one item was out of stock. The rest should reach you tomorrow afternoon.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Tomorrow afternoon is a problem. We have new staff starting on Monday and they need somewhere to sit. Is there any way to get them earlier?",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Let me talk to the depot manager and see if we can put the available chairs on the first van tomorrow morning. I'll email you a confirmation within the hour.",
      },
    ],
    items: [
      {
        id: 'p3-01-q1',
        vocab: [
          { term: "a shipment", translation: "une expédition, un envoi", example: "The shipment is still at our regional depot." },
        ],
        category: 'Conversation — sujet / problème',
        prompt: 'What is the problem?',
        choices: [
          { id: 'A', text: 'An invoice contains an error.' },
          { id: 'B', text: 'An order has not been delivered.' },
          { id: 'C', text: 'A product was damaged in transit.' },
          { id: 'D', text: 'A meeting room is unavailable.' },
        ],
        answer: 'B',
        explanation:
          "Dès la première réplique : « The delivery was supposed to arrive this morning, but nothing has come in yet ». Le problème est presque toujours annoncé dans les 2 premières phrases — lis la question 1 AVANT que l'audio commence.",
      },
      {
        id: 'p3-01-q2',
        vocab: [
          { term: "out of stock", translation: "en rupture de stock", example: "One item was out of stock.", note: "Paraphrasé « unavailable » dans les réponses : c'est le mécanisme même de la Part 3." },
          { term: "a depot", translation: "un dépôt, un entrepôt", note: "Se prononce « DEE-po » en anglais américain." },
        ],
        category: 'Conversation — détail',
        prompt: 'According to the man, why has the shipment been held?',
        choices: [
          { id: 'A', text: 'A driver called in sick.' },
          { id: 'B', text: 'The delivery address was incorrect.' },
          { id: 'C', text: 'One of the items was unavailable.' },
          { id: 'D', text: 'A payment has not been received.' },
        ],
        answer: 'C',
        explanation:
          "« because one item was out of stock » → « one of the items was unavailable ». Le TOEIC reformule systématiquement : « out of stock » devient « unavailable ». Entraîne-toi à guetter la paraphrase, jamais le mot exact.",
      },
      {
        id: 'p3-01-q3',
        vocab: [
          { term: "tracking", translation: "le suivi (d'un colis)", example: "Let me check the tracking." },
        ],
        category: 'Conversation — action future',
        prompt: 'What does the man say he will do next?',
        choices: [
          { id: 'A', text: 'Contact the depot manager.' },
          { id: 'B', text: 'Issue a full refund.' },
          { id: 'C', text: 'Visit the woman’s office.' },
          { id: 'D', text: 'Cancel the original order.' },
        ],
        answer: 'A',
        explanation:
          "Dernière réplique : « Let me talk to the depot manager ». La question « What will X do next? » porte quasi toujours sur les 2 dernières phrases de l'audio. Reste concentré jusqu'à la fin.",
      },
    ],
  },
  {
    id: 'p3-02',
    part: 3,
    title: 'Conversation à 3 — réaménagement de bureaux',
    source: 'seed',
    audio: [
      {
        speaker: 'Man 1',
        voice: 'male',
        text: "Before we finish, we need to decide where to put the design team when the renovation starts in April.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "The east wing has enough desks, but there's no natural light and the team spends all day looking at screens.",
      },
      {
        speaker: 'Man 2',
        voice: 'narrator',
        text: "What about letting them work from home three days a week? We'd only need space for about half of them at any time.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "That could work. I'll draft a proposal and circulate it to both of you before Friday so we can vote on it at the next meeting.",
      },
    ],
    items: [
      {
        id: 'p3-02-q1',
        vocab: [
          { term: "renovations", translation: "des travaux de rénovation", example: "when the renovation starts in April" },
        ],
        category: 'Conversation — contexte',
        prompt: 'What are the speakers mainly discussing?',
        choices: [
          { id: 'A', text: 'Hiring additional designers.' },
          { id: 'B', text: 'Where a team will work during renovations.' },
          { id: 'C', text: 'The cost of new office furniture.' },
          { id: 'D', text: 'A change to the company dress code.' },
        ],
        answer: 'B',
        explanation:
          "« we need to decide where to put the design team when the renovation starts ». En conversation à 3, le premier locuteur pose presque toujours le cadre : accroche-toi à sa phrase d'ouverture.",
      },
      {
        id: 'p3-02-q2',
        vocab: [
          { term: "natural light", translation: "la lumière naturelle", example: "There's no natural light." },
        ],
        category: 'Conversation — opinion',
        prompt: 'What concern does the woman raise about the east wing?',
        choices: [
          { id: 'A', text: 'It is too far from the parking lot.' },
          { id: 'B', text: 'It does not have enough desks.' },
          { id: 'C', text: 'It lacks natural light.' },
          { id: 'D', text: 'It is being renovated first.' },
        ],
        answer: 'C',
        explanation:
          "« there's no natural light ». Attention au piège (B) : elle dit l'inverse (« has enough desks »). Le TOEIC adore proposer une option qui reprend les mots entendus en inversant le sens.",
      },
      {
        id: 'p3-02-q3',
        vocab: [
          { term: "to draft", translation: "rédiger un premier jet", example: "I'll draft a proposal.", note: "Comme nom, a draft = un brouillon." },
          { term: "to circulate", translation: "faire circuler, diffuser", example: "circulate it to both of you" },
        ],
        category: 'Conversation — action future',
        prompt: 'What will the woman most likely do before Friday?',
        choices: [
          { id: 'A', text: 'Prepare a written proposal.' },
          { id: 'B', text: 'Interview job candidates.' },
          { id: 'C', text: 'Order new equipment.' },
          { id: 'D', text: 'Lead a training session.' },
        ],
        answer: 'A',
        explanation:
          "« I'll draft a proposal and circulate it… before Friday » → « prepare a written proposal ». « draft » (verbe) = rédiger un premier jet : un mot à connaître absolument pour le TOEIC.",
      },
    ],
  },

  /* =============================== PART 4 =============================== */
  {
    id: 'p4-01',
    part: 4,
    title: 'Annonce — fermeture du parking',
    source: 'seed',
    audio: [
      {
        speaker: 'Announcement',
        voice: 'female',
        text: "Attention, all employees. This is a reminder that the north parking lot will be closed for resurfacing from Monday the fourteenth through Wednesday the sixteenth. During those three days, please use the visitor lot behind Building C. Because that lot is smaller than usual, we strongly encourage carpooling, and the company shuttle from Central Station will run every fifteen minutes instead of every half hour. If you normally park a company vehicle overnight, contact facilities management by Friday to arrange an alternative space. We apologise for the inconvenience.",
      },
    ],
    items: [
      {
        id: 'p4-01-q1',
        vocab: [
          { term: "resurfacing", translation: "la réfection du revêtement", example: "closed for resurfacing" },
        ],
        category: 'Annonce — objet',
        prompt: 'What is the purpose of the announcement?',
        choices: [
          { id: 'A', text: 'To announce a temporary parking closure.' },
          { id: 'B', text: 'To introduce a new shuttle company.' },
          { id: 'C', text: 'To describe a change in working hours.' },
          { id: 'D', text: 'To report a traffic accident.' },
        ],
        answer: 'A',
        explanation:
          "« the north parking lot will be closed for resurfacing from Monday… through Wednesday » : fermeture temporaire. Le but d'une annonce est donné dans la première ou la deuxième phrase, après le « Attention, all employees ».",
      },
      {
        id: 'p4-01-q2',
        vocab: [
          { term: "to carpool", translation: "faire du covoiturage", example: "we strongly encourage carpooling" },
        ],
        category: 'Annonce — détail',
        prompt: 'What change will be made to the shuttle service?',
        choices: [
          { id: 'A', text: 'It will start from a different station.' },
          { id: 'B', text: 'It will run more frequently.' },
          { id: 'C', text: 'It will be free of charge.' },
          { id: 'D', text: 'It will be suspended for three days.' },
        ],
        answer: 'B',
        explanation:
          "« every fifteen minutes instead of every half hour » = plus fréquent. Les questions de Part 4 suivent l'ordre de l'audio : la Q2 se trouve au milieu du monologue.",
      },
      {
        id: 'p4-01-q3',
        vocab: [
          { term: "facilities management", translation: "les services généraux", example: "contact facilities management by Friday", note: "Le service qui gère les bâtiments : vocabulaire récurrent au TOEIC." },
        ],
        category: 'Annonce — consigne',
        prompt: 'What are listeners with company vehicles asked to do?',
        choices: [
          { id: 'A', text: 'Park at Central Station.' },
          { id: 'B', text: 'Return their keys to reception.' },
          { id: 'C', text: 'Contact the facilities department.' },
          { id: 'D', text: 'Share a ride with a colleague.' },
        ],
        answer: 'C',
        explanation:
          "« contact facilities management by Friday ». (D) est vrai pour TOUS les employés (« we encourage carpooling »), pas spécifiquement pour ceux qui ont un véhicule de société : lis bien le sujet de la question.",
      },
    ],
  },
  {
    id: 'p4-02',
    part: 4,
    title: 'Message vocal — déplacement professionnel',
    source: 'seed',
    audio: [
      {
        speaker: 'Voicemail',
        voice: 'male',
        text: "Hello Ms Ferrand, this is Victor Aubry from Halden Logistics. I'm calling about your visit to our Rotterdam site next week. Unfortunately, the plant tour we planned for Tuesday morning has to be moved, because the safety inspection was rescheduled for that same slot. I'd like to propose Tuesday at two in the afternoon instead. That would still leave you time to catch your evening flight. Also, please bring photo identification — security now requires it for all site visitors. If the new time doesn't suit you, call me back at extension four-one-two and we'll find another option.",
      },
    ],
    items: [
      {
        id: 'p4-02-q1',
        vocab: [
          { term: "a plant tour", translation: "une visite d'usine", example: "the plant tour we planned", note: "a plant = une usine, pas seulement une plante." },
        ],
        category: 'Message vocal — objet',
        prompt: 'Why is the speaker calling?',
        choices: [
          { id: 'A', text: 'To cancel a business trip.' },
          { id: 'B', text: 'To reschedule a site visit.' },
          { id: 'C', text: 'To confirm a hotel reservation.' },
          { id: 'D', text: 'To request a price quotation.' },
        ],
        answer: 'B',
        explanation:
          "« the plant tour we planned for Tuesday morning has to be moved… I'd like to propose Tuesday at two ». Attention à (A) : rien n'est annulé, seulement déplacé. « moved / rescheduled / postponed » = décaler, pas supprimer.",
      },
      {
        id: 'p4-02-q2',
        vocab: [
          { term: "to reschedule", translation: "replanifier, décaler", example: "the safety inspection was rescheduled" },
          { term: "a slot", translation: "un créneau (horaire)", example: "rescheduled for that same slot" },
        ],
        category: 'Message vocal — cause',
        prompt: 'What caused the change?',
        choices: [
          { id: 'A', text: 'A safety inspection was rescheduled.' },
          { id: 'B', text: 'A flight was cancelled.' },
          { id: 'C', text: 'A manager is on holiday.' },
          { id: 'D', text: 'The site is closed for repairs.' },
        ],
        answer: 'A',
        explanation:
          "« because the safety inspection was rescheduled for that same slot ». Le mot « because » est un signal fort : quand tu l'entends, la réponse d'une question « Why… ? » arrive juste après.",
      },
      {
        id: 'p4-02-q3',
        vocab: [
          { term: "photo identification", translation: "une pièce d'identité avec photo", example: "please bring photo identification", note: "Souvent abrégé « photo ID » à l'oral." },
        ],
        category: 'Message vocal — consigne',
        prompt: 'What is Ms Ferrand asked to bring?',
        choices: [
          { id: 'A', text: 'A signed contract.' },
          { id: 'B', text: 'Protective footwear.' },
          { id: 'C', text: 'A form of identification.' },
          { id: 'D', text: 'Her travel itinerary.' },
        ],
        answer: 'C',
        explanation:
          "« please bring photo identification ». Repère l'impératif « please bring / make sure to / don't forget to » : il introduit presque toujours la réponse aux questions « What is the listener asked to do? ».",
      },
    ],
  },

  /* =============================== PART 5 =============================== */
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

  /* =============================== PART 6 =============================== */
  {
    id: 'p6-01',
    part: 6,
    title: 'Part 6 — email interne (badges)',
    source: 'seed',
    passages: [
      {
        kind: 'email',
        heading: 'To: All staff | From: Security Office | Subject: New access badges',
        body: `Starting 3 March, the building will use a new access system. Your current badge will ___(1)___ work after that date, so please collect your replacement from the security desk on the ground floor.

Badges will be issued between 8 a.m. and 6 p.m. You will need to show an official document ___(2)___ your identity. The process takes about five minutes.

___(3)___ Employees who work remotely may collect their badge on their next visit to the office.

We ___(4)___ your cooperation during this transition. Please contact the security office if you have any questions.`,
      },
    ],
    items: [
      {
        id: 'p6-01-q1',
        vocab: [
          { term: "no longer", translation: "ne ... plus", example: "Your badge will no longer work." },
        ],
        category: 'Texte à trous — grammaire',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'no longer' },
          { id: 'B', text: 'not yet' },
          { id: 'C', text: 'still' },
          { id: 'D', text: 'already' },
        ],
        answer: 'A',
        explanation:
          "Le nouveau système démarre le 3 mars, donc l'ancien badge cessera de fonctionner : « will no longer work » (ne fonctionnera plus). « not yet » = pas encore, « still » = toujours : contresens.",
      },
      {
        id: 'p6-01-q2',
        vocab: [
          { term: "to confirm someone's identity", translation: "confirmer l'identité de qqn", example: "a document confirming your identity" },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (2)',
        choices: [
          { id: 'A', text: 'confirms' },
          { id: 'B', text: 'confirming' },
          { id: 'C', text: 'confirmed' },
          { id: 'D', text: 'to confirming' },
        ],
        answer: 'B',
        explanation:
          "« a document confirming your identity » = participe présent en fonction d'adjectif (= a document that confirms). La proposition a déjà son verbe (« will need »), donc pas de verbe conjugué supplémentaire.",
      },
      {
        id: 'p6-01-q3',
        vocab: [
          { term: "to collect", translation: "venir chercher, récupérer", example: "collect your replacement from the security desk", note: "Sens « récupérer », pas seulement « collectionner »." },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (3) — phrase à insérer',
        choices: [
          { id: 'A', text: 'Parking permits must be renewed at the same time.' },
          { id: 'B', text: 'The security desk will remain open on Saturday 7 March.' },
          { id: 'C', text: 'The cafeteria will close for refurbishment in April.' },
          { id: 'D', text: 'All visitors must be accompanied at all times.' },
        ],
        answer: 'B',
        explanation:
          "La phrase suivante parle des employés en télétravail qui passeront plus tard : il faut donc une info sur les HORAIRES / disponibilités de retrait. (B) enchaîne logiquement avec le paragraphe sur les créneaux. Pour ces questions d'insertion, lis toujours la phrase AVANT et la phrase APRÈS le trou.",
      },
      {
        id: 'p6-01-q4',
        vocab: [
          { term: "We appreciate your cooperation", translation: "Nous vous remercions de votre coopération", note: "Formule de clôture standard : à reconnaître d'emblée." },
          { term: "to issue", translation: "délivrer, émettre", example: "Badges will be issued between 8 a.m. and 6 p.m." },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'apologise' },
          { id: 'B', text: 'appreciate' },
          { id: 'C', text: 'require' },
          { id: 'D', text: 'complete' },
        ],
        answer: 'B',
        explanation:
          "« We appreciate your cooperation » est une formule de clôture standard des emails professionnels — apprends-la telle quelle, elle revient très souvent en Part 6 et 7 (avec « Thank you for your understanding »).",
      },
    ],
  },

  /* =============================== PART 7 =============================== */
  {
    id: 'p7-01',
    part: 7,
    title: 'Part 7 — passage simple (avis de formation)',
    source: 'seed',
    passages: [
      {
        kind: 'notice',
        heading: 'NOTICE — Data Protection Workshop',
        body: `Merrow & Klein is running a two-hour workshop on data protection for all client-facing staff.

Date: Thursday 22 May, 9:30–11:30
Location: Room B2 (Riverside office)

The workshop covers how to store client records, what to do if a laptop is lost, and the new rules on sharing files with external partners. Attendance is compulsory for anyone who handles client data; other employees are welcome if space allows.

Places are limited to thirty. Register through the staff portal by Friday 16 May. Those who cannot attend on 22 May must complete the online version before the end of June. Staff based at the Northgate office may join by video link; please indicate this when registering.`,
      },
    ],
    items: [
      {
        id: 'p7-01-q1',
        vocab: [
          { term: "compulsory", translation: "obligatoire", example: "Attendance is compulsory.", note: "Synonymes : mandatory, required. Contraire : optional." },
          { term: "to handle data", translation: "gérer, manipuler des données", example: "anyone who handles client data" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'Who must attend the workshop?',
        choices: [
          { id: 'A', text: 'All employees of the company.' },
          { id: 'B', text: 'Employees who work with client data.' },
          { id: 'C', text: 'Newly hired staff only.' },
          { id: 'D', text: 'Managers based at Northgate.' },
        ],
        answer: 'B',
        explanation:
          "« Attendance is compulsory for anyone who handles client data ». « compulsory » = obligatoire. Les autres employés sont seulement « welcome if space allows », ce qui élimine (A).",
      },
      {
        id: 'p7-01-q2',
        vocab: [
          { term: "if space allows", translation: "dans la limite des places disponibles", example: "other employees are welcome if space allows" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is indicated about employees who miss the session?',
        choices: [
          { id: 'A', text: 'They must ask their manager for approval.' },
          { id: 'B', text: 'They will be enrolled automatically in June.' },
          { id: 'C', text: 'They have to take an online course.' },
          { id: 'D', text: 'They cannot handle client records.' },
        ],
        answer: 'C',
        explanation:
          "« Those who cannot attend on 22 May must complete the online version before the end of June ». Astuce Part 7 : les questions suivent l'ordre du texte, donc la Q2 est plus bas que la Q1 — inutile de relire depuis le début.",
      },
    ],
  },
  {
    id: 'p7-02',
    part: 7,
    title: 'Part 7 — passage double (email + réponse)',
    source: 'seed',
    passages: [
      {
        kind: 'email',
        heading: 'From: t.varga@brightpath.example | To: catering@lomasgroup.example | 4 June',
        body: `Dear Mr Reyes,

Brightpath is holding its annual partner day on Friday 27 June at our Bristol office, and I would like a quotation for catering.

We expect ninety guests. We need a buffet lunch served at 12:30 and coffee with pastries at 15:00. At least fifteen guests have told us they are vegetarian, and two have a severe nut allergy.

Could you also confirm whether you provide staff to serve and clear the tables? Our previous supplier only delivered the food, which caused delays.

I would need the quotation by 11 June so that our finance team can approve it.

Kind regards,
Tomas Varga`,
      },
      {
        kind: 'email',
        heading: 'From: catering@lomasgroup.example | To: t.varga@brightpath.example | 6 June',
        body: `Dear Mr Varga,

Thank you for your enquiry. I have attached a full quotation for ninety guests, including twenty vegetarian portions.

Our standard package includes two members of serving staff for every fifty guests, so four would be present for your event, from setup until the tables are cleared. There is no extra charge for this.

Regarding allergies, we can prepare a completely nut-free menu, but I would need written confirmation ten days before the event.

One point: our kitchen cannot deliver hot food to Bristol before 13:00 on Fridays because of another contract. A cold buffet at 12:30 is possible, or hot food at 13:15. Please let me know which you prefer.

Best regards,
Daniel Reyes`,
      },
    ],
    items: [
      {
        id: 'p7-02-q1',
        vocab: [
          { term: "a quotation", translation: "un devis", example: "I would like a quotation for catering.", note: "Aussi : a quote, an estimate. Très fréquent en Part 7." },
          { term: "an enquiry", translation: "une demande de renseignements", example: "Thank you for your enquiry.", note: "Orthographe américaine : inquiry." },
        ],
        category: 'Lecture — but du document',
        prompt: 'Why did Mr Varga write the first email?',
        choices: [
          { id: 'A', text: 'To complain about a recent event.' },
          { id: 'B', text: 'To request a price estimate.' },
          { id: 'C', text: 'To confirm a booking.' },
          { id: 'D', text: 'To postpone a partner day.' },
        ],
        answer: 'B',
        explanation:
          "« I would like a quotation for catering ». « quotation / quote / estimate » = devis. Le but d'un email est presque toujours dans le premier paragraphe.",
      },
      {
        id: 'p7-02-q2',
        vocab: [
          { term: "serving staff", translation: "le personnel de service", example: "two members of serving staff" },
          { term: "to clear the tables", translation: "débarrasser les tables", example: "from setup until the tables are cleared" },
        ],
        category: 'Lecture — croisement de documents',
        prompt: 'How many serving staff will attend the Brightpath event?',
        choices: [
          { id: 'A', text: 'Two' },
          { id: 'B', text: 'Four' },
          { id: 'C', text: 'Fifteen' },
          { id: 'D', text: 'Ninety' },
        ],
        answer: 'B',
        explanation:
          "Question de croisement : 90 invités (email 1) + « two members of staff for every fifty guests » (email 2) → 4 personnes. La 2e réponse le dit explicitement, mais le raisonnement s'appuie sur le chiffre du 1er email : c'est le type de question qui rapporte le plus de points en double passage.",
      },
      {
        id: 'p7-02-q3',
        vocab: [
          { term: "a severe allergy", translation: "une allergie grave", example: "two have a severe nut allergy", note: "nut-free = sans fruits à coque." },
        ],
        category: 'Lecture — inférence',
        prompt: 'What problem does Mr Reyes mention?',
        choices: [
          { id: 'A', text: 'His company cannot cater for vegetarians.' },
          { id: 'B', text: 'The quotation will arrive after 11 June.' },
          { id: 'C', text: 'Hot food cannot be delivered at the requested time.' },
          { id: 'D', text: 'His staff are unavailable on 27 June.' },
        ],
        answer: 'C',
        explanation:
          "« our kitchen cannot deliver hot food to Bristol before 13:00 on Fridays » alors que M. Varga demandait 12:30. (B) est faux : la réponse est datée du 6 juin, donc dans les temps. Vérifie toujours les DATES dans les en-têtes, elles servent souvent de piège.",
      },
    ],
  },
];

/** Nombre total de questions notées disponibles dans la banque de départ. */
export const SEED_ITEM_COUNT = QUESTION_BANK.reduce((n, s) => n + s.items.length, 0);
