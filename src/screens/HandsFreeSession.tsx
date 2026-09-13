/**
 * Mode Écoute — déroulé d'une séance mains libres.
 *
 * L'écran n'est pas l'outil de travail : l'oreille l'est. Il sert à jeter un
 * coup d'œil entre deux foulées, donc tout y est grand, immobile, et sans rien
 * à toucher — le fil avance seul du premier « Part two. » au dernier « The
 * correct answer is C. ».
 *
 * Règle d'affichage : **à l'écran, exactement ce que l'examen imprime.** Les
 * propositions de Part 3 à 7 sont sur la feuille le jour J, elles sont donc
 * affichées ; la conversation de Part 3 ne l'est pas, elle reste invisible ;
 * la Part 2 n'imprime rien du tout, on ne voit que A, B, C. Ce qui change par
 * rapport à une session normale, c'est que TOUT est aussi prononcé.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PartId } from '../types';
import type { Chapter, HandsFreePlan } from '../lib/handsFree';
import type { PlayerState } from '../lib/handsFreePlayer';
import { HandsFreePlayer } from '../lib/handsFreePlayer';
import { PARTS } from '../lib/toeic';
import { stopPlayback } from '../lib/tts';
import { useApp } from '../store';
import { PassageView, SentenceWithBlank, withBlanks } from '../components/Passage';
import { FlowHeader, PartTag, ProgressBar, Tag } from '../components/ui';
import { CheckCircle, Headphones, Pause, Play, SkipBack, SkipForward } from '../components/Icons';

interface Props {
  plan: HandsFreePlan;
  onExit: () => void;
}

/** « ≈ 6 min » : l'estimation est calibrée, la fausse précision ne l'est pas. */
function remainingLabel(seconds: number): string {
  if (seconds <= 45) return 'presque fini';
  return `≈ ${Math.max(1, Math.round(seconds / 60))} min`;
}

/**
 * Le texte de ce qui a été prononcé, donné une fois la réponse tombée.
 *
 * Pendant la question, l'écran s'en tient à ce que l'examen imprime. Après, la
 * règle n'a plus d'objet : c'est le moment de relire la phrase qui a résisté,
 * et le document a défilé depuis longtemps.
 */
