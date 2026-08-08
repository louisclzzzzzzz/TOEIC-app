/**
 * Génération dynamique de questions via l'API Mistral (bonus).
 *
 * L'app cible automatiquement la partie la plus faible de l'utilisateur et
 * demande au modèle un JSON strictement structuré, qui est ensuite VALIDÉ avant
 * d'entrer dans la banque : un set mal formé est rejeté plutôt qu'affiché.
 *
 * Réseau : en dev, on passe par le proxy Vite (`/api/mistral`) car l'API
 * Mistral ne renvoie pas d'en-têtes CORS pour les appels navigateur.
 */

import type { AudioLine, Letter, PartId, QuestionSet } from '../types';
import { PARTS, hasSpokenChoices, sectionOf } from './toeic';
import { mistralFetch } from './mistralApi';

const LETTERS: Letter[] = ['A', 'B', 'C', 'D'];

/** Consignes de format, injectées telles quelles dans le prompt système. */
function schemaFor(part: PartId): string {
  const n = PARTS[part].choices;
  const letters = LETTERS.slice(0, n).join('", "');

  const common = `Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown.
Structure exacte attendue :
{
  "title": "titre interne court en français",
  "items": [
    {
      "category": "sous-catégorie fine en français (ex: 'Grammaire — prépositions')",
      "prompt": "énoncé imprimé en anglais",
      "choices": [{"id": "A", "text": "..."}, ...  ${n} propositions, ids "${letters}"],
      "answer": "une des lettres",
      "explanation": "explication PÉDAGOGIQUE EN FRANÇAIS : pourquoi la bonne réponse est correcte, pourquoi le piège principal ne l'est pas, et la règle à retenir. 2 à 4 phrases."
    }
  ]
}`;

  switch (part) {
    case 1:
      return `${common}
Spécificités Part 1 (Photographs) :
- "scene" (au niveau racine) : {"alt": "description en français de la photo imaginée, 1 phrase"}
- exactement 1 item, SANS champ "prompt"
- les 4 propositions sont des phrases descriptives en anglais ; 1 seule décrit la scène
- ajoute "audio" à l'item : [{"text":"A. <phrase 1>","voice":"female"}, ... pour les 4 lettres]`;
    case 2:
      return `${common}
Spécificités Part 2 (Question-Response) :
- exactement 1 item, SANS champ "prompt", 3 propositions (A, B, C)
- ajoute "audio" à l'item : première ligne = la question (voice "male"), puis les 3 réponses préfixées "A. ", "B. ", "C. " (voice "female")
- au moins un distracteur doit reprendre un mot de la question avec un sens décalé`;
    case 3:
      return `${common}
Spécificités Part 3 (Conversations) :
- ajoute "audio" au niveau racine : 4 à 6 répliques [{"speaker":"Man"|"Woman","text":"...","voice":"male"|"female"}]
- exactement 3 items avec "prompt" (sujet/problème, détail, action future)
- les bonnes réponses doivent être des PARAPHRASES de l'audio, jamais les mots exacts`;
    case 4:
      return `${common}
Spécificités Part 4 (Talks) :
- ajoute "audio" au niveau racine : 1 seule réplique de 90 à 130 mots (annonce, message vocal, extrait de réunion)
- exactement 3 items avec "prompt", dans l'ordre d'apparition des informations dans le monologue`;
    case 5:
      return `${common}
Spécificités Part 5 (Incomplete Sentences) :
- exactement 1 item ; "prompt" = une phrase anglaise avec un trou noté "----"
- teste un point précis : temps verbal, formation des mots, préposition, connecteur, pronom relatif ou collocation`;
    case 6:
      return `${common}
Spécificités Part 6 (Text Completion) :
- ajoute "passages" au niveau racine : [{"kind":"email","heading":"To: ... | From: ... | Subject: ...","body":"texte avec les trous notés ___(1)___ à ___(4)___"}]
- exactement 4 items ; "prompt" vaut "Trou (1)" … "Trou (4)"
- l'un des quatre trous doit être une PHRASE ENTIÈRE à insérer`;
    case 7:
      return `${common}
Spécificités Part 7 (Reading Comprehension) :
- ajoute "passages" au niveau racine : 1 ou 2 documents [{"kind":"email"|"notice"|"article"|"ad"|"memo","heading":"...","body":"120 à 200 mots"}]
- 2 à 3 items avec "prompt" (but du document, information ciblée, inférence)
- si 2 documents, au moins une question doit exiger de croiser les deux`;
  }
}

const SYSTEM_PROMPT = `Tu es concepteur d'items pour un entraînement au TOEIC Listening & Reading.
Tu écris des questions ORIGINALES, jamais copiées d'un test existant.
Contexte professionnel obligatoire : entreprise, emails, réunions, logistique, voyages d'affaires, RH, service client.
Niveau visé : B1-B2 (candidat visant 700-800).
Anglais international neutre, noms de personnes et d'entreprises inventés.
Les explications sont en FRANÇAIS, tout le reste (énoncés, propositions, audio, passages) en ANGLAIS.`;

