/**
 * Courbe de progression sur le mois.
 *
 * Deux informations superposées : le VOLUME par jour (barres discrètes en fond)
 * et la PRÉCISION (ligne). Les jours sans session restent vides, la ligne relie
 * les jours travaillés.
 *
 * Fait main en SVG : pas de librairie de graphes pour un seul écran, et le
 * rendu reste net sur mobile.
 */

import type { DayPoint } from '../lib/stats';

const W = 640;
const H = 190;
const PAD = { top: 16, right: 12, bottom: 26, left: 30 };

export function ProgressChart({ points }: { points: DayPoint[] }) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const maxVolume = Math.max(1, ...points.map((p) => p.attempts));
  const step = innerW / Math.max(1, points.length - 1);

  const x = (i: number) => PAD.left + i * step;
  const y = (accuracy: number) => PAD.top + innerH * (1 - accuracy);

  const withData = points
    .map((p, i) => ({ ...p, i }))
    .filter((p): p is DayPoint & { i: number; accuracy: number } => p.accuracy !== null);

  const line = withData
    .map((p, k) => `${k === 0 ? 'M' : 'L'}${x(p.i).toFixed(1)},${y(p.accuracy).toFixed(1)}`)
    .join(' ');

  const worked = points.filter((p) => p.attempts > 0).length;

  return (
    <div className="card">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-[19px] text-navy">Progression</h3>
          <p className="mt-0.5 text-[12.5px] text-muted">
            {worked} jour{worked > 1 ? 's' : ''} travaillé{worked > 1 ? 's' : ''} sur les 30 derniers
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-px w-4" style={{ background: 'var(--color-sage)' }} />
            précision
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-1.5 rounded-sm"
              style={{ background: 'var(--color-line)' }}
            />
            volume
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Précision quotidienne sur 30 jours, ${worked} jours travaillés`}
      >
        {[0, 0.5, 1].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-line-soft)"
              strokeWidth="1"
            />
            <text x={0} y={y(v) + 3.5} fill="var(--color-faint)" fontSize="10" fontFamily="Inter Variable, sans-serif">
              {v * 100}
            </text>
          </g>
        ))}

        {points.map((p, i) => {
          if (!p.attempts) return null;
          const h = (p.attempts / maxVolume) * innerH * 0.5;
          return (
            <rect
              key={p.key}
              x={x(i) - 3}
              y={PAD.top + innerH - h}
              width={6}
              height={h}
              rx="3"
              fill="var(--color-line)"
            />
          );
        })}

        {withData.length > 1 && (
          <path
            d={line}
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {withData.map((p) => (
          <circle
            key={p.key}
            cx={x(p.i)}
            cy={y(p.accuracy)}
            r="3"
            fill="var(--color-surface)"
            stroke="var(--color-sage)"
            strokeWidth="1.75"
          />
        ))}

        <text x={PAD.left} y={H - 6} fill="var(--color-faint)" fontSize="10" fontFamily="Inter Variable, sans-serif">
          {points[0]?.label}
        </text>
        <text
          x={W - PAD.right}
          y={H - 6}
          fill="var(--color-faint)"
          fontSize="10"
          textAnchor="end"
          fontFamily="Inter Variable, sans-serif"
        >
          {points[points.length - 1]?.label}
        </text>
      </svg>
    </div>
  );
}
