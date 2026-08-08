/**
 * Part 4 — Talks.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART4: QuestionSet[] = [
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
  {
    id: 'p4-03',
    part: 4,
    title: 'Bulletin radio — circulation et météo',
    source: 'seed',
    audio: [
      {
        speaker: 'Radio broadcast',
        voice: 'female',
        text: "You're listening to Riverside Ninety-Two, and here's your travel update. Roadworks on the eastbound ring road have been extended into next week, so drivers heading towards the industrial park should expect delays of up to thirty minutes during the morning rush. The city council recommends the riverside route as an alternative until Friday. Rail services are running normally, although the seven-oh-five to Central has been cancelled because of staff shortages. Looking at the weather, heavy rain is expected to move in from the coast around lunchtime, so if you're planning to walk, take an umbrella. We'll have another update at half past eight.",
      },
    ],
    items: [
      {
        id: 'p4-03-q1',
        vocab: [
          { term: "roadworks", translation: "des travaux routiers", note: "Toujours au pluriel en anglais britannique. US : road construction." },
          { term: "the rush hour", translation: "l'heure de pointe", example: "delays during the morning rush" },
        ],
        category: 'Bulletin — objet',
        prompt: 'What is the main purpose of the broadcast?',
        choices: [
          { id: 'A', text: 'To advertise a new bus service.' },
          { id: 'B', text: 'To give travel and weather information.' },
          { id: 'C', text: 'To report a serious road accident.' },
          { id: 'D', text: 'To announce a change to the radio schedule.' },
        ],
        answer: 'B',
        explanation:
          "« here's your travel update… Looking at the weather ». Le but d'un bulletin est annoncé dans la première phrase. (C) est un piège thématique : il est question de retards, jamais d'accident.",
      },
      {
        id: 'p4-03-q2',
        vocab: [
          { term: "an alternative route", translation: "un itinéraire de substitution", example: "the riverside route as an alternative" },
          { term: "a staff shortage", translation: "un manque de personnel", example: "cancelled because of staff shortages" },
        ],
        category: 'Bulletin — détail',
        prompt: 'What is said about rail services?',
        choices: [
          { id: 'A', text: 'All trains are running late.' },
          { id: 'B', text: 'Ticket prices have increased.' },
          { id: 'C', text: 'One early train will not run.' },
          { id: 'D', text: 'A new line has opened.' },
        ],
        answer: 'C',
        explanation:
          "« Rail services are running normally, although the seven-oh-five to Central has been cancelled ». Le mot « although » signale une exception : (A) généralise à tort ce qui ne concerne qu'un seul train.",
      },
      {
        id: 'p4-03-q3',
        vocab: [
          { term: "to move in (weather)", translation: "arriver, s'installer (temps)", example: "heavy rain is expected to move in from the coast" },
          { term: "around lunchtime", translation: "vers midi", note: "Repère horaire vague, fréquent dans les bulletins." },
        ],
        category: 'Bulletin — conseil',
        prompt: 'What does the speaker suggest listeners do?',
        choices: [
          { id: 'A', text: 'Take an umbrella if walking.' },
          { id: 'B', text: 'Travel before seven in the morning.' },
          { id: 'C', text: 'Use the ring road instead of the city centre.' },
          { id: 'D', text: 'Check the website for updates.' },
        ],
        answer: 'A',
        explanation:
          "« if you're planning to walk, take an umbrella ». (C) inverse le conseil : c'est la rocade (ring road) qu'il faut ÉVITER. Une option qui reprend les mots entendus en renversant le sens est le distracteur préféré du TOEIC.",
      },
    ],
  },
  {
    id: 'p4-04',
    part: 4,
    title: 'Publicité — ouverture d’un magasin',
    source: 'seed',
    audio: [
      {
        speaker: 'Advertisement',
        voice: 'male',
        text: "Kitchen and Table is opening its fourth store, and this one is right here in Ashford. To celebrate, everything in the shop is twenty percent off during our opening weekend, the tenth and eleventh of May. Bring this radio offer to the till and we'll take a further ten percent off any single item over fifty pounds. Our Ashford store carries the full cookware range, plus a demonstration kitchen where our chefs run free classes every Saturday morning. Places are limited, so sign up at the customer service desk when you visit. Kitchen and Table, Bridge Street, opposite the library.",
      },
    ],
    items: [
      {
        id: 'p4-04-q1',
        vocab: [
          { term: "twenty percent off", translation: "20 % de réduction", note: "« off » marque la remise : 20% off ≠ 20% du prix." },
          { term: "a till", translation: "une caisse (magasin)", note: "US : a register / a checkout." },
        ],
        category: 'Publicité — objet',
        prompt: 'What is being announced?',
        choices: [
          { id: 'A', text: 'The closing of a shop.' },
          { id: 'B', text: 'The opening of a new branch.' },
          { id: 'C', text: 'A change of business hours.' },
          { id: 'D', text: 'The launch of a cooking magazine.' },
        ],
        answer: 'B',
        explanation:
          "« Kitchen and Table is opening its fourth store, and this one is right here in Ashford ». Dans une publicité, l'information centrale arrive immédiatement : les 5 premiers mots suffisent presque toujours à répondre à la question 1.",
      },
      {
        id: 'p4-04-q2',
        vocab: [
          { term: "a further discount", translation: "une remise supplémentaire", example: "a further ten percent off" },
          { term: "a single item", translation: "un article unique, un seul article", note: "« single » insiste sur l'unité : par article, pas sur le total." },
        ],
        category: 'Publicité — condition',
        prompt: 'How can listeners obtain the extra discount?',
        choices: [
          { id: 'A', text: 'By spending over fifty pounds in total.' },
          { id: 'B', text: 'By joining a loyalty programme.' },
          { id: 'C', text: 'By mentioning the radio offer at the checkout.' },
          { id: 'D', text: 'By shopping before ten in the morning.' },
        ],
        answer: 'C',
        explanation:
          "« Bring this radio offer to the till and we'll take a further ten percent off ». Piège (A) : la condition porte sur UN article à plus de 50 £ (« any single item over fifty pounds »), pas sur le total du panier.",
      },
      {
        id: 'p4-04-q3',
        vocab: [
          { term: "cookware", translation: "des ustensiles de cuisine", note: "Indénombrable, comme software ou hardware." },
          { term: "to sign up", translation: "s'inscrire", example: "sign up at the customer service desk" },
        ],
        category: 'Publicité — service proposé',
        prompt: 'What does the store offer on Saturday mornings?',
        choices: [
          { id: 'A', text: 'Free cooking classes.' },
          { id: 'B', text: 'Home delivery at no charge.' },
          { id: 'C', text: 'Product repairs.' },
          { id: 'D', text: 'Extended opening hours.' },
        ],
        answer: 'A',
        explanation:
          "« our chefs run free classes every Saturday morning ». Le verbe « to run a class » signifie « animer un cours » : cette collocation revient souvent (run a workshop, run a session).",
      },
    ],
  },
  {
    id: 'p4-05',
    part: 4,
    title: 'Visite guidée — consignes de départ',
    source: 'seed',
    audio: [
      {
        speaker: 'Tour guide',
        voice: 'female',
        text: "Good morning everyone, and welcome to the Rendell Paper Mill. My name is Grace and I'll be your guide for the next ninety minutes. Before we start, three safety points. The production floor is loud, so please keep the ear protection you were given at reception on at all times. Second, stay behind the yellow lines — the machinery moves faster than it looks. And third, photography is allowed everywhere except the finishing room, where the process is still under patent. We'll begin in the pulp hall, then move through to packaging, and finish in the shop, where you'll each receive a sample notebook made here this week.",
      },
    ],
    items: [
      {
        id: 'p4-05-q1',
        vocab: [
          { term: "a mill", translation: "une usine (papeterie, scierie, filature)", example: "welcome to the Rendell Paper Mill" },
          { term: "ear protection", translation: "des protections auditives", note: "Aussi : ear defenders, earplugs." },
        ],
        category: 'Visite — contexte',
        prompt: 'Where is the talk taking place?',
        choices: [
          { id: 'A', text: 'At a printing school.' },
          { id: 'B', text: 'At a manufacturing site.' },
          { id: 'C', text: 'At a stationery shop.' },
          { id: 'D', text: 'At a design museum.' },
        ],
        answer: 'B',
        explanation:
          "« welcome to the Rendell Paper Mill… the production floor is loud » : c'est un site de production. La présence d'une boutique à la fin ne fait pas du lieu un magasin — identifie le lieu PRINCIPAL, pas une de ses parties.",
      },
      {
        id: 'p4-05-q2',
        vocab: [
          { term: "at all times", translation: "en permanence, à tout moment", example: "keep the ear protection on at all times" },
          { term: "machinery", translation: "les machines, l'équipement", note: "Indénombrable : « the machinery is », jamais « machineries »." },
        ],
        category: 'Visite — consigne',
        prompt: 'What are visitors told to do?',
        choices: [
          { id: 'A', text: 'Leave their bags at reception.' },
          { id: 'B', text: 'Remain in groups of four.' },
          { id: 'C', text: 'Keep protective equipment on.' },
          { id: 'D', text: 'Switch off their mobile phones.' },
        ],
        answer: 'C',
        explanation:
          "« please keep the ear protection… on at all times » → garder l'équipement de protection. L'énumération « three safety points » annonce trois consignes : compte-les, une question porte presque toujours dessus.",
      },
      {
        id: 'p4-05-q3',
        vocab: [
          { term: "under patent", translation: "protégé par un brevet", example: "the process is still under patent" },
          { term: "except", translation: "sauf, à l'exception de", note: "Mot charnière : il inverse la portée de la phrase. À guetter." },
        ],
        category: 'Visite — restriction',
        prompt: 'What is prohibited in the finishing room?',
        choices: [
          { id: 'A', text: 'Taking photographs.' },
          { id: 'B', text: 'Touching the products.' },
          { id: 'C', text: 'Speaking to the operators.' },
          { id: 'D', text: 'Entering without a guide.' },
        ],
        answer: 'A',
        explanation:
          "« photography is allowed everywhere except the finishing room ». Tout se joue sur « except » : sans ce mot, la phrase dirait l'inverse. Entraîne-toi à repérer except, apart from, other than — ils renversent le sens en une syllabe.",
      },
    ],
  },
  {
    id: 'p4-06',
    part: 4,
    title: 'Discours — remise d’un prix',
    source: 'seed',
    audio: [
      {
        speaker: 'Speech',
        voice: 'male',
        text: "Colleagues, thank you for staying on after the conference. It's my pleasure to present this year's Innovation Award to Dr Leila Hassan. Leila joined our research group eleven years ago as a laboratory assistant, and she now leads a team of twenty. Her work on low-temperature adhesives has cut our energy costs by almost a third and is being adopted by two of our largest clients. What impresses me most, though, is that she spends part of every week teaching apprentices — she has trained half the technicians in this room. Leila, please come up. And do stay for the reception next door; the buffet opens as soon as the speeches finish.",
      },
    ],
    items: [
      {
        id: 'p4-06-q1',
        vocab: [
          { term: "to present an award", translation: "remettre un prix", example: "to present this year's Innovation Award" },
          { term: "a research group", translation: "une équipe de recherche" },
        ],
        category: 'Discours — objet',
        prompt: 'What is the purpose of the speech?',
        choices: [
          { id: 'A', text: 'To open a scientific conference.' },
          { id: 'B', text: 'To honour an employee.' },
          { id: 'C', text: 'To announce a retirement.' },
          { id: 'D', text: 'To introduce a new product.' },
        ],
        answer: 'B',
        explanation:
          "« It's my pleasure to present this year's Innovation Award to Dr Leila Hassan ». Piège (A) : le discours a lieu APRÈS la conférence (« after the conference »), il ne l'ouvre pas. Écoute les prépositions de temps, elles changent tout.",
      },
      {
        id: 'p4-06-q2',
        vocab: [
          { term: "an adhesive", translation: "une colle, un adhésif", example: "her work on low-temperature adhesives" },
          { term: "to cut costs", translation: "réduire les coûts", example: "has cut our energy costs by almost a third" },
        ],
        category: 'Discours — détail',
        prompt: 'What has resulted from Dr Hassan’s work?',
        choices: [
          { id: 'A', text: 'A reduction in energy expenses.' },
          { id: 'B', text: 'The opening of a second laboratory.' },
          { id: 'C', text: 'An increase in staff numbers.' },
          { id: 'D', text: 'A patent dispute with a client.' },
        ],
        answer: 'A',
        explanation:
          "« has cut our energy costs by almost a third » → « a reduction in energy expenses ». « costs » devient « expenses », « cut » devient « reduction » : nom contre verbe, c'est la paraphrase type de la Part 4.",
      },
      {
        id: 'p4-06-q3',
        vocab: [
          { term: "an apprentice", translation: "un apprenti, un alternant", example: "she spends part of every week teaching apprentices" },
          { term: "next door", translation: "à côté, dans la pièce voisine", example: "the reception next door" },
        ],
        category: 'Discours — suite du programme',
        prompt: 'What will happen after the speeches?',
        choices: [
          { id: 'A', text: 'A laboratory tour will begin.' },
          { id: 'B', text: 'A training session will start.' },
          { id: 'C', text: 'Food will be served in another room.' },
          { id: 'D', text: 'Participants will vote on an award.' },
        ],
        answer: 'C',
        explanation:
          "« do stay for the reception next door; the buffet opens as soon as the speeches finish ». La dernière phrase d'un discours annonce presque toujours la suite du programme : c'est là que se trouve la réponse à « What will happen next? ».",
      },
    ],
  },
  {
    id: 'p4-07',
    part: 4,
    title: 'Annonce en gare — retard de train',
    source: 'seed',
    audio: [
      {
        speaker: 'Station announcement',
        voice: 'female',
        text: "May I have your attention please. The sixteen-forty service to Nantes, calling at Angers and Le Mans, is delayed by approximately fifty minutes due to a signalling fault outside the station. We are sorry for the disruption. Passengers holding tickets for this service may travel on the seventeen-ten to Le Mans and change there; your ticket will be accepted without any additional charge. Passengers who choose not to travel today can obtain a full refund from the ticket office on the main concourse. Please note that the platform for the delayed service has changed from platform four to platform nine. Further announcements will follow.",
      },
    ],
    items: [
      {
        id: 'p4-07-q1',
        vocab: [
          { term: "a signalling fault", translation: "une panne de signalisation", example: "due to a signalling fault outside the station" },
          { term: "to call at", translation: "desservir (une gare)", note: "Formule ferroviaire : « calling at Angers and Le Mans »." },
        ],
        category: 'Annonce — cause',
        prompt: 'Why is the service delayed?',
        choices: [
          { id: 'A', text: 'Because of severe weather.' },
          { id: 'B', text: 'Because of a technical fault.' },
          { id: 'C', text: 'Because of a staff strike.' },
          { id: 'D', text: 'Because of overcrowding.' },
        ],
        answer: 'B',
        explanation:
          "« due to a signalling fault » → une panne technique. La locution « due to » introduit la cause : avec « because of », « owing to » et « as a result of », c'est le signal à guetter dans toute annonce.",
      },
      {
        id: 'p4-07-q2',
        vocab: [
          { term: "to be accepted without additional charge", translation: "être accepté sans supplément", example: "your ticket will be accepted without any additional charge" },
          { term: "to change (trains)", translation: "changer de train", example: "travel on the seventeen-ten and change there" },
        ],
        category: 'Annonce — option proposée',
        prompt: 'What can passengers do instead of waiting?',
        choices: [
          { id: 'A', text: 'Take a replacement bus.' },
          { id: 'B', text: 'Upgrade to first class for free.' },
          { id: 'C', text: 'Travel on an earlier service and change.' },
          { id: 'D', text: 'Use their ticket on any train tomorrow.' },
        ],
        answer: 'C',
        explanation:
          "« may travel on the seventeen-ten to Le Mans and change there ». Attention : 17 h 10 est plus tard que 16 h 40 — mais c'est le train qui part le premier puisque celui de 16 h 40 a 50 minutes de retard. Le TOEIC teste ce genre de raisonnement horaire.",
      },
      {
        id: 'p4-07-q3',
        vocab: [
          { term: "a concourse", translation: "le hall (d'une gare, d'un aéroport)", example: "the ticket office on the main concourse" },
          { term: "a platform", translation: "un quai", note: "US : a track. « Platform nine » = quai 9." },
        ],
        category: 'Annonce — information pratique',
        prompt: 'What change is announced at the end?',
        choices: [
          { id: 'A', text: 'The destination has changed.' },
          { id: 'B', text: 'The departure platform has changed.' },
          { id: 'C', text: 'The ticket office has moved.' },
          { id: 'D', text: 'The refund policy has changed.' },
        ],
        answer: 'B',
        explanation:
          "« the platform… has changed from platform four to platform nine ». Les annonces de gare terminent souvent par une information pratique de dernière minute : ne décroche pas avant « Further announcements will follow ».",
      },
    ],
  },
  {
    id: 'p4-08',
    part: 4,
    title: 'Message vocal — suite d’entretien',
    source: 'seed',
    audio: [
      {
        speaker: 'Voicemail',
        voice: 'female',
        text: "Hello Mr Duarte, this is Claire Bennett from Harrow & Sons. Thank you for coming in on Tuesday — the panel was very positive about your presentation. We'd like to invite you to a second stage, which is a half-day session at our Leeds office with the two directors you haven't met yet. We're looking at Thursday the ninth or Friday the tenth; both start at nine. Before you confirm, I should be transparent about one thing: the role has been reclassified since the advert went out, and the salary band is slightly lower than the figure we discussed. I'd rather you knew that now than at the offer stage. Do call me back on 0113 496 2200 and we can talk it through.",
      },
    ],
    items: [
      {
        id: 'p4-08-q1',
        vocab: [
          { term: "a panel", translation: "un jury, un comité de recrutement", example: "the panel was very positive" },
          { term: "a second stage", translation: "un deuxième tour", note: "Aussi : a second round (of interviews)." },
        ],
        category: 'Message vocal — objet',
        prompt: 'Why is the speaker calling?',
        choices: [
          { id: 'A', text: 'To offer the man a position.' },
          { id: 'B', text: 'To invite the man to a further interview.' },
          { id: 'C', text: 'To reject the man’s application.' },
          { id: 'D', text: 'To ask the man for references.' },
        ],
        answer: 'B',
        explanation:
          "« We'd like to invite you to a second stage ». Piège (A) : elle mentionne « the offer stage » comme une étape FUTURE, aucune offre n'est faite. Une expression peut apparaître dans l'audio sans que le fait soit acquis.",
      },
      {
        id: 'p4-08-q2',
        vocab: [
          { term: "to reclassify a role", translation: "reclasser un poste", example: "the role has been reclassified" },
          { term: "a salary band", translation: "une fourchette salariale", example: "the salary band is slightly lower" },
        ],
        category: 'Message vocal — information sensible',
        prompt: 'What does the speaker warn the man about?',
        choices: [
          { id: 'A', text: 'The office location has changed.' },
          { id: 'B', text: 'The pay will be lower than discussed.' },
          { id: 'C', text: 'The start date has been delayed.' },
          { id: 'D', text: 'Another candidate is preferred.' },
        ],
        answer: 'B',
        explanation:
          "« the salary band is slightly lower than the figure we discussed ». L'annonce est introduite par « I should be transparent about one thing » : ces formules d'atténuation (« to be honest », « one thing I should mention ») précèdent toujours l'information délicate.",
      },
      {
        id: 'p4-08-q3',
        vocab: [
          { term: "to talk something through", translation: "discuter de qqch en détail", example: "we can talk it through" },
          { term: "to call back", translation: "rappeler", note: "Verbe à particule séparable : call me back." },
        ],
        category: 'Message vocal — action demandée',
        prompt: 'What is the man asked to do?',
        choices: [
          { id: 'A', text: 'Send an updated résumé.' },
          { id: 'B', text: 'Choose a date by email.' },
          { id: 'C', text: 'Return the call to discuss.' },
          { id: 'D', text: 'Visit the Leeds office on Tuesday.' },
        ],
        answer: 'C',
        explanation:
          "« Do call me back on 0113 496 2200 and we can talk it through ». Piège (B) : deux dates sont proposées, mais elle demande un APPEL, pas un email. La question porte sur le canal, pas sur le contenu.",
      },
    ],
  },
  {
    id: 'p4-09',
    part: 4,
    title: 'Chronique économique — rachat d’entreprise',
    source: 'seed',
    audio: [
      {
        speaker: 'News report',
        voice: 'male',
        text: "In business news, the logistics group Marden has confirmed it will acquire the regional carrier Ostvale for an undisclosed sum. Marden says the deal gives it immediate access to eleven depots across central Europe, a network it had planned to build from scratch over the next five years. Ostvale's four hundred employees will transfer under existing terms, and the company insists there will be no depot closures in the first two years. Analysts have been cautious: Ostvale reported a loss last year, and integrating two different fleet management systems has caused problems for other operators. The agreement still requires approval from competition regulators, a process expected to take around six months.",
      },
    ],
    items: [
      {
        id: 'p4-09-q1',
        vocab: [
          { term: "to acquire", translation: "racheter, acquérir", example: "it will acquire the regional carrier Ostvale", note: "Nom : an acquisition. Voisin : a takeover, a merger." },
          { term: "an undisclosed sum", translation: "un montant non divulgué", note: "Formule journalistique standard." },
        ],
        category: 'Chronique — sujet',
        prompt: 'What is the report mainly about?',
        choices: [
          { id: 'A', text: 'The purchase of one company by another.' },
          { id: 'B', text: 'The bankruptcy of a transport firm.' },
          { id: 'C', text: 'The opening of eleven new depots.' },
          { id: 'D', text: 'A strike affecting deliveries.' },
        ],
        answer: 'A',
        explanation:
          "« Marden has confirmed it will acquire the regional carrier Ostvale ». Piège (C) : les onze dépôts existent déjà et changent de propriétaire, ils ne sont pas construits. « access to » ≠ « creation of ».",
      },
      {
        id: 'p4-09-q2',
        vocab: [
          { term: "from scratch", translation: "à partir de zéro", example: "a network it had planned to build from scratch" },
          { term: "under existing terms", translation: "aux conditions actuelles", example: "employees will transfer under existing terms" },
        ],
        category: 'Chronique — bénéfice annoncé',
        prompt: 'What advantage does Marden gain?',
        choices: [
          { id: 'A', text: 'A reduction in its workforce.' },
          { id: 'B', text: 'An established European network.' },
          { id: 'C', text: 'A new fleet management system.' },
          { id: 'D', text: 'Exemption from regulatory approval.' },
        ],
        answer: 'B',
        explanation:
          "« the deal gives it immediate access to eleven depots across central Europe ». (D) est contredit en fin d'audio : l'accord doit justement être approuvé par les régulateurs. Vérifie toujours qu'une option n'est pas démentie plus loin.",
      },
      {
        id: 'p4-09-q3',
        vocab: [
          { term: "cautious", translation: "prudent, réservé", example: "Analysts have been cautious." },
          { term: "to report a loss", translation: "annoncer une perte", note: "Contraire : to report a profit / to break even (équilibre)." },
        ],
        category: 'Chronique — réserve exprimée',
        prompt: 'Why are analysts cautious?',
        choices: [
          { id: 'A', text: 'The purchase price was too high.' },
          { id: 'B', text: 'Depot closures are expected soon.' },
          { id: 'C', text: 'The acquired company was unprofitable.' },
          { id: 'D', text: 'Regulators have refused the deal.' },
        ],
        answer: 'C',
        explanation:
          "« Ostvale reported a loss last year ». (A) est impossible : le montant n'a pas été divulgué. (D) est faux : l'approbation est en cours, pas refusée. Élimine méthodiquement ce que l'audio contredit avant de choisir.",
      },
    ],
  },
  {
    id: 'p4-10',
    part: 4,
    title: 'Formation — nouvelle procédure interne',
    source: 'seed',
    audio: [
      {
        speaker: 'Trainer',
        voice: 'female',
        text: "Right, let's look at the new expense procedure, which replaces the paper forms from the first of next month. Everything now goes through the mobile app. You photograph the receipt, select a category, and submit — that's it. The app reads the amount automatically, but do check it, because blurred photos are the main cause of rejected claims. Two rules have changed. Claims must be submitted within thirty days of the expense, not sixty as before, and anything above two hundred euros needs a short justification in the comments field. Your manager approves in the app, and payment lands with the following month's salary. I'll email these slides afterwards, so there's no need to copy everything down.",
      },
    ],
    items: [
      {
        id: 'p4-10-q1',
        vocab: [
          { term: "an expense claim", translation: "une note de frais", note: "to submit a claim = soumettre une note de frais." },
          { term: "to replace", translation: "remplacer", example: "which replaces the paper forms" },
        ],
        category: 'Formation — objet',
        prompt: 'What is the speaker explaining?',
        choices: [
          { id: 'A', text: 'How to use a new payroll system.' },
          { id: 'B', text: 'A change to the expense process.' },
          { id: 'C', text: 'A new company travel policy.' },
          { id: 'D', text: 'How to install a mobile phone.' },
        ],
        answer: 'B',
        explanation:
          "« let's look at the new expense procedure, which replaces the paper forms ». Attention à (A) : le salaire n'est évoqué que comme moyen de paiement du remboursement, ce n'est pas le sujet.",
      },
      {
        id: 'p4-10-q2',
        vocab: [
          { term: "blurred", translation: "flou", example: "blurred photos are the main cause of rejected claims" },
          { term: "a rejected claim", translation: "une demande refusée", note: "to reject ≠ to reject sur le fond : ici, refus pour vice de forme." },
        ],
        category: 'Formation — mise en garde',
        prompt: 'What does the speaker warn listeners about?',
        choices: [
          { id: 'A', text: 'The app may calculate totals incorrectly.' },
          { id: 'B', text: 'Managers often approve claims late.' },
          { id: 'C', text: 'Unclear photographs cause refusals.' },
          { id: 'D', text: 'Paper forms will no longer be accepted.' },
        ],
        answer: 'C',
        explanation:
          "« blurred photos are the main cause of rejected claims » → des photos peu nettes entraînent des refus. (D) est vrai dans l'absolu mais ce n'est pas présenté comme une mise en garde : la question porte sur le « warning », introduit ici par « do check it, because… ».",
      },
      {
        id: 'p4-10-q3',
        vocab: [
          { term: "within thirty days", translation: "dans un délai de trente jours", note: "« within » = à l'intérieur d'un délai, pas « en dedans de »." },
          { term: "a justification", translation: "une justification, un motif", example: "needs a short justification in the comments field" },
        ],
        category: 'Formation — règle chiffrée',
        prompt: 'What has changed about the deadline?',
        choices: [
          { id: 'A', text: 'It has been shortened to thirty days.' },
          { id: 'B', text: 'It has been extended to sixty days.' },
          { id: 'C', text: 'It now depends on the amount claimed.' },
          { id: 'D', text: 'It has been removed entirely.' },
        ],
        answer: 'A',
        explanation:
          "« within thirty days of the expense, not sixty as before » : le délai est RÉDUIT. Le mot « as before » indique l'ancienne règle — repère bien lequel des deux chiffres est le nouveau, c'est exactement là que le piège est posé.",
      },
    ],
  },
  {
    id: 'p4-11',
    part: 4,
    title: 'Message enregistré — service client',
    source: 'seed',
    audio: [
      {
        speaker: 'Recorded message',
        voice: 'male',
        text: "Thank you for calling Verity Insurance. Please listen carefully as our options have recently changed. For claims relating to a vehicle, press one. For home and contents, press two. To make a payment or discuss your direct debit, press three. If you are calling about a policy that begins next month, please note that new policies are handled by our sales team, who are available until eight in the evening on weekdays only. Our current waiting time is around twelve minutes. You may find it faster to use the online portal, where most claims can be started in a few minutes and tracked at any time. To hear these options again, press the star key.",
      },
    ],
    items: [
      {
        id: 'p4-11-q1',
        vocab: [
          { term: "a claim (insurance)", translation: "une déclaration de sinistre", note: "to make a claim = déclarer un sinistre." },
          { term: "a direct debit", translation: "un prélèvement automatique", note: "US : an automatic payment." },
        ],
        category: 'Message enregistré — contexte',
        prompt: 'What kind of company is this?',
        choices: [
          { id: 'A', text: 'A car rental agency.' },
          { id: 'B', text: 'An insurance provider.' },
          { id: 'C', text: 'A bank.' },
          { id: 'D', text: 'A property developer.' },
        ],
        answer: 'B',
        explanation:
          "« Thank you for calling Verity Insurance… For claims relating to a vehicle ». Les mots « claims », « policy » et « cover » forment le champ lexical de l'assurance : les reconnaître identifie immédiatement le contexte.",
      },
      {
        id: 'p4-11-q2',
        vocab: [
          { term: "a policy", translation: "un contrat d'assurance", note: "Faux ami : ici, ce n'est pas une « politique »." },
          { term: "on weekdays", translation: "en semaine", note: "À distinguer de « weekly » (hebdomadaire) et « weekends »." },
        ],
        category: 'Message enregistré — détail',
        prompt: 'What is said about new policies?',
        choices: [
          { id: 'A', text: 'They cannot be arranged by telephone.' },
          { id: 'B', text: 'They are managed by a different team.' },
          { id: 'C', text: 'They require a deposit in advance.' },
          { id: 'D', text: 'They take effect immediately.' },
        ],
        answer: 'B',
        explanation:
          "« new policies are handled by our sales team ». Piège (A) : l'équipe commerciale est justement joignable par téléphone jusqu'à 20 h. Le message précise QUI traite, pas qu'un canal est fermé.",
      },
      {
        id: 'p4-11-q3',
        vocab: [
          { term: "a waiting time", translation: "un temps d'attente", example: "Our current waiting time is around twelve minutes." },
          { term: "to track", translation: "suivre (l'avancement de)", example: "claims can be started and tracked at any time" },
        ],
        category: 'Message enregistré — recommandation',
        prompt: 'What does the message suggest callers do?',
        choices: [
          { id: 'A', text: 'Call back outside peak hours.' },
          { id: 'B', text: 'Press one to speak to an adviser.' },
          { id: 'C', text: 'Use the company website instead.' },
          { id: 'D', text: 'Send documents by post.' },
        ],
        answer: 'C',
        explanation:
          "« You may find it faster to use the online portal ». La formule « You may find it faster / easier to… » est une recommandation déguisée : elle ne contient aucun impératif, ce qui la rend facile à manquer.",
      },
    ],
  },
  {
    id: 'p4-12',
    part: 4,
    title: 'Annonce en magasin — fermeture et animation',
    source: 'seed',
    audio: [
      {
        speaker: 'Store announcement',
        voice: 'female',
        text: "Attention shoppers. The store will be closing in thirty minutes. Please bring your final purchases to the checkouts on the ground floor; the self-service tills on level two are already closed for the evening. A reminder that our seasonal sale begins on Thursday, with reductions of up to forty percent across menswear and homeware. Members of our loyalty scheme can shop the sale a day early, on Wednesday evening from six until nine, and we will be serving refreshments near the main entrance. If you are not yet a member, you can join free of charge at the customer service desk before you leave tonight. Thank you for shopping with us.",
      },
    ],
    items: [
      {
        id: 'p4-12-q1',
        vocab: [
          { term: "a checkout", translation: "une caisse", note: "self-service till / self-checkout = caisse automatique." },
          { term: "final purchases", translation: "les derniers achats", example: "bring your final purchases to the checkouts" },
        ],
        category: 'Annonce — information immédiate',
        prompt: 'What are shoppers told about level two?',
        choices: [
          { id: 'A', text: 'It is closed for refurbishment.' },
          { id: 'B', text: 'Its automatic tills are no longer open.' },
          { id: 'C', text: 'It will host the sale on Thursday.' },
          { id: 'D', text: 'Refreshments are being served there.' },
        ],
        answer: 'B',
        explanation:
          "« the self-service tills on level two are already closed for the evening ». Seules les caisses automatiques ferment, pas l'étage : (A) généralise abusivement. La précision du sujet grammatical est décisive ici.",
      },
      {
        id: 'p4-12-q2',
        vocab: [
          { term: "a loyalty scheme", translation: "un programme de fidélité", note: "US : a loyalty program / rewards program." },
          { term: "reductions of up to", translation: "des remises allant jusqu'à", note: "« up to » = plafond, pas une remise garantie." },
        ],
        category: 'Annonce — avantage réservé',
        prompt: 'What benefit do loyalty members receive?',
        choices: [
          { id: 'A', text: 'An additional ten percent discount.' },
          { id: 'B', text: 'Free home delivery during the sale.' },
          { id: 'C', text: 'Early access to the sale.' },
          { id: 'D', text: 'A voucher for the customer service desk.' },
        ],
        answer: 'C',
        explanation:
          "« Members… can shop the sale a day early, on Wednesday evening ». L'avantage est temporel, pas tarifaire : la remise de 40 % s'applique à tout le monde. Distingue ce qui est réservé de ce qui est général.",
      },
      {
        id: 'p4-12-q3',
        vocab: [
          { term: "free of charge", translation: "gratuitement, sans frais", example: "you can join free of charge" },
          { term: "the customer service desk", translation: "l'accueil clientèle, le service client" },
        ],
        category: 'Annonce — démarche possible',
        prompt: 'How can shoppers become members?',
        choices: [
          { id: 'A', text: 'By signing up at the service desk tonight.' },
          { id: 'B', text: 'By registering on the store website.' },
          { id: 'C', text: 'By spending forty pounds or more.' },
          { id: 'D', text: 'By attending the Wednesday event.' },
        ],
        answer: 'A',
        explanation:
          "« you can join free of charge at the customer service desk before you leave tonight ». Le « forty » de (C) reprend les 40 % de remise dans un tout autre contexte : méfie-toi des chiffres recyclés d'une phrase à l'autre.",
      },
    ],
  },
];
