/**
 * Synthétise l'audio de toute la banque via l'API Mistral et écrit les clips
 * dans `public/audio/`, pour qu'ils soient livrés comme fichiers statiques
 * avec le build — l'app elle-même ne parle plus jamais à Mistral.
 *
 *   MISTRAL_API_KEY=... npm run synthesize
 *
 * Un fichier par réplique unique (voix + texte dédupliqués, comme l'ancien
 * préchargement de `Réglages → Cache audio`), nommé par un hash du couple
 * (voix, texte) — `src/lib/staticAudio.ts` retrouve le même nom côté client
 * sans manifeste à tenir à jour. Idempotent : un fichier déjà présent n'est
 * pas resynthétisé, donc ne resynthétiser que les nouvelles questions ajoutées
 * à la banque revient simplement à relancer la commande.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { QUESTION_BANK } from '../src/data/questions';
import { DEFAULT_VOICES, TTS_MODEL } from '../src/lib/voices';
import type { AudioLine } from '../src/types';

// `npm run synthesize` s'exécute depuis la racine du projet ; on ne peut pas se
// fier à `import.meta.url`, esbuild rebundle ce script dans node_modules/.cache
// et l'aurait fait pointer là plutôt que vers la racine.
const OUT_DIR = path.join(process.cwd(), 'public/audio');
const CONCURRENCY = 4;

const apiKey = process.env.MISTRAL_API_KEY?.trim();
if (!apiKey) {
  console.error('MISTRAL_API_KEY manquant : MISTRAL_API_KEY=... npm run synthesize');
  process.exit(1);
}

function hashOf(voiceId: string, text: string): string {
  return createHash('sha256').update(`${voiceId}|${text}`).digest('hex');
}

/** Toutes les répliques de la banque, dédupliquées par (voix, texte). */
function collectLines(): { voiceId: string; text: string }[] {
  const all: AudioLine[] = QUESTION_BANK.flatMap((s) => [
    ...(s.audio ?? []),
    ...s.items.flatMap((i) => i.audio ?? []),
  ]);
  const seen = new Map<string, { voiceId: string; text: string }>();
  for (const line of all) {
    const voiceId = DEFAULT_VOICES[line.voice ?? 'narrator'];
    const key = `${voiceId}|${line.text}`;
    if (!seen.has(key)) seen.set(key, { voiceId, text: line.text });
  }
  return [...seen.values()];
}

async function synthesizeOne(voiceId: string, text: string): Promise<Buffer> {
  const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: TTS_MODEL,
      input: text,
      response_format: 'mp3',
      voice_id: voiceId,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Mistral ${res.status} — ${detail.slice(0, 200) || res.statusText}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const data = (await res.json()) as { audio_data?: string; audio?: string; data?: string };
    const b64 = data.audio_data ?? data.audio ?? data.data;
    if (!b64) throw new Error('Réponse audio vide ou inattendue.');
    return Buffer.from(b64, 'base64');
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const existingBefore = new Set(readdirSync(OUT_DIR));

  const lines = collectLines();
  const todo = lines
    .map((l) => ({ ...l, file: `${hashOf(l.voiceId, l.text)}.mp3` }))
    .filter((l) => !existingBefore.has(l.file));

  console.log(`${lines.length} répliques dans la banque, ${todo.length} à synthétiser.`);

  let done = 0;
  let failed = 0;
  let cursor = 0;

  const worker = async () => {
    while (cursor < todo.length) {
      const job = todo[cursor++];
      try {
        const audio = await synthesizeOne(job.voiceId, job.text);
        writeFileSync(path.join(OUT_DIR, job.file), audio);
        done++;
        process.stdout.write(`\r  ${done + failed}/${todo.length}`);
      } catch (err) {
        failed++;
        console.error(`\n  ✗ ${job.text.slice(0, 60)}… — ${(err as Error).message}`);
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, worker));

  const files = readdirSync(OUT_DIR).filter((f) => f.endsWith('.mp3'));
  const bytes = files.reduce((n, f) => n + statSync(path.join(OUT_DIR, f)).size, 0);
  console.log(
    `\n→ ${done} synthétisées, ${failed} échec(s), ${lines.length - todo.length} déjà présentes.`,
  );
  console.log(`→ ${files.length} clips en tout, ${(bytes / 1_048_576).toFixed(1)} Mo dans public/audio/.`);
  if (failed > 0) process.exit(1);
}

void main();
