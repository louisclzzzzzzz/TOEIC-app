/**
 * Point d'entrée unique de l'audio de l'app.
 *
 * Deux moteurs :
 *  - `mistral` : clips pré-synthétisés par l'API Mistral et livrés comme
 *    fichiers statiques (`public/audio/`, voir `scripts/synthesize-audio.ts`) —
 *    voix nettement plus naturelles, accent homogène d'un appareil à l'autre ;
 *  - `system`  : Web Speech API du navigateur (gratuit, hors ligne, mais la
 *    qualité dépend entièrement des voix installées sur la machine).
 *
 * Règle d'or : une session ne doit JAMAIS se bloquer sur un problème d'audio.
 * Un clip manquant ou une erreur réseau bascule automatiquement sur le moteur
 * système, en le signalant à l'utilisateur.
 */

import type { AudioLine } from '../types';
import { speakLines, stopSpeech } from './speech';
import { fetchAll } from './staticAudio';
import { stopBlockPlayback } from './blockPlayer';

export type TtsEngine = 'system' | 'mistral';
export type PlayStatus = 'idle' | 'preparing' | 'playing';

export interface PlayOptions {
  engine: TtsEngine;
  /** Vitesse de lecture (0.6 à 1.2). Appliquée aux deux moteurs. */
  rate: number;
  gapMs?: number;
  onStatus?: (status: PlayStatus) => void;
  /** Message à afficher : repli sur le moteur système, clip manquant… */
  onNotice?: (message: string) => void;
}

/** Incrémenté à chaque stop/nouvelle lecture : invalide les lectures en cours. */
let playToken = 0;
let currentAudio: HTMLAudioElement | null = null;

export function stopPlayback(): void {
  playToken += 1;
  stopSpeech();
  // Le lecteur navigable a sa propre file de clips : il ne passe pas par ici.
  stopBlockPlayback();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function playBlob(blob: Blob, rate: number, token: number): Promise<'ok' | 'blocked'> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    // Le réglage de vitesse reste actif : les navigateurs corrigent la hauteur.
    audio.playbackRate = rate;
    currentAudio = audio;

    const finish = (result: 'ok' | 'blocked') => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      resolve(result);
    };

    audio.onended = () => finish('ok');
    audio.onerror = () => finish('ok');
    void audio.play().catch(() => {
      // Lecture refusée faute de geste utilisateur : on le dit, sans planter.
      finish(token === playToken ? 'blocked' : 'ok');
    });
  });
}

/**
 * Récupère les clips d'un bloc, sans rien jouer.
 *
 * C'est ce qui permet la barre de navigation : le lecteur a besoin des fichiers
 * en main pour les mesurer et se déplacer dedans, là où `playLines` ne fait que
 * les enchaîner.
 *
 * Renvoie `null` quand le moteur choisi n'est pas `mistral` : l'appelant
 * retombe alors sur `playLines`, qui ne sait pas naviguer mais parle quand
 * même. Lève en cas de clip manquant ou d'erreur réseau.
 */
export async function prepareLines(lines: AudioLine[], opts: PlayOptions): Promise<Blob[] | null> {
  if (!canPrepare(opts) || !lines.length) return null;
  return fetchAll(lines);
}

/** Le moteur peut-il livrer des fichiers — et donc une barre de navigation ? */
export const canPrepare = (opts: PlayOptions): boolean => opts.engine === 'mistral';

/**
 * Prépare l'audio d'un bloc sans le jouer (mise en cache navigateur).
 * Appelé à l'affichage d'une question : pendant que l'utilisateur lit l'énoncé,
 * la récupération se fait en tâche de fond et la lecture démarre ensuite sans délai.
 */
export async function prefetchLines(lines: AudioLine[], opts: PlayOptions): Promise<void> {
  try {
    await prepareLines(lines, opts);
  } catch {
    // Le préchargement est opportuniste : un échec ici est sans conséquence,
    // la lecture réelle affichera l'erreur si elle persiste.
  }
}

/** Lit une suite de répliques avec le moteur choisi. */
export async function playLines(lines: AudioLine[], opts: PlayOptions): Promise<void> {
  if (!lines.length) return;
  stopPlayback();
  const token = playToken;
  const gap = opts.gapMs ?? 420;

  const useSystem = async (notice?: string) => {
    if (notice) opts.onNotice?.(notice);
    if (token !== playToken) return;
    opts.onStatus?.('playing');
    await speakLines(lines, { rate: opts.rate, gapMs: gap });
  };

  if (opts.engine !== 'mistral') return useSystem();

  // Tout le bloc est récupéré en parallèle avant la première lecture, sinon
  // on entendrait un blanc entre chaque réplique d'une conversation.
  let clips: Blob[];
  try {
    opts.onStatus?.('preparing');
    clips = await fetchAll(lines);
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Audio pré-synthétisé indisponible.';
    return useSystem(`${reason} Lecture avec la voix du système.`);
  }

  if (token !== playToken) return;
  opts.onStatus?.('playing');

  for (const clip of clips) {
    if (token !== playToken) break;
    const result = await playBlob(clip, opts.rate, token);
    if (result === 'blocked') {
      opts.onNotice?.('Lecture bloquée par le navigateur — appuie sur ▶.');
      break;
    }
    if (token !== playToken) break;
    await wait(gap);
  }

  if (token === playToken) opts.onStatus?.('idle');
}
