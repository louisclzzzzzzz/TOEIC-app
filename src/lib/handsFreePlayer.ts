/**
 * Lecteur du mode Écoute : déroule une séance entière sans intervention.
 *
 * Trois contraintes dictent la forme de ce fichier, et elles viennent toutes du
 * même usage — un téléphone posé sur un tapis de course, ou dans une poche,
 * écran éteint :
 *
 *  1. **Un seul élément `<audio>`, dont on change la source.** iOS n'autorise
 *     la lecture que sur un élément « débloqué » par un geste de
 *     l'utilisateur ; en créer un par clip redemanderait un appui à chaque
 *     réplique. On en garde donc un pour toute la séance.
 *  2. **Les pauses sont des clips silencieux** (`lib/tone.ts`), pas des
 *     minuteurs : un `setTimeout` est bridé en arrière-plan, la file audio non.
 *  3. **Tout est téléchargé avant de commencer.** Trois secondes d'attente au
 *     départ valent mieux qu'un blanc au milieu d'une conversation parce que le
 *     réseau a hoqueté entre deux machines.
 *
 * Repli : si un clip manque (banque pas encore synthétisée), la réplique passe
 * par la voix du système. La séance continue, avec un avertissement — mais la
 * Web Speech API, elle, s'arrête quand l'écran se verrouille.
 */

import type { AudioLine } from '../types';
import type { Chapter } from './handsFree';
import { beatSeconds, spokenSeconds } from './handsFree';
import { fetchClip } from './staticAudio';
import { speakLines, speechSupported, stopSpeech } from './speech';
import { silenceClip } from './tone';

export interface PlayerState {
  chapter: number;
  beat: number;
  playing: boolean;
  /** Secondes estimées écoulées / totales (voir `CHARS_PER_SECOND`). */
  elapsed: number;
  total: number;
}

export interface PlayerOptions {
  rate: number;
  /** `false` : lecture par la voix du système, sans clips pré-synthétisés. */
  useClips: boolean;
  onState: (state: PlayerState) => void;
  onNotice: (message: string | null) => void;
  onEnd: () => void;
}

/** Clip muet minimal, joué pour « débloquer » l'élément dès le geste initial. */
const UNLOCK_MS = 40;

/**
 * Un seul élément `<audio>` pour tout le mode, gardé entre deux séances.
 *
 * iOS n'autorise la lecture programmée que sur un élément déjà joué à la suite
 * d'un geste — et le déblocage est attaché à l'élément, pas à la page. En le
 * conservant, la séance démarre toute seule après le téléchargement des clips,
 * sans redemander un appui à l'utilisateur qui a déjà appuyé sur « Démarrer ».
 */
let shared: HTMLAudioElement | null = null;
let unlockUrl: string | null = null;

function element(): HTMLAudioElement {
  if (!shared) {
    shared = new Audio();
    shared.preload = 'auto';
  }
  return shared;
}

/**
 * À appeler DANS le gestionnaire du clic de démarrage, avant tout `await` :
 * après le premier point d'attente, le navigateur ne reconnaît plus le geste.
 */
export function primeAudio(): void {
  unlockUrl ??= URL.createObjectURL(silenceClip(UNLOCK_MS));
  const el = element();
  el.src = unlockUrl;
  void el.play().catch(() => {
    // Appel hors geste : la séance demandera un appui sur ▶ au démarrage.
  });
}

export class HandsFreePlayer {
  private readonly el: HTMLAudioElement;
  private readonly chapters: Chapter[];
  private readonly opts: PlayerOptions;
  /** URL d'objet par texte de réplique (dédupliqué : « Part five. » sert dix fois). */
  private readonly clips = new Map<string, string>();
  /** Silences déjà fabriqués, par durée : une séance n'en compte qu'une poignée. */
  private readonly rests = new Map<number, string>();
  private readonly urls: string[] = [];

  private ci = 0;
  private bi = 0;
  private playing = false;
  private dead = false;
  /** Invalide la boucle en cours à chaque saut, pause définitive ou arrêt. */
  private token = 0;
  private settle: (() => void) | null = null;
  /** Vrai tant que le fil attend la fin d'un clip (et non d'une voix système). */
  private onElement = false;
  private readonly total: number;

