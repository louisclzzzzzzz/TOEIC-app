/** Bilan de fin de session : score, détail par partie, erreurs à retenir. */

import { useMemo } from 'react';
import type { PartId, SessionMode } from '../types';
import type { SessionResult } from './Session';
import { PARTS } from '../lib/toeic';
import {
  DetailRow,
  FlowHeader,
  PartTag,
  ProgressBar,
  StatWidget,
  accuracyColor,
  pct,
  readablePrompt,
} from '../components/ui';
import { CheckCircle, Clock, Notebook } from '../components/Icons';

interface Props {
  results: SessionResult[];
  /** Nombre de questions prévues : l'écart révèle les questions non traitées. */
  planned: number;
  mode: SessionMode;
  onHome: () => void;
  onReviewErrors: () => void;
}

export function Results({ results, planned, mode, onHome, onReviewErrors }: Props) {
  const correct = results.filter((r) => r.correct).length;
  const accuracy = results.length ? correct / results.length : null;
  const skipped = Math.max(0, planned - results.length);
  const wrong = results.filter((r) => !r.correct);
  const totalSec = Math.round(results.reduce((s, r) => s + r.ms, 0) / 1000);

  const byPart = useMemo(() => {
    const map = new Map<PartId, { n: number; ok: number }>();
    for (const r of results) {
      const cur = map.get(r.part) ?? { n: 0, ok: 0 };
      cur.n += 1;
      if (r.correct) cur.ok += 1;
      map.set(r.part, cur);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [results]);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-16">
      <FlowHeader title="Bilan de session" onBack={onHome} />

      <section className="card py-10 text-center">
        <p className="eyebrow mb-4">Score</p>
        {/* Chiffre en sans : le « % » de Playfair est démesuré et se désaligne
            des chiffres. Les valeurs numériques restent en Inter partout. */}
        <p
          className="font-sans text-[58px] font-semibold leading-none tracking-tight tabular-nums"
          style={{ color: accuracyColor(accuracy) }}
        >
          {pct(accuracy)}
        </p>
        <p className="mt-3 text-[14px] text-muted">
          {correct} bonne{correct > 1 ? 's' : ''} réponse{correct > 1 ? 's' : ''} sur{' '}
          {results.length}
          {skipped > 0 && ` · ${skipped} non traitée${skipped > 1 ? 's' : ''}`}
        </p>
        <div className="mx-auto mt-6 max-w-xs">
          <ProgressBar value={accuracy ?? 0} color={accuracyColor(accuracy)} />
        </div>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3">
        <StatWidget
          icon={<Clock size={17} />}
          label="Temps de réponse"
          value={totalSec >= 60 ? `${Math.floor(totalSec / 60)} min` : `${totalSec} s`}
          hint={`${Math.round(totalSec / Math.max(1, results.length))} s par question`}
        />
        <StatWidget
          icon={wrong.length ? <Notebook size={17} /> : <CheckCircle size={17} />}
          label="À réviser"
          value={wrong.length}
          hint={wrong.length ? 'ajoutées à la file' : 'aucune erreur'}
          color={wrong.length ? 'var(--color-flame)' : 'var(--color-sage)'}
        />
      </section>

      {byPart.length > 1 && (
        <section className="mt-8">
          <h2 className="eyebrow mb-4">Détail par partie</h2>
          <div className="card divide-y divide-line-soft py-1">
            {byPart.map(([part, v]) => (
              <DetailRow
                key={part}
                label={PARTS[part].name}
                sub={`Part ${part}`}
                value={`${v.ok}/${v.n}`}
                ratio={v.ok / v.n}
                color={accuracyColor(v.ok / v.n)}
              />
            ))}
          </div>
        </section>
      )}

      {wrong.length > 0 && (
        <section className="mt-8">
          <h2 className="eyebrow mb-4">{mode === 'exam' ? 'Corrections' : 'À retenir'}</h2>
          <div className="space-y-3">
            {wrong.map((r) => (
              <article key={r.itemId} className="card">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <PartTag part={r.part} compact />
                  <span className="text-[11.5px] text-muted">
                    ta réponse {r.chosen ?? '—'} · correcte {r.answer}
                  </span>
                </div>
                <p className="font-display text-[17px] leading-snug text-navy">
                  {readablePrompt(r.prompt)}
                </p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{r.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex gap-2">
        <button onClick={onHome} className="btn-quiet flex-1">
          Accueil
        </button>
        <button onClick={onReviewErrors} className="btn-primary flex-1">
          Voir le journal
        </button>
      </div>
    </div>
  );
}