interface RawItem {
  category?: string;
  prompt?: string;
  choices?: { id?: string; text?: string }[];
  answer?: string;
  explanation?: string;
  audio?: AudioLine[];
}

interface RawSet {
  title?: string;
  scene?: { alt?: string };
  audio?: AudioLine[];
  passages?: { kind?: string; heading?: string; body?: string }[];
  items?: RawItem[];
}

const PASSAGE_KINDS = ['email', 'notice', 'article', 'ad', 'letter', 'memo', 'chat', 'schedule'];

/**
 * Valide et normalise la réponse du modèle.
 * @throws si le set est inutilisable (mieux vaut échouer que polluer la banque).
 */
export function normalizeGeneratedSet(raw: RawSet, part: PartId): QuestionSet {
  const expected = PARTS[part].choices;
  const id = `ai-${part}-${Date.now().toString(36)}`;
  const items = (raw.items ?? []).map((item, index) => {
    const choices = (item.choices ?? [])
      .slice(0, expected)
      .map((c, i) => ({ id: LETTERS[i], text: String(c?.text ?? '').trim() }));

    if (choices.length !== expected || choices.some((c) => !c.text)) {
      throw new Error(`Question ${index + 1} : ${expected} propositions attendues.`);
    }
    const answer = String(item.answer ?? '').trim().toUpperCase().charAt(0) as Letter;
    if (!choices.some((c) => c.id === answer)) {
      throw new Error(`Question ${index + 1} : réponse « ${item.answer} » hors des propositions.`);
    }
    if (!item.explanation) throw new Error(`Question ${index + 1} : explication manquante.`);
    // Parts 1 et 2 : tout est audio, aucun énoncé ne doit être imprimé.
    const prompt = hasSpokenChoices(part) ? undefined : item.prompt?.trim();
    if (!hasSpokenChoices(part) && !prompt) {
      throw new Error(`Question ${index + 1} : énoncé manquant.`);
    }

    return {
      id: `${id}-q${index + 1}`,
      category: item.category?.trim() || PARTS[part].name,
      prompt,
      choices,
      answer,
      explanation: item.explanation.trim(),
      audio: sanitizeAudio(item.audio),
    };
  });

  if (!items.length) throw new Error('Aucune question exploitable dans la réponse.');

  const set: QuestionSet = {
    id,
    part,
    title: raw.title?.trim() || `${PARTS[part].label} (IA)`,
    items,
    source: 'ai',
    createdAt: Date.now(),
  };

  if (part === 1) {
    set.scene = { id: 'office-desk', alt: raw.scene?.alt?.trim() || 'Scène de bureau.' };
    if (!items[0].audio?.length) throw new Error('Part 1 : script audio manquant.');
  }
  if (part === 2 && !items[0].audio?.length) throw new Error('Part 2 : script audio manquant.');

  if (part === 3 || part === 4) {
    const audio = sanitizeAudio(raw.audio);
    if (!audio?.length) throw new Error('Script audio manquant pour la conversation.');
    set.audio = audio;
  }

  if (part === 6 || part === 7) {
    const passages = (raw.passages ?? [])
      .filter((p) => p?.body)
      .map((p) => ({
        kind: (PASSAGE_KINDS.includes(String(p.kind)) ? p.kind : 'notice') as never,
        heading: p.heading?.trim(),
        body: String(p.body).trim(),
      }));
    if (!passages.length) throw new Error('Document de lecture manquant.');
    set.passages = passages;
  }

  return set;
}

function sanitizeAudio(lines?: AudioLine[]): AudioLine[] | undefined {
  if (!Array.isArray(lines)) return undefined;
  const clean = lines
    .filter((l) => l && typeof l.text === 'string' && l.text.trim())
    .map((l) => ({
      speaker: typeof l.speaker === 'string' ? l.speaker : undefined,
      text: l.text.trim(),
      voice: l.voice === 'male' || l.voice === 'female' ? l.voice : ('narrator' as const),
    }));
  return clean.length ? clean : undefined;
}

/** Appelle l'API Mistral et renvoie un set prêt à être ajouté à la banque. */
export async function generateSet(opts: {
  part: PartId;
  apiKey: string;
  model: string;
  /** Catégories déjà ratées, pour orienter le contenu généré. */
  weakCategories?: string[];
  signal?: AbortSignal;
}): Promise<QuestionSet> {
  const { part, apiKey, model, weakCategories = [], signal } = opts;
  if (!apiKey) throw new Error('Clé API Mistral absente (à renseigner dans Réglages).');

  const focus = weakCategories.length
    ? `\nCible en priorité ces points, où l'utilisateur échoue : ${weakCategories.slice(0, 4).join(' ; ')}.`
    : '';

  const userPrompt = `Génère un nouveau bloc de ${PARTS[part].label} (${PARTS[part].name}), section ${
    sectionOf(part) === 'listening' ? 'Listening' : 'Reading'
  }.${focus}

${schemaFor(part)}`;

  const res = await mistralFetch('/v1/chat/completions', apiKey, {
    method: 'POST',
    signal,
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? '';
  let parsed: RawSet;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Réponse illisible : le modèle n’a pas renvoyé du JSON.');
  }
  return normalizeGeneratedSet(parsed, part);
}
