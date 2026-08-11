/**
 * Banque de vocabulaire TOEIC — liste statique, commune à tous, indépendante
 * du carnet personnel (`state.vocab`). Elle sert de point de départ pour qui
 * veut réviser du lexique classique de l'examen sans attendre de tomber
 * dessus dans une session.
 *
 * Comme partout ailleurs dans le carnet, rien n'entre tout seul : un tap sur
 * un mot (ou « tout ajouter » sur un thème) le verse au carnet via `addVocab`,
 * qui ignore les doublons et ne touche jamais à la progression déjà acquise.
 */

import { useMemo, useState } from 'react';
import { useApp } from '../store';
import { vocabId } from '../lib/vocab';
import { VOCAB_BANK } from '../data/vocabBank';
import { FlowHeader } from '../components/ui';
import { CheckCircle, ChevronRight, Plus } from '../components/Icons';

export function VocabBank({ onBack }: { onBack: () => void }) {
  const { state, addVocab } = useApp();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const inDeck = (term: string) => Boolean(state.vocab[vocabId(term)]);

  const q = query.trim().toLowerCase();
  const themes = useMemo(
    () =>
      VOCAB_BANK.map((theme) => ({
        ...theme,
        hints: q
          ? theme.hints.filter(
              (h) => h.term.toLowerCase().includes(q) || h.translation.toLowerCase().includes(q),
            )
          : theme.hints,
      })).filter((theme) => theme.hints.length > 0),
    [q],
  );

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28">
      <FlowHeader title="Banque TOEIC" meta="Vocabulaire classique, par thème" onBack={onBack} />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Chercher un mot ou une traduction…"
        className="field mb-5"
      />

      {themes.length === 0 ? (
        <p className="py-10 text-center text-[13.5px] text-muted">Aucun mot ne correspond à « {query} ».</p>
      ) : (
        <div className="space-y-3">
          {themes.map((theme) => {
            const open = Boolean(q) || Boolean(expanded[theme.id]);
            const remaining = theme.hints.filter((h) => !inDeck(h.term));
            return (
              <section key={theme.id} className="card p-0 overflow-hidden">
                <button
                  onClick={() => setExpanded((prev) => ({ ...prev, [theme.id]: !prev[theme.id] }))}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[16.5px] text-navy">{theme.label}</p>
                    <p className="mt-0.5 text-[12.5px] text-muted">
                      {theme.hints.length} mot{theme.hints.length > 1 ? 's' : ''}
                      {remaining.length === 0 ? ' · tous au carnet' : ` · ${remaining.length} à ajouter`}
                    </p>
                  </div>
                  {remaining.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addVocab(remaining);
                      }}
                      className="btn-quiet shrink-0 py-1.5 text-[12px]"
                    >
                      Tout ajouter
                    </button>
                  )}
                  <ChevronRight
                    size={15}
                    className={`shrink-0 text-faint transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                  />
                </button>

                {open && (
                  <div className="animate-rise space-y-2 border-t border-line-soft p-3">
                    {theme.hints.map((hint) => {
                      const added = inDeck(hint.term);
                      return (
                        <div
                          key={hint.term}
                          className="flex items-start gap-3 rounded-xl border border-line-soft bg-surface p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-[15px] leading-snug text-navy">{hint.term}</p>
                            <p className="mt-0.5 text-[13px] text-muted">{hint.translation}</p>
                            {hint.example && (
                              <p className="mt-1.5 text-[12.5px] italic leading-relaxed text-faint">
                                « {hint.example} »
                              </p>
                            )}
                            {hint.note && (
                              <p className="mt-1 text-[12px] leading-relaxed text-muted">{hint.note}</p>
                            )}
                          </div>
                          <button
                            onClick={() => addVocab([hint])}
                            disabled={added}
                            className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${
                              added
                                ? 'border-transparent'
                                : 'border-line text-ink hover:border-navy/20'
                            }`}
                            style={
                              added
                                ? {
                                    background:
                                      'color-mix(in srgb, var(--color-sage) 12%, var(--color-surface))',
                                    color: 'var(--color-sage)',
                                  }
                                : undefined
                            }
                          >
                            {added ? (
                              <>
                                <CheckCircle size={12} /> au carnet
                              </>
                            ) : (
                              <>
                                <Plus size={12} /> ajouter
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
