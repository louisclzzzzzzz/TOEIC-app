/** Journal d'erreurs : chaque faute est conservée avec son statut Leitner. */

import { useMemo, useState } from 'react';
import type { ErrorEntry } from '../types';
import { useApp } from '../store';
import { BOX_INTERVAL_DAYS, dueLabel } from '../lib/leitner';
import { PARTS } from '../lib/toeic';
import { Page } from '../components/Shell';
import { EmptyState, PageTitle, Tag, readablePrompt, sectionColor } from '../components/ui';
import { CheckCircle, ChevronRight, Journal as JournalIcon } from '../components/Icons';

type Filter = 'due' | 'upcoming' | 'mastered';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'due', label: 'À revoir' },
  { id: 'upcoming', label: 'À venir' },
  { id: 'mastered', label: 'Maîtrisées' },
];

export function Journal({ onReview }: { onReview: () => void }) {
  const { state } = useApp();
  const now = Date.now();
  const [filter, setFilter] = useState<Filter>(() =>
    Object.values(state.errors).some((e) => !e.mastered && e.dueAt <= Date.now())
      ? 'due'
      : 'upcoming',
  );

  const groups = useMemo(() => {
    const all = Object.values(state.errors);
    return {
      due: all.filter((e) => !e.mastered && e.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt),
      upcoming: all.filter((e) => !e.mastered && e.dueAt > now).sort((a, b) => a.dueAt - b.dueAt),
      mastered: all.filter((e) => e.mastered).sort((a, b) => b.lastReviewedAt - a.lastReviewedAt),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.errors]);

  const list = groups[filter];
  const total = groups.due.length + groups.upcoming.length;

  return (
    <Page>
      <PageTitle
        eyebrow="Journal d’erreurs"
        title="Ce qu’il reste à corriger."
        lede={
          total || groups.mastered.length
            ? `${total} question${total > 1 ? 's' : ''} en file · ${groups.mastered.length} maîtrisée${groups.mastered.length > 1 ? 's' : ''}`
            : undefined
        }
        aside={
          groups.due.length > 0 ? (
            <button onClick={onReview} className="btn-primary shrink-0">
              Réviser {groups.due.length}
            </button>
          ) : undefined
        }
      />

      {total + groups.mastered.length === 0 ? (
        <EmptyState
          icon={<JournalIcon size={22} />}
          title="Aucune erreur enregistrée"
          text="Chaque mauvaise réponse atterrit ici automatiquement, avec la bonne réponse, l’explication et une échéance de révision."
        />
      ) : (
        <>
          <div className="mb-5 flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex-1 rounded-full border px-3 py-2 text-[12.5px] font-medium transition ${
                  filter === f.id
                    ? 'border-navy bg-navy text-cream'
                    : 'border-line bg-surface text-muted hover:border-navy/20'
                }`}
              >
                {f.label} · {groups[f.id].length}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <EmptyState
              icon={<CheckCircle size={22} />}
              title={filter === 'mastered' ? 'Rien de maîtrisé pour l’instant' : 'File vide'}
              text={
                filter === 'mastered'
                  ? 'Deux bonnes réponses consécutives sur une question et elle arrive ici.'
                  : 'Rien à revoir dans cette file pour le moment.'
              }
            />
          ) : (
            <div className="space-y-2.5">
              {list.map((entry) => (
                <EntryCard key={entry.itemId} entry={entry} now={now} />
              ))}
            </div>
          )}
        </>
      )}
    </Page>
  );
}

function EntryCard({ entry, now }: { entry: ErrorEntry; now: number }) {
  const [open, setOpen] = useState(false);
  const color = sectionColor(entry.part);

  return (
    <article className="card card-tap p-4">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-center gap-2">
          <Tag color={color}>P{entry.part}</Tag>
          <span className="min-w-0 flex-1 truncate text-[12px] text-muted">{entry.category}</span>
          <span
            className="tag shrink-0"
            style={
              entry.mastered
                ? {
                    background: 'color-mix(in srgb, var(--color-sage) 12%, var(--color-surface))',
                    color: 'var(--color-sage)',
                  }
                : entry.dueAt <= now
                  ? {
                      background: 'color-mix(in srgb, var(--color-flame) 12%, var(--color-surface))',
                      color: 'var(--color-flame)',
                    }
                  : { background: 'var(--color-surface-sunk)', color: 'var(--color-muted)' }
            }
          >
            {entry.mastered ? 'maîtrisée' : dueLabel(entry.dueAt, now)}
          </span>
          <ChevronRight
            size={15}
            className={`shrink-0 text-faint transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          />
        </div>
        <p className="mt-2.5 line-clamp-2 text-[14.5px] leading-relaxed text-navy">
          {readablePrompt(entry.promptSnippet)}
        </p>
      </button>

      {open && (
        <div className="animate-rise mt-4 space-y-2.5 border-t border-line-soft pt-4 text-[14px]">
          <p style={{ color: 'var(--color-sage)' }}>{entry.correctAnswer}</p>
          <p style={{ color: 'var(--color-clay)' }}>{entry.chosenAnswer}</p>
          <p className="leading-relaxed text-muted">{entry.explanation}</p>
          <p className="text-[11.5px] text-faint">
            {PARTS[entry.part].label} · boîte {entry.box} (revue tous les{' '}
            {BOX_INTERVAL_DAYS[entry.box]} j) · {entry.timesWrong} erreur
            {entry.timesWrong > 1 ? 's' : ''} sur {entry.attempts} passage
            {entry.attempts > 1 ? 's' : ''}
            {entry.streak > 0 && !entry.mastered && ` · ${entry.streak}/2 bonnes d’affilée`}
          </p>
        </div>
      )}
    </article>
  );
}
