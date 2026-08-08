/**
 * Part 3 — Conversations.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART3: QuestionSet[] = [
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
  {
    id: 'p3-03',
    part: 3,
    title: 'Conversation — problème de facturation',
    source: 'seed',
    audio: [
      {
        speaker: 'Man',
        voice: 'male',
        text: "Good morning, this is Peter Novak from Alder Consulting. I've just received invoice number 4471 and I think there's a mistake. We're being charged for twelve licences, but our contract only covers eight.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Let me pull up your account. You're right — it looks like four licences were added in January when your colleague requested trial access. Those should have been removed after the trial ended.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "That explains it. Can you issue a corrected invoice? Our accounts payable team won't process anything until the amount matches the contract.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Of course. I'll cancel this one and send a revised version today. I'd also suggest switching to annual billing — it would save you about fifteen percent and avoid this kind of confusion.",
      },
    ],
    items: [
      {
        id: 'p3-03-q1',
        vocab: [
          { term: "an invoice", translation: "une facture", example: "I've just received invoice number 4471.", note: "Se prononce /ˈɪnvɔɪs/. À distinguer de « a bill » (note à payer)." },
          { term: "to be charged for", translation: "être facturé pour", example: "We're being charged for twelve licences." },
        ],
        category: 'Conversation — sujet / problème',
        prompt: 'Why is the man calling?',
        choices: [
          { id: 'A', text: 'To cancel a service contract.' },
          { id: 'B', text: 'To dispute an amount on a bill.' },
          { id: 'C', text: 'To request additional licences.' },
          { id: 'D', text: 'To report a software failure.' },
        ],
        answer: 'B',
        explanation:
          "« I think there's a mistake… we're being charged for twelve licences, but our contract only covers eight » → contester un montant. Piège (C) : il ne DEMANDE pas de licences, il conteste celles qu'on lui facture. Écoute le verbe, pas seulement le nom.",
      },
      {
        id: 'p3-03-q2',
        vocab: [
          { term: "trial access", translation: "un accès d'essai", example: "your colleague requested trial access" },
          { term: "to pull up an account", translation: "afficher, ouvrir un dossier client", note: "Formule standard du service client au téléphone." },
        ],
        category: 'Conversation — détail',
        prompt: 'According to the woman, what caused the error?',
        choices: [
          { id: 'A', text: 'A payment was applied to the wrong account.' },
          { id: 'B', text: 'The contract was signed by the wrong person.' },
          { id: 'C', text: 'Temporary accounts were never deactivated.' },
          { id: 'D', text: 'Prices increased at the start of the year.' },
        ],
        answer: 'C',
        explanation:
          "« four licences were added… for trial access. Those should have been removed after the trial ended » → des comptes temporaires jamais désactivés. Le TOEIC reformule « trial » en « temporary » et « removed » en « deactivated » : la bonne réponse ne reprend aucun mot de l'audio.",
      },
      {
        id: 'p3-03-q3',
        vocab: [
          { term: "annual billing", translation: "la facturation annuelle", example: "switching to annual billing" },
          { term: "accounts payable", translation: "la comptabilité fournisseurs", note: "Le service qui paie les factures. Pendant : accounts receivable (clients)." },
        ],
        category: 'Conversation — suggestion',
        prompt: 'What does the woman recommend?',
        choices: [
          { id: 'A', text: 'Paying on a yearly basis.' },
          { id: 'B', text: 'Reducing the number of users.' },
          { id: 'C', text: 'Contacting the accounting department.' },
          { id: 'D', text: 'Renewing the contract early.' },
        ],
        answer: 'A',
        explanation:
          "« I'd also suggest switching to annual billing » → « paying on a yearly basis ». Les questions « What does X recommend/suggest? » portent presque toujours sur la dernière réplique, introduite par « I'd suggest », « Why don't you », « You might want to ».",
      },
    ],
  },
  {
    id: 'p3-04',
    part: 3,
    title: 'Conversation — entretien de recrutement',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Thanks for coming in, Mr Ellis. I've read your application and I'm impressed by your experience in supply chain management. What made you apply to Kestrel Foods?",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Honestly, it was your sustainability programme. My current employer talks about reducing packaging but never invests in it. I'd like to work somewhere the commitment is real.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "I appreciate that. One thing I should mention — this role is based in Manchester, but you'd travel to our Dublin plant roughly one week a month. Would that be manageable for you?",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "That's fine. I travelled far more in my last position. Could you tell me when you expect to make a decision? I've been asked to give an answer elsewhere by the end of next week.",
      },
    ],
    items: [
      {
        id: 'p3-04-q1',
        vocab: [
          { term: "supply chain management", translation: "la gestion de la chaîne logistique", note: "Terme récurrent : supply chain, procurement, logistics." },
          { term: "an application", translation: "une candidature", note: "Faux ami partiel : ici ce n'est pas une « application » informatique." },
        ],
        category: 'Conversation — contexte',
        prompt: 'What is taking place?',
        choices: [
          { id: 'A', text: 'A performance review.' },
          { id: 'B', text: 'A job interview.' },
          { id: 'C', text: 'A supplier negotiation.' },
          { id: 'D', text: 'A training session.' },
        ],
        answer: 'B',
        explanation:
          "« I've read your application… What made you apply to Kestrel Foods? » : c'est un entretien d'embauche. Le contexte se déduit dans les 10 premières secondes — repère les mots « application », « apply », « role », « position ».",
      },
      {
        id: 'p3-04-q2',
        vocab: [
          { term: "sustainability", translation: "le développement durable, la durabilité", example: "it was your sustainability programme" },
          { term: "a commitment", translation: "un engagement", example: "the commitment is real" },
        ],
        category: 'Conversation — raison',
        prompt: 'Why is the man interested in the company?',
        choices: [
          { id: 'A', text: 'It offers a higher salary.' },
          { id: 'B', text: 'It is closer to his home.' },
          { id: 'C', text: 'It genuinely invests in environmental issues.' },
          { id: 'D', text: 'It requires very little travel.' },
        ],
        answer: 'C',
        explanation:
          "« it was your sustainability programme… I'd like to work somewhere the commitment is real ». (D) est l'inverse de ce qui est dit (il voyagera une semaine par mois). Méfie-toi des options qui reprennent un thème abordé mais en renversent le sens.",
      },
      {
        id: 'p3-04-q3',
        vocab: [
          { term: "manageable", translation: "gérable, faisable", example: "Would that be manageable for you?" },
          { term: "to give an answer by", translation: "donner une réponse d'ici à", note: "« by + date » = au plus tard à cette date." },
        ],
        category: 'Conversation — inférence',
        prompt: 'What does the man imply at the end?',
        choices: [
          { id: 'A', text: 'He has received another offer.' },
          { id: 'B', text: 'He cannot relocate to Manchester.' },
          { id: 'C', text: 'He would like a higher position.' },
          { id: 'D', text: 'He needs to consult his family.' },
        ],
        answer: 'A',
        explanation:
          "« I've been asked to give an answer elsewhere by the end of next week » sous-entend qu'une autre entreprise lui a fait une offre — il ne le dit jamais explicitement. Les questions « What does the man imply? » exigent ce petit pas de déduction : la bonne réponse n'est jamais dans l'audio mot pour mot.",
      },
    ],
  },
  {
    id: 'p3-05',
    part: 3,
    title: 'Conversation — assistance informatique',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "IT help desk, this is Nadia. How can I help?",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Hi Nadia. I can't open any of the files on the shared drive. It keeps saying I don't have permission, but I was working on them yesterday afternoon.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "We migrated the shared drive to the new server last night. Everyone's access has to be reassigned by department. Which team are you in?",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Product development. And I have a client presentation at eleven that uses three of those files.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Then let's not wait for the batch update this afternoon. I'll restore your access manually in the next ten minutes. Stay logged out until I email you, otherwise the change won't apply.",
      },
    ],
    items: [
      {
        id: 'p3-05-q1',
        vocab: [
          { term: "a shared drive", translation: "un lecteur partagé, un espace commun", example: "the files on the shared drive" },
          { term: "permission", translation: "les droits d'accès", note: "Au pluriel « permissions » en informatique : les autorisations." },
        ],
        category: 'Conversation — sujet / problème',
        prompt: "What is the man's problem?",
        choices: [
          { id: 'A', text: 'He has forgotten his password.' },
          { id: 'B', text: 'He cannot access certain documents.' },
          { id: 'C', text: 'His computer will not start.' },
          { id: 'D', text: 'He deleted an important file.' },
        ],
        answer: 'B',
        explanation:
          "« I can't open any of the files… It keeps saying I don't have permission » → il ne peut pas accéder aux documents. (A) est tentant car proche du thème « accès », mais aucun mot de passe n'est mentionné : n'ajoute jamais d'information.",
      },
      {
        id: 'p3-05-q2',
        vocab: [
          { term: "to migrate", translation: "migrer, transférer (des données)", example: "We migrated the shared drive to the new server." },
          { term: "to reassign", translation: "réattribuer", example: "Access has to be reassigned by department." },
        ],
        category: 'Conversation — cause',
        prompt: 'What does the woman say happened?',
        choices: [
          { id: 'A', text: 'A department was reorganised.' },
          { id: 'B', text: 'A security breach was detected.' },
          { id: 'C', text: 'Data was moved to a different server.' },
          { id: 'D', text: 'The software licence expired.' },
        ],
        answer: 'C',
        explanation:
          "« We migrated the shared drive to the new server last night » → « data was moved to a different server ». « to migrate » est paraphrasé par « to move » : garde en tête que les verbes techniques sont toujours reformulés en langage simple.",
      },
      {
        id: 'p3-05-q3',
        vocab: [
          { term: "to log out", translation: "se déconnecter", example: "Stay logged out until I email you.", note: "Contraire : to log in / to sign in." },
          { term: "a batch update", translation: "une mise à jour groupée", example: "the batch update this afternoon" },
        ],
        category: 'Conversation — consigne',
        prompt: 'What is the man asked to do?',
        choices: [
          { id: 'A', text: 'Reschedule his presentation.' },
          { id: 'B', text: 'Remain disconnected for a short time.' },
          { id: 'C', text: 'Submit a written request to IT.' },
          { id: 'D', text: 'Restart his computer immediately.' },
        ],
        answer: 'B',
        explanation:
          "« Stay logged out until I email you » → rester déconnecté un moment. La consigne arrive en toute fin d'audio, souvent après « otherwise » ou « make sure to ». Ne relâche jamais ton attention sur la dernière phrase.",
      },
    ],
  },
  {
    id: 'p3-06',
    part: 3,
    title: 'Conversation — réservation d’hôtel de séminaire',
    source: 'seed',
    audio: [
      {
        speaker: 'Man',
        voice: 'male',
        text: "Hello, I'm organising a two-day sales conference for about sixty people in early October. I saw on your website that you have a conference wing.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "We do. Our main hall seats eighty, and there are three smaller rooms for breakout sessions. For sixty guests I'd recommend the full package, which includes lunch and equipment.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "That sounds right. What worries me is accommodation — last year half our team ended up in a different hotel and it made the evenings very disjointed.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "In October we can block sixty rooms without difficulty; it's after the tourist season. But I'd need a deposit of twenty percent to hold them, and the rooms are only guaranteed once that clears.",
      },
    ],
    items: [
      {
        id: 'p3-06-q1',
        vocab: [
          { term: "a breakout session", translation: "un atelier en petit groupe", note: "Vocabulaire de séminaire : keynote, breakout session, plenary." },
          { term: "to seat", translation: "avoir une capacité de (places assises)", example: "Our main hall seats eighty." },
        ],
        category: 'Conversation — contexte',
        prompt: 'What is the man planning?',
        choices: [
          { id: 'A', text: 'A company anniversary dinner.' },
          { id: 'B', text: 'A two-day business conference.' },
          { id: 'C', text: 'A training course for new hires.' },
          { id: 'D', text: 'A product launch for customers.' },
        ],
        answer: 'B',
        explanation:
          "« I'm organising a two-day sales conference for about sixty people ». Le sujet est posé dès la première phrase, comme presque toujours en Part 3 : lis la question 1 pendant les consignes, avant que l'audio démarre.",
      },
      {
        id: 'p3-06-q2',
        vocab: [
          { term: "accommodation", translation: "l'hébergement", note: "Indénombrable en anglais britannique : PAS d'« accommodations » au pluriel." },
          { term: "disjointed", translation: "décousu, sans cohésion", example: "it made the evenings very disjointed" },
        ],
        category: 'Conversation — préoccupation',
        prompt: 'What is the man concerned about?',
        choices: [
          { id: 'A', text: 'The cost of catering.' },
          { id: 'B', text: 'The size of the main hall.' },
          { id: 'C', text: 'Housing everyone in one place.' },
          { id: 'D', text: 'The availability of parking.' },
        ],
        answer: 'C',
        explanation:
          "« What worries me is accommodation — last year half our team ended up in a different hotel ». Le signal « What worries me is… » annonce explicitement la préoccupation : les marqueurs « my concern is », « the problem is », « I'm not sure about » servent de balises.",
      },
      {
        id: 'p3-06-q3',
        vocab: [
          { term: "a deposit", translation: "des arrhes, un acompte", example: "I'd need a deposit of twenty percent." },
          { term: "to clear", translation: "être encaissé (paiement)", example: "once that clears", note: "Se dit d'un virement ou d'un chèque qui passe." },
        ],
        category: 'Conversation — condition',
        prompt: 'What does the woman say is required?',
        choices: [
          { id: 'A', text: 'An advance payment.' },
          { id: 'B', text: 'A signed insurance form.' },
          { id: 'C', text: 'A final headcount by September.' },
          { id: 'D', text: 'Written approval from a manager.' },
        ],
        answer: 'A',
        explanation:
          "« I'd need a deposit of twenty percent to hold them » → « an advance payment ». « a deposit » se paraphrase par « advance payment » ou « down payment » : trois façons de dire la même chose, à connaître pour la Part 7 aussi.",
      },
    ],
  },
  {
    id: 'p3-07',
    part: 3,
    title: 'Conversation à 3 — retard sur un lancement produit',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "We're four weeks from the launch date and the packaging still hasn't been approved. I need to know whether we hold the date or move it.",
      },
      {
        speaker: 'Man 1',
        voice: 'male',
        text: "The delay is on the legal side. They flagged the nutritional claims on the front of the box, so the design has to be reworked before printing.",
      },
      {
        speaker: 'Man 2',
        voice: 'narrator',
        text: "If we get sign-off by Friday, the printer says ten working days. That's tight but it lands two days before launch.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Two days is not a margin, it's a gamble. Let's push the launch to the following Tuesday and use the extra time for the press samples. I'd rather announce a new date now than apologise for an empty shelf later.",
      },
    ],
    items: [
      {
        id: 'p3-07-q1',
        vocab: [
          { term: "to flag something", translation: "signaler, pointer un problème sur qqch", example: "They flagged the nutritional claims." },
          { term: "a claim", translation: "une allégation, une affirmation", note: "Sur un emballage : « nutritional claims » = allégations nutritionnelles." },
        ],
        category: 'Conversation — sujet / problème',
        prompt: 'What is delaying the project?',
        choices: [
          { id: 'A', text: 'A printing machine has broken down.' },
          { id: 'B', text: 'The packaging design needs legal changes.' },
          { id: 'C', text: 'A supplier has raised its prices.' },
          { id: 'D', text: 'Several team members are unavailable.' },
        ],
        answer: 'B',
        explanation:
          "« The delay is on the legal side. They flagged the nutritional claims… the design has to be reworked ». En conversation à trois, la cause est souvent donnée par le deuxième locuteur, en réponse à la question du premier.",
      },
      {
        id: 'p3-07-q2',
        vocab: [
          { term: "sign-off", translation: "la validation, le feu vert", example: "If we get sign-off by Friday…", note: "Verbe : to sign off on something." },
          { term: "working days", translation: "jours ouvrés", note: "À distinguer de « calendar days » (jours calendaires)." },
        ],
        category: 'Conversation — détail chiffré',
        prompt: 'How long does the printer need?',
        choices: [
          { id: 'A', text: 'Two days.' },
          { id: 'B', text: 'Four weeks.' },
          { id: 'C', text: 'Ten working days.' },
          { id: 'D', text: 'One month.' },
        ],
        answer: 'C',
        explanation:
          "« the printer says ten working days ». Tous les autres chiffres sont prononcés dans l'audio (quatre semaines, deux jours) : c'est le piège des questions numériques. Note mentalement à quoi se rapporte chaque nombre, pas seulement le nombre.",
      },
      {
        id: 'p3-07-q3',
        vocab: [
          { term: "a gamble", translation: "un pari risqué", example: "Two days is not a margin, it's a gamble." },
          { term: "I'd rather + base verbale", translation: "je préfère (plutôt)", example: "I'd rather announce a new date now." },
        ],
        category: 'Conversation — décision',
        prompt: 'What does the woman decide to do?',
        choices: [
          { id: 'A', text: 'Cancel the product launch.' },
          { id: 'B', text: 'Change the printing supplier.' },
          { id: 'C', text: 'Keep the original launch date.' },
          { id: 'D', text: 'Postpone the launch by a few days.' },
        ],
        answer: 'D',
        explanation:
          "« Let's push the launch to the following Tuesday » → reporter de quelques jours. Piège (A) : « push » signifie décaler, pas annuler. Les verbes de report — push back, move, postpone, reschedule — n'impliquent JAMAIS une annulation.",
      },
    ],
  },
  {
    id: 'p3-08',
    part: 3,
    title: 'Conversation — location de bureaux',
    source: 'seed',
    audio: [
      {
        speaker: 'Man',
        voice: 'male',
        text: "So this is the third floor. Two hundred square metres, open plan, and the lease would run for three years with a break clause at eighteen months.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "It's brighter than the last one we saw. My only hesitation is the noise — we're right above a main road and my developers need to concentrate.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "The windows were replaced with acoustic glazing in January. Let me open one so you can hear the difference. Honestly, tenants tell me they notice the trams less here than in the quieter street behind.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "That is quieter than I expected. I'd like to bring my operations manager to see it on Thursday before we go any further — she'll be the one dealing with the fit-out.",
      },
    ],
    items: [
      {
        id: 'p3-08-q1',
        vocab: [
          { term: "a lease", translation: "un bail", example: "the lease would run for three years", note: "Verbe : to lease = louer (bail commercial)." },
          { term: "open plan", translation: "en espace ouvert, décloisonné", note: "Un « open-plan office » = un bureau paysager." },
        ],
        category: 'Conversation — contexte',
        prompt: 'Where does the conversation most likely take place?',
        choices: [
          { id: 'A', text: 'In a hotel lobby.' },
          { id: 'B', text: 'At an office property viewing.' },
          { id: 'C', text: 'On a construction site.' },
          { id: 'D', text: 'At a furniture showroom.' },
        ],
        answer: 'B',
        explanation:
          "« this is the third floor. Two hundred square metres… the lease would run for three years » : visite d'un local à louer. Les questions « Where does this take place? » se résolvent en accumulant des indices (surface, bail, étage), pas sur un mot unique.",
      },
      {
        id: 'p3-08-q2',
        vocab: [
          { term: "a hesitation", translation: "une réserve, une hésitation", example: "My only hesitation is the noise." },
          { term: "acoustic glazing", translation: "un vitrage acoustique", note: "double glazing = double vitrage." },
        ],
        category: 'Conversation — préoccupation',
        prompt: 'What concern does the woman raise?',
        choices: [
          { id: 'A', text: 'The rent is too high.' },
          { id: 'B', text: 'The space is too small.' },
          { id: 'C', text: 'The location may be noisy.' },
          { id: 'D', text: 'The lease is too short.' },
        ],
        answer: 'C',
        explanation:
          "« My only hesitation is the noise — we're right above a main road ». L'expression « my only hesitation / my one concern is… » introduit systématiquement la réponse à ce type de question.",
      },
      {
        id: 'p3-08-q3',
        vocab: [
          { term: "a fit-out", translation: "l'aménagement (d'un local)", example: "she'll be the one dealing with the fit-out" },
          { term: "before we go any further", translation: "avant d'aller plus loin", note: "Formule d'étape dans une négociation." },
        ],
        category: 'Conversation — action future',
        prompt: 'What will the woman do on Thursday?',
        choices: [
          { id: 'A', text: 'Sign the lease agreement.' },
          { id: 'B', text: 'Return with a colleague.' },
          { id: 'C', text: 'Meet the building owner.' },
          { id: 'D', text: 'Compare two other properties.' },
        ],
        answer: 'B',
        explanation:
          "« I'd like to bring my operations manager to see it on Thursday » → revenir avec une collègue. (A) est explicitement écarté : elle veut voir les lieux « before we go any further », donc avant tout engagement.",
      },
    ],
  },
  {
    id: 'p3-09',
    part: 3,
    title: 'Conversation — modification de voyage',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Corporate travel desk, Amina speaking.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Hi Amina. I'm booked on the Thursday evening flight to Milan, but the client has moved our meeting to Thursday morning. I need to fly out Wednesday instead.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Let me look. There's a seat on the six-forty Wednesday evening flight, but your current ticket is a restricted fare, so there's a change fee of ninety euros plus the fare difference.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "That's annoying, but missing the meeting would cost far more. Go ahead and change it. Could you also extend the hotel by one night?",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "I'll do both and send you the new confirmation. One thing — anything over fifty euros in change fees needs your manager's approval, so I'll copy her on the email.",
      },
    ],
    items: [
      {
        id: 'p3-09-q1',
        vocab: [
          { term: "to be booked on", translation: "être réservé sur (un vol)", example: "I'm booked on the Thursday evening flight." },
          { term: "to fly out", translation: "partir en avion, décoller", example: "I need to fly out Wednesday instead." },
        ],
        category: 'Conversation — sujet / problème',
        prompt: 'Why does the man need to change his flight?',
        choices: [
          { id: 'A', text: 'His original flight was cancelled.' },
          { id: 'B', text: 'A meeting was rescheduled earlier.' },
          { id: 'C', text: 'He missed a connection in Milan.' },
          { id: 'D', text: 'The ticket price has decreased.' },
        ],
        answer: 'B',
        explanation:
          "« the client has moved our meeting to Thursday morning. I need to fly out Wednesday instead ». Le vol n'est pas annulé (A) : c'est le rendez-vous qui a bougé. Distingue toujours ce qui change de ce qui subit le changement.",
      },
      {
        id: 'p3-09-q2',
        vocab: [
          { term: "a restricted fare", translation: "un tarif non modifiable, restrictif", note: "Opposé : a flexible fare." },
          { term: "a change fee", translation: "des frais de modification", example: "a change fee of ninety euros" },
        ],
        category: 'Conversation — détail',
        prompt: 'What does the woman explain about the ticket?',
        choices: [
          { id: 'A', text: 'It cannot be modified at all.' },
          { id: 'B', text: 'It includes free seat selection.' },
          { id: 'C', text: 'Changing it involves extra costs.' },
          { id: 'D', text: 'It expires at the end of the month.' },
        ],
        answer: 'C',
        explanation:
          "« there's a change fee of ninety euros plus the fare difference ». Attention à (A) : le billet est « restricted », donc coûteux à modifier, mais pas immodifiable — l'audio prouve le contraire puisqu'elle procède au changement.",
      },
      {
        id: 'p3-09-q3',
        vocab: [
          { term: "approval", translation: "l'accord, la validation", example: "needs your manager's approval" },
          { term: "to copy someone on an email", translation: "mettre qqn en copie d'un email", example: "I'll copy her on the email." },
        ],
        category: 'Conversation — procédure',
        prompt: 'Why will the woman contact the man’s manager?',
        choices: [
          { id: 'A', text: 'To confirm the hotel address.' },
          { id: 'B', text: 'To obtain authorisation for the fee.' },
          { id: 'C', text: 'To invite her to the client meeting.' },
          { id: 'D', text: 'To report a policy violation.' },
        ],
        answer: 'B',
        explanation:
          "« anything over fifty euros in change fees needs your manager's approval, so I'll copy her on the email » → obtenir une autorisation. Les règles internes chiffrées (« anything over X needs… ») sont un ressort classique : note le seuil ET la conséquence.",
      },
    ],
  },
  {
    id: 'p3-10',
    part: 3,
    title: 'Conversation — défaut de fabrication',
    source: 'seed',
    audio: [
      {
        speaker: 'Man',
        voice: 'male',
        text: "Quality control stopped line two this morning. About four hundred units have a hairline crack in the housing, all from the same batch of moulded parts.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Four hundred? Have any of them shipped?",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Sixty went out to the Belgian distributor yesterday. The rest are still in the warehouse, so we can pull them before they leave.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Right. Quarantine everything in the warehouse and call Antwerp before they start distributing. I'll speak to the supplier about the mould — if their tooling is worn, this will happen again next month.",
      },
    ],
    items: [
      {
        id: 'p3-10-q1',
        vocab: [
          { term: "a hairline crack", translation: "une microfissure", example: "a hairline crack in the housing" },
          { term: "a batch", translation: "un lot (de production)", example: "all from the same batch of moulded parts" },
        ],
        category: 'Conversation — sujet / problème',
        prompt: 'What problem is being discussed?',
        choices: [
          { id: 'A', text: 'A shipment was sent to the wrong address.' },
          { id: 'B', text: 'A machine on the line has broken down.' },
          { id: 'C', text: 'Some products have a manufacturing defect.' },
          { id: 'D', text: 'A supplier has missed a delivery date.' },
        ],
        answer: 'C',
        explanation:
          "« About four hundred units have a hairline crack in the housing » → un défaut de fabrication. (B) est un piège : la ligne a été ARRÊTÉE par le contrôle qualité, elle n'est pas en panne. Une conséquence n'est pas la cause.",
      },
      {
        id: 'p3-10-q2',
        vocab: [
          { term: "to ship", translation: "expédier", example: "Have any of them shipped?", note: "S'emploie pour tout envoi, pas seulement par bateau." },
          { term: "to pull (stock)", translation: "retirer, bloquer (de la marchandise)", example: "we can pull them before they leave" },
        ],
        category: 'Conversation — détail chiffré',
        prompt: 'How many units have already been sent out?',
        choices: [
          { id: 'A', text: 'Sixty.' },
          { id: 'B', text: 'Four hundred.' },
          { id: 'C', text: 'Two hundred.' },
          { id: 'D', text: 'None of them.' },
        ],
        answer: 'A',
        explanation:
          "« Sixty went out to the Belgian distributor yesterday ». Le 400 correspond au TOTAL des pièces défectueuses, pas aux pièces expédiées. Dans les questions chiffrées, relie chaque nombre à son référent avant de répondre.",
      },
      {
        id: 'p3-10-q3',
        vocab: [
          { term: "to quarantine", translation: "mettre en quarantaine, isoler", example: "Quarantine everything in the warehouse." },
          { term: "tooling", translation: "l'outillage (moules, matrices)", example: "if their tooling is worn" },
          { term: "worn", translation: "usé", note: "Participe de « to wear » : wear / wore / worn." },
        ],
        category: 'Conversation — action future',
        prompt: 'What does the woman say she will do?',
        choices: [
          { id: 'A', text: 'Visit the Belgian distributor.' },
          { id: 'B', text: 'Inspect the warehouse herself.' },
          { id: 'C', text: 'Contact the parts supplier.' },
          { id: 'D', text: 'Halt production for a week.' },
        ],
        answer: 'C',
        explanation:
          "« I'll speak to the supplier about the mould ». Attention à bien séparer ce que la femme fait ELLE-MÊME (« I'll speak to… ») de ce qu'elle DEMANDE à l'homme (« Quarantine everything… call Antwerp »). Cette confusion coûte cher en Part 3.",
      },
    ],
  },
  {
    id: 'p3-11',
    part: 3,
    title: 'Conversation — intégration d’un nouvel employé',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Welcome aboard, Karim. Your laptop is on your desk and your badge should be ready at reception this afternoon.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Thank you. I tried logging into the intranet this morning but the temporary password didn't work.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "That's normal on the first day — the account activates at midday. If it still fails after two, send a ticket rather than calling; the help desk is much faster by ticket.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "Understood. And when do I meet the rest of the team? I saw a calendar invitation for Wednesday but nothing before that.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Most of them are at the regional meeting until Tuesday. Wednesday's session is the proper introduction — bring the questions you've collected until then, it's the best moment to ask them.",
      },
    ],
    items: [
      {
        id: 'p3-11-q1',
        vocab: [
          { term: "Welcome aboard", translation: "Bienvenue parmi nous", note: "Formule d'accueil d'une nouvelle recrue." },
          { term: "a badge", translation: "un badge d'accès", example: "your badge should be ready at reception" },
        ],
        category: 'Conversation — contexte',
        prompt: 'Who most likely is the man?',
        choices: [
          { id: 'A', text: 'A visiting client.' },
          { id: 'B', text: 'A new employee.' },
          { id: 'C', text: 'A maintenance technician.' },
          { id: 'D', text: 'A job applicant.' },
        ],
        answer: 'B',
        explanation:
          "« Welcome aboard… Your laptop is on your desk… That's normal on the first day » : c'est un nouvel arrivant. Piège (D) : un candidat n'a ni bureau ni ordinateur — le processus de recrutement est déjà terminé.",
      },
      {
        id: 'p3-11-q2',
        vocab: [
          { term: "to send a ticket", translation: "ouvrir un ticket d'assistance", example: "send a ticket rather than calling" },
          { term: "rather than", translation: "plutôt que", note: "Suivi de la même forme que le premier terme : « send… rather than calling »." },
        ],
        category: 'Conversation — consigne',
        prompt: 'What is the man advised to do if the problem continues?',
        choices: [
          { id: 'A', text: 'Telephone the help desk.' },
          { id: 'B', text: 'Ask a colleague for a password.' },
          { id: 'C', text: 'Submit a written request online.' },
          { id: 'D', text: 'Go to reception in person.' },
        ],
        answer: 'C',
        explanation:
          "« send a ticket rather than calling » → une demande écrite en ligne. (A) est exactement ce qu'elle DÉCONSEILLE. Quand tu entends « rather than » ou « instead of », l'option rejetée figure toujours parmi les distracteurs.",
      },
      {
        id: 'p3-11-q3',
        vocab: [
          { term: "a calendar invitation", translation: "une invitation dans l'agenda", note: "Aussi : a calendar invite (registre oral)." },
          { term: "a proper introduction", translation: "une véritable présentation", note: "« proper » = en bonne et due forme, complet." },
        ],
        category: 'Conversation — raison',
        prompt: 'Why will the man not meet the team before Wednesday?',
        choices: [
          { id: 'A', text: 'His badge is not ready yet.' },
          { id: 'B', text: 'Most colleagues are away at a meeting.' },
          { id: 'C', text: 'The meeting room is being renovated.' },
          { id: 'D', text: 'He must complete training first.' },
        ],
        answer: 'B',
        explanation:
          "« Most of them are at the regional meeting until Tuesday ». La cause est donnée juste avant l'information cherchée : en Part 3, une réponse à « Why » suit presque toujours immédiatement la question posée à l'oral par l'autre locuteur.",
      },
    ],
  },
  {
    id: 'p3-12',
    part: 3,
    title: 'Conversation — réclamation d’un client mécontent',
    source: 'seed',
    audio: [
      {
        speaker: 'Woman',
        voice: 'female',
        text: "I ordered a coffee machine on the sixth and paid for next-day delivery. It arrived a week late and the milk frother was missing from the box.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "I'm very sorry. Let me check the order… I can see the delay was caused by a warehouse move, and the frother is listed as a separate item that wasn't picked.",
      },
      {
        speaker: 'Woman',
        voice: 'female',
        text: "Separate or not, the website showed it as included. I use the machine for a small café, so I've had to borrow one for a week.",
      },
      {
        speaker: 'Man',
        voice: 'male',
        text: "You're right, and I'll have the frother sent by courier today. I'm also refunding the delivery charge and adding a fifteen percent credit to your account for the inconvenience.",
      },
    ],
    items: [
      {
        id: 'p3-12-q1',
        vocab: [
          { term: "next-day delivery", translation: "la livraison en 24 h", example: "I paid for next-day delivery." },
          { term: "missing", translation: "manquant, absent", example: "the milk frother was missing from the box" },
        ],
        category: 'Conversation — sujet / problème',
        prompt: 'What two problems does the woman report?',
        choices: [
          { id: 'A', text: 'A late delivery and an incomplete order.' },
          { id: 'B', text: 'A damaged item and a double charge.' },
          { id: 'C', text: 'A wrong model and a missing receipt.' },
          { id: 'D', text: 'A cancelled order and a refused refund.' },
        ],
        answer: 'A',
        explanation:
          "« It arrived a week late » + « the milk frother was missing » → retard et commande incomplète. Quand une question annonce « two problems », les deux figurent presque toujours dans la même réplique d'ouverture : ne cherche pas plus loin.",
      },
      {
        id: 'p3-12-q2',
        vocab: [
          { term: "to pick (an order)", translation: "prélever, préparer (une commande)", example: "a separate item that wasn't picked", note: "Vocabulaire d'entrepôt : picking = préparation de commande." },
          { term: "a warehouse move", translation: "un déménagement d'entrepôt" },
        ],
        category: 'Conversation — cause',
        prompt: 'According to the man, why was the order delayed?',
        choices: [
          { id: 'A', text: 'The item was out of stock.' },
          { id: 'B', text: 'The warehouse was being relocated.' },
          { id: 'C', text: 'The address was incorrect.' },
          { id: 'D', text: 'The payment was not confirmed.' },
        ],
        answer: 'B',
        explanation:
          "« the delay was caused by a warehouse move » → « the warehouse was being relocated ». Le nom « a move » devient le verbe passif « was being relocated » : ce changement de forme grammaticale est le cœur du mécanisme de paraphrase en Part 3.",
      },
      {
        id: 'p3-12-q3',
        vocab: [
          { term: "to refund", translation: "rembourser", example: "I'm refunding the delivery charge." },
          { term: "a credit", translation: "un avoir", example: "adding a fifteen percent credit to your account", note: "Un avoir n'est pas de l'argent rendu : c'est un crédit à utiliser." },
        ],
        category: 'Conversation — solution proposée',
        prompt: 'What does the man offer the woman?',
        choices: [
          { id: 'A', text: 'A full refund of the machine.' },
          { id: 'B', text: 'A replacement machine.' },
          { id: 'C', text: 'The missing part and financial compensation.' },
          { id: 'D', text: 'A free extended warranty.' },
        ],
        answer: 'C',
        explanation:
          "« I'll have the frother sent by courier today… refunding the delivery charge and adding a fifteen percent credit ». (A) est faux : il rembourse les FRAIS DE PORT, pas la machine. Le détail de ce qui est remboursé fait toute la différence.",
      },
    ],
  },
];
