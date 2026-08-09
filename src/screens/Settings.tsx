/** Réglages : audio, session, données. */

import { useEffect, useState } from 'react';
import { useApp } from '../store';
import type { PlayStatus } from '../lib/tts';
import { playLines } from '../lib/tts';
import { exportState } from '../lib/storage';
import { loadVoices, voiceSummary } from '../lib/speech';
import { DEFAULT_VOICES } from '../lib/voices';
import { Page } from '../components/Shell';
import { PageTitle } from '../components/ui';
import { Download, Sound } from '../components/Icons';

/** Bloc de réglages : titre, explication, contenu. */
function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card mb-3">
      <h2 className="font-display text-[19px] text-navy">{title}</h2>
      {lede && <p className="mt-1 text-[13px] leading-relaxed text-muted">{lede}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const VOICE_LABELS: { role: keyof typeof DEFAULT_VOICES; label: string; accent: string }[] = [
  { role: 'female', label: 'Voix féminine', accent: 'britannique' },
  { role: 'male', label: 'Voix masculine', accent: 'américain' },
  { role: 'narrator', label: 'Narrateur / 3e locuteur', accent: 'britannique' },
];

export function Settings() {
  const { state, setSettings, reset } = useApp();
  const { settings } = state;
  const [systemVoices, setSystemVoices] = useState('chargement…');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    void loadVoices().then(() => setSystemVoices(voiceSummary()));
  }, []);

  return (
    <Page>
      <PageTitle eyebrow="Réglages" title="Comment l’app travaille." />

      <Section title="Audio">
        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              { id: 'mistral', label: 'Voix Mistral', hint: 'naturelles, pré-synthétisées' },
              { id: 'system', label: 'Voix système', hint: 'hors ligne, gratuites' },
            ] as const
          ).map((engine) => (
            <button
              key={engine.id}
              onClick={() => setSettings({ ttsEngine: engine.id })}
              className="rounded-2xl border p-4 text-left transition"
              style={{
                borderColor:
                  settings.ttsEngine === engine.id ? 'var(--color-navy)' : 'var(--color-line)',
                background:
                  settings.ttsEngine === engine.id
                    ? 'color-mix(in srgb, var(--color-navy) 4%, var(--color-surface))'
                    : 'var(--color-surface)',
              }}
            >
              <p className="text-[14.5px] font-medium text-navy">{engine.label}</p>
              <p className="mt-0.5 text-[12px] text-muted">{engine.hint}</p>
            </button>
          ))}
        </div>

        {settings.ttsEngine === 'mistral' ? (
          <div className="mt-5 divide-y divide-line-soft">
            {VOICE_LABELS.map(({ role, label, accent }) => (
              <div key={role} className="flex items-center justify-between gap-3 py-2">
                <span className="text-[13px] text-muted">{label}</span>
                <span className="text-[12.5px] text-navy">
                  {DEFAULT_VOICES[role]} · {accent}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[12.5px] text-muted">Voix système : {systemVoices}</p>
        )}

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor="rate" className="eyebrow">
              Vitesse de lecture
            </label>
            <span className="text-[13px] font-medium text-navy tabular-nums">
              {settings.speechRate.toFixed(2)}×
            </span>
          </div>
          <input
            id="rate"
            type="range"
            min={0.6}
            max={1.2}
            step={0.05}
            value={settings.speechRate}
            onChange={(e) => setSettings({ speechRate: Number(e.target.value) })}
            className="w-full accent-[var(--color-navy)]"
          />
          <p className="mt-1.5 text-[12px] text-faint">0.95× correspond au rythme de l’examen.</p>
        </div>

        <TestVoicesButton />

        <label className="mt-6 flex cursor-pointer items-center gap-4">
          <span className="flex-1">
            <span className="block text-[14.5px] font-medium text-navy">Lecture automatique</span>
            <span className="block text-[12.5px] text-muted">
              Démarre l’audio dès l’arrivée sur une question
            </span>
          </span>
          <input
            type="checkbox"
            checked={settings.autoPlay}
            onChange={(e) => setSettings({ autoPlay: e.target.checked })}
            className="sr-only"
          />
          <span
            className="relative h-6 w-11 shrink-0 rounded-full transition"
            style={{
              background: settings.autoPlay ? 'var(--color-navy)' : 'var(--color-surface-sunk)',
            }}
          >
            <span
              className="absolute top-0.5 size-5 rounded-full bg-surface transition-all duration-200"
              style={{ left: settings.autoPlay ? 22 : 2 }}
            />
          </span>
        </label>
      </Section>

      <Section
        title="Données"
        lede="Tout est stocké dans ce navigateur. Rien n’est envoyé sur un serveur."
      >
        <button onClick={() => downloadJson(exportState(state))} className="btn-quiet w-full">
          <Download size={16} /> Exporter ma progression
        </button>

        {confirmReset ? (
          <div
            className="mt-5 rounded-2xl border p-4"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-clay) 30%, transparent)',
              background: 'color-mix(in srgb, var(--color-clay) 6%, var(--color-surface))',
            }}
          >
            <p className="text-[14.5px] font-medium" style={{ color: 'var(--color-clay)' }}>
              Effacer tout l’historique ?
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              Irréversible. Les réglages sont conservés.
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-quiet flex-1">
                Annuler
              </button>
              <button
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
                className="btn flex-1"
                style={{ background: 'var(--color-clay)', color: 'var(--color-surface)' }}
              >
                Effacer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-3 w-full py-2 text-center text-[12.5px]"
            style={{ color: 'var(--color-clay)' }}
          >
            Réinitialiser ma progression
          </button>
        )}
      </Section>

      <p className="mt-8 text-center text-[11.5px] leading-relaxed text-faint">
        Questions rédigées spécifiquement pour cette app, dans le style TOEIC.
        <br />
        TOEIC est une marque déposée d’ETS ; cette app n’est ni affiliée ni approuvée par ETS.
      </p>
    </Page>
  );
}

function TestVoicesButton() {
  const { state } = useApp();
  const { settings } = state;
  const [status, setStatus] = useState<PlayStatus>('idle');
  const [notice, setNotice] = useState<string | null>(null);

  const test = () =>
    void playLines(
      [
        { text: 'Good morning. The quarterly review has been moved to Thursday.', voice: 'female' },
        { text: 'Thanks for letting me know. I will update the agenda.', voice: 'male' },
      ],
      {
        engine: settings.ttsEngine,
        rate: settings.speechRate,
        onStatus: setStatus,
        onNotice: setNotice,
      },
    ).then(() => setStatus('idle'));

  return (
    <>
      <button onClick={test} disabled={status !== 'idle'} className="btn-quiet mt-5 w-full">
        <Sound size={16} />
        {status === 'preparing' ? 'Synthèse…' : status === 'playing' ? 'Lecture…' : 'Tester les voix'}
      </button>
      {notice && (
        <p className="mt-2 text-[12px]" style={{ color: 'var(--color-flame)' }}>
          {notice}
        </p>
      )}
    </>
  );
}

function downloadJson(content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `toeic-progression-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
