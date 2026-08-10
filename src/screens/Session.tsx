/**
 * Déroulé d'une session (practice, mixte, révision, examen blanc).
 *
 * Règles reprises de l'examen réel :
 *  - Parts 1 et 2 : ni énoncé ni propositions à l'écran avant la réponse, on
 *    ne voit que les lettres — tout passe par l'oreille.
 *  - Parts 3 et 4 : l'audio est diffusé, les questions sont imprimées, le
 *    script n'apparaît qu'après la réponse.
 *  - Mode examen : aucune correction avant la fin, et chronomètre par section.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Letter, PartId, Section, SessionMode } from '../types';
import type { SessionBlock } from '../lib/selection';
import { hasSpokenChoices, sectionOf } from '../lib/toeic';
import { useApp } from '../store';
import { AudioPlayer } from '../components/AudioPlayer';
import { PassageView, SentenceWithBlank } from '../components/Passage';
import { Scene } from '../components/Scene';
import { VocabSheet } from '../components/VocabSheet';
import { FlowHeader, PartTag, ProgressBar, formatClock } from '../components/ui';
import { CheckCircle, Clock, Notebook } from '../components/Icons';
import { stopPlayback } from '../lib/tts';

export interface SessionResult {
  itemId: string;
  setId: string;
  part: PartId;
  correct: boolean;
  chosen: Letter | null;
  answer: Letter;
  prompt: string;
  explanation: string;
  ms: number;
}

interface Props {
  blocks: SessionBlock[];
  mode: SessionMode;
  title: string;
  /**
   * Budget temps par section (examen blanc). Comme à l'examen réel, le temps
   * du listening ne peut pas être reporté sur le reading : quand le compteur
   * d'une section tombe à zéro, on passe directement à la suivante.
   */
  sectionLimits?: Record<Section, number>;
  onFinish: (results: SessionResult[]) => void;
  onExit: () => void;
}

