/**
 * Lecteur d'un bloc audio, avec navigation libre dans le temps.
 *
 * Le problème : l'API Mistral synthétise UNE réplique à la fois. Une
 * conversation de Part 3 arrive donc en cinq fichiers séparés, pas en un seul,
 * et un `<audio>` par fichier ne donne aucune barre de progression d'ensemble.
 *
 * La solution retenue : ne pas fusionner les fichiers — concaténer des MP3
 * laisse l'en-tête du premier annoncer une durée fausse, donc une barre fausse
 * — mais mesurer chaque clip et tenir une timeline virtuelle par-dessus.
 * Chercher la seconde 42 revient à trouver le clip qui la contient et à s'y
 * positionner.
 *
 * Bénéfice secondaire, qui compte pour un entraînement à l'oral : les
 * frontières entre répliques sont connues au clip près. On peut donc les
 * marquer sur la barre et reprendre exactement le passage qu'on n'a pas
 * compris, sans viser au pixel.
 *
 * Les silences entre répliques ne comptent pas dans la timeline : la barre
 * mesure l'audio entendu, pas les blancs de mise en scène.
 */

/** Position d'une réplique sur la timeline globale, en secondes. */
export interface Segment {
  index: number;
  start: number;
  end: number;
}

export interface PlayerSnapshot {
  playing: boolean;
  /** Position courante en secondes. */
  time: number;
  duration: number;
  /** Index de la réplique en cours de lecture. */
  segment: number;
}

/** Une seule lecture à la fois dans l'app : changer d'écran coupe le son. */
let active: BlockPlayer | null = null;

export function stopBlockPlayback(): void {
  active?.pause();
}

export class BlockPlayer {
  readonly segments: Segment[];
  readonly duration: number;
  /** `false` si un clip n'a pas pu être mesuré : la barre serait mensongère. */
  readonly measured: boolean;

  private readonly els: HTMLAudioElement[];
  private readonly urls: string[];
  private readonly gapMs: number;
  private rate: number;
  private index = 0;
  private playing = false;
  /** Identifiant du timer de rafraîchissement du curseur. */
  private raf = 0;
  private gapTimer = 0;
  private lastEmit = 0;
  private dead = false;
  private readonly listeners = new Set<(s: PlayerSnapshot) => void>();

  static async create(
    clips: Blob[],
    opts: { gapMs?: number; rate?: number } = {},
  ): Promise<BlockPlayer> {
    const urls = clips.map((c) => URL.createObjectURL(c));
    const els = urls.map((url) => {
      const el = new Audio();
      el.preload = 'metadata';
      el.src = url;
      return el;
    });
    const durations = await Promise.all(els.map(measureDuration));
    return new BlockPlayer(els, urls, durations, opts);
  }

  private constructor(
    els: HTMLAudioElement[],
    urls: string[],
    durations: number[],
    opts: { gapMs?: number; rate?: number },
  ) {
    this.els = els;
    this.urls = urls;
    this.gapMs = opts.gapMs ?? 420;
    this.rate = opts.rate ?? 1;
    this.measured = durations.every((d) => d > 0);

    let cursor = 0;
    this.segments = durations.map((d, index) => {
      const seg = { index, start: cursor, end: cursor + d };
      cursor += d;
      return seg;
    });
    this.duration = cursor;

    els.forEach((el, i) => {
      el.playbackRate = this.rate;
      el.addEventListener('ended', () => this.onEnded(i));
    });
  }

  /* --- Lecture ------------------------------------------------------ */

  /** `blocked` = le navigateur a refusé la lecture faute de geste utilisateur. */
  async play(): Promise<'ok' | 'blocked'> {
    if (this.dead) return 'ok';
    // Rejouer depuis la fin repart du début, comme n'importe quel lecteur.
    if (this.duration && this.time() >= this.duration - 0.05) this.locate(0);

    active?.pause();
    active = this;
    this.playing = true;
    this.emit(true);

    const el = this.els[this.index];
    el.playbackRate = this.rate;
    try {
      await el.play();
    } catch {
      this.playing = false;
      this.emit(true);
      return 'blocked';
    }
    this.startLoop();
    return 'ok';
  }

  pause(): void {
    if (this.dead) return;
    this.playing = false;
    window.clearTimeout(this.gapTimer);
    this.els[this.index].pause();
    this.stopLoop();
    if (active === this) active = null;
    this.emit(true);
  }

  toggle(): Promise<'ok' | 'blocked'> {
    if (this.playing) {
      this.pause();
      return Promise.resolve('ok');
    }
    return this.play();
  }

  /** Position absolue en secondes ; la lecture reprend si elle était en cours. */
  seek(seconds: number): void {
    if (this.dead) return;
    this.locate(seconds);
    if (this.playing) {
      const el = this.els[this.index];
      el.playbackRate = this.rate;
      void el.play().catch(() => {
        this.playing = false;
        this.emit(true);
      });
    }
    this.emit(true);
  }

  /** Avance ou recule de quelques secondes, en restant dans les bornes. */
  nudge(delta: number): void {
    this.seek(this.time() + delta);
  }

