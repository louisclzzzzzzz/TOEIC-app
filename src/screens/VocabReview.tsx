/**
 * Révision du vocabulaire en flashcards.
 *
 * Sens anglais → français : le TOEIC est un test de RECONNAISSANCE (on lit et
 * on écoute, on ne produit pas), donc c'est ce sens qu'il faut entraîner.
 *
 * L'auto-évaluation (« je savais » / « à revoir ») alimente les mêmes boîtes
 * Leitner que le reste de l'app.
 */

import { useMemo, useRef, useState } from 'react';
import type { VocabEntry } from '../types';
import { useApp } from '../store';
import { buildVocabSession } from '../lib/vocab';
import { playLines, stopPlayback } from '../lib/tts';
import { FlowHeader, ProgressBar, Tag, sectionColor } from '../components/ui';
import { Sound } from '../components/Icons';

export function VocabReview({ onDone }: { onDone: () => void }) {
  const { state, reviewVocabEntry } = useApp();
  const { settings } = state;

  // File figée à l'ouverture : la révision ne doit pas se réordonner sous les
  // doigts à mesure que les échéances changent.
  const queue = useMemo(() => buildVocabSession(state.vocab, 20), []);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const score = useRef({ known: 0, again: 0 });

  const entry: VocabEntry | undefined = queue[index];

  const answer = (known: boolean) => {
    if (!entry) return;
    reviewVocabEntry(entry.id, known);
    score.current[known ? 'known' : 'again'] += 1;
    stopPlayback();
    if (index + 1 >= queue.length) return onDone();
    setIndex(index + 1);
    setRevealed(false);
  };

  /** Écouter le mot : la prononciation compte autant que le sens en listening. */
  const listen = () => {
    if (!entry) return;
    void playLines([{ text: entry.example || entry.term, voice: 'female' }], {
      engine: settings.ttsEngine,
      rate: settings.speechRate,
    });
  };

  if (!entry) {
    return (
      <div className="mx-auto max-w-2xl px-5">
        <FlowHeader title="Révision du carnet" onBack={onDone} />
        <p className="text-sm text-muted">Rien à réviser pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pb-32">
      <FlowHeader
        title="Révision du carnet"
        meta={`Carte ${index + 1} sur ${queue.length}`}
        onBack={() => {
          stopPlayback();
          onDone();
        }}
      />
      <ProgressBar value={index / queue.length} height={4} />

      <div className="flex flex-1 flex-col justify-center py-8">
        <div className="card flex min-h-[300px] flex-col items-center justify-center py-10 text-center">
          <Tag color={entry.sourcePart ? sectionColor(entry.sourcePart) : 'var(--color-muted)'}>
            {entry.origin === 'missed' ? `raté en Part ${entry.sourcePart ?? '?'}` : 'ajouté'}
          </Tag>

          <p className="mt-6 font-display text-[34px] leading-tight text-navy">{entry.term}</p>

          <button
            onClick={listen}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12.5px] font-medium text-ink transition hover:border-navy/20"
          >
            <Sound size={15} /> Écouter
          </button>

          {revealed ? (
            <div className="animate-rise mt-7 w-full space-y-3 border-t border-line-soft pt-6">
              <p className="font-display text-[22px]" style={{ color: 'var(--color-iris)' }}>
                {entry.translation}
              </p>
              {entry.example && (
                <p className="font-display text-[15.5px] italic leading-relaxed text-ink">
                  « {entry.example} »
                </p>
              )}
              {entry.note && (
                <p className="mx-auto max-w-sm text-[13.5px] leading-relaxed text-muted">
                  {entry.note}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-10 text-[13.5px] text-faint">Rappelle-toi le sens, puis vérifie.</p>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-soft bg-cream/95 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3.5 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          {revealed ? (
            <>
              <button
                onClick={() => answer(false)}
                className="btn flex-1"
                style={{
                  background: 'color-mix(in srgb, var(--color-clay) 10%, var(--color-surface))',
                  color: 'var(--color-clay)',
                  border: '1px solid color-mix(in srgb, var(--color-clay) 30%, transparent)',
                }}
              >
                À revoir
              </button>
              <button
                onClick={() => answer(true)}
                className="btn flex-1"
                style={{ background: 'var(--color-sage)', color: 'var(--color-surface)' }}
              >
                Je savais
              </button>
            </>
          ) : (
            <button onClick={() => setRevealed(true)} className="btn-primary flex-1">
              Afficher la traduction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
