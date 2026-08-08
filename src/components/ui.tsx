/** Primitives d'interface partagées. */

import type { ReactNode } from 'react';
import type { PartId } from '../types';
import { PARTS, sectionOf } from '../lib/toeic';
import { ChevronLeft, ChevronRight } from './Icons';

/* ------------------------------------------------------------------ */
/* Couleur                                                             */
/* ------------------------------------------------------------------ */

/**
 * Une couleur par SECTION, pas une par partie : sept teintes en aplat
 * fatigueraient la page, alors que la distinction listening / reading est la
 * seule qui porte du sens à l'écran.
 */
export const sectionColor = (part: PartId): string =>
  sectionOf(part) === 'listening' ? 'var(--color-tide)' : 'var(--color-iris)';

/** Fond pastel dérivé d'un accent — jamais de couleur saturée en aplat large. */
export const tint = (color: string, amount = 10): string =>
  `color-mix(in srgb, ${color} ${amount}%, var(--color-surface))`;

/** Rouge sourd sous 55 %, ambre sous 75 %, vert au-delà. */
export function accuracyColor(accuracy: number | null): string {
  if (accuracy === null) return 'var(--color-faint)';
  if (accuracy < 0.55) return 'var(--color-clay)';
  if (accuracy < 0.75) return 'var(--color-flame)';
  return 'var(--color-sage)';
}

export const pct = (v: number | null): string => (v === null ? '—' : `${Math.round(v * 100)} %`);

/**
 * Rend un énoncé lisible hors session : le marqueur de trou `----` de la
 * Part 5 n'a de sens que dans le composant qui le dessine.
 */
export const readablePrompt = (prompt: string): string => prompt.replace(/-{2,}/g, '⎯⎯⎯');

export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  return `${Math.floor(s / 60)}:${`${s % 60}`.padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Structure                                                           */
/* ------------------------------------------------------------------ */

export function PageTitle({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="mb-8 flex items-end justify-between gap-6">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-[32px] leading-[1.08] text-navy sm:text-[40px]">{title}</h1>
        {lede && <p className="mt-2 max-w-lg text-[15px] text-muted">{lede}</p>}
      </div>
      {aside}
    </header>
  );
}

/** En-tête des écrans de flux (session, révision) : retour + progression. */
export function FlowHeader({
  title,
  meta,
  onBack,
  right,
}: {
  title: string;
  meta?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 -mx-5 mb-5 flex items-center gap-3 border-b border-line-soft bg-cream/92 px-5 py-3.5 backdrop-blur">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Retour"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-navy/20"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[17px] text-navy">{title}</p>
        {meta && <p className="truncate text-xs text-muted">{meta}</p>}
      </div>
      {right}
    </header>
  );
}

export function IconWell({
  children,
  color = 'var(--color-navy)',
  size = 40,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <span
      className="icon-well"
      style={{ width: size, height: size, background: tint(color, 12), color }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Widgets                                                             */
/* ------------------------------------------------------------------ */

/** Widget statistique : icône, label, grande valeur. */
export function StatWidget({
  icon,
  label,
  value,
  hint,
  color = 'var(--color-navy)',
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  color?: string;
}) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <IconWell color={color} size={32}>
          {icon}
        </IconWell>
        <p className="text-[13px] font-medium text-muted">{label}</p>
      </div>
      {/* Un « — » en 28px semibold se lit comme un trait plein : on l'affiche
          en gris clair et sans graisse pour qu'il reste une absence. */}
      <p
        className={`font-sans leading-none tabular-nums ${
          value === '—'
            ? 'text-[24px] font-normal text-faint'
            : 'text-[28px] font-semibold tracking-tight text-navy'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/** Carte d'action de la grille principale. */
export function ActionCard({
  icon,
  title,
  description,
  onClick,
  color = 'var(--color-navy)',
  disabled,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="card card-tap flex h-full flex-col items-start text-left disabled:opacity-45 disabled:hover:shadow-none"
    >
      <IconWell color={color}>{icon}</IconWell>
      <p className="mt-4 font-display text-[19px] text-navy">{title}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{description}</p>
      <span className="mt-auto pt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-navy/70">
        Ouvrir <ChevronRight size={14} />
      </span>
    </button>
  );
}

/** Barre de progression fine, fond neutre, remplissage discret. */
export function ProgressBar({
  value,
  color = 'var(--color-navy)',
  height = 6,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-surface-sunk"
      style={{ height }}
      role="presentation"
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, background: color }}
      />
    </div>
  );
}

/** Ligne du détail par catégorie : label, barre, valeur. */
export function DetailRow({
  label,
  sub,
  value,
  ratio,
  color,
}: {
  label: string;
  sub?: string;
  value: string;
  ratio: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div className="w-[38%] min-w-0 shrink-0 sm:w-[30%]">
        <p className="truncate text-[14px] font-medium text-navy">{label}</p>
        {sub && <p className="truncate text-[11.5px] text-muted">{sub}</p>}
      </div>
      <div className="flex-1">
        <ProgressBar value={ratio} color={color} />
      </div>
      <p className="w-14 shrink-0 text-right text-[13px] font-medium tabular-nums text-navy">
        {value}
      </p>
    </div>
  );
}

export function Tag({
  children,
  color = 'var(--color-muted)',
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span className="tag" style={{ background: tint(color, 12), color }}>
      {children}
    </span>
  );
}

export function PartTag({ part, compact = false }: { part: PartId; compact?: boolean }) {
  return <Tag color={sectionColor(part)}>{compact ? `P${part}` : PARTS[part].label}</Tag>;
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 py-12 text-center">
      <IconWell size={44} color="var(--color-faint)">
        {icon}
      </IconWell>
      <p className="font-display text-[19px] text-navy">{title}</p>
      <p className="max-w-sm text-[13.5px] leading-relaxed text-muted">{text}</p>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Signature : l'échine des 7 parties                                  */
/* ------------------------------------------------------------------ */

/**
 * Sept segments, un par partie de l'examen, remplis selon la précision.
 *
 * C'est la seule pièce vraiment singulière de l'interface, et elle encode une
 * information vraie plutôt que de décorer : la forme du TOEIC lui-même. Les
 * quatre premiers segments (listening) et les trois derniers (reading) se lisent
 * d'un coup d'œil, et un creux saute aux yeux sans avoir à lire un chiffre.
 */
export function PartSpine({
  values,
  size = 'sm',
}: {
  /** Précision par partie, `null` si jamais travaillée. */
  values: { part: PartId; accuracy: number | null }[];
  size?: 'sm' | 'lg';
}) {
  const h = size === 'lg' ? 72 : 34;

  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {values.map(({ part, accuracy }) => (
        <div key={part} className="flex flex-col items-center gap-1.5">
          <div
            className="relative w-[7px] overflow-hidden rounded-full sm:w-2"
            style={{ height: h, background: 'color-mix(in srgb, var(--color-navy) 8%, transparent)' }}
          >
            <div
              className="absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-700 ease-out"
              style={{
                height: `${(accuracy ?? 0) * 100}%`,
                background: sectionColor(part),
                opacity: accuracy === null ? 0 : 0.35 + accuracy * 0.65,
              }}
            />
          </div>
          {size === 'lg' && <span className="text-[10px] text-faint tabular-nums">{part}</span>}
        </div>
      ))}
    </div>
  );
}
