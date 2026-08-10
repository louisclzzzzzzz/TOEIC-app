/**
 * Carnet de vocabulaire — l'endroit unique où atterrit tout le lexique à revoir.
 *
 * Rien n'y entre tout seul : chaque mot demande un tap (depuis la correction
 * d'une question) ou une saisie manuelle (ici, avec traduction suggérée).
 * Deux provenances, distinguées à l'écran :
 *  - « raté » : mot clé ajouté depuis la correction d'une question manquée ;
 *  - « ajouté » : mot saisi à la main, ici ou pendant une session.
 */

import { useMemo, useState } from 'react';
import type { VocabEntry } from '../types';
import { useApp } from '../store';
import { dueLabel } from '../lib/leitner';
import { dueVocab, masteredVocab, upcomingVocab, vocabStats } from '../lib/vocab';
import { translateToFrench } from '../lib/translate';
import { Page } from '../components/Shell';
import {
  EmptyState,
  PageTitle,
  StatWidget,
  Tag,
  sectionColor,
} from '../components/ui';
import { CheckCircle, ChevronRight, Notebook, Plus, Recycle, Trash } from '../components/Icons';

type Filter = 'due' | 'upcoming' | 'mastered';

export function Vocab({ onReview }: { onReview: () => void }) {
  const { state } = useApp();
  const now = Date.now();
  const stats = useMemo(() => vocabStats(state.vocab, now), [state.vocab, now]);
  const [filter, setFilter] = useState<Filter>(stats.due ? 'due' : 'upcoming');
  const [adding, setAdding] = useState(false);

  const groups = useMemo(
    () => ({
      due: dueVocab(state.vocab, now),
      upcoming: upcomingVocab(state.vocab, now),
      mastered: masteredVocab(state.vocab),
    }),
    [state.vocab, now],
  );

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'due', label: 'À revoir' },
    { id: 'upcoming', label: 'À venir' },
    { id: 'mastered', label: 'Acquis' },
  ];

  const list = groups[filter];

  return (
    <Page>
      <PageTitle
        eyebrow="Carnet"
        title="Le lexique qui te coûte."
        lede={
          stats.total
            ? `${stats.total} mot${stats.total > 1 ? 's' : ''} · ajoutés depuis une correction ou à la main`
            : undefined
        }
        aside={
          <button onClick={() => setAdding(true)} className="btn-quiet shrink-0">
            <Plus size={16} /> Ajouter
          </button>
        }
      />

      {stats.total === 0 ? (
        <EmptyState
          icon={<Notebook size={22} />}
          title="Carnet vide"
          text="Les mots clés des questions que tu rates s’affichent dans la correction — ajoute-les en un tap, ou saisis-en un toi-même ici."
          action={
            <button onClick={() => setAdding(true)} className="btn-primary mt-2">
              Ajouter un mot
            </button>
          }
        />
      ) : (
        <>
          <section className="mb-6 grid grid-cols-3 gap-3">
            <StatWidget
              icon={<Recycle size={17} />}
              label="À revoir"
              value={stats.due}
              color="var(--color-tide)"
            />
            <StatWidget
              icon={<Notebook size={17} />}
              label="En cours"
              value={stats.active}
              color="var(--color-flame)"
            />
            <StatWidget
              icon={<CheckCircle size={17} />}
              label="Acquis"
              value={stats.mastered}
              color="var(--color-sage)"
            />
          </section>

          {stats.due > 0 && (
            <button onClick={onReview} className="btn-primary mb-2 w-full">
              Réviser {stats.due} mot{stats.due > 1 ? 's' : ''}
            </button>
          )}

          {stats.stubborn > 0 && (
            <p className="mb-6 text-center text-[12px] text-muted">
              {stats.stubborn} mot{stats.stubborn > 1 ? 's' : ''} oublié
              {stats.stubborn > 1 ? 's' : ''} au moins deux fois.
            </p>
          )}

          <div className="mb-5 mt-6 flex gap-2">
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
              title={filter === 'mastered' ? 'Aucun mot acquis' : 'File vide'}
              text={
                filter === 'mastered'
                  ? 'Deux « je savais » consécutifs et un mot arrive ici.'
                  : 'Rien dans cette file pour le moment.'
              }
            />
          ) : (
            <div className="space-y-2.5">
              {list.map((entry) => (
                <VocabCard key={entry.id} entry={entry} now={now} />
              ))}
            </div>
          )}
        </>
      )}

      {adding && <AddVocabDialog onClose={() => setAdding(false)} />}
    </Page>
  );
}

