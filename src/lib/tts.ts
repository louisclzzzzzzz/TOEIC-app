/**
 * Point d'entrée unique de l'audio de l'app.
 *
 * Deux moteurs :
 *  - `mistral` : synthèse par l'API Mistral (voix nettement plus naturelles,
 *    accent en_US homogène d'un appareil à l'autre) ;
 *  - `system`  : Web Speech API du navigateur (gratuit, hors ligne, mais la
 *    qualité dépend entièrement des voix installées sur la machine).
 *
 * Règle d'or : une session ne doit JAMAIS se bloquer sur un problème d'audio.
 * Toute erreur Mistral (clé absente, quota, réseau) bascule automatiquement sur
 * le moteur système, en le signalant à l'utilisateur.
 */

import type { AudioLine, VoiceRole } from '../types';
import { speakLines, stopSpeech } from './speech';
import { synthesizeAll } from './mistralTts';
import { hasMistralAccess } from './mistralApi';
import { stopBlockPlayback } from './blockPlayer';

export type TtsEngine = 'system' | 'mistral';
export type PlayStatus = 'idle' | 'preparing' | 'playing';

export interface PlayOptions {
  engine: TtsEngine;
  /** Vitesse de lecture (0.6 à 1.2). Appliquée aux deux moteurs. */
  rate: number;
  apiKey: string;
  model: string;
  /** Voix Mistral associées à chaque rôle ; vide = voix par défaut de l'API. */
  voices: Record<VoiceRole, string>;
  gapMs?: number;
  onStatus?: (status: PlayStatus) => void;
  /** Message à afficher : repli sur le moteur système, autoplay bloqué… */
  onNotice?: (message: string) => void;
}

/**
 * Message unique du repli « pas de clé ». Il est affiché à deux endroits (au
 * chargement d'un bloc et au lancement d'une lecture) : une seule formulation,
 * sinon les deux divergent — ce qui est déjà arrivé.
 */
export const NO_KEY_NOTICE =
  'Voix du système : colle ta clé dans Réglages → Clé API Mistral pour des voix naturelles et la navigation dans l’audio.';

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

/** Jobs de synthèse d'un bloc : un par réplique, avec la voix de son rôle. */
const toJobs = (lines: AudioLine[], voices: Record<VoiceRole, string>) =>
  lines.map((line) => ({
    text: line.text,
    voiceId: voices[line.voice ?? 'narrator'] || undefined,
  }));

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
 * Synthétise un bloc et renvoie un clip par réplique, sans rien jouer.
 *
 * C'est ce qui permet la barre de navigation : le lecteur a besoin des fichiers
 * en main pour les mesurer et se déplacer dedans, là où `playLines` ne fait que
 * les enchaîner.
 *
 * Renvoie `null` quand la synthèse Mistral n'est pas disponible (voix du
 * système, ou clé absente) : l'appelant retombe alors sur `playLines`, qui ne
 * sait pas naviguer mais parle quand même. Lève en cas d'échec de l'API.
 */
export async function prepareLines(lines: AudioLine[], opts: PlayOptions): Promise<Blob[] | null> {
  if (!canPrepare(opts) || !lines.length) return null;
  return synthesizeAll(toJobs(lines, opts.voices), { apiKey: opts.apiKey, model: opts.model });
}

/** Le moteur peut-il livrer des fichiers — et donc une barre de navigation ? */
export const canPrepare = (opts: PlayOptions): boolean =>
  opts.engine === 'mistral' && hasMistralAccess(opts.apiKey);

/**
 * Prépare l'audio d'un bloc sans le jouer (mise en cache).
 * Appelé à l'affichage d'une question : pendant que l'utilisateur lit l'énoncé,
 * la synthèse se fait en tâche de fond et la lecture démarre ensuite sans délai.
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

  if (!hasMistralAccess(opts.apiKey)) return useSystem(NO_KEY_NOTICE);

  // Tout le bloc est synthétisé en parallèle avant la première lecture, sinon
  // on entendrait un blanc entre chaque réplique d'une conversation.
  let clips: Blob[];
  try {
    opts.onStatus?.('preparing');
    clips = await synthesizeAll(toJobs(lines, opts.voices), {
      apiKey: opts.apiKey,
      model: opts.model,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Synthèse Mistral indisponible.';
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
