/** Accueil : où j'en suis, et quoi faire maintenant. */

import { useMemo } from 'react';
import { useApp } from '../store';
import { globalStats, partStats, weakestPart } from '../lib/stats';
import { ALL_PARTS, PARTS } from '../lib/toeic';
import { allSets } from '../lib/selection';
import { vocabStats } from '../lib/vocab';
import { Page } from '../components/Shell';
import {
  ActionCard,
  PartSpine,
  StatWidget,
  pct,
} from '../components/ui';
import { CheckCircle, Clock, Flame, Layers, Notebook, Recycle, Target } from '../components/Icons';

interface Props {
  onMixed: () => void;
  onPractice: () => void;
  onReview: () => void;
  onExam: () => void;
  onVocab: () => void;
}

/** Salutation selon l'heure — l'app sert le matin comme le soir. */
function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Bonne nuit.';
  if (h < 13) return 'Bonjour.';
  if (h < 18) return 'Bon après-midi.';
  return 'Bonsoir.';
}

export function Home({ onMixed, onPractice, onReview, onExam, onVocab }: Props) {
  const { state } = useApp();
  const stats = useMemo(() => globalStats(state), [state]);
  const vocab = useMemo(() => vocabStats(state.vocab), [state.vocab]);
  const parts = useMemo(() => partStats(state.attempts), [state.attempts]);
  const weak = weakestPart(state.attempts);
  const bankSize = useMemo(() => allSets(state).reduce((n, s) => n + s.items.length, 0), [state]);

  const spine = ALL_PARTS.map((part) => ({
    part,
    accuracy: parts.find((p) => p.part === part)?.accuracy ?? null,
  }));

  const started = stats.totalAttempts > 0;

  return (
    <Page wide>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-3">TOEIC Listening &amp; Reading</p>
          <h1 className="font-display text-[38px] leading-[1.05] text-navy sm:text-[52px]">
            {greeting()}
          </h1>
          <p className="mt-3 max-w-md text-[15px] text-muted">
            {started
              ? stats.dueCount > 0
                ? `${stats.dueCount} révision${stats.dueCount > 1 ? 's' : ''} t'attend${stats.dueCount > 1 ? 'ent' : ''} aujourd'hui.`
                : 'Rien à revoir aujourd’hui — bon moment pour du nouveau.'
              : `${bankSize} questions prêtes, réparties sur les sept parties de l'examen.`}
          </p>
        </div>

        {/* Signature : la forme de l'examen, sept segments remplis par la précision. */}
        <div className="flex items-end gap-3">
          <PartSpine values={spine} />
          <p className="mb-0.5 text-[11px] leading-tight text-faint">
            Parts
            <br />1 à 7
          </p>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatWidget
          icon={<Flame size={17} />}
          label="Série"
          value={stats.streak > 0 ? `${stats.streak} j` : '—'}
          hint={stats.streak > 0 ? 'jours consécutifs' : 'commence aujourd’hui'}
          color="var(--color-flame)"
        />
        <StatWidget
          icon={<Target size={17} />}
          label="Précision"
          value={pct(stats.accuracy)}
          hint={started ? `sur ${stats.totalAttempts} questions` : 'aucune donnée'}
          color="var(--color-iris)"
        />
        <StatWidget
          icon={<Recycle size={17} />}
          label="En révision"
          value={stats.dueCount}
          hint={`${stats.activeCount} en file`}
          color="var(--color-tide)"
        />
        <StatWidget
          icon={<CheckCircle size={17} />}
          label="Maîtrisées"
          value={stats.masteredCount}
          hint="sorties de la file"
          color="var(--color-sage)"
        />
      </section>

      <section>
        <h2 className="eyebrow mb-4">Aujourd’hui</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            icon={<Recycle size={19} />}
            title="Révision du jour"
            description={
              stats.dueCount > 0
                ? `${stats.dueCount} question${stats.dueCount > 1 ? 's' : ''} échue${stats.dueCount > 1 ? 's' : ''}, à traiter en priorité.`
                : 'Se remplit avec les questions que tu rates.'
            }
            onClick={onReview}
            color="var(--color-tide)"
            disabled={stats.dueCount === 0}
          />
          <ActionCard
            icon={<Layers size={19} />}
            title="Session mixte"
            description={
              weak
                ? `Pondérée vers ${PARTS[weak].name}, ta partie la plus fragile.`
                : `${state.settings.sessionLength} questions tirées sur les sept parties.`
            }
            onClick={onMixed}
            color="var(--color-iris)"
          />
          <ActionCard
            icon={<Target size={19} />}
            title="Practice ciblé"
            description="Choisis les parties à travailler et la longueur."
            onClick={onPractice}
          />
          <ActionCard
            icon={<Notebook size={19} />}
            title="Carnet de vocabulaire"
            description={
              vocab.total
                ? `${vocab.due} mot${vocab.due > 1 ? 's' : ''} à revoir, ${vocab.mastered} acquis sur ${vocab.total}.`
                : 'Se remplit avec les mots ratés ou signalés.'
            }
            onClick={onVocab}
            color="var(--color-flame)"
          />
          <ActionCard
            icon={<Clock size={19} />}
            title="Examen blanc"
            description="Chronométré par section, sans correction avant la fin."
            onClick={onExam}
            color="var(--color-clay)"
          />
        </div>
      </section>
    </Page>
  );
}
