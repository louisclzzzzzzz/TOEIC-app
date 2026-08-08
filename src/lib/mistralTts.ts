/**
 * Synthèse vocale via l'API Mistral (`POST /v1/audio/speech`).
 *
 * Modèle par défaut : `voxtral-mini-tts-2603`.
 *
 * Format retenu : mp3. L'endpoint propose aussi pcm/wav (temps au premier octet
 * plus court) mais un monologue de Part 4 pèse alors plusieurs Mo, ce qui sature
 * vite le cache. Comme on précharge le bloc AVANT de le jouer, la latence de
 * synthèse est masquée et la compacité l'emporte.
 *
 * La réponse documentée est un JSON `{ audio_data: "<base64>" }` ; on accepte
 * aussi un flux binaire brut, au cas où l'API renverrait directement l'audio.
 */

import type { VoiceRole } from '../types';
import { MistralError, mistralFetch } from './mistralApi';
import { clipKey, getClip, putClip } from './audioCache';

export const DEFAULT_TTS_MODEL = 'voxtral-mini-tts-2603';
const RESPONSE_FORMAT = 'mp3';
const MIME = 'audio/mpeg';

/**
 * Voix préréglées retenues par défaut. Le champ `slug` est accepté comme
 * `voice_id`, donc on cite des identifiants lisibles plutôt que des UUID.
 *
 * Le catalogue ne propose qu'une voix masculine américaine (Paul) et pas de
 * voix féminine américaine : la voix féminine est donc britannique (Jane).
 * Ce n'est pas un pis-aller — le TOEIC alterne délibérément les accents
 * américain, britannique, canadien et australien, donc ce mélange rapproche
 * l'entraînement des conditions réelles.
 *
 * Les variantes « neutral » sont choisies volontairement : les variantes
 * émotionnelles (Sad, Angry, Excited…) ne correspondent pas au ton posé des
 * enregistrements d'examen.
 */
export const DEFAULT_VOICES: Record<VoiceRole, string> = {
  male: 'en_paul_neutral',
  female: 'gb_jane_neutral',
  narrator: 'gb_oliver_neutral',
};

export interface MistralVoice {
  /** UUID de la voix. */
  id: string;
  name: string;
  /** Identifiant lisible (`en_paul_neutral`), utilisable tel quel comme `voice_id`. */
  slug: string | null;
  gender?: string | null;
  /** Codes de langue au format `en_us`, `en_gb`, `fr_fr`… */
  languages?: string[];
  tags?: string[] | null;
}

/** Étiquette d'accent affichée dans le sélecteur de voix. */
export function accentLabel(voice: MistralVoice): string {
  const lang = (voice.languages?.[0] ?? '').toLowerCase();
  if (lang === 'en_us') return 'américain';
  if (lang === 'en_gb') return 'britannique';
  if (lang.startsWith('en')) return 'anglais';
  return lang || '—';
}

export const isEnglish = (voice: MistralVoice): boolean =>
  !voice.languages?.length || voice.languages.some((l) => l.toLowerCase().startsWith('en'));

/** Voix disponibles sur le compte (préréglées + clonées). */
export async function listVoices(apiKey: string, signal?: AbortSignal): Promise<MistralVoice[]> {
  const res = await mistralFetch('/v1/audio/voices?type=all&limit=100', apiKey, {
    method: 'GET',
    signal,
  });
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return items
    .filter((v: MistralVoice) => v?.id)
    .map((v: MistralVoice) => ({
      id: v.id,
      name: v.name ?? v.id,
      slug: v.slug ?? null,
      gender: v.gender ?? null,
      languages: v.languages ?? [],
      tags: v.tags ?? null,
    }));
}

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Synthétise un texte et renvoie le clip (depuis le cache si déjà connu). */
export async function synthesize(opts: {
  text: string;
  voiceId?: string;
  apiKey: string;
  model?: string;
  signal?: AbortSignal;
}): Promise<Blob> {
  const { text, voiceId = '', apiKey, model = DEFAULT_TTS_MODEL, signal } = opts;

  const key = clipKey(model, voiceId, text);
  const cached = await getClip(key);
  if (cached) return cached;

  const res = await mistralFetch('/v1/audio/speech', apiKey, {
    method: 'POST',
    signal,
    body: JSON.stringify({
      model,
      input: text,
      response_format: RESPONSE_FORMAT,
      // `voice_id` est optionnel : sans lui, l'API utilise sa voix par défaut.
      ...(voiceId ? { voice_id: voiceId } : {}),
    }),
  });

  const contentType = res.headers.get('content-type') ?? '';
  let blob: Blob;
  if (contentType.includes('application/json')) {
    const data = await res.json();
    const b64 = data?.audio_data ?? data?.audio ?? data?.data;
    if (typeof b64 !== 'string' || !b64) {
      throw new MistralError("Réponse audio vide ou inattendue de l'API Mistral.");
    }
    blob = base64ToBlob(b64, MIME);
  } else {
    blob = await res.blob();
  }

  if (!blob.size) throw new MistralError('Clip audio vide renvoyé par Mistral.');
  await putClip(key, blob);
  return blob;
}

/**
 * Synthétise plusieurs textes avec une concurrence limitée.
 * Utilisé pour préparer un bloc entier (conversation de 4 à 6 répliques) : les
 * appels partent en parallèle, ce qui masque la latence de synthèse.
 */
export async function synthesizeAll(
  jobs: { text: string; voiceId?: string }[],
  opts: { apiKey: string; model?: string; signal?: AbortSignal; concurrency?: number },
): Promise<Blob[]> {
  const { concurrency = 3 } = opts;
  const out: Blob[] = new Array(jobs.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < jobs.length) {
      const index = cursor++;
      const job = jobs[index];
      out[index] = await synthesize({ ...job, ...opts });
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
  return out;
}
