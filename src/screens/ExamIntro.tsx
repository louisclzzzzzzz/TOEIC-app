/** Écran d'avant-examen : composition du test blanc et règles du chronomètre. */

import { useMemo } from 'react';
import { useApp } from '../store';
import { buildExamSession, sectionDurationSec } from '../lib/selection';
import type { SessionBlock } from '../lib/selection';
import { PARTS, sectionOf } from '../lib/toeic';
import { DetailRow, FlowHeader, formatClock, sectionColor } from '../components/ui';

export function ExamIntro({
  onStart,
  onBack,
}: {
  onStart: (blocks: SessionBlock[]) => void;
  onBack: () => void;
}) {
  const { state } = useApp();
  const blocks = useMemo(() => buildExamSession(state), [state]);

  const listeningSec = sectionDurationSec(blocks, 'listening');
  const readingSec = sectionDurationSec(blocks, 'reading');
  const total = listeningSec + readingSec;

  const perPart = Object.values(PARTS)
    .map((meta) => ({
      meta,
      count: blocks.filter((b) => b.set.part === meta.id).reduce((n, b) => n + b.items.length, 0),
    }))
    .filter((p) => p.count > 0);

  const maxCount = Math.max(1, ...perPart.map((p) => p.count));

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32">
      <FlowHeader title="Examen blanc" meta="Format resserré, rythme réel" onBack={onBack} />

      <section className="card py-10 text-center">
        <p className="eyebrow mb-4">Durée totale</p>
        <p className="font-display text-[60px] leading-none text-navy tabular-nums">
          {formatClock(total)}
        </p>
        <div className="mt-5 flex items-center justify-center gap-8 text-[13px]">
          <span className="text-muted">
            Listening{' '}
            <span className="font-medium tabular-nums" style={{ color: 'var(--color-tide)' }}>
              {formatClock(listeningSec)}
            </span>
          </span>
          <span className="text-muted">
            Reading{' '}
            <span className="font-medium tabular-nums" style={{ color: 'var(--color-iris)' }}>
              {formatClock(readingSec)}
            </span>
          </span>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow mb-4">Composition</h2>
        <div className="card divide-y divide-line-soft py-1">
          {perPart.map(({ meta, count }) => (
            <DetailRow
              key={meta.id}
              label={meta.name}
              sub={`Part ${meta.id} · ${sectionOf(meta.id) === 'listening' ? 'Listening' : 'Reading'}`}
              value={`${count} q.`}
              ratio={count / maxCount}
              color={sectionColor(meta.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="eyebrow mb-4">Règles</h2>
        <div className="card space-y-3 text-[14px] leading-relaxed text-muted">
          <p>Aucune correction avant la fin : tu enchaînes les questions.</p>
          <p>
            Chronomètre par section, au rythme réel de l’examen — 27 secondes par question en
            listening, 45 en reading.
          </p>
          <p>
            Le temps non utilisé en listening n’est pas reporté. Quand une section expire, on passe
            directement à la suivante.
          </p>
          <p>Les résultats alimentent tes statistiques et ton journal comme une session normale.</p>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-line-soft bg-cream/95 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3.5 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onStart(blocks)}
            disabled={!blocks.length}
            className="btn-primary w-full"
          >
            Commencer l’examen
          </button>
        </div>
      </div>
    </div>
  );
}
