/**
 * Part 7 — Reading Comprehension.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART7: QuestionSet[] = [
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
  {
    id: 'p7-03',
    part: 7,
    title: 'Part 7 — passage simple (annonce de service)',
    source: 'seed',
    passages: [
      {
        kind: 'ad',
        heading: 'NORTHWOOD BUSINESS STORAGE — Now open in Sheffield',
        body: `Running out of space? Northwood Business Storage rents secure units from four to two hundred square metres, by the month, with no long-term commitment.

What you get:
· 24-hour access with your own entry code
· Climate-controlled units suitable for documents and electronics
· Free use of trolleys and a loading bay
· On-site staff Monday to Saturday, 7 a.m. to 7 p.m.

Our Sheffield site is five minutes from junction 34 of the M1, with parking for vans directly outside each block.

First month at half price for new customers who sign before 31 August. Quote reference NW-SHEF when you call.

We also collect: for an additional fee, our team will pick up your items and place them in your unit. This service must be booked at least five working days in advance and is not available on Saturdays.

Call 0114 555 0180 or visit northwoodstorage.example for a free quotation.`,
      },
    ],
    items: [
      {
        id: 'p7-03-q1',
        vocab: [
          { term: "a long-term commitment", translation: "un engagement de longue durée", example: "with no long-term commitment" },
          { term: "climate-controlled", translation: "à température et humidité régulées" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is indicated about the rental terms?',
        choices: [
          { id: 'A', text: 'A minimum rental of one year is required.' },
          { id: 'B', text: 'Units are rented on a monthly basis.' },
          { id: 'C', text: 'Prices depend on the length of the contract.' },
          { id: 'D', text: 'A deposit is payable in advance.' },
        ],
        answer: 'B',
        explanation:
          "« rents secure units… by the month, with no long-term commitment ». (A) dit exactement l'inverse du texte. En Part 7, une option qui contredit frontalement le passage est souvent placée en premier pour capter une lecture trop rapide.",
      },
      {
        id: 'p7-03-q2',
        vocab: [
          { term: "a loading bay", translation: "un quai de chargement" },
          { term: "on-site staff", translation: "du personnel sur place" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is NOT mentioned as being included?',
        choices: [
          { id: 'A', text: 'Access at any hour.' },
          { id: 'B', text: 'Use of trolleys.' },
          { id: 'C', text: 'Collection of items.' },
          { id: 'D', text: 'A loading area.' },
        ],
        answer: 'C',
        explanation:
          "Le service d'enlèvement est proposé « for an additional fee » : il n'est donc pas inclus. Méthode pour les questions NOT/EXCEPT : coche les trois options que tu trouves dans le texte, la quatrième est la réponse. Ne cherche pas la bonne, élimine les vraies.",
      },
      {
        id: 'p7-03-q3',
        vocab: [
          { term: "working days", translation: "jours ouvrés", note: "Exclut le week-end et les jours fériés." },
          { term: "in advance", translation: "à l'avance", example: "booked at least five working days in advance" },
        ],
        category: 'Lecture — inférence',
        prompt: 'A customer wants items collected on Friday 12 September. By when must the booking be made?',
        choices: [
          { id: 'A', text: 'Thursday 11 September.' },
          { id: 'B', text: 'Friday 5 September.' },
          { id: 'C', text: 'Saturday 6 September.' },
          { id: 'D', text: 'Monday 15 September.' },
        ],
        answer: 'B',
        explanation:
          "« at least five working days in advance » : cinq jours OUVRÉS avant le vendredi 12 nous ramène au vendredi 5 (11, 10, 9, 8 puis 5 — le week-end ne compte pas). Le TOEIC teste souvent ce calcul : « working days » exclut samedi et dimanche.",
      },
    ],
  },
  {
    id: 'p7-04',
    part: 7,
    title: 'Part 7 — passage simple (article de presse locale)',
    source: 'seed',
    passages: [
      {
        kind: 'article',
        heading: 'Riverside Gazette — Cycle scheme doubles in size',
        body: `The city's bike-share scheme will double in size by next spring, the transport authority announced on Tuesday.

Forty new docking stations will be added to the existing forty-two, bringing the total fleet to around twelve hundred bicycles. Most of the new stations will be placed in the eastern districts, which were largely left out when the scheme launched three years ago.

The expansion is funded by a regional grant of 2.4 million euros, together with sponsorship from a private company whose name has not yet been announced. Notably, no money will come from the city's own transport budget.

Usage figures have surprised officials. The scheme was designed for tourists and occasional users, but data shows that almost seventy percent of journeys are made by people travelling to work, often at the same time each day.

"That changes how we plan," said transport director Hélène Marchand. "A commuter needs a bike to be there at eight every morning, without exception. A tourist can wait ten minutes."

As a result, the authority will introduce a redistribution service, with vans moving bicycles overnight from residential areas to business districts. The service starts in March.`,
      },
    ],
    items: [
      {
        id: 'p7-04-q1',
        vocab: [
          { term: "a bike-share scheme", translation: "un système de vélos en libre-service" },
          { term: "a docking station", translation: "une station d'accueil, une borne" },
        ],
        category: 'Lecture — sujet du document',
        prompt: 'What is the article mainly about?',
        choices: [
          { id: 'A', text: 'The closure of an unprofitable service.' },
          { id: 'B', text: 'The expansion of a public transport scheme.' },
          { id: 'C', text: 'A rise in the cost of cycling.' },
          { id: 'D', text: 'A new city transport budget.' },
        ],
        answer: 'B',
        explanation:
          "« The city's bike-share scheme will double in size ». Le titre et la première phrase suffisent à répondre. En Part 7, commence toujours par lire l'en-tête et la phrase d'ouverture : ils donnent le sujet dans 90 % des cas.",
      },
      {
        id: 'p7-04-q2',
        vocab: [
          { term: "a grant", translation: "une subvention", example: "funded by a regional grant" },
          { term: "sponsorship", translation: "le parrainage, le mécénat" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is stated about the funding?',
        choices: [
          { id: 'A', text: 'It comes entirely from the city budget.' },
          { id: 'B', text: 'It has not yet been approved.' },
          { id: 'C', text: 'No city transport money is involved.' },
          { id: 'D', text: 'A private company will pay the full cost.' },
        ],
        answer: 'C',
        explanation:
          "« no money will come from the city's own transport budget ». L'adverbe « Notably » signale une information que l'auteur juge importante : en Part 7, ces marqueurs (notably, importantly, however) précèdent souvent la réponse à une question.",
      },
      {
        id: 'p7-04-q3',
        vocab: [
          { term: "a commuter", translation: "un navetteur, un actif qui fait le trajet quotidien", note: "Verbe : to commute." },
          { term: "an occasional user", translation: "un usager occasionnel" },
        ],
        category: 'Lecture — inférence',
        prompt: 'What surprised officials about the scheme?',
        choices: [
          { id: 'A', text: 'Most users are daily commuters, not tourists.' },
          { id: 'B', text: 'Bicycles are frequently damaged.' },
          { id: 'C', text: 'Usage is highest at weekends.' },
          { id: 'D', text: 'Eastern districts use it the most.' },
        ],
        answer: 'A',
        explanation:
          "« The scheme was designed for tourists… but data shows that almost seventy percent of journeys are made by people travelling to work ». Le « but » marque l'écart entre l'intention et la réalité : c'est exactement ce qui a surpris.",
      },
      {
        id: 'p7-04-q4',
        vocab: [
          { term: "redistribution", translation: "la redistribution, le rééquilibrage" },
          { term: "overnight", translation: "pendant la nuit", example: "vans moving bicycles overnight" },
        ],
        category: 'Lecture — conséquence',
        prompt: 'Why will vans move bicycles at night?',
        choices: [
          { id: 'A', text: 'To repair damaged bikes in a workshop.' },
          { id: 'B', text: 'To ensure bikes are available where commuters need them.' },
          { id: 'C', text: 'To reduce the number of docking stations.' },
          { id: 'D', text: 'To transport them to the eastern districts.' },
        ],
        answer: 'B',
        explanation:
          "La citation explique tout : « A commuter needs a bike to be there at eight every morning ». Le service de redistribution (« As a result… ») en découle directement. Les connecteurs de conséquence relient la cause citée à la mesure prise.",
      },
    ],
  },
  {
    id: 'p7-05',
    part: 7,
    title: 'Part 7 — échange de messages (intention)',
    source: 'seed',
    passages: [
      {
        kind: 'chat',
        heading: 'Group chat — Trade fair team',
        body: `Priya Raman (08:12)
Just arrived at the hall. Our stand is up but the display screens haven't been delivered.

Tomás Leal (08:14)
The hire company said Tuesday morning. It's Tuesday.

Priya Raman (08:15)
It's also 8:15 and doors open at 10.

Tomás Leal (08:17)
Fair point. I'll call them now. If they can't confirm a time in the next twenty minutes, we go to plan B.

Priya Raman (08:18)
Which is?

Tomás Leal (08:19)
The printed boards from the Lyon fair are still in the van. Not as impressive, but they fill the wall.

Priya Raman (08:20)
That works. Ines, are you close? We may need help carrying them.

Ines Okonkwo (08:26)
Twenty minutes away. I'll come straight to the stand rather than checking into the hotel first.

Tomás Leal (08:41)
Screens are on a lorry outside the city, driver says 9:30. Cutting it fine but it's within the window.

Priya Raman (08:42)
Let's set up the boards anyway. If the screens arrive we swap them out. I'd rather take them down than have an empty wall at ten.`,
      },
    ],
    items: [
      {
        id: 'p7-05-q1',
        vocab: [
          { term: "a stand", translation: "un stand (de salon)", note: "US : a booth." },
          { term: "to be delivered", translation: "être livré" },
        ],
        category: 'Lecture — problème',
        prompt: 'What problem do the writers discuss?',
        choices: [
          { id: 'A', text: 'A hotel booking was cancelled.' },
          { id: 'B', text: 'Equipment has not arrived.' },
          { id: 'C', text: 'The stand is the wrong size.' },
          { id: 'D', text: 'A colleague has missed a flight.' },
        ],
        answer: 'B',
        explanation:
          "« Our stand is up but the display screens haven't been delivered ». Dans une conversation écrite, le problème est presque toujours posé dans le tout premier message : les échanges suivants ne font que le traiter.",
      },
      {
        id: 'p7-05-q2',
        vocab: [
          { term: "Fair point", translation: "Bien vu, tu as raison", note: "Reconnaît la validité d'une objection." },
          { term: "plan B", translation: "une solution de repli" },
        ],
        category: 'Lecture — intention du locuteur',
        prompt: 'At 08:15, what does Ms Raman mean when she writes, “It’s also 8:15 and doors open at 10”?',
        choices: [
          { id: 'A', text: 'She thinks the delivery is no longer necessary.' },
          { id: 'B', text: 'She wants to change the opening time.' },
          { id: 'C', text: 'She is pointing out that time is running out.' },
          { id: 'D', text: 'She is offering to collect the screens herself.' },
        ],
        answer: 'C',
        explanation:
          "Elle répond à « The hire company said Tuesday morning. It's Tuesday » en rappelant l'heure : elle souligne l'URGENCE. Pour ces questions d'intention, lis toujours le message qui PRÉCÈDE — la phrase citée y répond et n'a pas de sens isolée.",
      },
      {
        id: 'p7-05-q3',
        vocab: [
          { term: "to cut it fine", translation: "s'y prendre à la dernière minute", example: "Cutting it fine but it's within the window." },
          { term: "to swap something out", translation: "remplacer, échanger qqch" },
        ],
        category: 'Lecture — décision',
        prompt: 'What does Ms Raman decide at the end?',
        choices: [
          { id: 'A', text: 'To wait for the screens before setting up.' },
          { id: 'B', text: 'To install the printed boards as a precaution.' },
          { id: 'C', text: 'To cancel the team’s participation.' },
          { id: 'D', text: 'To ask Ms Okonkwo to collect the screens.' },
        ],
        answer: 'B',
        explanation:
          "« Let's set up the boards anyway. If the screens arrive we swap them out ». Le mot « anyway » est décisif : elle installe les panneaux MALGRÉ l'annonce des écrans pour 9 h 30. (A) est précisément ce qu'elle refuse de faire.",
      },
    ],
  },
  {
    id: 'p7-06',
    part: 7,
    title: 'Part 7 — passage simple (règlement intérieur)',
    source: 'seed',
    passages: [
      {
        kind: 'notice',
        heading: 'HALVERTON SCIENCE PARK — Visitor and contractor rules',
        body: `All visitors and contractors must report to the main gate on arrival. Photographic identification is required; a driving licence or passport is acceptable, a staff card from another company is not.

Visitors are issued with a green badge and must be accompanied by their host at all times. Contractors receive an orange badge, which allows unaccompanied access to the areas listed on their work permit only.

Badges must be returned to the gate on departure. A charge of 25 euros applies to badges that are not returned by the end of the day on which they were issued.

Deliveries are accepted at the goods entrance on Chapel Lane between 7 a.m. and 3 p.m. Drivers may remain in the loading area for a maximum of thirty minutes. Vehicles left beyond this period may be moved at the owner's expense.

Site speed limit: 15 km/h. Cycling is permitted on the perimeter road but not between buildings.

In the event of an alarm, leave by the nearest exit and go to the assembly point in car park C. Do not return to collect belongings.`,
      },
    ],
    items: [
      {
        id: 'p7-06-q1',
        vocab: [
          { term: "photographic identification", translation: "une pièce d'identité avec photo" },
          { term: "acceptable", translation: "recevable, accepté" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What form of identification is refused?',
        choices: [
          { id: 'A', text: 'A passport.' },
          { id: 'B', text: 'A driving licence.' },
          { id: 'C', text: 'An employee card from another firm.' },
          { id: 'D', text: 'A work permit.' },
        ],
        answer: 'C',
        explanation:
          "« a staff card from another company is not [acceptable] ». La phrase énumère d'abord deux documents acceptés puis un refusé : la négation finale porte tout le sens. Lis les listes jusqu'au bout, le TOEIC place l'exception à la fin.",
      },
      {
        id: 'p7-06-q2',
        vocab: [
          { term: "unaccompanied", translation: "non accompagné, seul" },
          { term: "a work permit", translation: "un permis de travail, une autorisation d'intervention" },
        ],
        category: 'Lecture — comparaison',
        prompt: 'How do orange badges differ from green ones?',
        choices: [
          { id: 'A', text: 'They allow movement without a host in certain areas.' },
          { id: 'B', text: 'They are valid for several days.' },
          { id: 'C', text: 'They do not need to be returned.' },
          { id: 'D', text: 'They give access to the whole site.' },
        ],
        answer: 'A',
        explanation:
          "Vert = « must be accompanied by their host at all times » ; orange = « allows unaccompanied access to the areas listed on their work permit only ». (D) est le piège : l'accès est limité par le permis, pas illimité. Le mot « only » restreint tout.",
      },
      {
        id: 'p7-06-q3',
        vocab: [
          { term: "at the owner's expense", translation: "aux frais du propriétaire" },
          { term: "an assembly point", translation: "un point de rassemblement" },
        ],
        category: 'Lecture — inférence',
        prompt: 'What happens to a vehicle left in the loading area for two hours?',
        choices: [
          { id: 'A', text: 'The driver receives a written warning.' },
          { id: 'B', text: 'It may be removed at a cost to the owner.' },
          { id: 'C', text: 'It is charged 25 euros.' },
          { id: 'D', text: 'It is escorted to car park C.' },
        ],
        answer: 'B',
        explanation:
          "La limite est de trente minutes ; au-delà, « Vehicles… may be moved at the owner's expense ». (C) mélange deux règles : les 25 euros concernent les BADGES non rendus. Ne transporte jamais un chiffre d'un paragraphe à un autre.",
      },
    ],
  },
  {
    id: 'p7-07',
    part: 7,
    title: 'Part 7 — passage double (offre d’emploi + candidature)',
    source: 'seed',
    passages: [
      {
        kind: 'ad',
        heading: 'MERIDIAN TRANSLATIONS — Project Manager (maternity cover, 10 months)',
        body: `Meridian Translations is seeking a project manager to cover a period of maternity leave from 1 February.

The role involves managing translation projects from quotation to delivery, allocating work to our network of freelance translators, and acting as the main contact for eight key accounts.

Essential:
· Three or more years in a language services company
· Fluency in English and one other European language
· Experience with a computer-assisted translation tool

Desirable:
· A second foreign language
· Knowledge of the pharmaceutical or legal sector

The position is based in our Lyon office, with the possibility of two days per week from home after an initial training period of six weeks, during which attendance in the office is required every day.

Applications close on 12 December. Please send a CV and covering letter to hr@meridiantrans.example, quoting reference PM-FEB.`,
      },
      {
        kind: 'email',
        heading: 'From: n.beaumont@mailbox.example | To: hr@meridiantrans.example | 9 December | Subject: Application — reference PM-FEB',
        body: `Dear Sir or Madam,

I am writing to apply for the project manager position advertised on your website.

I have spent the last five years at Solent Language Services in Bristol, where I currently manage a portfolio of twelve clients, most of them in the pharmaceutical industry. I work daily with our translation memory software and have trained two colleagues to use it.

Besides English, I am fluent in French and have a good command of Portuguese, which I studied during two years spent in Lisbon.

I should mention one point regarding timing: I am required to give six weeks' notice, so the earliest I could start is mid-January. I understand from the advertisement that the role begins in February, so I hope this presents no difficulty.

I am relocating to the Lyon area in any case, as my partner has taken a position there, and I am able to attend an interview at short notice.

Yours faithfully,
Nadia Beaumont`,
      },
    ],
    items: [
      {
        id: 'p7-07-q1',
        vocab: [
          { term: "maternity cover", translation: "un remplacement de congé maternité" },
          { term: "a key account", translation: "un compte clé, un client stratégique" },
        ],
        category: 'Lecture — but du document',
        prompt: 'Why is the position available?',
        choices: [
          { id: 'A', text: 'The company is opening a new office.' },
          { id: 'B', text: 'An employee is taking leave.' },
          { id: 'C', text: 'A manager has resigned.' },
          { id: 'D', text: 'Client numbers have increased.' },
        ],
        answer: 'B',
        explanation:
          "« to cover a period of maternity leave » : le poste est un remplacement temporaire, ce que confirme « 10 months » dans le titre. Rien n'indique une démission (C) — ne complète jamais le texte avec une hypothèse plausible.",
      },
      {
        id: 'p7-07-q2',
        vocab: [
          { term: "a computer-assisted translation tool", translation: "un outil de traduction assistée par ordinateur (TAO)" },
          { term: "a translation memory", translation: "une mémoire de traduction" },
        ],
        category: 'Lecture — croisement de documents',
        prompt: 'Which desirable requirement does Ms Beaumont meet?',
        choices: [
          { id: 'A', text: 'Experience in the legal sector.' },
          { id: 'B', text: 'A qualification in translation.' },
          { id: 'C', text: 'Knowledge of the pharmaceutical field.' },
          { id: 'D', text: 'Management of a large team.' },
        ],
        answer: 'C',
        explanation:
          "L'annonce liste « Knowledge of the pharmaceutical or legal sector » en critère souhaité ; l'email précise « twelve clients, most of them in the pharmaceutical industry ». C'est un croisement pur : ni l'un ni l'autre document ne suffit seul.",
      },
      {
        id: 'p7-07-q3',
        vocab: [
          { term: "to give notice", translation: "donner son préavis", example: "I am required to give six weeks' notice." },
          { term: "at short notice", translation: "dans un délai très court, rapidement" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What does Ms Beaumont say about her availability?',
        choices: [
          { id: 'A', text: 'She can begin work immediately.' },
          { id: 'B', text: 'She cannot start before the middle of January.' },
          { id: 'C', text: 'She is only available from March.' },
          { id: 'D', text: 'She needs to work remotely at first.' },
        ],
        answer: 'B',
        explanation:
          "« I am required to give six weeks' notice, so the earliest I could start is mid-January ». Elle prévient d'une contrainte qui, en réalité, ne pose aucun problème puisque le poste commence en février : le TOEIC aime ces fausses difficultés.",
      },
      {
        id: 'p7-07-q4',
        vocab: [
          { term: "a good command of", translation: "une bonne maîtrise de", example: "a good command of Portuguese" },
          { term: "fluency", translation: "l'aisance, la maîtrise courante", note: "Adjectif : fluent in a language." },
        ],
        category: 'Lecture — inférence',
        prompt: 'What can be inferred about Ms Beaumont’s move to Lyon?',
        choices: [
          { id: 'A', text: 'It depends on her getting the job.' },
          { id: 'B', text: 'It will happen regardless of the outcome.' },
          { id: 'C', text: 'The company will pay her relocation costs.' },
          { id: 'D', text: 'She has already bought a house there.' },
        ],
        answer: 'B',
        explanation:
          "« I am relocating to the Lyon area in any case ». La locution « in any case » (de toute façon) rend le déménagement indépendant du recrutement : c'est exactement l'inverse de (A). Une seule expression porte toute la réponse.",
      },
      {
        id: 'p7-07-q5',
        vocab: [
          { term: "an initial training period", translation: "une période de formation initiale" },
          { term: "attendance", translation: "la présence", example: "attendance in the office is required every day" },
        ],
        category: 'Lecture — croisement de documents',
        prompt: 'If hired, when could Ms Beaumont first work from home?',
        choices: [
          { id: 'A', text: 'Immediately after starting.' },
          { id: 'B', text: 'After six weeks in the office.' },
          { id: 'C', text: 'After ten months.' },
          { id: 'D', text: 'Only during the training period.' },
        ],
        answer: 'B',
        explanation:
          "L'annonce précise « two days per week from home after an initial training period of six weeks, during which attendance in the office is required every day ». Attention au piège des deux « six semaines » : celui du préavis dans l'email n'a rien à voir avec celui de la formation.",
      },
    ],
  },
  {
    id: 'p7-08',
    part: 7,
    title: 'Part 7 — passage simple (lettre de réclamation)',
    source: 'seed',
    passages: [
      {
        kind: 'letter',
        heading: 'From: Bellrose Dental Practice, 22 Cheriton Road | To: Customer Services, Aldrin Office Supplies | 3 February',
        body: `Dear Customer Services,

I am writing about our standing order for consumables, account 77-2043.

Since November, three of the four monthly deliveries have arrived incomplete. On each occasion the missing items were the same: the paper towels and the small waste bags. Your delivery notes list them as supplied, which suggests the problem occurs at the packing stage rather than in transit.

I telephoned on 6 December and again on 14 January. Both times I was told the matter would be passed to the warehouse and that someone would call me back. No one has.

I am not asking for a refund. What I need is a delivery that matches the order, since our practice cannot operate without these items and we have twice had to buy them locally at a higher price.

I would be grateful if you could confirm in writing, before the next delivery on 20 February, what has been done to correct this. If the February delivery is also incomplete, I will move the account to another supplier.

Yours faithfully,
Dr Anne Fournier`,
      },
    ],
    items: [
      {
        id: 'p7-08-q1',
        vocab: [
          { term: "a standing order", translation: "une commande permanente, un abonnement de livraison" },
          { term: "consumables", translation: "des consommables" },
        ],
        category: 'Lecture — but du document',
        prompt: 'What is the purpose of the letter?',
        choices: [
          { id: 'A', text: 'To cancel an account.' },
          { id: 'B', text: 'To report repeated delivery errors.' },
          { id: 'C', text: 'To request a price reduction.' },
          { id: 'D', text: 'To change a delivery address.' },
        ],
        answer: 'B',
        explanation:
          "« three of the four monthly deliveries have arrived incomplete ». (A) est un piège : elle MENACE de partir si rien ne change, mais ne résilie pas. Une condition future n'est pas un fait accompli.",
      },
      {
        id: 'p7-08-q2',
        vocab: [
          { term: "a delivery note", translation: "un bon de livraison" },
          { term: "in transit", translation: "en cours d'acheminement" },
        ],
        category: 'Lecture — inférence',
        prompt: 'Where does Dr Fournier believe the problem occurs?',
        choices: [
          { id: 'A', text: 'During transport.' },
          { id: 'B', text: 'In the ordering system.' },
          { id: 'C', text: 'When the goods are packed.' },
          { id: 'D', text: 'At her own reception desk.' },
        ],
        answer: 'C',
        explanation:
          "« the problem occurs at the packing stage rather than in transit ». La structure « X rather than Y » désigne la bonne réponse ET fournit le distracteur (A). Quand tu la vois, note bien lequel des deux termes est retenu.",
      },
      {
        id: 'p7-08-q3',
        vocab: [
          { term: "to be grateful if", translation: "être reconnaissant que", note: "Formule de demande polie et formelle." },
          { term: "in writing", translation: "par écrit" },
        ],
        category: 'Lecture — demande',
        prompt: 'What does Dr Fournier ask the company to do?',
        choices: [
          { id: 'A', text: 'Refund the cost of the missing items.' },
          { id: 'B', text: 'Send a written explanation before 20 February.' },
          { id: 'C', text: 'Telephone her to discuss the account.' },
          { id: 'D', text: 'Deliver the missing goods immediately.' },
        ],
        answer: 'B',
        explanation:
          "« confirm in writing, before the next delivery on 20 February, what has been done ». (A) est explicitement écarté (« I am not asking for a refund ») et (C) est ce qui n'a jamais fonctionné. Le texte élimine lui-même deux distracteurs.",
      },
    ],
  },
  {
    id: 'p7-09',
    part: 7,
    title: 'Part 7 — passage double (programme + email)',
    source: 'seed',
    passages: [
      {
        kind: 'schedule',
        heading: 'ATRIUM LEADERSHIP FORUM — Thursday 15 May, Delmont Hotel',
        body: `09:00–09:30  Registration and coffee — Foyer
09:30–10:15  Opening address: "Leading through uncertainty" — Sofia Renard — Main Hall
10:30–12:00  Workshop A: Difficult conversations — Room 1 (limit 20)
10:30–12:00  Workshop B: Building remote teams — Room 2 (limit 30)
12:00–13:15  Lunch — Terrace restaurant
13:15–14:45  Workshop C: Decision-making under pressure — Room 1 (limit 20)
13:15–14:45  Workshop D: Feedback that works — Room 2 (limit 30)
15:00–16:00  Panel discussion: The four-day week — Main Hall
16:00–16:30  Closing remarks and networking — Foyer

Delegates may attend one morning and one afternoon workshop. Workshops A and C are practical and involve role-play; B and D are discussion-based.`,
      },
      {
        kind: 'email',
        heading: 'From: j.abadi@corliss.example | To: events@atriumforum.example | 2 May | Subject: Registration — three delegates',
        body: `Dear organisers,

I would like to register three people from Corliss Engineering for the forum on 15 May.

For myself and Mr Petrov, please book Workshop B in the morning and Workshop D in the afternoon. Neither of us is comfortable with role-play exercises, so we would prefer to avoid those sessions entirely.

Our third delegate, Ms Halvorsen, would like Workshop A in the morning. For the afternoon she is happy with either session, so please put her wherever there is space.

One question: the panel discussion is listed as finishing at 16:00, but our train leaves at 16:20 from the station near the hotel. Is it acceptable to leave a few minutes before the end of the closing remarks? We do not want to be discourteous.

Finally, Ms Halvorsen follows a gluten-free diet. Could you confirm that the lunch menu can accommodate this?

Best regards,
Jamal Abadi`,
      },
    ],
    items: [
      {
        id: 'p7-09-q1',
        vocab: [
          { term: "a delegate", translation: "un participant, un congressiste" },
          { term: "role-play", translation: "un jeu de rôle", example: "sessions that involve role-play" },
        ],
        category: 'Lecture — croisement de documents',
        prompt: 'Why did Mr Abadi choose Workshops B and D?',
        choices: [
          { id: 'A', text: 'They are the only sessions with places left.' },
          { id: 'B', text: 'They do not involve role-play.' },
          { id: 'C', text: 'They are led by Sofia Renard.' },
          { id: 'D', text: 'They finish earlier than the others.' },
        ],
        answer: 'B',
        explanation:
          "L'email dit « Neither of us is comfortable with role-play » et le programme précise que « Workshops A and C… involve role-play; B and D are discussion-based ». Il faut les deux documents : c'est la question type du passage double.",
      },
      {
        id: 'p7-09-q2',
        vocab: [
          { term: "wherever there is space", translation: "là où il reste de la place" },
          { term: "a limit", translation: "une jauge, un nombre maximal", example: "Room 1 (limit 20)" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is indicated about Ms Halvorsen’s afternoon session?',
        choices: [
          { id: 'A', text: 'She has chosen Workshop C.' },
          { id: 'B', text: 'She will not attend the afternoon.' },
          { id: 'C', text: 'She has no preference.' },
          { id: 'D', text: 'She will join Mr Abadi’s session.' },
        ],
        answer: 'C',
        explanation:
          "« For the afternoon she is happy with either session ». « either » signifie ici « l'un ou l'autre, peu importe » : c'est une absence de préférence, pas un choix. Ce mot est régulièrement mal interprété.",
      },
      {
        id: 'p7-09-q3',
        vocab: [
          { term: "discourteous", translation: "impoli, incorrect", note: "Registre soutenu. Synonyme : rude, impolite." },
          { term: "closing remarks", translation: "le mot de la fin, la clôture" },
        ],
        category: 'Lecture — inférence',
        prompt: 'What is Mr Abadi concerned about?',
        choices: [
          { id: 'A', text: 'Missing the opening address.' },
          { id: 'B', text: 'Leaving the event slightly early.' },
          { id: 'C', text: 'The cost of the registration.' },
          { id: 'D', text: 'Finding the hotel from the station.' },
        ],
        answer: 'B',
        explanation:
          "« Is it acceptable to leave a few minutes before the end of the closing remarks? » Son train part à 16 h 20 alors que la clôture finit à 16 h 30 : le programme confirme le conflit d'horaire qu'il pressent.",
      },
      {
        id: 'p7-09-q4',
        vocab: [
          { term: "to accommodate a diet", translation: "s'adapter à un régime alimentaire" },
          { term: "gluten-free", translation: "sans gluten", note: "Sur le modèle : sugar-free, nut-free, duty-free." },
        ],
        category: 'Lecture — demande',
        prompt: 'What additional request does Mr Abadi make?',
        choices: [
          { id: 'A', text: 'A parking space at the hotel.' },
          { id: 'B', text: 'A copy of the presentation slides.' },
          { id: 'C', text: 'Confirmation about a special meal.' },
          { id: 'D', text: 'An invoice for three delegates.' },
        ],
        answer: 'C',
        explanation:
          "« Ms Halvorsen follows a gluten-free diet. Could you confirm that the lunch menu can accommodate this? » Le mot « Finally » annonce la dernière demande : en Part 7, les marqueurs d'énumération aident à localiser chaque information.",
      },
    ],
  },
  {
    id: 'p7-10',
    part: 7,
    title: 'Part 7 — passage triple (annonce + email + réponse)',
    source: 'seed',
    passages: [
      {
        kind: 'notice',
        heading: 'GRANTLEY MUSEUM — Call for volunteer guides',
        body: `The Grantley Museum is recruiting volunteer guides for the summer season, from 1 June to 15 September.

Guides lead tours of the main collection (45 minutes) and, once experienced, the textile archive (90 minutes). No formal qualifications are needed, but volunteers must attend a training weekend on 10 and 11 May and commit to at least one four-hour shift per week.

In return, volunteers receive free entry to all our exhibitions, a 20 % discount in the museum shop and café, and an invitation to the annual supporters' dinner in October.

Please note: because the textile archive contains light-sensitive material, guides working there must complete an additional half-day handling course, held on the last Friday of each month.

To express interest, email volunteers@grantleymuseum.example by 25 April.`,
      },
      {
        kind: 'email',
        heading: 'From: r.castellanos@mailbox.example | To: volunteers@grantleymuseum.example | 19 April',
        body: `Dear Volunteer Coordinator,

I would like to offer my help as a guide this summer. I retired from teaching history two years ago and have visited the museum regularly since moving to Grantley.

I can commit to two shifts a week, on Tuesdays and Fridays, and I am free for the whole summer apart from the last week of July.

I am particularly interested in the textile archive, as my family worked in the mills for three generations and I have researched the subject in some depth.

There is one difficulty. I am away at my daughter's wedding on the weekend of 10 and 11 May. Is there any alternative arrangement, or should I apply next year instead?

Kind regards,
Rosa Castellanos`,
      },
      {
        kind: 'email',
        heading: 'From: volunteers@grantleymuseum.example | To: r.castellanos@mailbox.example | 22 April',
        body: `Dear Ms Castellanos,

Thank you for your interest — your background sounds very relevant to us.

The May weekend is our only group training, but we can arrange individual training across two weekday afternoons in the week beginning 19 May. Two other applicants are in the same position, so you would not be alone.

Regarding the archive, I should point out that new guides normally spend their first season on the main collection. However, given your knowledge of the mills, I am happy to make an exception provided you attend the handling course. The next available date is Friday 30 May.

Could you confirm both dates by 2 May so that I can book the trainer?

Best wishes,
Duncan Reid`,
      },
    ],
    items: [
      {
        id: 'p7-10-q1',
        vocab: [
          { term: "to commit to", translation: "s'engager à", example: "commit to at least one four-hour shift per week" },
          { term: "a shift", translation: "un créneau, une vacation" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is required of all volunteer guides?',
        choices: [
          { id: 'A', text: 'A formal qualification in history.' },
          { id: 'B', text: 'Attendance at a training weekend.' },
          { id: 'C', text: 'A minimum of two shifts per week.' },
          { id: 'D', text: 'Experience of working in a museum.' },
        ],
        answer: 'B',
        explanation:
          "« volunteers must attend a training weekend on 10 and 11 May ». (A) est explicitement nié (« No formal qualifications are needed ») et (C) déforme le minimum d'UNE vacation. Vérifie les quantités : « at least one » n'est pas « two ».",
      },
      {
        id: 'p7-10-q2',
        vocab: [
          { term: "light-sensitive", translation: "sensible à la lumière" },
          { term: "a handling course", translation: "une formation à la manipulation" },
        ],
        category: 'Lecture — inférence',
        prompt: 'Why is extra training needed for the textile archive?',
        choices: [
          { id: 'A', text: 'The tours there last longer.' },
          { id: 'B', text: 'The items can be damaged by light.' },
          { id: 'C', text: 'The archive is open to the public less often.' },
          { id: 'D', text: 'Visitor numbers are higher there.' },
        ],
        answer: 'B',
        explanation:
          "« because the textile archive contains light-sensitive material ». (A) est vrai (90 minutes contre 45) mais ne constitue pas la RAISON de la formation : une information exacte peut ne pas répondre à la question posée.",
      },
      {
        id: 'p7-10-q3',
        vocab: [
          { term: "an alternative arrangement", translation: "une autre solution, un aménagement" },
          { term: "apart from", translation: "sauf, à l'exception de", example: "free apart from the last week of July" },
        ],
        category: 'Lecture — problème',
        prompt: 'What problem does Ms Castellanos raise?',
        choices: [
          { id: 'A', text: 'She cannot work on Tuesdays.' },
          { id: 'B', text: 'She is unavailable for the training weekend.' },
          { id: 'C', text: 'She lives too far from the museum.' },
          { id: 'D', text: 'She has no experience of guiding.' },
        ],
        answer: 'B',
        explanation:
          "« I am away at my daughter's wedding on the weekend of 10 and 11 May » — soit exactement les dates de la formation obligatoire. Le rapprochement se fait entre deux documents : l'annonce donne les dates, l'email l'indisponibilité.",
      },
      {
        id: 'p7-10-q4',
        vocab: [
          { term: "to make an exception", translation: "faire une exception" },
          { term: "provided (that)", translation: "à condition que", note: "Synonyme : as long as. Introduit une condition." },
        ],
        category: 'Lecture — croisement de documents',
        prompt: 'Why does Mr Reid agree to an exception for Ms Castellanos?',
        choices: [
          { id: 'A', text: 'She can work more shifts than required.' },
          { id: 'B', text: 'She has taught history professionally.' },
          { id: 'C', text: 'She has specialist knowledge of the mills.' },
          { id: 'D', text: 'No other guides are available.' },
        ],
        answer: 'C',
        explanation:
          "« given your knowledge of the mills, I am happy to make an exception ». Sa carrière d'enseignante (B) est mentionnée mais n'est pas le motif invoqué. La locution « given… » introduit la raison exacte : c'est elle qu'il faut suivre.",
      },
      {
        id: 'p7-10-q5',
        vocab: [
          { term: "the week beginning", translation: "la semaine du", note: "Formule administrative britannique, abrégée « w/b »." },
          { term: "to book a trainer", translation: "réserver un formateur" },
        ],
        category: 'Lecture — croisement de documents',
        prompt: 'What must Ms Castellanos confirm by 2 May?',
        choices: [
          { id: 'A', text: 'Her attendance on 10 and 11 May.' },
          { id: 'B', text: 'The individual training and the handling course.' },
          { id: 'C', text: 'Her shift pattern for the whole summer.' },
          { id: 'D', text: 'Her interest in the supporters’ dinner.' },
        ],
        answer: 'B',
        explanation:
          "« Could you confirm both dates » renvoie aux deux dates que Duncan Reid vient de proposer : la formation individuelle (semaine du 19 mai) et le cours de manipulation (30 mai). Le mot « both » impose de remonter aux deux paragraphes précédents.",
      },
    ],
  },
  {
    id: 'p7-11',
    part: 7,
    title: 'Part 7 — passage simple (email interne)',
    source: 'seed',
    passages: [
      {
        kind: 'email',
        heading: 'To: All Kestrel Analytics staff | From: Operations | 14 March | Subject: Printing changes from 1 April',
        body: `Colleagues,

From 1 April, all printing will go through the four multifunction devices on each floor. The individual desktop printers will be collected during the week of 7 April.

The reason is straightforward. An audit last autumn found that we print around 1.1 million pages a year, and that just under a third of those pages are never collected from the tray. Desktop printers make this easy to do and difficult to measure.

The new devices hold your job until you tap your badge, so nothing prints unless you are standing there. Colour printing remains available but must be selected each time; the default for every device is black and white, double-sided.

We are not setting page quotas and there will be no reporting on individual usage. This is about waste, not surveillance.

If your role genuinely requires a dedicated printer — for example if you print confidential medical records — email operations@kestrelanalytics.example before 25 March with a short explanation, and we will look at each case individually.

Thank you,
Operations`,
      },
    ],
    items: [
      {
        id: 'p7-11-q1',
        vocab: [
          { term: "a multifunction device", translation: "un copieur multifonction" },
          { term: "straightforward", translation: "simple, sans détour", example: "The reason is straightforward." },
        ],
        category: 'Lecture — but du document',
        prompt: 'What is the main purpose of the email?',
        choices: [
          { id: 'A', text: 'To announce a change to printing arrangements.' },
          { id: 'B', text: 'To report the results of a financial audit.' },
          { id: 'C', text: 'To introduce limits on paper use.' },
          { id: 'D', text: 'To request volunteers for a pilot scheme.' },
        ],
        answer: 'A',
        explanation:
          "« From 1 April, all printing will go through the four multifunction devices ». (C) est démenti plus bas : « We are not setting page quotas ». Le texte anticipe l'objection et la nie — lis jusqu'au bout avant de choisir.",
      },
      {
        id: 'p7-11-q2',
        vocab: [
          { term: "a tray", translation: "un bac (d'imprimante)" },
          { term: "just under a third", translation: "un peu moins d'un tiers" },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What did the audit reveal?',
        choices: [
          { id: 'A', text: 'Colour printing costs more than expected.' },
          { id: 'B', text: 'Many printed pages are never picked up.' },
          { id: 'C', text: 'Desktop printers break down frequently.' },
          { id: 'D', text: 'Printing volumes have doubled.' },
        ],
        answer: 'B',
        explanation:
          "« just under a third of those pages are never collected from the tray ». Cette proportion justifie toute la réforme : quand un chiffre est mis en avant dans un email interne, une question porte presque toujours dessus.",
      },
      {
        id: 'p7-11-q3',
        vocab: [
          { term: "a default setting", translation: "un réglage par défaut" },
          { term: "double-sided", translation: "recto verso", note: "Aussi : duplex printing." },
        ],
        category: 'Lecture — inférence',
        prompt: 'What is suggested about colour printing?',
        choices: [
          { id: 'A', text: 'It will no longer be possible.' },
          { id: 'B', text: 'It requires manager approval.' },
          { id: 'C', text: 'It must be chosen deliberately each time.' },
          { id: 'D', text: 'It is limited to certain departments.' },
        ],
        answer: 'C',
        explanation:
          "« Colour printing remains available but must be selected each time; the default… is black and white ». (A) est le distracteur naturel : « remains available » l'exclut. Un changement de réglage par défaut n'est pas une interdiction.",
      },
      {
        id: 'p7-11-q4',
        vocab: [
          { term: "a dedicated printer", translation: "une imprimante attitrée, dédiée" },
          { term: "on a case-by-case basis", translation: "au cas par cas", example: "we will look at each case individually" },
        ],
        category: 'Lecture — démarche possible',
        prompt: 'What should employees with special needs do?',
        choices: [
          { id: 'A', text: 'Keep their desktop printer until April.' },
          { id: 'B', text: 'Write to Operations before 25 March.' },
          { id: 'C', text: 'Speak to their line manager.' },
          { id: 'D', text: 'Complete an online form.' },
        ],
        answer: 'B',
        explanation:
          "« email operations@kestrelanalytics.example before 25 March with a short explanation ». Trois dates circulent dans le texte (1er avril, 7 avril, 25 mars) : associe chaque date à son action avant de répondre.",
      },
    ],
  },
  {
    id: 'p7-12',
    part: 7,
    title: 'Part 7 — passage simple (compte rendu de réunion)',
    source: 'seed',
    passages: [
      {
        kind: 'memo',
        heading: 'MINUTES — Vendée Nautic, production meeting, 6 October | Present: L. Bruneau (chair), K. Ito, M. Sassi, P. Delcourt',
        body: `1. Hull moulding delays
K. Ito reported that the September output was 34 hulls against a target of 45. The shortfall is due to the curing time of the new resin, which is two hours longer than the previous formulation. The supplier has confirmed this is normal and cannot be reduced.
Action: K. Ito to obtain quotations for a second curing oven by 20 October.

2. Winter orders
M. Sassi noted that eleven of the fifteen winter orders are for the 8.5-metre model, which uses the same mould as the 9-metre. Switching between the two costs half a day each time.
Action: production to be grouped by model rather than by order date, from November.

3. Apprentice recruitment
Two apprentices will join the laminating team in January. P. Delcourt raised the question of who will supervise them, as the senior laminator retires in December.
Action: L. Bruneau to discuss internal promotion with HR before the next meeting. No external recruitment at this stage.

4. Any other business
The staff car park will be resurfaced during the Christmas shutdown. No disruption to production is expected.

Next meeting: 3 November, 14:00, meeting room 2.`,
      },
    ],
    items: [
      {
        id: 'p7-12-q1',
        vocab: [
          { term: "a shortfall", translation: "un déficit, un manque", example: "The shortfall is due to the curing time." },
          { term: "curing time", translation: "le temps de durcissement, de séchage" },
        ],
        category: 'Lecture — cause',
        prompt: 'Why was production below target in September?',
        choices: [
          { id: 'A', text: 'A machine was out of service.' },
          { id: 'B', text: 'A new material takes longer to set.' },
          { id: 'C', text: 'Several employees were absent.' },
          { id: 'D', text: 'A supplier delivered late.' },
        ],
        answer: 'B',
        explanation:
          "« The shortfall is due to the curing time of the new resin, which is two hours longer ». (D) est tentant car un fournisseur est mentionné — mais il confirme seulement que le délai est normal. Le rôle d'un acteur n'en fait pas la cause.",
      },
      {
        id: 'p7-12-q2',
        vocab: [
          { term: "a mould", translation: "un moule", note: "US : a mold. Verbe : to mould = mouler." },
          { term: "to group by", translation: "regrouper par", example: "production to be grouped by model" },
        ],
        category: 'Lecture — décision',
        prompt: 'What change will be made from November?',
        choices: [
          { id: 'A', text: 'Orders will be produced in the order received.' },
          { id: 'B', text: 'Two models will be discontinued.' },
          { id: 'C', text: 'Similar models will be produced together.' },
          { id: 'D', text: 'A second mould will be purchased.' },
        ],
        answer: 'C',
        explanation:
          "« production to be grouped by model rather than by order date ». La logique est donnée juste avant : changer de moule coûte une demi-journée. (A) décrit précisément la pratique ABANDONNÉE — encore une fois, « rather than » fournit le piège.",
      },
      {
        id: 'p7-12-q3',
        vocab: [
          { term: "to supervise", translation: "encadrer, superviser" },
          { term: "internal promotion", translation: "une promotion interne" },
        ],
        category: 'Lecture — inférence',
        prompt: 'What is implied about the supervisor position?',
        choices: [
          { id: 'A', text: 'It will be filled from within the company.' },
          { id: 'B', text: 'It will be advertised externally in December.' },
          { id: 'C', text: 'It will be shared between two apprentices.' },
          { id: 'D', text: 'It will remain vacant until January.' },
        ],
        answer: 'A',
        explanation:
          "« L. Bruneau to discuss internal promotion with HR… No external recruitment at this stage ». Les deux phrases se complètent : l'une ouvre une piste, l'autre en ferme une. (B) est explicitement exclu.",
      },
      {
        id: 'p7-12-q4',
        vocab: [
          { term: "a shutdown", translation: "une fermeture, un arrêt d'activité", example: "during the Christmas shutdown" },
          { term: "disruption", translation: "une perturbation", note: "to disrupt = perturber." },
        ],
        category: 'Lecture — information ciblée',
        prompt: 'What is stated about the car park work?',
        choices: [
          { id: 'A', text: 'It will delay several winter orders.' },
          { id: 'B', text: 'It will take place while the site is closed.' },
          { id: 'C', text: 'It has been postponed until next year.' },
          { id: 'D', text: 'It will be discussed at the next meeting.' },
        ],
        answer: 'B',
        explanation:
          "« resurfaced during the Christmas shutdown. No disruption to production is expected ». La rubrique « Any other business » regroupe les points mineurs d'un compte rendu — elle porte tout de même une question, ne la survole pas.",
      },
    ],
  },
];
