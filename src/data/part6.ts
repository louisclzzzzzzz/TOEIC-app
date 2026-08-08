/**
 * Part 6 — Text Completion.
 *
 * Voir `questions.ts` pour les conventions de rédaction communes.
 */

import type { QuestionSet } from '../types';

export const PART6: QuestionSet[] = [
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
  {
    id: 'p6-02',
    part: 6,
    title: 'Part 6 — avis de travaux',
    source: 'seed',
    passages: [
      {
        kind: 'notice',
        heading: 'NOTICE TO ALL TENANTS — Lift modernisation',
        body: `The main lift in Kestrel House will be out of service from Monday 6 April ___(1)___ Friday 17 April while the control system is replaced.

During this period, the service lift at the rear of the building will be available to all tenants. Because it is smaller, we ask that you ___(2)___ it for deliveries and heavy items only between 9 a.m. and 11 a.m.

___(3)___ Anyone who has difficulty using the stairs should contact the building manager, who will arrange assistance.

We understand that this work is ___(4)___, but the new system will be considerably faster and much quieter than the current one. Thank you for your patience.`,
      },
    ],
    items: [
      {
        id: 'p6-02-q1',
        vocab: [
          { term: "from … until / to", translation: "du … au", note: "« from X until Y » encadre une période continue." },
          { term: "out of service", translation: "hors service", example: "The lift will be out of service." },
        ],
        category: 'Texte à trous — préposition',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'until' },
          { id: 'B', text: 'since' },
          { id: 'C', text: 'during' },
          { id: 'D', text: 'by' },
        ],
        answer: 'A',
        explanation:
          "« from Monday 6 April until Friday 17 April » : le couple from … until délimite une période. « since » exige un point de départ dans le passé, « by » une échéance ponctuelle. La présence de « from » avant le trou impose la réponse.",
      },
      {
        id: 'p6-02-q2',
        vocab: [
          { term: "we ask that you + base verbale", translation: "nous vous demandons de", note: "Subjonctif : pas de « s » à la 3e personne après « ask that »." },
          { term: "a service lift", translation: "un monte-charge" },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (2)',
        choices: [
          { id: 'A', text: 'uses' },
          { id: 'B', text: 'using' },
          { id: 'C', text: 'use' },
          { id: 'D', text: 'to use' },
        ],
        answer: 'C',
        explanation:
          "Après « we ask / request / recommend / insist THAT », l'anglais emploie le subjonctif, c'est-à-dire la BASE VERBALE sans accord : « that you use », « that he use ». Cette construction formelle est fréquente dans les avis officiels.",
      },
      {
        id: 'p6-02-q3',
        vocab: [
          { term: "a stairwell", translation: "une cage d'escalier" },
          { term: "to be signposted", translation: "être fléché, indiqué" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (3) — phrase à insérer',
        choices: [
          { id: 'A', text: 'The rear stairwell will remain lit and signposted at all times.' },
          { id: 'B', text: 'Parking spaces must be vacated before the end of the month.' },
          { id: 'C', text: 'The new lift will be installed by an external contractor.' },
          { id: 'D', text: 'Tenants are reminded to recycle cardboard packaging.' },
        ],
        answer: 'A',
        explanation:
          "La phrase suivante parle des personnes qui ont du mal à emprunter les ESCALIERS. Il faut donc une phrase qui introduise ce sujet : (A) enchaîne logiquement. Méthode d'insertion : identifie le thème de la phrase qui SUIT le trou, la bonne réponse le prépare.",
      },
      {
        id: 'p6-02-q4',
        vocab: [
          { term: "inconvenient", translation: "gênant, peu pratique", note: "Nom : an inconvenience (un désagrément)." },
          { term: "considerably", translation: "nettement, considérablement" },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'affordable' },
          { id: 'B', text: 'inconvenient' },
          { id: 'C', text: 'temporary' },
          { id: 'D', text: 'confidential' },
        ],
        answer: 'B',
        explanation:
          "Le « but » qui suit annonce une compensation (« the new system will be faster and quieter ») : le trou doit donc porter un sens NÉGATIF. « inconvenient » = gênant. Repère la structure « We understand that… , but… » : elle oppose un inconvénient à un bénéfice.",
      },
    ],
  },
  {
    id: 'p6-03',
    part: 6,
    title: 'Part 6 — note de service (télétravail)',
    source: 'seed',
    passages: [
      {
        kind: 'memo',
        heading: 'MEMO — To: All departments | From: Human Resources | Subject: Hybrid working from September',
        body: `Following the pilot that ran between March and June, the executive team has decided to make hybrid working permanent. From 1 September, most employees ___(1)___ to work from home up to three days a week.

Teams whose roles require them to be on site — reception, laboratory and maintenance staff — are not covered by this arrangement. ___(2)___

Managers are asked to agree a written pattern with each team member before 20 August. Once agreed, the pattern should be ___(3)___ into the shared calendar so that colleagues can see who is in the office on any given day.

We will review the arrangement after six months and adjust it ___(4)___ necessary. Questions should be directed to your HR business partner.`,
      },
    ],
    items: [
      {
        id: 'p6-03-q1',
        vocab: [
          { term: "to be entitled to", translation: "avoir le droit de, être autorisé à", note: "Suivi de TO + base verbale." },
          { term: "hybrid working", translation: "le travail hybride", note: "Mélange présentiel / télétravail." },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'entitle' },
          { id: 'B', text: 'will be entitled' },
          { id: 'C', text: 'entitling' },
          { id: 'D', text: 'have entitled' },
        ],
        answer: 'B',
        explanation:
          "« From 1 September » projette dans le FUTUR, et les employés SUBISSENT le droit accordé → futur passif « will be entitled to ». Deux indices convergent : la date future et le fait que le sujet ne réalise pas l'action.",
      },
      {
        id: 'p6-03-q2',
        vocab: [
          { term: "on site", translation: "sur place, sur site", note: "Contraire : off site, remotely." },
          { term: "an arrangement", translation: "un dispositif, une organisation" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (2) — phrase à insérer',
        choices: [
          { id: 'A', text: 'All staff must complete the online security course by July.' },
          { id: 'B', text: 'Their line managers will discuss alternative flexible options with them.' },
          { id: 'C', text: 'The pilot involved forty volunteers from three departments.' },
          { id: 'D', text: 'Office furniture will be replaced during the summer break.' },
        ],
        answer: 'B',
        explanation:
          "La phrase précédente indique que certaines équipes sont EXCLUES du dispositif. La suite logique est de dire ce qui leur est proposé à la place : (B). (C) est plausible sur le fond mais reviendrait en arrière, alors que le paragraphe traite des exceptions.",
      },
      {
        id: 'p6-03-q3',
        vocab: [
          { term: "to enter data into", translation: "saisir des données dans", example: "entered into the shared calendar" },
          { term: "a shared calendar", translation: "un agenda partagé" },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (3)',
        choices: [
          { id: 'A', text: 'entered' },
          { id: 'B', text: 'entering' },
          { id: 'C', text: 'entry' },
          { id: 'D', text: 'enters' },
        ],
        answer: 'A',
        explanation:
          "« should be ___ into the calendar » : après « be », il faut un PARTICIPE PASSÉ pour former le passif. Le rythme de travail est saisi par quelqu'un, il ne saisit rien lui-même. Structure : modal + be + participe passé.",
      },
      {
        id: 'p6-03-q4',
        vocab: [
          { term: "as necessary", translation: "si nécessaire, au besoin", note: "Ellipse de « as it is necessary ». Formule figée." },
          { term: "to review an arrangement", translation: "réexaminer un dispositif" },
        ],
        category: 'Texte à trous — grammaire',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'so' },
          { id: 'B', text: 'as' },
          { id: 'C', text: 'very' },
          { id: 'D', text: 'much' },
        ],
        answer: 'B',
        explanation:
          "« adjust it as necessary » = l'ajuster autant que de besoin. « as necessary », « as required », « as appropriate » sont des ellipses figées du registre administratif : apprends-les en bloc, elles reviennent souvent en Part 6.",
      },
    ],
  },
  {
    id: 'p6-04',
    part: 6,
    title: 'Part 6 — email commercial (retard fournisseur)',
    source: 'seed',
    passages: [
      {
        kind: 'email',
        heading: 'To: purchasing@havelock.example | From: orders@bramleyparts.example | Subject: Order BP-8842',
        body: `Dear Ms Whitfield,

Thank you for your order of 3 October. I am writing to let you know that ten of the twenty-four valves you ordered are currently ___(1)___ stock.

Our supplier has confirmed that the remaining units will reach our warehouse on 21 October. ___(2)___ We can either send the fourteen available valves immediately and the rest later, or hold the whole order until the twenty-first.

Please let me know ___(3)___ option you prefer. If we do not hear from you by Friday, we will send the partial shipment, as most customers find this more practical.

We are sorry for the delay and have ___(4)___ the express delivery charge from your invoice.

Kind regards,
Owen Bramley`,
      },
    ],
    items: [
      {
        id: 'p6-04-q1',
        vocab: [
          { term: "out of stock", translation: "en rupture de stock", note: "Contraire : in stock. Ne pas dire « without stock »." },
          { term: "a valve", translation: "une vanne, une soupape" },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'out of' },
          { id: 'B', text: 'without' },
          { id: 'C', text: 'off' },
          { id: 'D', text: 'lacking' },
        ],
        answer: 'A',
        explanation:
          "« out of stock » est l'expression figée pour « en rupture de stock ». Le reste du message confirme : seules 14 des 24 pièces sont disponibles. Aucune des autres options ne se combine avec « stock » en anglais.",
      },
      {
        id: 'p6-04-q2',
        vocab: [
          { term: "a partial shipment", translation: "une expédition partielle" },
          { term: "to hold an order", translation: "bloquer, mettre en attente une commande" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (2) — phrase à insérer',
        choices: [
          { id: 'A', text: 'Your account has been suspended pending payment.' },
          { id: 'B', text: 'This gives you two possibilities.' },
          { id: 'C', text: 'We no longer supply this type of component.' },
          { id: 'D', text: 'The valves are manufactured in three different sizes.' },
        ],
        answer: 'B',
        explanation:
          "La phrase suivante commence par « We can either… or… » : elle présente deux options. Le trou doit donc les ANNONCER. (C) contredirait tout le message, qui propose justement de livrer. Cherche toujours la cohérence avec ce qui suit.",
      },
      {
        id: 'p6-04-q3',
        vocab: [
          { term: "which + nom", translation: "quel, lequel (parmi un choix limité)", note: "« which option » : choix fermé ; « what » serait ouvert." },
          { term: "to let someone know", translation: "faire savoir à qqn, tenir au courant" },
        ],
        category: 'Texte à trous — grammaire',
        prompt: 'Trou (3)',
        choices: [
          { id: 'A', text: 'what' },
          { id: 'B', text: 'which' },
          { id: 'C', text: 'that' },
          { id: 'D', text: 'whose' },
        ],
        answer: 'B',
        explanation:
          "Deux options précises viennent d'être proposées : le choix est FERMÉ, donc « which option ». « what » s'emploie quand les possibilités ne sont pas énumérées. Cette nuance which/what est régulièrement testée.",
      },
      {
        id: 'p6-04-q4',
        vocab: [
          { term: "to remove a charge", translation: "retirer, annuler des frais", example: "we have removed the express delivery charge" },
          { term: "an invoice", translation: "une facture" },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'added' },
          { id: 'B', text: 'increased' },
          { id: 'C', text: 'removed' },
          { id: 'D', text: 'confirmed' },
        ],
        answer: 'C',
        explanation:
          "Le geste suit des excuses (« We are sorry for the delay ») : il doit être favorable au client, donc « removed » (retiré des frais). (A) et (B) iraient dans le sens contraire. Le ton de la phrase précédente oriente le choix du verbe.",
      },
    ],
  },
  {
    id: 'p6-05',
    part: 6,
    title: 'Part 6 — offre d’emploi',
    source: 'seed',
    passages: [
      {
        kind: 'ad',
        heading: 'VACANCY — Logistics Coordinator, Nantes site',
        body: `Delmar Foods is looking for a logistics coordinator to join our Nantes distribution centre. The successful candidate ___(1)___ the daily movement of goods between our three warehouses and coordinate a team of six drivers.

We are looking for someone with at least three years' experience in a similar role, strong spoken English, and a good working ___(2)___ of warehouse management software.

___(3)___ Full training on our internal systems will be provided during the first month.

The position is permanent and full-time, with a salary ___(4)___ on experience. To apply, send a CV and a short covering letter to recruitment@delmarfoods.example before 30 November. Interviews will be held during the first week of December.`,
      },
    ],
    items: [
      {
        id: 'p6-05-q1',
        vocab: [
          { term: "to oversee", translation: "superviser, encadrer", note: "Ne pas confondre avec « to overlook » = négliger, omettre." },
          { term: "the successful candidate", translation: "le candidat retenu", note: "Formule standard des offres d'emploi." },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'overseeing' },
          { id: 'B', text: 'will oversee' },
          { id: 'C', text: 'has overseen' },
          { id: 'D', text: 'to oversee' },
        ],
        answer: 'B',
        explanation:
          "La phrase parle du futur titulaire du poste → futur « will oversee ». Le second verbe « coordinate » confirme : il est coordonné au premier sans « to », donc les deux dépendent du même « will ». Vérifie toujours les verbes coordonnés par « and ».",
      },
      {
        id: 'p6-05-q2',
        vocab: [
          { term: "a working knowledge of", translation: "une maîtrise pratique de", note: "Collocation figée dans les offres d'emploi." },
          { term: "spoken English", translation: "l'anglais oral", note: "Opposé : written English." },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (2)',
        choices: [
          { id: 'A', text: 'knowledge' },
          { id: 'B', text: 'known' },
          { id: 'C', text: 'knowing' },
          { id: 'D', text: 'knowledgeable' },
        ],
        answer: 'A',
        explanation:
          "« a good working knowledge of » = une maîtrise pratique de. Après l'article « a » et deux adjectifs, il faut un NOM. La collocation complète vaut la peine d'être mémorisée telle quelle : elle figure dans presque toutes les annonces.",
      },
      {
        id: 'p6-05-q3',
        vocab: [
          { term: "essential / desirable", translation: "exigé / souhaité", note: "Vocabulaire des offres d'emploi pour classer les critères." },
          { term: "a forklift licence", translation: "un permis cariste (chariot élévateur)" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (3) — phrase à insérer',
        choices: [
          { id: 'A', text: 'A forklift licence is desirable but not essential.' },
          { id: 'B', text: 'The distribution centre opened eleven years ago.' },
          { id: 'C', text: 'Delmar Foods exports to more than twenty countries.' },
          { id: 'D', text: 'Our canteen serves hot meals until three in the afternoon.' },
        ],
        answer: 'A',
        explanation:
          "Le paragraphe précédent liste les compétences requises et la phrase suivante parle de la FORMATION fournie. (A) fait le pont : un critère souhaitable qui n'est pas bloquant, précisément parce qu'une formation suivra. Les autres options sortent du sujet des qualifications.",
      },
      {
        id: 'p6-05-q4',
        vocab: [
          { term: "depending on experience", translation: "selon l'expérience", note: "Formule figée des annonces, souvent abrégée « DOE »." },
          { term: "a covering letter", translation: "une lettre de motivation", note: "US : a cover letter." },
        ],
        category: 'Texte à trous — grammaire',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'depend' },
          { id: 'B', text: 'depends' },
          { id: 'C', text: 'depending' },
          { id: 'D', text: 'depended' },
        ],
        answer: 'C',
        explanation:
          "« a salary depending on experience » : participe présent en fonction d'adjectif, équivalent de « which depends on experience ». La proposition a déjà son verbe (« is permanent »), donc pas de verbe conjugué supplémentaire.",
      },
    ],
  },
  {
    id: 'p6-06',
    part: 6,
    title: 'Part 6 — article (ouverture d’un centre)',
    source: 'seed',
    passages: [
      {
        kind: 'article',
        heading: 'Local business — Training centre opens in Belfort',
        body: `A new technical training centre opened last week in Belfort, ___(1)___ around forty apprentices in their first year.

The centre, funded jointly by four regional manufacturers, offers two-year programmes in welding, machining and industrial maintenance. Its director, Camille Roussel, said the aim was to address a shortage that local firms have faced ___(2)___ more than a decade.

"Every one of our partner companies has vacancies they cannot fill," she explained. "___(3)___"

Applications for the September intake open in April. Candidates must be at least seventeen and will be selected ___(4)___ a practical test rather than on school results alone.`,
      },
    ],
    items: [
      {
        id: 'p6-06-q1',
        vocab: [
          { term: "an apprentice", translation: "un apprenti, un alternant" },
          { term: "to welcome", translation: "accueillir", example: "welcoming forty apprentices" },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'welcomes' },
          { id: 'B', text: 'welcomed' },
          { id: 'C', text: 'welcoming' },
          { id: 'D', text: 'to welcome' },
        ],
        answer: 'C',
        explanation:
          "Après une virgule, un participe présent introduit une action simultanée : « opened…, welcoming forty apprentices ». La proposition principale a déjà son verbe (« opened »), donc pas de second verbe conjugué. Cette structure est très fréquente dans la presse.",
      },
      {
        id: 'p6-06-q2',
        vocab: [
          { term: "for + durée", translation: "depuis (une durée)", note: "for a decade = depuis dix ans ; since 2014 = depuis 2014." },
          { term: "a shortage", translation: "une pénurie", example: "a shortage of qualified workers" },
        ],
        category: 'Texte à trous — préposition',
        prompt: 'Trou (2)',
        choices: [
          { id: 'A', text: 'since' },
          { id: 'B', text: 'for' },
          { id: 'C', text: 'during' },
          { id: 'D', text: 'from' },
        ],
        answer: 'B',
        explanation:
          "« more than a decade » exprime une DURÉE, donc « for ». « since » demanderait un point de départ daté (since 2014). Cette paire for/since est l'un des points les plus rentables de la Part 5 et 6 : durée ⇒ for, date ⇒ since.",
      },
      {
        id: 'p6-06-q3',
        vocab: [
          { term: "a vacancy", translation: "un poste vacant", example: "vacancies they cannot fill" },
          { term: "to fill a position", translation: "pourvoir un poste" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (3) — phrase à insérer',
        choices: [
          { id: 'A', text: 'The building was previously a furniture warehouse.' },
          { id: 'B', text: 'We expect most of these students to be hired before they finish.' },
          { id: 'C', text: 'Tuition fees will rise by three percent next year.' },
          { id: 'D', text: 'The region has excellent rail connections to Paris.' },
        ],
        answer: 'B',
        explanation:
          "Le trou se trouve DANS une citation, juste après « Every one of our partner companies has vacancies they cannot fill ». La suite naturelle est la conséquence pour les étudiants : (B). Vérifie toujours qui parle : une phrase insérée dans des guillemets doit garder la voix du locuteur (« we »).",
      },
      {
        id: 'p6-06-q4',
        vocab: [
          { term: "on the basis of", translation: "sur la base de", note: "Ici abrégé en « on a practical test »." },
          { term: "an intake", translation: "une promotion, une rentrée", example: "the September intake" },
        ],
        category: 'Texte à trous — préposition',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'on' },
          { id: 'B', text: 'in' },
          { id: 'C', text: 'for' },
          { id: 'D', text: 'at' },
        ],
        answer: 'A',
        explanation:
          "« selected ON a practical test rather than ON school results » : la préposition est confirmée par le second membre de la phrase, déjà écrit. Astuce Part 6 : quand une structure parallèle existe (« rather than… »), copie la préposition qui y figure.",
      },
    ],
  },
  {
    id: 'p6-07',
    part: 6,
    title: 'Part 6 — lettre client (programme de fidélité)',
    source: 'seed',
    passages: [
      {
        kind: 'letter',
        heading: 'Coleridge Books | 14 Aldgate Row, Norwich | 8 January',
        body: `Dear Mr Iyer,

As one of our longest-standing customers, you ___(1)___ to hear that our loyalty programme is changing this spring.

From 1 March, members will earn one point for every pound spent, instead of one point for every two pounds. Points can be exchanged for vouchers ___(2)___ any of our six shops or on our website.

___(3)___ Your existing points will be transferred automatically, and nothing will be lost in the change.

If you would prefer not to remain in the programme, you may withdraw at any time by replying to this letter or by speaking to a member of staff. ___(4)___, we hope you will stay with us.

Yours sincerely,
Marion Coleridge`,
      },
    ],
    items: [
      {
        id: 'p6-07-q1',
        vocab: [
          { term: "longest-standing", translation: "le plus ancien, de longue date", example: "one of our longest-standing customers" },
          { term: "to be pleased to", translation: "avoir le plaisir de" },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'are pleasing' },
          { id: 'B', text: 'will be pleased' },
          { id: 'C', text: 'have pleased' },
          { id: 'D', text: 'pleased' },
        ],
        answer: 'B',
        explanation:
          "« you will be pleased to hear that… » est la formule figée pour annoncer une bonne nouvelle dans une lettre commerciale. Note la forme en -ED : c'est le client qui RESSENT le plaisir, la nouvelle serait « pleasing ».",
      },
      {
        id: 'p6-07-q2',
        vocab: [
          { term: "a voucher", translation: "un bon d'achat, un coupon", note: "US : a gift certificate / a coupon." },
          { term: "to exchange something for", translation: "échanger qqch contre" },
        ],
        category: 'Texte à trous — préposition',
        prompt: 'Trou (2)',
        choices: [
          { id: 'A', text: 'at' },
          { id: 'B', text: 'on' },
          { id: 'C', text: 'to' },
          { id: 'D', text: 'by' },
        ],
        answer: 'A',
        explanation:
          "« at any of our six shops » : « at » situe un point de vente précis. La suite « or on our website » confirme l'opposition physique/en ligne — on est AT un magasin, ON un site web. Deux prépositions, deux univers.",
      },
      {
        id: 'p6-07-q3',
        vocab: [
          { term: "to take no action", translation: "n'avoir aucune démarche à faire", example: "You do not need to take any action." },
          { term: "to be transferred automatically", translation: "être transféré automatiquement" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (3) — phrase à insérer',
        choices: [
          { id: 'A', text: 'You do not need to take any action.' },
          { id: 'B', text: 'Please return your old card to the nearest branch.' },
          { id: 'C', text: 'The Norwich shop will close for refurbishment in April.' },
          { id: 'D', text: 'New members must pay a small joining fee.' },
        ],
        answer: 'A',
        explanation:
          "La phrase suivante précise que « Your existing points will be transferred automatically » : le trou doit donc rassurer le client sur le fait qu'il n'a rien à faire. (B) dirait exactement le contraire. Une phrase insérée ne doit jamais contredire son voisinage immédiat.",
      },
      {
        id: 'p6-07-q4',
        vocab: [
          { term: "Naturally / Of course", translation: "Bien entendu", note: "Adverbe de liaison qui adoucit une phrase commerciale." },
          { term: "to withdraw", translation: "se retirer, se désinscrire", example: "you may withdraw at any time" },
        ],
        category: 'Texte à trous — connecteur',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'Therefore' },
          { id: 'B', text: 'Naturally' },
          { id: 'C', text: 'For example' },
          { id: 'D', text: 'In addition' },
        ],
        answer: 'B',
        explanation:
          "La phrase précédente offre la possibilité de partir ; celle-ci exprime le souhait contraire. « Naturally » (bien entendu) atténue et enchaîne poliment. « Therefore » marquerait une conséquence logique, ce qui n'a aucun sens ici.",
      },
    ],
  },
  {
    id: 'p6-08',
    part: 6,
    title: 'Part 6 — email (invitation à un salon)',
    source: 'seed',
    passages: [
      {
        kind: 'email',
        heading: 'To: partners@list.arvent.example | From: events@arvent.example | Subject: Arvent Expo — 12–13 October',
        body: `Dear partners,

We are delighted to invite you to the eighth Arvent Expo, which ___(1)___ place at the Vasari Centre in Turin on 12 and 13 October.

This year's programme focuses on energy efficiency in mid-sized plants. Alongside the exhibition, there will be twelve technical sessions, and we have ___(2)___ engineers from four countries to present case studies from their own sites.

___(3)___ Registration closes on 26 September, and places at the technical sessions are allocated in the order requests are received.

Travel is not included, but we have negotiated a reduced rate at two hotels near the venue. Details ___(4)___ in the attached document.

We look forward to seeing you in Turin.

The Arvent events team`,
      },
    ],
    items: [
      {
        id: 'p6-08-q1',
        vocab: [
          { term: "to take place", translation: "avoir lieu, se dérouler", note: "Collocation figée : take place, jamais « have place »." },
          { term: "a venue", translation: "un lieu d'événement" },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (1)',
        choices: [
          { id: 'A', text: 'takes' },
          { id: 'B', text: 'taking' },
          { id: 'C', text: 'taken' },
          { id: 'D', text: 'to take' },
        ],
        answer: 'A',
        explanation:
          "La relative « which ___ place » a besoin d'un verbe CONJUGUÉ, et le présent s'emploie couramment pour un événement programmé (« the expo takes place on 12 October »). Note la collocation : take place, et non « have place ».",
      },
      {
        id: 'p6-08-q2',
        vocab: [
          { term: "to invite someone to do", translation: "inviter qqn à faire", note: "Structure : invite + COD + TO + base verbale." },
          { term: "a case study", translation: "une étude de cas" },
        ],
        category: 'Texte à trous — vocabulaire',
        prompt: 'Trou (2)',
        choices: [
          { id: 'A', text: 'refused' },
          { id: 'B', text: 'invited' },
          { id: 'C', text: 'reminded' },
          { id: 'D', text: 'complained' },
        ],
        answer: 'B',
        explanation:
          "« we have invited engineers… to present case studies » : seul « invited » se construit avec cette structure et convient au sens. Vérifie toujours la compatibilité grammaticale ET sémantique : « complained » ne peut pas prendre de COD ici.",
      },
      {
        id: 'p6-08-q3',
        vocab: [
          { term: "to register", translation: "s'inscrire", note: "Nom : registration. Aussi : to sign up." },
          { term: "at no cost", translation: "gratuitement, sans frais" },
        ],
        category: 'Texte à trous — insertion de phrase',
        prompt: 'Trou (3) — phrase à insérer',
        choices: [
          { id: 'A', text: 'Attendance is free for partners, but registration is required.' },
          { id: 'B', text: 'The Vasari Centre was renovated three years ago.' },
          { id: 'C', text: 'Last year the event attracted six hundred visitors.' },
          { id: 'D', text: 'Exhibitors must supply their own display stands.' },
        ],
        answer: 'A',
        explanation:
          "La phrase suivante parle de la CLÔTURE des inscriptions : le trou doit donc introduire l'inscription. (A) l'annonce explicitement. (C) et (B) sont des informations de contexte qui ne préparent pas la phrase suivante.",
      },
      {
        id: 'p6-08-q4',
        vocab: [
          { term: "attached", translation: "ci-joint, en pièce jointe", example: "in the attached document" },
          { term: "a reduced rate", translation: "un tarif préférentiel, réduit" },
        ],
        category: 'Texte à trous — forme verbale',
        prompt: 'Trou (4)',
        choices: [
          { id: 'A', text: 'are given' },
          { id: 'B', text: 'give' },
          { id: 'C', text: 'giving' },
          { id: 'D', text: 'has given' },
        ],
        answer: 'A',
        explanation:
          "« Details » est PLURIEL et subit l'action (les détails sont donnés) → passif pluriel « are given ». Deux vérifications à faire systématiquement sur un trou verbal : l'accord avec le sujet, puis la voix active ou passive.",
      },
    ],
  },
];
