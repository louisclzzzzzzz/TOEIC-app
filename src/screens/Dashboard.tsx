/** Progrès : précision par partie, courbe du mois, file de révision. */

import { useMemo } from 'react';
import { useApp } from '../store';
import { categoryStats, dailySeries, globalStats, partStats } from '../lib/stats';
import { ALL_PARTS, PARTS, sectionOf } from '../lib/toeic';
import { ProgressChart } from '../components/ProgressChart';
import { Page } from '../components/Shell';
import {
  DetailRow,
  EmptyState,
  PageTitle,
  PartSpine,
  StatWidget,
  accuracyColor,
  pct,
  sectionColor,
} from '../components/ui';
import { Chart, CheckCircle, Flame, Recycle, Target } from '../components/Icons';

export function Dashboard() {
  const { state } = useApp();
  const stats = useMemo(() => globalStats(state), [state]);
  const parts = useMemo(() => partStats(state.attempts), [state.attempts]);
  const series = useMemo(() => dailySeries(state.attempts, 30), [state.attempts]);
  const weakCategories = useMemo(() => categoryStats(state.attempts).slice(0, 6), [state.attempts]);

  if (!state.attempts.length) {
    return (
      <Page wide>
        <PageTitle eyebrow="Progrès" title="Rien à mesurer pour l’instant." />
        <EmptyState
          icon={<Chart size={22} />}
          title="La courbe démarre à ta première session"
          text="Précision par partie, progression sur le mois et file de révision apparaîtront ici dès que tu auras répondu à quelques questions."
        />
      </Page>
    );
  }

  const spine = ALL_PARTS.map((part) => ({
    part,
    accuracy: parts.find((p) => p.part === part)?.accuracy ?? null,
  }));

  return (
    <Page wide>
      <PageTitle
        eyebrow="Progrès"
        title="Où tu en es."
        lede={`${stats.totalAttempts} questions traitées · listening ${pct(stats.listeningAccuracy)} · reading ${pct(stats.readingAccuracy)}`}
        aside={
          <div className="hidden sm:block">
            <PartSpine values={spine} size="lg" />
          </div>
        }
      />

      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatWidget
          icon={<Target size={17} />}
          label="Précision"
          value={pct(stats.accuracy)}
          hint="toutes parties"
          color="var(--color-iris)"
        />
        <StatWidget
          icon={<Flame size={17} />}
          label="Série"
          value={`${stats.streak} j`}
          hint="jours consécutifs"
          color="var(--color-flame)"
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

      <section className="mb-8">
        <ProgressChart points={series} />
      </section>

      <section className="mb-8">
        <h2 className="eyebrow mb-4">Détail par partie</h2>
        <div className="card divide-y divide-line-soft py-1">
          {parts.map((s) => (
            <DetailRow
              key={s.part}
              label={PARTS[s.part].name}
              sub={`Part ${s.part} · ${sectionOf(s.part) === 'listening' ? 'Listening' : 'Reading'}${
                s.medianSec !== null ? ` · ${s.medianSec}s / question` : ''
              }`}
              value={s.attempts ? `${s.correct}/${s.attempts}` : '—'}
              ratio={s.accuracy ?? 0}
              color={s.attempts ? accuracyColor(s.accuracy) : 'var(--color-line)'}
            />
          ))}
        </div>
      </section>

      {weakCategories.length > 0 && (
        <section>
          <h2 className="eyebrow mb-4">Points à travailler</h2>
          <div className="card divide-y divide-line-soft py-1">
            {weakCategories.map((c) => (
              <DetailRow
                key={c.category}
                label={c.category}
                sub={`Part ${c.part} · ${c.attempts} question${c.attempts > 1 ? 's' : ''}`}
                value={pct(c.accuracy)}
                ratio={c.accuracy}
                color={sectionColor(c.part)}
              />
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