export function Session({ blocks, mode, title, sectionLimits, onFinish, onExit }: Props) {
  const { state, answer } = useApp();
  const immediateFeedback = mode !== 'exam';

  const [blockIndex, setBlockIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [selected, setSelected] = useState<Letter | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(false);
  const results = useRef<SessionResult[]>([]);
  const itemStart = useRef(Date.now());

  const block = blocks[blockIndex];
  const item = block?.items[itemIndex];

  const totalItems = useMemo(() => blocks.reduce((n, b) => n + b.items.length, 0), [blocks]);
  const doneItems = useMemo(
    () => blocks.slice(0, blockIndex).reduce((n, b) => n + b.items.length, 0) + itemIndex,
    [blocks, blockIndex, itemIndex],
  );

  const finish = useCallback(() => {
    stopPlayback();
    onFinish(results.current);
  }, [onFinish]);

  /* --- Chronomètre par section (examen blanc) ----------------------- */
  const section: Section = block ? sectionOf(block.set.part) : 'listening';
  const [remaining, setRemaining] = useState(sectionLimits?.listening ?? 0);

  useEffect(() => {
    if (sectionLimits) setRemaining(sectionLimits[section]);
  }, [section, sectionLimits]);

  /** Temps écoulé : on saute à la section suivante, ou on clôture. */
  const skipSection = useCallback(() => {
    const next = blocks.findIndex((b) => sectionOf(b.set.part) !== section);
    if (next === -1 || next <= blockIndex) return finish();
    stopPlayback();
    setBlockIndex(next);
    setItemIndex(0);
  }, [blocks, section, blockIndex, finish]);

  useEffect(() => {
    if (!sectionLimits) return;
    const id = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => window.clearInterval(id);
  }, [sectionLimits]);

  // Le passage à zéro est traité dans un effet séparé : déclencher une
  // navigation depuis l'updater de `setRemaining` serait un effet de bord
  // pendant le rendu.
  useEffect(() => {
    if (sectionLimits && remaining === 0) skipSection();
  }, [remaining, sectionLimits, skipSection]);

  /* --- Chronométrage par question ---------------------------------- */
  useEffect(() => {
    itemStart.current = Date.now();
    setSelected(null);
    setRevealed(false);
    setVocabOpen(false);
    window.scrollTo({ top: 0 });
  }, [blockIndex, itemIndex]);

  // La correction est sous les propositions : on l'amène dans le champ de
  // vision, sinon elle passe inaperçue sur un écran de téléphone.
  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (revealed) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [revealed]);

  useEffect(() => stopPlayback, []);

  if (!block || !item) {
    return (
      <div className="mx-auto max-w-2xl px-5">
        <FlowHeader title={title} onBack={onExit} />
        <p className="text-sm text-muted">Aucune question disponible pour ces critères.</p>
      </div>
    );
  }

  const part = block.set.part;
  const spokenChoices = hasSpokenChoices(part);
  const isLast = blockIndex === blocks.length - 1 && itemIndex === block.items.length - 1;

  /** Enregistre la réponse (stats + Leitner + vocabulaire). */
  const commit = (chosen: Letter) => {
    const ms = Date.now() - itemStart.current;
    answer({ set: block.set, item, chosen, ms, mode });
    results.current.push({
      itemId: item.id,
      setId: block.set.id,
      part,
      correct: chosen === item.answer,
      chosen,
      answer: item.answer,
      prompt: item.prompt ?? block.set.title,
      explanation: item.explanation,
      ms,
    });
  };

  const goNext = () => {
    if (isLast) return finish();
    stopPlayback();
    if (itemIndex + 1 < block.items.length) setItemIndex(itemIndex + 1);
    else {
      setBlockIndex(blockIndex + 1);
      setItemIndex(0);
    }
  };

  const onValidate = () => {
    if (!selected) return;
    commit(selected);
    if (immediateFeedback) setRevealed(true);
    else goNext();
  };

  const correct = revealed && selected === item.answer;

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-32">
      <FlowHeader
        title={title}
        meta={`Question ${doneItems + 1} sur ${totalItems}`}
        onBack={() => setConfirmExit(true)}
        right={
          sectionLimits ? (
            <span
              className="tag tabular-nums"
              style={{
                background:
                  remaining < 60
                    ? 'color-mix(in srgb, var(--color-clay) 12%, var(--color-surface))'
                    : 'var(--color-surface-sunk)',
                color: remaining < 60 ? 'var(--color-clay)' : 'var(--color-ink)',
              }}
            >
              <Clock size={13} /> {formatClock(remaining)}
            </span>
          ) : (
            <PartTag part={part} compact />
          )
        }
      />

      <ProgressBar value={totalItems ? doneItems / totalItems : 0} height={4} />

      <div className="mt-6 flex-1 space-y-5">
        {/* --- Stimulus ------------------------------------------------ */}
        {block.set.scene && <Scene scene={block.set.scene} />}

        {block.set.audio && (
          <AudioPlayer
            lines={block.set.audio}
            autoPlay={state.settings.autoPlay}
            playKey={block.set.id}
            revealed={revealed}
            label={part === 3 ? 'Conversation' : 'Monologue'}
          />
        )}

        {item.audio && (
          <AudioPlayer
            lines={item.audio}
            autoPlay={state.settings.autoPlay}
            playKey={item.id}
            revealed={revealed}
            label={part === 1 ? 'Quatre descriptions' : 'Question et réponses'}
          />
        )}

        {block.set.passages?.map((p, i) => (
          <PassageView
            key={i}
            passage={p}
            index={i}
            total={block.set.passages!.length}
            highlightBlank={part === 6 ? itemIndex + 1 : undefined}
          />
        ))}

        {/* --- Énoncé -------------------------------------------------- */}
        {spokenChoices ? (
          <p className="text-[14px] text-muted">
            {part === 1
              ? 'Écoute les quatre descriptions et choisis celle qui correspond à la photo.'
              : 'Écoute la question puis choisis la meilleure réponse.'}
          </p>
        ) : part === 5 ? (
          <SentenceWithBlank text={item.prompt ?? ''} />
        ) : (
          <p className="font-display text-[21px] leading-snug text-navy">{item.prompt}</p>
        )}

        {/* --- Propositions -------------------------------------------- */}
        <div className="space-y-2.5">
          {item.choices.map((choice) => {
            const isPicked = selected === choice.id;
            const isAnswer = choice.id === item.answer;
            const showText = !spokenChoices || revealed;

            let border = 'var(--color-line)';
            let background = 'var(--color-surface)';
            let mark = 'var(--color-surface-sunk)';
            let markText = 'var(--color-muted)';

            if (revealed && isAnswer) {
              border = 'color-mix(in srgb, var(--color-sage) 45%, transparent)';
              background = 'color-mix(in srgb, var(--color-sage) 7%, var(--color-surface))';
              mark = 'var(--color-sage)';
              markText = 'var(--color-surface)';
            } else if (revealed && isPicked) {
              border = 'color-mix(in srgb, var(--color-clay) 45%, transparent)';
              background = 'color-mix(in srgb, var(--color-clay) 7%, var(--color-surface))';
              mark = 'var(--color-clay)';
              markText = 'var(--color-surface)';
            } else if (isPicked) {
              border = 'var(--color-navy)';
              mark = 'var(--color-navy)';
              markText = 'var(--color-cream)';
            }

            return (
              <button
                key={choice.id}
                disabled={revealed}
                onClick={() => setSelected(choice.id)}
                className="flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition duration-200 disabled:cursor-default"
                style={{ borderColor: border, background }}
              >
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition"
                  style={{ background: mark, color: markText }}
                >
                  {choice.id}
                </span>
                {showText && (
                  <span className="pt-0.5 text-[15px] leading-relaxed text-ink">{choice.text}</span>
                )}
                {revealed && isAnswer && (
                  <span className="ml-auto shrink-0 pt-0.5" style={{ color: 'var(--color-sage)' }}>
                    <CheckCircle size={18} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* --- Correction ---------------------------------------------- */}
        {revealed && (
          <div
            ref={feedbackRef}
            className="animate-rise rounded-2xl border p-5"
            style={{
              borderColor: `color-mix(in srgb, ${correct ? 'var(--color-sage)' : 'var(--color-clay)'} 30%, transparent)`,
              background: `color-mix(in srgb, ${correct ? 'var(--color-sage)' : 'var(--color-clay)'} 6%, var(--color-surface))`,
            }}
          >
            <p
              className="font-display text-[19px]"
              style={{ color: correct ? 'var(--color-sage)' : 'var(--color-clay)' }}
            >
              {correct ? 'Correct.' : `La bonne réponse était ${item.answer}.`}
            </p>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink">{item.explanation}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3.5">
              <p className="eyebrow">{item.category}</p>
              <button
                onClick={() => setVocabOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink transition hover:border-navy/20"
              >
                <Notebook size={14} /> Vocabulaire
              </button>
            </div>

            {/* Rien n'entre au carnet tout seul : on signale juste qu'il y a des
                mots clés à ajouter, sinon leur présence reste invisible. */}
            {!correct && (item.vocab?.length ?? 0) > 0 && (
              <p className="mt-2 text-[12px] text-muted">
                {item.vocab!.length} mot{item.vocab!.length > 1 ? 's' : ''} clé
                {item.vocab!.length > 1 ? 's' : ''} à ajouter au carnet.
              </p>
            )}
          </div>
        )}

        {vocabOpen && (
          <VocabSheet item={item} part={part} correct={correct} onClose={() => setVocabOpen(false)} />
        )}
      </div>

      {/* --- Barre d'action fixe (pouce en bas d'écran) ----------------- */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-soft bg-cream/95 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3.5 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          {revealed ? (
            <button onClick={goNext} className="btn-primary flex-1">
              {isLast ? 'Voir le bilan' : 'Question suivante'}
            </button>
          ) : (
            <button onClick={onValidate} disabled={!selected} className="btn-primary flex-1">
              {immediateFeedback ? 'Valider' : isLast ? 'Terminer' : 'Suivant'}
            </button>
          )}
        </div>
      </div>

      {confirmExit && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-navy/25 p-6 backdrop-blur-sm">
          <div className="card max-w-sm">
            <h2 className="font-display text-[20px] text-navy">Quitter la session ?</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Les questions déjà validées sont enregistrées. Les suivantes seront perdues.
            </p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setConfirmExit(false)} className="btn-quiet flex-1">
                Continuer
              </button>
              <button
                onClick={() => {
                  stopPlayback();
                  onExit();
                }}
                className="btn flex-1"
                style={{ background: 'var(--color-clay)', color: 'var(--color-surface)' }}
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
