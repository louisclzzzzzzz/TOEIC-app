/** Réglage d'une session ciblée : quelles parties, combien de questions. */

import { useMemo, useState } from 'react';
import type { PartId } from '../types';
import { useApp } from '../store';
import { ALL_PARTS, PARTS, sectionOf } from '../lib/toeic';
import { allSets } from '../lib/selection';
import { partStats } from '../lib/stats';
import { FlowHeader, ProgressBar, accuracyColor, pct, sectionColor } from '../components/ui';
import { CheckCircle } from '../components/Icons';

const LENGTHS = [5, 10, 15, 20];

export function PracticeSetup({
  onStart,
  onBack,
}: {
  onStart: (parts: PartId[], length: number) => void;
  onBack: () => void;
}) {
  const { state, setSettings } = useApp();
  const [selected, setSelected] = useState<PartId[]>([]);
  const [length, setLength] = useState(state.settings.sessionLength);

  const sets = useMemo(() => allSets(state), [state]);
  const stats = useMemo(() => partStats(state.attempts), [state.attempts]);
  const available = (part: PartId) =>
    sets.filter((s) => s.part === part).reduce((n, s) => n + s.items.length, 0);

  const toggle = (part: PartId) =>
    setSelected((cur) => (cur.includes(part) ? cur.filter((p) => p !== part) : [...cur, part]));

  const start = () => {
    if (!selected.length) return;
    setSettings({ sessionLength: length });
    onStart(selected, length);
  };

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32">
      <FlowHeader title="Practice ciblé" meta="Choisis les parties à travailler" onBack={onBack} />

      <div className="space-y-2.5">
        {ALL_PARTS.map((part) => {
          const stat = stats.find((s) => s.part === part)!;
          const on = selected.includes(part);
          const count = available(part);
          const color = sectionColor(part);

          return (
            <button
              key={part}
              onClick={() => toggle(part)}
              disabled={count === 0}
              className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 disabled:opacity-40"
              style={{
                borderColor: on ? 'var(--color-navy)' : 'var(--color-line)',
                background: on
                  ? 'color-mix(in srgb, var(--color-navy) 4%, var(--color-surface))'
                  : 'var(--color-surface)',
              }}
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-semibold"
                style={{
                  background: on ? 'var(--color-navy)' : `color-mix(in srgb, ${color} 12%, var(--color-surface))`,
                  color: on ? 'var(--color-cream)' : color,
                }}
              >
                {on ? <CheckCircle size={17} /> : `P${part}`}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-navy">{PARTS[part].name}</p>
                <p className="truncate text-[12.5px] text-muted">
                  {sectionOf(part) === 'listening' ? 'Listening' : 'Reading'} · {PARTS[part].hint}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p
                  className="text-[14px] font-semibold tabular-nums"
                  style={{ color: accuracyColor(stat.accuracy) }}
                >
                  {pct(stat.accuracy)}
                </p>
                <p className="text-[11px] text-faint tabular-nums">{count} q.</p>
              </div>
            </button>
          );
        })}
      </div>

      <h2 className="eyebrow mb-3 mt-8">Longueur de session</h2>
      <div className="flex gap-2">
        {LENGTHS.map((n) => (
          <button
            key={n}
            onClick={() => setLength(n)}
            className={`flex-1 rounded-full border py-3 text-[14px] font-medium tabular-nums transition ${
              length === n
                ? 'border-navy bg-navy text-cream'
                : 'border-line bg-surface text-muted hover:border-navy/20'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <ProgressBar value={length / 20} />
      </div>
      <p className="mt-2 text-[12.5px] text-muted">
        Environ {Math.round(length * 0.75)} à {Math.round(length * 1.5)} minutes selon les parties
        choisies.
      </p>

      <div className="fixed inset-x-0 bottom-0 border-t border-line-soft bg-cream/95 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3.5 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button onClick={start} disabled={!selected.length} className="btn-primary w-full">
            {selected.length
              ? `Démarrer · ${selected.length} partie${selected.length > 1 ? 's' : ''}`
              : 'Choisis au moins une partie'}
          </button>
        </div>
      </div>
    </div>
  );
}
