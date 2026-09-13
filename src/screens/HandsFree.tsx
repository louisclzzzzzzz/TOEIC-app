/**
 * Mode Écoute — réglage d'une séance mains libres.
 *
 * L'écran est fait pour être quitté : trois choix, un bouton, et on range le
 * téléphone. Tout ce qui se règle ici est mémorisé, de sorte qu'à la deuxième
 * séance il ne reste qu'à appuyer sur Démarrer.
 */

import { useMemo, useState } from 'react';
import { useApp } from '../store';
import type { PartId } from '../types';
import type { HandsFreePlan } from '../lib/handsFree';
import { HANDS_FREE_PARTS, PART_PRESETS, buildHandsFreeSession } from '../lib/handsFree';
import { primeAudio } from '../lib/handsFreePlayer';
import { PARTS, sectionOf } from '../lib/toeic';
import { allSets } from '../lib/selection';
import { Page } from '../components/Shell';
import { PageTitle, sectionColor } from '../components/ui';
import { CheckCircle, Headphones, Sound } from '../components/Icons';

const MINUTES = [5, 10, 15, 20];
const THINK = [3, 5, 8];

const sameParts = (a: PartId[], b: PartId[]) =>
  a.length === b.length && a.every((p) => b.includes(p));

/** Rangée de choix exclusifs, format « pilule » comme le reste de l'app. */
function Segmented<T extends string | number>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { id: T; label: string; sub?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="card mb-3">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="eyebrow">{label}</h2>
        {hint && <p className="text-[12px] text-muted">{hint}</p>}
      </div>
      <div className="flex gap-2">
        {options.map((option) => {
          const on = option.id === value;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              aria-pressed={on}
              className={`flex-1 rounded-2xl border px-2 py-2.5 transition ${
                on
                  ? 'border-navy bg-navy text-cream'
                  : 'border-line bg-surface text-muted hover:border-navy/20'
              }`}
            >
              <span className="block text-[14px] font-medium tabular-nums">{option.label}</span>
              {option.sub && (
                <span className={`block text-[11px] ${on ? 'text-cream/70' : 'text-faint'}`}>
                  {option.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function HandsFree({ onStart }: { onStart: (plan: HandsFreePlan) => void }) {
  const { state, setSettings } = useApp();
  const { settings } = state;
  const [parts, setParts] = useState<PartId[]>(settings.handsFreeParts);
  const [minutes, setMinutes] = useState(settings.handsFreeMinutes);
  const [thinkSec, setThinkSec] = useState(settings.handsFreeThinkSec);

  // La séance affichée en aperçu est exactement celle qui va se jouer : elle
  // est tirée une seule fois, puis transmise telle quelle au lecteur.
  const plan = useMemo(
    () => buildHandsFreeSession(state, { minutes, parts, thinkSec, rate: settings.speechRate }),
    // Le tirage ne doit pas rejouer à chaque frappe dans le store (il est
    // aléatoire) : seules les options de la séance le relancent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minutes, parts, thinkSec, settings.speechRate],
  );

  const sets = useMemo(() => allSets(state), [state]);
  const blocks = (part: PartId) => sets.filter((s) => s.part === part).length;
  const drawn = [...new Set(plan.chapters.map((c) => c.part))].sort();

  const toggle = (part: PartId) =>
    setParts((cur) =>
      cur.includes(part) ? cur.filter((p) => p !== part) : [...cur, part].sort(),
    );

  const start = () => {
    if (!plan.chapters.length) return;
    // Le déblocage audio doit avoir lieu dans le geste lui-même : après le
    // téléchargement des clips, le navigateur ne reconnaîtrait plus l'appui et
    // réclamerait un second tap avant de parler.
    primeAudio();
    setSettings({ handsFreeMinutes: minutes, handsFreeThinkSec: thinkSec, handsFreeParts: parts });
    onStart(plan);
  };

  return (
    <Page>
      <PageTitle
        eyebrow="Mains libres"
        title="Écoute."
        lede="Pose le téléphone, mets tes écouteurs. La question s’entend, un silence te laisse répondre dans ta tête, la réponse tombe juste après. Rien à toucher jusqu’à la fin."
      />

      <Segmented
        label="Durée"
        hint="minutes"
        options={MINUTES.map((n) => ({ id: n, label: String(n) }))}
        value={minutes}
        onChange={setMinutes}
      />
      <section className="card mb-3">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="eyebrow">Contenu</h2>
          <p className="text-[12px] text-muted tabular-nums">
            {parts.length} partie{parts.length > 1 ? 's' : ''} sur {HANDS_FREE_PARTS.length}
          </p>
        </div>

        {/* Raccourcis : ils ne font que remplir la sélection ci-dessous. */}
        <div className="flex gap-2">
          {PART_PRESETS.map((preset) => {
            const on = sameParts(parts, preset.parts);
            return (
              <button
                key={preset.id}
                onClick={() => setParts(preset.parts)}
                aria-pressed={on}
                className={`flex-1 rounded-2xl border px-2 py-2.5 text-[14px] font-medium transition ${
                  on
                    ? 'border-navy bg-navy text-cream'
                    : 'border-line bg-surface text-muted hover:border-navy/20'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Choix à la carte : un type d'exercice précis quand on veut le travailler. */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {HANDS_FREE_PARTS.map((part) => {
            const on = parts.includes(part);
            const color = sectionColor(part);
            return (
              <button
                key={part}
                onClick={() => toggle(part)}
                aria-pressed={on}
                className="flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition"
                style={{
                  borderColor: on ? 'var(--color-navy)' : 'var(--color-line)',
                  background: on
                    ? 'color-mix(in srgb, var(--color-navy) 4%, var(--color-surface))'
                    : 'var(--color-surface)',
                }}
              >
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
                  style={{
                    background: on ? 'var(--color-navy)' : `color-mix(in srgb, ${color} 12%, var(--color-surface))`,
                    color: on ? 'var(--color-cream)' : color,
                  }}
                >
                  {on ? <CheckCircle size={15} /> : `P${part}`}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium leading-tight text-navy">
                    {PARTS[part].short}
                  </span>
                  <span className="block text-[11px] text-faint tabular-nums">
                    {sectionOf(part) === 'listening' ? 'Écoute' : 'Lecture'} · {blocks(part)} blocs
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <Segmented
        label="Temps de réflexion"
        hint="après chaque question"
        options={THINK.map((n) => ({ id: n, label: `${n} s` }))}
        value={thinkSec}
        onChange={setThinkSec}
      />

      <section className="card mb-3 flex items-center gap-4">
        <span
          className="icon-well size-11"
          style={{ background: 'color-mix(in srgb, var(--color-tide) 12%, var(--color-surface))', color: 'var(--color-tide)' }}
        >
          <Headphones size={20} />
        </span>
        <div className="min-w-0">
          {plan.chapters.length ? (
            <>
              <p className="text-[15px] font-medium text-navy">
                ≈ {Math.round(plan.seconds / 60)} min · {plan.questionCount} question
                {plan.questionCount > 1 ? 's' : ''}
              </p>
              {/* Les parties réellement tirées, pas celles cochées : une séance
                  courte n'a pas la place de toutes les servir. */}
              <p className="mt-0.5 text-[12.5px] text-muted">
                Part{drawn.length > 1 ? 's' : ''} {drawn.join(', ')} · {plan.setIds.length} bloc
                {plan.setIds.length > 1 ? 's' : ''}
              </p>
            </>
          ) : (
            <p className="text-[14px] text-muted">
              {parts.length ? 'Aucun contenu disponible pour ce choix.' : 'Choisis au moins une partie.'}
            </p>
          )}
        </div>
      </section>

      <button onClick={start} disabled={!plan.chapters.length} className="btn-primary w-full">
        Démarrer la séance
      </button>

      <div className="mt-8 space-y-2 text-[12.5px] leading-relaxed text-muted">
        <p>
          La Part 1 est écartée : ses quatre descriptions ne veulent rien dire sans la photo. Tout
          le reste est lu à voix haute, y compris ce qui est imprimé le jour de l’examen —
          propositions, phrases à trous et documents de lecture.
        </p>
        {settings.ttsEngine === 'system' && (
          <p className="flex gap-2" style={{ color: 'var(--color-flame)' }}>
            <span className="mt-0.5 shrink-0">
              <Sound size={15} />
            </span>
            <span>
              Les voix du système sont sélectionnées dans les réglages. Elles fonctionnent, mais
              s’arrêtent dès que l’écran se verrouille : pour une séance dans la poche, préfère les
              voix Mistral.
            </span>
          </p>
        )}
      </div>
    </Page>
  );
}
