/**
 * Lecteur audio de la session.
 *
 * Comportement calqué sur l'examen : le script n'est JAMAIS affiché tant que
 * l'utilisateur n'a pas répondu. Le nombre d'écoutes est compté et affiché —
 * en examen réel on n'entend l'audio qu'une fois, l'app le rappelle sans
 * l'interdire (on est en entraînement).
 *
 * Deux lecteurs selon le moteur choisi dans les réglages :
 *  - Mistral : les clips sont des fichiers, donc on peut les mesurer, les
 *    recoller en une timeline et offrir une barre de navigation — revenir sur
 *    la phrase qu'on n'a pas comprise est le geste central de la révision ;
 *  - voix du système : la Web Speech API ne sait ni se positionner ni donner
 *    une durée. Pas de barre, et on le dit plutôt que d'en afficher une inerte.
 */

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { AudioLine } from '../types';
import type { PlayStatus } from '../lib/tts';
import { NO_KEY_NOTICE, canPrepare, playLines, prepareLines, stopPlayback } from '../lib/tts';
import type { PlayerSnapshot } from '../lib/blockPlayer';
import { BlockPlayer } from '../lib/blockPlayer';
import { speechSupported } from '../lib/speech';
import { useApp } from '../store';
import { formatClock } from './ui';
import { Pause, Play, Rewind, Stop } from './Icons';

interface Props {
  lines: AudioLine[];
  autoPlay: boolean;
  /** Change de valeur à chaque nouveau bloc : relance l'auto-play. */
  playKey: string;
  /** Transcription visible (après réponse, ou en mode révision). */
  revealed: boolean;
  label?: string;
}

const EMPTY: PlayerSnapshot = { playing: false, time: 0, duration: 0, segment: 0 };
const BLOCKED = 'Lecture bloquée par le navigateur — appuie sur ▶.';

/** Pas des boutons d'ajustement fin, en secondes. */
const NUDGE = 5;

