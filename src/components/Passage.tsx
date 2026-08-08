/** Affichage des documents de lecture (Part 6 et 7). */

import type { ReactElement } from 'react';
import type { Passage } from '../types';

const KIND_LABEL: Record<Passage['kind'], string> = {
  email: 'E-mail',
  notice: 'Avis',
  article: 'Article',
  ad: 'Annonce',
  letter: 'Lettre',
  memo: 'Note de service',
  chat: 'Messagerie',
  schedule: 'Planning',
};

/** Repère les trous de Part 6, notés `___(1)___`. */
const BLANK = /___\((\d+)\)___/g;

export function PassageView({
  passage,
  index,
  total,
  highlightBlank,
}: {
  passage: Passage;
  index: number;
  total: number;
  /** Numéro du trou en cours de traitement (Part 6) : mis en évidence. */
  highlightBlank?: number;
}) {
  return (
    <article className="card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="eyebrow">{KIND_LABEL[passage.kind]}</span>
        {total > 1 && (
          <span className="text-[11px] text-faint tabular-nums">
            Document {index + 1} / {total}
          </span>
        )}
      </div>

      {passage.heading && (
        <p className="mb-3 border-b border-line-soft pb-3 text-[12.5px] font-medium leading-relaxed text-navy">
          {passage.heading}
        </p>
      )}

      {/* Serif pour le corps : ces passages sont de la lecture suivie, pas de
          l'interface — le rendu s'approche de la page d'examen. */}
      <div className="whitespace-pre-line font-display text-[16px] leading-[1.7] text-ink">
        {renderBody(passage.body, highlightBlank)}
      </div>
    </article>
  );
}

function renderBody(body: string, highlight?: number) {
  const out: (string | ReactElement)[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  BLANK.lastIndex = 0;

  while ((match = BLANK.exec(body)) !== null) {
    out.push(body.slice(last, match.index));
    const n = Number(match[1]);
    const active = n === highlight;
    out.push(
      <span
        key={`${n}-${match.index}`}
        className="mx-1 inline-flex size-6 items-center justify-center rounded-full font-sans text-[12px] font-semibold align-baseline"
        style={{
          background: active ? 'var(--color-navy)' : 'var(--color-surface-sunk)',
          color: active ? 'var(--color-cream)' : 'var(--color-faint)',
        }}
      >
        {n}
      </span>,
    );
    last = match.index + match[0].length;
  }
  out.push(body.slice(last));
  return out;
}

/** Phrase de Part 5 : le trou est noté `----`. */
export function SentenceWithBlank({ text }: { text: string }) {
  const parts = text.split('----');
  return (
    <p className="font-display text-[20px] leading-[1.6] text-navy">
      {parts.map((chunk, i) => (
        <span key={i}>
          {chunk}
          {i < parts.length - 1 && (
            <span
              className="mx-1.5 inline-block w-16 align-baseline"
              style={{ borderBottom: '2px dotted var(--color-iris)' }}
            />
          )}
        </span>
      ))}
    </p>
  );
}
