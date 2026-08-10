/**
 * Panneau d'ajout au carnet, ouvert depuis la correction d'une question.
 *
 * Il montre les mots clés de la question — ceux déjà présents dans le carnet
 * apparaissent cochés — et permet d'en ajouter un à la main. Rien n'y entre
 * tout seul : chaque mot suggéré demande un tap, et l'origine affichée dans
 * le carnet (« raté » / « ajouté ») reflète si la question était juste ou non.
 */

import { useState } from 'react';
import type { PartId, QuestionItem } from '../types';
import { useApp } from '../store';
import { vocabId } from '../lib/vocab';
import { translateToFrench } from '../lib/translate';

export function VocabSheet({
  item,
  part,
  correct,
  onClose,
}: {
  item: QuestionItem;
  part: PartId;
  correct: boolean;
  onClose: () => void;
}) {
  const { state, addVocab } = useApp();
  const hints = item.vocab ?? [];
  const source = { itemId: item.id, part };
  const origin = correct ? 'manual' : 'missed';

  const [custom, setCustom] = useState(false);
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);

  const inDeck = (t: string) => Boolean(state.vocab[vocabId(t)]);

  const autoTranslate = async () => {
    if (!term.trim() || translation.trim()) return;
    setTranslating(true);
    const result = await translateToFrench(term);
    setTranslating(false);
    if (result) setTranslation(result);
  };

  const saveCustom = () => {
    if (!term.trim() || !translation.trim()) return;
    addVocab([{ term, translation }], source, origin);
    setTerm('');
    setTranslation('');
    setCustom(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="card max-h-[85vh] w-full max-w-md overflow-y-auto rounded-b-none bg-ink-900 sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">Vocabulaire de la question</h2>
          <button onClick={onClose} className="text-xl leading-none text-slate-400">
            ×
          </button>
        </div>

        {hints.length > 0 ? (
          <div className="space-y-2">
            {hints.map((hint) => {
              const added = inDeck(hint.term);
              return (
                <div
                  key={hint.term}
                  className={`rounded-xl border p-3 ${
                    added ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug">{hint.term}</p>
                      <p className="text-sm text-slate-400">{hint.translation}</p>
                    </div>
                    <button
                      onClick={() => addVocab([hint], source, origin)}
                      disabled={added}
                      className={`chip shrink-0 ${
                        added
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-indigo-500 text-white active:scale-95'
                      }`}
                    >
                      {added ? '✓ au carnet' : '＋ ajouter'}
                    </button>
                  </div>
                  {hint.note && <p className="mt-2 text-xs text-slate-500">{hint.note}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            Aucun mot clé prédéfini pour cette question — ajoute celui qui t'a bloqué.
          </p>
        )}

        {custom ? (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onBlur={autoTranslate}
              autoFocus
              placeholder="Mot ou expression (anglais)"
              className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder={translating ? 'Traduction…' : 'Traduction'}
                className="w-full rounded-lg border border-white/10 bg-ink-900 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={autoTranslate}
                disabled={!term.trim() || translating}
                title="Traduire automatiquement"
                className="shrink-0 rounded-lg border border-white/10 px-2.5 py-2 text-xs text-slate-400 disabled:opacity-40"
              >
                {translating ? '…' : '↻'}
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setCustom(false)} className="btn-ghost flex-1 py-2 text-xs">
                Annuler
              </button>
              <button
                onClick={saveCustom}
                disabled={!term.trim() || !translation.trim()}
                className="btn-primary flex-1 py-2 text-xs"
              >
                Ajouter
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCustom(true)} className="btn-ghost mt-3 w-full">
            ＋ Un autre mot m'a bloqué
          </button>
        )}

        <button onClick={onClose} className="mt-2 w-full py-2 text-center text-xs text-slate-400">
          Fermer
        </button>
      </div>
    </div>
  );
}