export function AudioPlayer({ lines, autoPlay, playKey, revealed, label }: Props) {
  const { state } = useApp();
  const { settings } = state;

  const [player, setPlayer] = useState<BlockPlayer | null>(null);
  const [snap, setSnap] = useState<PlayerSnapshot>(EMPTY);
  const [preparing, setPreparing] = useState(false);
  const [speech, setSpeech] = useState<PlayStatus>('idle');
  const [plays, setPlays] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  /** Position affichée pendant un glisser : elle prime sur celle du lecteur. */
  const [scrub, setScrub] = useState<number | null>(null);

  const snapRef = useRef(snap);
  snapRef.current = snap;
  const resumeAfterScrub = useRef(false);

  const options = {
    engine: settings.ttsEngine,
    rate: settings.speechRate,
    apiKey: settings.mistralApiKey,
    model: settings.mistralTtsModel,
    voices: settings.mistralVoices,
    onStatus: setSpeech,
    onNotice: setNotice,
  };
  // Les options changent à chaque rendu ; on les lit via une ref pour ne pas
  // relancer la lecture à cause d'une simple égalité d'objet.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /* --- Préparation du bloc ------------------------------------------ */

  useEffect(() => {
    let cancelled = false;
    let created: BlockPlayer | null = null;

    setPlayer(null);
    setSnap(EMPTY);
    setPlays(0);
    setNotice(null);
    setScrub(null);

    const opts = optionsRef.current;
    const speak = () => {
      if (cancelled) return;
      setPlays((n) => n + 1);
      void playLines(lines, optionsRef.current).then(() => setSpeech('idle'));
    };

    void (async () => {
      let clips: Blob[] | null = null;
      try {
        // Le voyant n'apparaît que si une synthèse va réellement avoir lieu :
        // sinon il clignoterait pour rien à chaque question.
        if (canPrepare(opts)) setPreparing(true);
        clips = await prepareLines(lines, opts);
      } catch (err) {
        if (cancelled) return;
        setPreparing(false);
        const reason = err instanceof Error ? err.message : 'Synthèse Mistral indisponible.';
        setNotice(`${reason} Lecture avec la voix du système, sans navigation.`);
        if (autoPlay) speak();
        return;
      }

      if (cancelled) return;
      setPreparing(false);

      // Pas de clips : moteur système ou clé absente, on parle sans naviguer.
      if (!clips) {
        if (opts.engine === 'mistral' && !opts.apiKey.trim()) setNotice(NO_KEY_NOTICE);
        if (autoPlay) speak();
        return;
      }

      created = await BlockPlayer.create(clips, { rate: opts.rate });
      if (cancelled) return created.dispose();
      setPlayer(created);

      if (autoPlay) {
        setPlays(1);
        const result = await created.play();
        if (!cancelled && result === 'blocked') setNotice(BLOCKED);
      }
    })();

    return () => {
      cancelled = true;
      created?.dispose();
      stopPlayback();
      setSpeech('idle');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  useEffect(() => (player ? player.subscribe(setSnap) : undefined), [player]);

  // La vitesse se règle en cours de session : elle s'applique au clip en train
  // de jouer, sans le redémarrer.
  useEffect(() => {
    player?.setRate(settings.speechRate);
  }, [player, settings.speechRate]);

  /* --- Commandes ----------------------------------------------------- */

  const seekable = !!player && player.measured && player.duration > 0;
  const busy = player ? snap.playing : speech !== 'idle';
  const duration = player?.duration ?? 0;
  const position = scrub ?? snap.time;

  const toggle = async () => {
    setNotice(null);
    if (!player) {
      if (busy) return (stopPlayback(), setSpeech('idle'));
      setPlays((n) => n + 1);
      await playLines(lines, optionsRef.current);
      return setSpeech('idle');
    }
    // « Écoutes » = lectures reprises depuis le début. Une pause suivie d'une
    // reprise au milieu ne compte pas : ce serait fausser le rappel d'examen.
    const at = snapRef.current;
    if (!at.playing && (at.time <= 0.05 || at.time >= player.duration - 0.05)) {
      setPlays((n) => n + 1);
    }
    if ((await player.toggle()) === 'blocked') setNotice(BLOCKED);
  };

  const onScrubDown = () => {
    if (!player) return;
    resumeAfterScrub.current = snapRef.current.playing;
    if (snapRef.current.playing) player.pause();
  };

  const onScrubCommit = () => {
    setScrub(null);
    if (resumeAfterScrub.current) void player?.play();
    resumeAfterScrub.current = false;
  };

  const jumpTo = (segment: number) => {
    if (!player) return;
    player.seek(player.segments[segment]?.start ?? 0);
    void player.play();
  };

  // « Ce passage » est un verbe d'écoute : s'il était en pause, on relance.
  // Les ±5 s, eux, sont un réglage fin et respectent l'état courant.
  const replaySegment = () => {
    player?.replaySegment();
    void player?.play();
  };

  /* --- Rendu ---------------------------------------------------------- */

  if (settings.ttsEngine === 'system' && !speechSupported()) {
    return (
      <div
        className="rounded-2xl border p-5 text-[14px]"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-flame) 30%, transparent)',
          background: 'color-mix(in srgb, var(--color-flame) 7%, var(--color-surface))',
        }}
      >
        <p className="text-ink">
          La synthèse vocale n’est pas disponible dans ce navigateur. Le script est affiché à la
          place :
        </p>
        <div className="mt-3">
          <Transcript lines={lines} />
        </div>
      </div>
    );
  }

  const status = preparing
    ? 'Préparation de l’audio…'
    : busy
      ? 'Lecture en cours'
      : plays === 0
        ? 'Appuie pour écouter'
        : `${plays} écoute${plays > 1 ? 's' : ''} · une seule le jour de l’examen`;

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <button
          onClick={() => void toggle()}
          // Pendant la synthèse, le lecteur navigable n'existe pas encore :
          // un appui lancerait la lecture séquentielle, sans barre.
          disabled={preparing}
          className="grid size-12 shrink-0 place-items-center rounded-full transition duration-200 active:scale-95 disabled:opacity-70"
          style={{
            background: busy && !player ? 'var(--color-surface-sunk)' : 'var(--color-navy)',
            color: busy && !player ? 'var(--color-navy)' : 'var(--color-cream)',
          }}
          aria-label={
            !busy ? 'Écouter' : player ? 'Mettre en pause' : 'Arrêter la lecture'
          }
        >
          {preparing ? (
            <Spinner />
          ) : !player ? (
            busy ? (
              <Stop size={16} />
            ) : (
              <Play size={17} />
            )
          ) : snap.playing ? (
            <Pause size={16} />
          ) : (
            <Play size={17} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-navy">{label ?? 'Document audio'}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">{status}</p>
        </div>
      </div>

      {seekable && player && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="w-9 shrink-0 text-right text-[11.5px] tabular-nums text-muted">
              {formatClock(position)}
            </span>

            <div className="relative flex-1">
              <input
                type="range"
                className="scrub"
                min={0}
                max={duration}
                step={0.05}
                value={position}
                onPointerDown={onScrubDown}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setScrub(v);
                  player.seek(v);
                }}
                onPointerUp={onScrubCommit}
                onPointerCancel={onScrubCommit}
                onKeyUp={onScrubCommit}
                style={
                  {
                    '--played': `${duration ? (position / duration) * 100 : 0}%`,
                  } as CSSProperties
                }
                aria-label="Position dans l’audio"
                aria-valuetext={`${formatClock(position)} sur ${formatClock(duration)}`}
              />
              {/* Repères de répliques : les frontières viennent des clips, elles
                  sont exactes. On voit d'un coup d'œil où commence la réponse du
                  second interlocuteur. */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2">
                {player.segments.slice(1).map((seg) => (
                  <span
                    key={seg.index}
                    className="absolute top-0 h-full w-px"
                    // Le repère s'inverse au passage du curseur : clair sur la
                    // portion lue (marine), sombre sur la portion restante.
                    style={{
                      left: `calc(7px + (100% - 14px) * ${duration ? seg.start / duration : 0})`,
                      background:
                        seg.start <= position
                          ? 'color-mix(in srgb, var(--color-cream) 80%, transparent)'
                          : 'color-mix(in srgb, var(--color-navy) 35%, transparent)',
                    }}
                  />
                ))}
              </div>
            </div>

            <span className="w-9 shrink-0 text-[11.5px] tabular-nums text-muted">
              {formatClock(duration)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <TransportButton onClick={replaySegment}>
              <Rewind size={13} /> Ce passage
            </TransportButton>
            <TransportButton onClick={() => player.nudge(-NUDGE)}>−{NUDGE} s</TransportButton>
            <TransportButton onClick={() => player.nudge(NUDGE)}>+{NUDGE} s</TransportButton>
          </div>
        </div>
      )}

      {notice && (
        <p className="mt-3 text-[12px] leading-relaxed" style={{ color: 'var(--color-flame)' }}>
          {notice}
        </p>
      )}

      {revealed && (
        <div className="animate-rise mt-4 border-t border-line-soft pt-4">
          <p className="eyebrow mb-2">Transcription</p>
          {/* Surlignage seulement une fois la lecture engagée : au repos, la
              première ligne ne doit pas paraître « en cours ». */}
          <Transcript
            lines={lines}
            active={seekable && (snap.playing || snap.time > 0) ? snap.segment : -1}
            onSeek={seekable ? jumpTo : undefined}
          />
          {seekable && (
            <p className="mt-2.5 text-[11.5px] text-faint">
              Touche une réplique pour la réécouter.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TransportButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink transition hover:border-navy/20 active:scale-[0.97]"
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      className="block size-4 animate-spin rounded-full border-2 border-transparent"
      style={{ borderTopColor: 'currentColor', borderRightColor: 'currentColor', opacity: 0.7 }}
    />
  );
}

/**
 * Transcription. Quand la navigation est possible, chaque réplique devient un
 * point d'entrée dans l'audio et celle en cours est surlignée : on suit le texte
 * à l'oreille, puis on rejoue la ligne qui a résisté.
 */
function Transcript({
  lines,
  active = -1,
  onSeek,
}: {
  lines: AudioLine[];
  active?: number;
  onSeek?: (index: number) => void;
}) {
  return (
    <div className="space-y-1 text-[14.5px] leading-relaxed text-ink">
      {lines.map((line, i) => {
        const body = (
          <>
            {line.speaker && <span className="mr-1.5 font-medium text-navy">{line.speaker} —</span>}
            {line.text}
          </>
        );

        if (!onSeek) {
          return (
            <p key={i} className="py-1">
              {body}
            </p>
          );
        }

        return (
          <button
            key={i}
            onClick={() => onSeek(i)}
            className="-mx-2 block w-[calc(100%+1rem)] rounded-xl px-2 py-1 text-left transition"
            style={
              i === active
                ? { background: 'color-mix(in srgb, var(--color-tide) 9%, transparent)' }
                : undefined
            }
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