  /** L'élément doit avoir été débloqué par `primeAudio()` au clic de démarrage. */
  constructor(chapters: Chapter[], opts: PlayerOptions) {
    this.chapters = chapters;
    this.opts = opts;
    this.el = element();
    this.el.playbackRate = opts.rate;
    this.total = chapters.reduce((n, c) => n + c.seconds, 0);
  }

  /* --- Préparation --------------------------------------------------- */

  /**
   * Télécharge tous les clips de la séance. `onProgress` va de 0 à 1.
   * Ne lève jamais : une réplique introuvable bascule sur la voix du système.
   */
  async load(onProgress: (ratio: number) => void): Promise<void> {
    if (!this.opts.useClips) return;

    const lines = new Map<string, AudioLine>();
    for (const chapter of this.chapters) {
      for (const beat of chapter.beats) {
        if (beat.line) lines.set(beat.line.text, beat.line);
      }
    }

    const jobs = [...lines.values()];
    let done = 0;
    let missing = 0;
    let cursor = 0;

    const worker = async () => {
      while (cursor < jobs.length && !this.dead) {
        const line = jobs[cursor++];
        try {
          const url = URL.createObjectURL(await fetchClip(line));
          this.urls.push(url);
          this.clips.set(line.text, url);
        } catch {
          missing += 1;
        }
        onProgress(++done / jobs.length);
      }
    };

    await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, worker));

    if (missing) {
      this.opts.onNotice(
        `${missing} réplique${missing > 1 ? 's' : ''} sans clip pré-synthétisé : ${
          missing > 1 ? 'elles seront lues' : 'elle sera lue'
        } par la voix du système.`,
      );
    }
  }

  /* --- Transport ------------------------------------------------------ */

  start(): void {
    this.playing = true;
    void this.run();
  }

  pause(): void {
    if (this.dead) return;
    this.playing = false;
    this.el.pause();
    if (this.speaking()) window.speechSynthesis.pause();
    this.emit();
  }

  resume(): void {
    if (this.dead) return;
    this.playing = true;
    if (this.speaking()) window.speechSynthesis.resume();
    // Ne relancer l'élément que s'il porte réellement le battement en cours :
    // pendant une réplique lue par la voix du système, il tient encore le clip
    // précédent et un `play()` le rejouerait par-dessus.
    if (this.onElement) {
      void this.el.play().catch(() => this.opts.onNotice('Appuie sur ▶ pour reprendre.'));
    }
    this.emit();
  }

  toggle(): void {
    if (this.playing) this.pause();
    else this.resume();
  }

  /** Chapitre suivant. En bout de séance, clôt la séance. */
  next(): void {
    this.jump(this.ci + 1);
  }

  /**
   * Reprend le chapitre en cours depuis le début, ou passe au précédent si on
   * vient à peine de le commencer — le geste des lecteurs de musique.
   */
  previous(): void {
    this.jump(this.bi <= 1 ? this.ci - 1 : this.ci);
  }

  jump(chapter: number): void {
    if (this.dead) return;
    const target = Math.max(0, chapter);
    if (target >= this.chapters.length) return this.stopAt(this.chapters.length);
    this.ci = target;
    this.bi = 0;
    this.playing = true;
    void this.run();
  }

  dispose(): void {
    this.dead = true;
    this.playing = false;
    this.token += 1;
    this.settle?.();
    this.el.pause();
    // L'élément est partagé : on lui rend le clip de déblocage plutôt que de
    // le vider, pour qu'il reste jouable à la séance suivante.
    if (unlockUrl) this.el.src = unlockUrl;
    stopSpeech();
    for (const url of this.urls) URL.revokeObjectURL(url);
  }

  setRate(rate: number): void {
    this.el.playbackRate = rate;
  }

  /* --- Boucle ---------------------------------------------------------- */

  private async run(): Promise<void> {
    const token = ++this.token;
    this.settle?.();

    while (!this.dead && token === this.token) {
      const chapter = this.chapters[this.ci];
      if (!chapter) return this.stopAt(this.chapters.length);

      const beat = chapter.beats[this.bi];
      if (!beat) {
        this.ci += 1;
        this.bi = 0;
        continue;
      }

      this.emit();

      if (beat.line) {
        await this.say(beat.line);
        if (this.dead || token !== this.token) return;
      }
      if (beat.silenceMs) {
        await this.rest(beat.silenceMs, beat.tick);
        if (this.dead || token !== this.token) return;
      }

      this.bi += 1;
    }
  }

  /** Fin de séance : on reste sur le dernier chapitre, lecture arrêtée. */
  private stopAt(chapter: number): void {
    this.token += 1;
    this.playing = false;
    this.ci = Math.min(chapter, this.chapters.length - 1);
    this.bi = 0;
    this.el.pause();
    this.emit();
    this.opts.onEnd();
  }

  private say(line: AudioLine): Promise<void> {
    const url = this.clips.get(line.text);
    if (url) return this.playUrl(url);

    // Ni clip ni voix : on laisse malgré tout passer le temps de la réplique,
    // pour que le fil garde son rythme au lieu de défiler en une seconde.
    const estimate = spokenSeconds(line.text, this.opts.rate) * 1000;
    if (!speechSupported()) return this.rest(estimate);

    // Repli : la voix du système ne connaît ni pause fine ni arrière-plan,
    // mais elle prononce la réplique et la séance continue. Une voix qui ne
    // rend jamais la main (moteur absent, onglet en arrière-plan) ne doit pas
    // pouvoir figer une séance que personne ne surveille : au-delà du double
    // de la durée attendue, on passe au battement suivant.
    return Promise.race([
      speakLines([line], { rate: this.opts.rate, gapMs: 0 }),
      new Promise<void>((resolve) => window.setTimeout(resolve, estimate * 2 + 4000)),
    ]);
  }

  /**
   * Silence de `ms` réellement écoulées : le clip est fabriqué plus court de
   * la vitesse de lecture, puisque l'élément le jouera accéléré comme le reste.
   */
  private rest(ms: number, tick?: boolean): Promise<void> {
    const key = Math.round(ms) * (tick ? -1 : 1);
    let url = this.rests.get(key);
    if (!url) {
      url = URL.createObjectURL(silenceClip(ms * this.opts.rate, { tick }));
      this.urls.push(url);
      this.rests.set(key, url);
    }
    return this.playUrl(url);
  }

  /**
   * Joue une source jusqu'au bout. La promesse ne se résout pas pendant une
   * pause (l'élément est simplement en pause), mais `settle` permet à un saut
   * ou à un arrêt de l'abandonner immédiatement.
   */
  private playUrl(url: string): Promise<void> {
    const token = this.token;
    return new Promise((resolve) => {
      const done = () => {
        this.el.removeEventListener('ended', done);
        this.el.removeEventListener('error', done);
        if (this.settle === done) this.settle = null;
        this.onElement = false;
        resolve();
      };
      this.settle = done;
      this.onElement = true;
      this.el.addEventListener('ended', done);
      this.el.addEventListener('error', done);

      this.el.src = url;
      this.el.playbackRate = this.opts.rate;
      if (!this.playing) return; // repris par `resume()`
      void this.el.play().catch(() => {
        // Un saut (⏭, ⏮) change la source avant que la lecture n'ait démarré :
        // le navigateur rejette alors la promesse précédente. Ce n'est pas un
        // refus de lecture, et l'annoncer comme tel arrêterait la séance.
        if (this.dead || token !== this.token) return;
        this.playing = false;
        this.opts.onNotice('Lecture bloquée par le navigateur — appuie sur ▶.');
        this.emit();
      });
    });
  }

  private speaking(): boolean {
    return speechSupported() && window.speechSynthesis.speaking;
  }

  /* --- Observation ------------------------------------------------------ */

  private emit(): void {
    this.opts.onState({
      chapter: this.ci,
      beat: this.bi,
      playing: this.playing,
      elapsed: this.elapsed(),
      total: this.total,
    });
  }

  private elapsed(): number {
    let sum = 0;
    for (let i = 0; i < this.ci && i < this.chapters.length; i++) sum += this.chapters[i].seconds;
    const chapter = this.chapters[this.ci];
    if (chapter) {
      for (let i = 0; i < this.bi && i < chapter.beats.length; i++) {
        sum += beatSeconds(chapter.beats[i], this.opts.rate);
      }
    }
    return sum;
  }
}