function VocabCard({ entry, now }: { entry: VocabEntry; now: number }) {
  const { removeVocab } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <article className="card card-tap p-4">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[18px] leading-snug text-navy">{entry.term}</p>
            <p className="mt-0.5 text-[14px] text-muted">{entry.translation}</p>
          </div>
          <span
            className="tag mt-0.5 shrink-0"
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
            {entry.mastered ? 'acquis' : dueLabel(entry.dueAt, now)}
          </span>
          <ChevronRight
            size={15}
            className={`mt-1 shrink-0 text-faint transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="animate-rise mt-4 space-y-3 border-t border-line-soft pt-4">
          {entry.example && (
            <p className="font-display text-[15.5px] italic leading-relaxed text-ink">
              « {entry.example} »
            </p>
          )}
          {entry.note && <p className="text-[13.5px] leading-relaxed text-muted">{entry.note}</p>}
          <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-faint">
            <Tag color={entry.sourcePart ? sectionColor(entry.sourcePart) : 'var(--color-muted)'}>
              {entry.origin === 'missed' ? `raté en Part ${entry.sourcePart ?? '?'}` : 'ajouté'}
            </Tag>
            <span>
              boîte {entry.box} · {entry.reviews} révision{entry.reviews > 1 ? 's' : ''}
              {entry.lapses > 0 && ` · ${entry.lapses} oubli${entry.lapses > 1 ? 's' : ''}`}
            </span>
            <button
              onClick={() => removeVocab(entry.id)}
              className="ml-auto inline-flex items-center gap-1 text-[11.5px] transition"
              style={{ color: 'var(--color-clay)' }}
            >
              <Trash size={13} /> Retirer
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/** Saisie libre d'un mot, avec traduction suggérée automatiquement (MyMemory). */
export function AddVocabDialog({
  onClose,
  initialTerm = '',
}: {
  onClose: () => void;
  initialTerm?: string;
}) {
  const { addVocab } = useApp();
  const [term, setTerm] = useState(initialTerm);
  const [translation, setTranslation] = useState('');
  const [example, setExample] = useState('');
  const [translating, setTranslating] = useState(false);

  const autoTranslate = async () => {
    if (!term.trim() || translation.trim()) return;
    setTranslating(true);
    const result = await translateToFrench(term);
    setTranslating(false);
    if (result) setTranslation(result);
  };

  const save = () => {
    if (!term.trim() || !translation.trim()) return;
    addVocab([{ term, translation, example: example.trim() || undefined }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-navy/25 p-4 backdrop-blur-sm sm:items-center">
      <div className="card w-full max-w-md">
        <h2 className="font-display text-[20px] text-navy">Ajouter au carnet</h2>

        <label className="eyebrow mt-5 block">Mot ou expression</label>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onBlur={autoTranslate}
          autoFocus
          placeholder="to postpone"
          className="field mt-1.5"
        />

        <label className="eyebrow mt-4 flex items-center justify-between">
          Traduction
          <button
            type="button"
            onClick={autoTranslate}
            disabled={!term.trim() || translating}
            className="normal-case tracking-normal text-iris disabled:text-faint"
          >
            {translating ? 'Traduction…' : 'Traduire'}
          </button>
        </label>
        <input
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="reporter, décaler"
          className="field mt-1.5"
        />

        <label className="eyebrow mt-4 block">
          Exemple <span className="normal-case tracking-normal text-faint">— facultatif</span>
        </label>
        <input
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="The meeting was postponed until Thursday."
          className="field mt-1.5"
        />

        <div className="mt-6 flex gap-2">
          <button onClick={onClose} className="btn-quiet flex-1">
            Annuler
          </button>
          <button
            onClick={save}
            disabled={!term.trim() || !translation.trim()}
            className="btn-primary flex-1"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