  /** Reprend la réplique en cours depuis son début — le geste de la révision. */
  replaySegment(): void {
    this.seek(this.segments[this.currentSegment()]?.start ?? 0);
  }

  setRate(rate: number): void {
    this.rate = rate;
    for (const el of this.els) el.playbackRate = rate;
  }

  dispose(): void {
    this.dead = true;
    this.playing = false;
    window.clearTimeout(this.gapTimer);
    this.stopLoop();
    if (active === this) active = null;
    for (const el of this.els) {
      el.pause();
      el.removeAttribute('src');
    }
    for (const url of this.urls) URL.revokeObjectURL(url);
    this.listeners.clear();
  }

  /* --- Observation --------------------------------------------------- */

  subscribe(fn: (s: PlayerSnapshot) => void): () => void {
    this.listeners.add(fn);
    fn(this.snapshot());
    return () => {
      this.listeners.delete(fn);
    };
  }

  snapshot(): PlayerSnapshot {
    return {
      playing: this.playing,
      time: this.time(),
      duration: this.duration,
      segment: this.currentSegment(),
    };
  }

  /* --- Interne ------------------------------------------------------- */

  private time(): number {
    const seg = this.segments[this.index];
    if (!seg) return 0;
    return Math.min(this.duration, seg.start + (this.els[this.index].currentTime || 0));
  }

  private currentSegment(): number {
    return this.index;
  }

  /** Place le curseur sans toucher à l'état de lecture. */
  private locate(seconds: number): void {
    window.clearTimeout(this.gapTimer);
    const target = Math.max(0, Math.min(this.duration, seconds));
    const next = this.segmentAt(target);
    if (next !== this.index) {
      this.els[this.index].pause();
      this.els[this.index].currentTime = 0;
      this.index = next;
    }
    const seg = this.segments[next];
    this.els[next].currentTime = Math.max(0, target - seg.start);
  }

  private segmentAt(t: number): number {
    for (let i = this.segments.length - 1; i >= 0; i--) {
      if (t >= this.segments[i].start) return i;
    }
    return 0;
  }

  private onEnded(index: number): void {
    if (this.dead || index !== this.index || !this.playing) return;

    if (index >= this.els.length - 1) {
      this.playing = false;
      this.stopLoop();
      if (active === this) active = null;
      this.emit(true);
      return;
    }

    // Silence entre deux répliques : la timeline se fige sur la fin du clip,
    // elle ne compte que l'audio réellement entendu.
    this.gapTimer = window.setTimeout(() => {
      if (this.dead || !this.playing) return;
      this.index = index + 1;
      const el = this.els[this.index];
      el.currentTime = 0;
      el.playbackRate = this.rate;
      void el.play().catch(() => {
        this.playing = false;
        this.emit(true);
      });
      this.emit(true);
    }, this.gapMs);
  }

  /**
   * Un timer plutôt que `requestAnimationFrame` : rAF ne tourne pas du tout
   * dans un onglet masqué, alors que l'audio, lui, continue — le curseur
   * reviendrait faux le temps d'un rafraîchissement. Le navigateur bride
   * lui-même les timers en arrière-plan, donc le coût reste nul.
   */
  private startLoop(): void {
    this.stopLoop();
    this.raf = window.setInterval(() => {
      if (this.dead || !this.playing) return this.stopLoop();
      this.emit();
    }, 66);
  }

  private stopLoop(): void {
    if (this.raf) window.clearInterval(this.raf);
    this.raf = 0;
  }

  /**
   * Les changements d'état sont diffusés tels quels ; le défilement du curseur
   * est limité à ~15 Hz — au-delà on redessine la transcription soixante fois
   * par seconde pour un déplacement invisible.
   */
  private emit(force = false): void {
    const now = performance.now();
    if (!force && now - this.lastEmit < 66) return;
    this.lastEmit = now;
    const snap = this.snapshot();
    for (const fn of this.listeners) fn(snap);
  }
}

/**
 * Durée d'un clip, en secondes. Renvoie 0 si elle reste introuvable — l'appelant
 * préfère masquer la barre plutôt que d'en afficher une fausse.
 */
function measureDuration(el: HTMLAudioElement): Promise<number> {
  return new Promise((resolve) => {
    let settled = false;
    let forced = false;

    const done = (d: number) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(guard);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('durationchange', onMeta);
      el.removeEventListener('error', onFail);
      try {
        el.currentTime = 0;
      } catch {
        // Un seek refusé n'empêche pas la lecture : on ignore.
      }
      resolve(Number.isFinite(d) && d > 0 ? d : 0);
    };

    const onMeta = () => {
      if (Number.isFinite(el.duration)) return done(el.duration);
      // Chrome annonce parfois `Infinity` sur une source blob : un seek très
      // loin force le décodeur à parcourir le fichier et à publier la durée.
      if (forced) return;
      forced = true;
      el.currentTime = 1e101;
    };

    const onFail = () => done(0);
    const guard = window.setTimeout(() => done(el.duration), 5000);

    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('durationchange', onMeta);
    el.addEventListener('error', onFail);
    if (el.readyState >= 1) onMeta();
  });
}
