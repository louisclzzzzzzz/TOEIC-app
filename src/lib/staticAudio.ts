/**
 * Lecture de l'audio pré-synthétisé, livré comme fichiers statiques dans
 * `public/audio/`.
 *
 * L'app ne parle plus à l'API Mistral en direct : le contenu (banque de
 * questions) et son audio sont produits hors-ligne — voir
 * `scripts/synthesize-audio.ts` — puis committés dans le dépôt. Le nom de
 * fichier est un hash du couple (voix, texte), calculé ici exactement comme
 * dans le script de synthèse : pas de manifeste à tenir à jour, le client
 * retrouve le clip tout seul.
 */

import type { AudioLine } from '../types';
import { DEFAULT_VOICES } from './voices';

/** Même construction de clé que `scripts/synthesize-audio.ts` (voix|texte). */
export async function clipHash(voiceId: string, text: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${voiceId}|${text}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function clipUrl(line: AudioLine): Promise<string> {
  const voiceId = DEFAULT_VOICES[line.voice ?? 'narrator'];
  const hash = await clipHash(voiceId, line.text);
  return `/audio/${hash}.mp3`;
}

/** Récupère un clip pré-synthétisé. Lève si le fichier est introuvable. */
export async function fetchClip(line: AudioLine, signal?: AbortSignal): Promise<Blob> {
  const url = await clipUrl(line);
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Clip audio manquant (${url}) — banque pas encore synthétisée ?`);
  return res.blob();
}

/** Récupère tous les clips d'un bloc, dans l'ordre, en parallèle. */
export async function fetchAll(lines: AudioLine[], signal?: AbortSignal): Promise<Blob[]> {
  return Promise.all(lines.map((line) => fetchClip(line, signal)));
}