function Transcript({ transcript, part }: { transcript: Chapter['transcript']; part: PartId }) {
  if (!transcript) return null;
  const { lines, passages, blank, sentence } = transcript;

  return (
    <div className="animate-rise mt-3 space-y-3">
      {sentence && (
        <div className="card">
          <p className="eyebrow mb-2">Phrase complète</p>
          <p className="font-display text-[17px] leading-relaxed text-navy">{sentence}</p>
        </div>
      )}

      {!!lines?.length && (
        <div className="card">
          <p className="eyebrow mb-2.5">Transcription</p>
          <div className="space-y-1.5 text-[14.5px] leading-relaxed text-ink">
            {lines.map((line, i) => (
              <p key={i}>
                {line.speaker && (
                  <span className="mr-1.5 font-medium text-navy">{line.speaker} —</span>
                )}
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {passages?.map((passage, i) => (
        <PassageView
          key={i}
          passage={passage}
          index={i}
          total={passages.length}
          highlightBlank={part === 6 ? blank : undefined}
        />
      ))}
    </div>
  );
}

export function HandsFreeSession({ plan, onExit }: Props) {
  const { state, markHeard } = useApp();
  const { settings } = state;

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pos, setPos] = useState<PlayerState>({
    chapter: 0,
    beat: 0,
    playing: false,
    elapsed: 0,
    total: plan.seconds,
  });

  const player = useRef<HandsFreePlayer | null>(null);

  /* --- Cycle de vie du lecteur -------------------------------------- */

  useEffect(() => {
    stopPlayback(); // couper tout audio laissé par un autre écran
    const instance = new HandsFreePlayer(plan.chapters, {
      rate: settings.speechRate,
      useClips: settings.ttsEngine === 'mistral',
      onState: setPos,
      onNotice: setNotice,
      onEnd: () => setDone(true),
    });
    player.current = instance;

    let cancelled = false;
    void instance.load(setProgress).then(() => {
      if (cancelled) return;
      setReady(true);
      instance.start();
    });

    return () => {
      cancelled = true;
      instance.dispose();
      player.current = null;
    };
    // Le lecteur vit le temps de la séance : ni le plan ni les réglages ne
    // changent en cours de route (les modifier relancerait la lecture).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Blocs réellement entendus : ils ne ressortiront pas à la prochaine séance.
   * Tant qu'aucun battement n'est passé, la liste reste vide — ouvrir puis
   * refermer l'écran ne doit ni consommer du contenu ni valider la journée.
   */
  const heard = useMemo(
    () =>
      pos.chapter || pos.beat
        ? [...new Set(plan.chapters.slice(0, pos.chapter + 1).map((c) => c.setId))]
        : [],
    [plan.chapters, pos.chapter, pos.beat],
  );
  // Enregistré au démontage seulement : quitter en cours de route compte ce
  // qui a été écouté, aller au bout compte tout. Les deux valeurs passent par
  // une ref, car `markHeard` change d'identité à chaque écriture du store —
  // en dépendance d'effet, sa mise à jour relancerait le nettoyage, qui
  // réécrirait le store, en boucle.
  const closing = useRef({ markHeard, heard });
  closing.current = { markHeard, heard };
  useEffect(() => () => closing.current.markHeard(closing.current.heard), []);

  /* --- Écran allumé, contrôles sur l'écran de verrouillage ----------- */

  useEffect(() => {
    if (!('wakeLock' in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let stopped = false;

    const acquire = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // Batterie faible, onglet masqué : sans verrou, l'écran s'éteindra.
      }
    };
    // Le verrou saute quand l'onglet passe en arrière-plan : on le reprend.
    const onVisible = () => {
      if (!stopped && document.visibilityState === 'visible') void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', onVisible);
      void sentinel?.release().catch(() => {});
    };
  }, []);

  const chapter = plan.chapters[pos.chapter];

  /* --- Suivre le fil sans y toucher --------------------------------- */

  /**
   * Élément « en cours » : le paragraphe que la voix lit, ou la correction qui
   * vient de tomber. L'écran se recale dessus tout seul — personne ne va faire
   * défiler une page en marchant.
   */
  const spot = useRef<HTMLElement | null>(null);
  const setSpot = (el: HTMLElement | null) => {
    spot.current = el;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pos.chapter]);

  const answering = plan.chapters[pos.chapter]?.beats[pos.beat]?.role === 'answer';
  useEffect(() => {
    spot.current?.scrollIntoView({
      // À la correction, la réponse se cale en haut : la transcription qui la
      // suit entre dans l'écran sans avoir à la chercher. Le reste du temps,
      // `nearest` ne bouge que si l'élément est hors de vue — sinon la page
      // sautillerait à chaque réplique.
      block: answering ? 'start' : 'nearest',
      behavior: 'smooth',
    });
  }, [pos.chapter, pos.beat, answering]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const control = player.current;
    if (!control) return;
    navigator.mediaSession.setActionHandler('play', () => control.resume());
    navigator.mediaSession.setActionHandler('pause', () => control.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => control.next());
    navigator.mediaSession.setActionHandler('previoustrack', () => control.previous());
    return () => {
      for (const action of ['play', 'pause', 'nexttrack', 'previoustrack'] as const) {
        navigator.mediaSession.setActionHandler(action, null);
      }
    };
  }, [ready]);

  useEffect(() => {
    if (!('mediaSession' in navigator) || !chapter) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: chapter.label,
      artist: PARTS[chapter.part].label,
      album: 'TOEIC · Écoute mains libres',
    });
    navigator.mediaSession.playbackState = pos.playing ? 'playing' : 'paused';
  }, [chapter, pos.playing]);

  /* --- Chargement ----------------------------------------------------- */

  if (!ready) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-8 text-center">
        <div className="w-full">
          <span
            className="icon-well mx-auto size-14"
            style={{
              background: 'color-mix(in srgb, var(--color-tide) 12%, var(--color-surface))',
              color: 'var(--color-tide)',
            }}
          >
            <Headphones size={24} />
          </span>
          <p className="mt-5 font-display text-[21px] text-navy">Préparation de la séance</p>
          <p className="mt-1.5 text-[13px] text-muted">
            Les clips sont téléchargés d’un coup : une fois partie, la séance ne dépend plus du
            réseau.
          </p>
          <div className="mt-6">
            <ProgressBar value={progress} />
          </div>
          <p className="mt-2 text-[12px] tabular-nums text-faint">{Math.round(progress * 100)} %</p>
          <button onClick={onExit} className="btn-quiet mt-8">
            Annuler
          </button>
        </div>
      </div>
    );
  }

  const beat = chapter?.beats[pos.beat];
  // `lead` par défaut : entre deux chapitres, rien n'est encore révélé.
  const role = beat?.role ?? 'lead';
  const revealed = role === 'answer' || (done && !!chapter?.reveal);
  const questionsDone = plan.chapters.slice(0, pos.chapter + 1).filter((c) => c.itemId).length;

  const status =
    role === 'think'
      ? 'À toi.'
      : role === 'answer'
        ? 'Réponse'
        : role === 'choice'
          ? 'Propositions'
          : role === 'question'
            ? 'Énoncé'
            : role === 'stimulus'
              ? 'Écoute'
              : 'Annonce';

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-40">
      <FlowHeader
        title="Écoute"
        meta={
          plan.questionCount
            ? `Question ${Math.min(questionsDone || 1, plan.questionCount)} sur ${plan.questionCount}`
            : undefined
        }
        onBack={onExit}
        right={
          <span className="tag tabular-nums" style={{ background: 'var(--color-surface-sunk)' }}>
            {remainingLabel(Math.max(0, pos.total - pos.elapsed))}
          </span>
        }
      />

      <ProgressBar value={pos.total ? pos.elapsed / pos.total : 0} height={4} />

      {done ? (
        <div className="mt-10 flex-1">
          <div className="card text-center">
            <span
              className="icon-well mx-auto size-14"
              style={{
                background: 'color-mix(in srgb, var(--color-sage) 12%, var(--color-surface))',
                color: 'var(--color-sage)',
              }}
            >
              <CheckCircle size={24} />
            </span>
            <p className="mt-4 font-display text-[22px] text-navy">Séance terminée.</p>
            <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-muted">
              {plan.questionCount} question{plan.questionCount > 1 ? 's' : ''} écoutée
              {plan.questionCount > 1 ? 's' : ''} en {Math.round(plan.seconds / 60)} minutes. Rien
              n’est noté — les réponses sont restées dans ta tête — mais les blocs entendus ne
              reviendront pas à la prochaine séance.
            </p>
            <button onClick={onExit} className="btn-primary mt-6">
              Terminer
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex-1">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {chapter && <PartTag part={chapter.part} />}
            <span className="eyebrow">{chapter?.label}</span>
            <span
              className="ml-auto text-[12px] font-medium"
              style={{ color: role === 'think' ? 'var(--color-flame)' : 'var(--color-faint)' }}
            >
              {status}
            </span>
          </div>

          {chapter?.question ? (
            <>
              {!chapter.question.printed ? (
                <p className="text-[15px] leading-relaxed text-muted">
                  Question et réponses uniquement à l’oral, comme à l’examen.
                </p>
              ) : chapter.part === 5 ? (
                <SentenceWithBlank text={chapter.question.prompt ?? ''} />
              ) : (
                chapter.question.prompt && (
                  <p className="font-display text-[22px] leading-snug text-navy">
                    {chapter.question.prompt}
                  </p>
                )
              )}

              <div className="mt-5 space-y-2.5">
                {chapter.question.choices.map((choice) => {
                  const right = revealed && choice.id === chapter.reveal?.answer;
                  const reading = !revealed && beat?.focus === choice.id;
                  return (
                    <div
                      key={choice.id}
                      className="flex items-start gap-3.5 rounded-2xl border p-4 transition duration-200"
                      style={{
                        borderColor: right
                          ? 'color-mix(in srgb, var(--color-sage) 45%, transparent)'
                          : reading
                            ? 'var(--color-navy)'
                            : 'var(--color-line)',
                        background: right
                          ? 'color-mix(in srgb, var(--color-sage) 7%, var(--color-surface))'
                          : 'var(--color-surface)',
                      }}
                    >
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
                        style={{
                          background: right
                            ? 'var(--color-sage)'
                            : reading
                              ? 'var(--color-navy)'
                              : 'var(--color-surface-sunk)',
                          color:
                            right || reading ? 'var(--color-surface)' : 'var(--color-muted)',
                        }}
                      >
                        {choice.id}
                      </span>
                      {/* Part 2 : le texte des réponses reste caché jusqu'à la
                          correction, sinon il suffirait de lire pour répondre. */}
                      {(chapter.question!.printed || revealed) && (
                        <span className="pt-0.5 text-[15px] leading-relaxed text-ink">
                          {choice.text}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {revealed && chapter.reveal && (
                <div
                  ref={setSpot}
                  className="animate-rise mt-5 scroll-mb-36 rounded-2xl border p-5"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--color-sage) 30%, transparent)',
                    background: 'color-mix(in srgb, var(--color-sage) 6%, var(--color-surface))',
                  }}
                >
                  <p className="font-display text-[19px]" style={{ color: 'var(--color-sage)' }}>
                    Réponse {chapter.reveal.answer} — {chapter.reveal.text}
                  </p>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink">
                    {chapter.reveal.explanation}
                  </p>
                  <p className="eyebrow mt-4 border-t border-line-soft pt-3.5">
                    {chapter.reveal.category}
                  </p>
                </div>
              )}

              {revealed && chapter.transcript && (
                <Transcript transcript={chapter.transcript} part={chapter.part} />
              )}
            </>
          ) : chapter && chapter.part <= 4 ? (
            /* Conversation ou monologue : rien n'est imprimé à l'examen. Seule
               l'étiquette du locuteur bouge, pour suivre qui parle d'un regard. */
            <div className="card">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-[22px] leading-snug text-navy">
                  {chapter.part === 3 ? 'Conversation' : 'Monologue'}
                </p>
                {beat?.line?.speaker && <Tag color="var(--color-tide)">{beat.line.speaker}</Tag>}
              </div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
                La transcription n’est pas affichée : à l’examen, l’audio ne passe qu’une fois et
                rien n’est écrit. Les questions arrivent juste après.
              </p>
            </div>
          ) : (
            /* Document de lecture : il est sous les yeux le jour J, il l'est ici.
               Le paragraphe en cours de lecture est le seul en pleine encre —
               un coup d'œil suffit à retrouver où en est la voix. */
            <div className="card space-y-3">
              {chapter?.beats
                .filter((b) => b.role === 'stimulus')
                .map((b, i) => (
                  <p
                    key={i}
                    ref={b === beat ? setSpot : undefined}
                    className="scroll-mb-36 whitespace-pre-line font-display text-[16px] leading-relaxed transition"
                    style={{ color: b === beat ? 'var(--color-navy)' : 'var(--color-faint)' }}
                  >
                    {withBlanks(b.display ?? b.line?.text ?? '')}
                  </p>
                ))}
            </div>
          )}

          {notice && (
            <p className="mt-5 text-[12.5px] leading-relaxed" style={{ color: 'var(--color-flame)' }}>
              {notice}
            </p>
          )}
        </div>
      )}

      {/* --- Transport : gros boutons, atteignables sans regarder -------- */}
      {!done && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-soft bg-cream/95 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-center gap-8">
            <button
              onClick={() => player.current?.previous()}
              aria-label="Passage précédent"
              className="grid size-14 place-items-center rounded-full border border-line bg-surface text-ink transition active:scale-95"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => player.current?.toggle()}
              aria-label={pos.playing ? 'Mettre en pause' : 'Reprendre'}
              className="grid size-16 place-items-center rounded-full bg-navy text-cream transition active:scale-95"
            >
              {pos.playing ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button
              onClick={() => player.current?.next()}
              aria-label="Passage suivant"
              className="grid size-14 place-items-center rounded-full border border-line bg-surface text-ink transition active:scale-95"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
