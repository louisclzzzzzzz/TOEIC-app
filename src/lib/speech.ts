/**
 * Simulation audio via la Web Speech API (SpeechSynthesis).
 *
 * Choix techniques :
 *  - voix en_US uniquement (l'examen est en anglais nord-américain / international) ;
 *  - deux voix distinctes pour les dialogues (male / female) quand le système
 *    en propose, sinon on rejoue la même voix avec un pitch différent ;
 *  - lecture séquentielle avec une courte pause entre les répliques, comme
 *    dans un enregistrement d'examen ;
 *  - keep-alive Chrome : la synthèse s'interrompt d'elle-même au bout d'une
 *    quinzaine de secondes si on ne « réveille » pas le moteur.
 */

import type { AudioLine, VoiceRole } from '../types';

export const speechSupported = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Sélection des voix par liste de préférence plutôt que par heuristique.
 *
 * macOS installe une trentaine de voix en_US dont la majorité sont des voix
 * « nouveauté » (Zarvox, Bouffon, Cloches…) : prendre la première voix en_US
 * venue donne un audio inutilisable. On cite donc explicitement les voix
 * naturelles connues, dans l'ordre de préférence.
 */
const PREFERRED_FEMALE = [
  'samantha', 'ava', 'allison', 'susan', 'nicky', 'karen', 'serena', 'victoria',
  'zira', 'aria', 'jenny', 'michelle', 'sandy', 'shelley', 'flo', 'google us english',
];
const PREFERRED_MALE = [
  'alex', 'daniel', 'tom', 'aaron', 'david', 'guy', 'eddy', 'reed', 'rocko', 'ryan', 'fred',
];

/**
 * Voix de fantaisie à écarter. Les noms sont traduits selon la langue du
 * système, d'où les variantes françaises.
 */
const NOVELTY = [
  'albert', 'bahh', 'boing', 'bubbles', 'bulles', 'bells', 'cloches', 'cellos', 'violoncelles',
  'organ', 'orgue', 'jester', 'bouffon', 'junior', 'kathy', 'whisper', 'murmure', 'wobble',
  'zarvox', 'trinoid', 'trinoï', 'superstar', 'good news', 'bad news', 'bonnes nouvelles',
  'mauvaises nouvelles', 'deranged', 'hysterical', 'ralph', 'grandma', 'grandpa', 'mamie', 'papy',
];

let cachedVoices: SpeechSynthesisVoice[] = [];

/** Les voix arrivent de façon asynchrone au premier chargement de la page. */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported()) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) {
    cachedVoices = now;
    return Promise.resolve(now);
  }
  return new Promise((resolve) => {
    const done = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    // Filet de sécurité : certains navigateurs n'émettent jamais l'événement.
    setTimeout(done, 1200);
  });
}

function englishVoices(): SpeechSynthesisVoice[] {
  const all = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
  const us = all.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('en-us'));
  return us.length ? us : all.filter((v) => v.lang.toLowerCase().startsWith('en'));
}

const isNovelty = (voice: SpeechSynthesisVoice) =>
  NOVELTY.some((n) => voice.name.toLowerCase().includes(n));

/** Première voix disponible en suivant l'ordre de préférence donné. */
function pick(
  voices: SpeechSynthesisVoice[],
  preferences: string[],
  taken: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  for (const name of preferences) {
    const found = voices.find((v) => v.name.toLowerCase().includes(name) && !taken.includes(v));
    if (found) return found;
  }
  return undefined;
}

/** Associe chaque rôle à une vraie voix du système (peut renvoyer `undefined`). */
export function resolveVoices(): Record<VoiceRole, SpeechSynthesisVoice | undefined> {
  const en = englishVoices();
  const usable = en.filter((v) => !isNovelty(v));
  const pool = usable.length ? usable : en;

  const female = pick(pool, PREFERRED_FEMALE, []) ?? pool[0];
  const male = pick(pool, PREFERRED_MALE, female ? [female] : []) ?? pool.find((v) => v !== female) ?? female;
  // Le narrateur (Part 4, 3e locuteur) prend une 3e voix si elle existe.
  const narrator = pool.find((v) => v !== female && v !== male) ?? female;

  return { female, male, narrator };
}

/** Nom des voix effectivement utilisées (affiché dans les réglages). */
export function voiceSummary(): string {
  if (!speechSupported()) return 'non disponible';
  const v = resolveVoices();
  const names = [v.female?.name, v.male?.name].filter(Boolean);
  return names.length ? names.join(' · ') : 'voix par défaut du système';
}

/** Incrémenté à chaque stop/nouvelle lecture : invalide les lectures en cours. */
let playToken = 0;
let keepAlive: number | undefined;

export function stopSpeech(): void {
  if (!speechSupported()) return;
  playToken += 1;
  window.clearInterval(keepAlive);
  keepAlive = undefined;
  window.speechSynthesis.cancel();
}

function speakOne(
  line: AudioLine,
  rate: number,
  voices: Record<VoiceRole, SpeechSynthesisVoice | undefined>,
): Promise<void> {
  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(line.text);
    const role: VoiceRole = line.voice ?? 'narrator';
    const voice = voices[role];
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang ?? 'en-US';
    utter.rate = rate;
    // Si le système n'a qu'une voix, on différencie les locuteurs par le pitch.
    utter.pitch = role === 'male' ? 0.85 : role === 'female' ? 1.12 : 1;
    utter.onend = () => resolve();
    utter.onerror = () => resolve(); // ne jamais bloquer la session sur une erreur audio
    window.speechSynthesis.speak(utter);
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Lit une suite de répliques. Résout à la fin, ou immédiatement si la lecture
 * a été annulée entre-temps (changement de question, bouton stop…).
 */
export async function speakLines(
  lines: AudioLine[],
  opts: { rate?: number; gapMs?: number } = {},
): Promise<void> {
  if (!speechSupported() || !lines.length) return;
  stopSpeech();
  const token = playToken;
  const rate = opts.rate ?? 0.95;
  const gap = opts.gapMs ?? 420;

  await loadVoices();
  if (token !== playToken) return;
  const voices = resolveVoices();

  // Chrome coupe la synthèse après ~15 s : on la relance périodiquement.
  keepAlive = window.setInterval(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10_000);

  for (const line of lines) {
    if (token !== playToken) break;
    await speakOne(line, rate, voices);
    if (token !== playToken) break;
    await wait(gap);
  }

  if (token === playToken) {
    window.clearInterval(keepAlive);
    keepAlive = undefined;
  }
}
