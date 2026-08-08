/** Réglages : clé API, voix, cache audio, génération, données. */

import { useEffect, useMemo, useState } from 'react';
import type { PartId, VoiceRole } from '../types';
import { useApp, useMistralAccess } from '../store';
import { ALL_PARTS, PARTS } from '../lib/toeic';
import { categoryStats, weakestPart } from '../lib/stats';
import { generateSet } from '../lib/mistral';
import type { MistralVoice } from '../lib/mistralTts';
import { accentLabel, isEnglish, listVoices, synthesizeAll } from '../lib/mistralTts';
import type { PlayStatus } from '../lib/tts';
import { playLines } from '../lib/tts';
import { cacheStats, clearClips } from '../lib/audioCache';
import { allSets } from '../lib/selection';
import { exportState } from '../lib/storage';
import { generatedToSource } from '../lib/seedExport';
import { loadVoices, voiceSummary } from '../lib/speech';
import { probeServerKey } from '../lib/mistralApi';
import { Page } from '../components/Shell';
import { PageTitle, ProgressBar } from '../components/ui';
import { CheckCircle, Download, Sound, Spark, Trash } from '../components/Icons';

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

export function Settings() {
  const { state, setSettings, removeGenerated, reset } = useApp();
  const { settings } = state;
  const [systemVoices, setSystemVoices] = useState('chargement…');
  const [confirmReset, setConfirmReset] = useState(false);
  const [serverKey, setServerKey] = useState(false);

  useEffect(() => {
    void loadVoices().then(() => setSystemVoices(voiceSummary()));
    void probeServerKey().then(setServerKey);
  }, []);

  const ownKey = Boolean(settings.mistralApiKey.trim());
  // La clé de l'hébergeur suffit : le champ peut rester vide et tout marche.
  const hasKey = ownKey || serverKey;

  return (
    <Page>
      <PageTitle eyebrow="Réglages" title="Comment l’app travaille." />

      <Section
        title="Clé API Mistral"
        lede="Sert aux voix et à la génération de questions. Stockée uniquement dans ce navigateur — inutile si le serveur en fournit déjà une."
      >
        <input
          type="password"
          value={settings.mistralApiKey}
          onChange={(e) => setSettings({ mistralApiKey: e.target.value })}
          placeholder="Colle ta clé ici"
          autoComplete="off"
          spellCheck={false}
          className="field"
        />
        <p
          className="mt-3 flex items-center gap-1.5 text-[12.5px]"
          style={{ color: hasKey ? 'var(--color-sage)' : 'var(--color-flame)' }}
        >
          {hasKey && <CheckCircle size={14} />}
          {ownKey
            ? 'Clé enregistrée — les voix Mistral sont actives.'
            : serverKey
              ? 'Clé fournie par le serveur — les voix Mistral sont actives, rien à saisir.'
              : 'Sans clé, l’app se rabat sur les voix du système.'}
        </p>
      </Section>

      <Section title="Audio">
        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              { id: 'mistral', label: 'Voix Mistral', hint: 'naturelles, clé requise' },
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
          <MistralVoicePicker />
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

      <AudioCacheSection />
      <GenerateSection />

      <Section
        title="Données"
        lede="Tout est stocké dans ce navigateur. Rien n’est envoyé sur un serveur."
      >
        <button onClick={() => downloadJson(exportState(state))} className="btn-quiet w-full">
          <Download size={16} /> Exporter ma progression
        </button>

        {state.generated.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow mb-2">Questions générées · {state.generated.length}</p>
            <button
              onClick={() => downloadSource(generatedToSource(state.generated, allSets(state)))}
              className="btn-quiet mb-3 w-full"
            >
              <Download size={16} /> Exporter en TypeScript pour le dépôt
            </button>
            <p className="mb-3 text-[12px] leading-relaxed text-faint">
              Produit les blocs à coller dans <code>src/data/partN.ts</code>, renumérotés à la
              suite. C’est le seul moyen de les garder : sinon elles restent dans ce navigateur.
            </p>
            <div className="divide-y divide-line-soft">
              {state.generated.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                    Part {s.part} · {s.title}
                  </span>
                  <span className="shrink-0 text-[12px] text-faint tabular-nums">
                    {s.items.length} q.
                  </span>
                  <button
                    onClick={() => removeGenerated(s.id)}
                    className="shrink-0"
                    style={{ color: 'var(--color-clay)' }}
                    aria-label={`Supprimer ${s.title}`}
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              Irréversible. Les réglages et les questions générées sont conservés.
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

/* ------------------------------------------------------------------ */
/* Voix Mistral                                                        */
/* ------------------------------------------------------------------ */

const ROLES: { id: VoiceRole; label: string }[] = [
  { id: 'female', label: 'Voix féminine' },
  { id: 'male', label: 'Voix masculine' },
  { id: 'narrator', label: 'Narrateur / 3e locuteur' },
];

const genderOf = (voice: MistralVoice): VoiceRole | null => {
  const gender = (voice.gender ?? '').toLowerCase();
  if (gender.startsWith('f') || gender.includes('woman')) return 'female';
  if (gender.startsWith('m') || gender.includes('man')) return 'male';
  return null;
};

/**
 * Remplace une voix devenue introuvable (compte différent, voix clonée
 * supprimée) par la meilleure candidate : même genre, ton neutre de préférence.
 */
function repair(current: Record<VoiceRole, string>, list: MistralVoice[]) {
  const known = new Set(list.flatMap((v) => [v.id, v.slug].filter(Boolean) as string[]));
  const pool = list.filter(isEnglish);
  const patch = { ...current };

  for (const { id: role } of ROLES) {
    if (patch[role] && known.has(patch[role])) continue;
    const candidates = pool.filter((v) => genderOf(v) === (role === 'narrator' ? 'male' : role));
    const best =
      candidates.find((v) => (v.slug ?? '').includes('neutral')) ?? candidates[0] ?? pool[0];
    if (best) patch[role] = best.slug ?? best.id;
  }
  return patch;
}

function MistralVoicePicker() {
  const { state, setSettings } = useApp();
  const canUseMistral = useMistralAccess();
  const { settings } = state;
  const [voices, setVoices] = useState<MistralVoice[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setBusy(true);
    setError(null);
    try {
      const list = await listVoices(settings.mistralApiKey);
      setVoices(list);
      setSettings({ mistralVoices: repair(settings.mistralVoices, list) });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de récupérer les voix.');
    } finally {
      setBusy(false);
    }
  };

  // Les voix françaises n'ont aucun intérêt ici : l'examen est en anglais.
  const english = voices?.filter(isEnglish) ?? [];

  return (
    <div className="mt-5">
      {english.length ? (
        <div className="space-y-3">
          {ROLES.map((role) => (
            <label key={role.id} className="block">
              <span className="eyebrow">{role.label}</span>
              <select
                value={settings.mistralVoices[role.id]}
                onChange={(e) =>
                  setSettings({
                    mistralVoices: { ...settings.mistralVoices, [role.id]: e.target.value },
                  })
                }
                className="field mt-1.5"
              >
                {english.map((v) => (
                  <option key={v.id} value={v.slug ?? v.id}>
                    {v.name} · {accentLabel(v)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <p className="text-[12px] leading-relaxed text-muted">
            Le TOEIC alterne les accents américain et britannique : garder une voix de chaque colle
            aux conditions de l’examen.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-line-soft">
            {ROLES.map((role) => (
              <div key={role.id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-[13px] text-muted">{role.label}</span>
                <span className="text-[12.5px] text-navy">{settings.mistralVoices[role.id]}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => void load()}
            disabled={busy || !canUseMistral}
            className="btn-quiet mt-3 w-full"
          >
            {busy ? 'Chargement…' : 'Changer de voix'}
          </button>
        </>
      )}
      {error && (
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--color-clay)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function TestVoicesButton() {
  // Volontairement jamais désactivé : sans accès Mistral, `playLines` retombe
  // sur la voix du système et affiche le message correspondant — ce qui est
  // précisément ce qu'on veut tester ici.
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
        apiKey: settings.mistralApiKey,
        model: settings.mistralTtsModel,
        voices: settings.mistralVoices,
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

/* ------------------------------------------------------------------ */
/* Cache audio                                                         */
/* ------------------------------------------------------------------ */

function AudioCacheSection() {
  const { state } = useApp();
  const canUseMistral = useMistralAccess();
  const { settings } = state;
  const [stats, setStats] = useState({ count: 0, bytes: 0 });
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => void cacheStats().then(setStats);
  useEffect(refresh, []);

  // Toutes les répliques de la banque, dédoublonnées.
  const lines = useMemo(() => {
    const all = allSets(state).flatMap((s) => [
      ...(s.audio ?? []),
      ...s.items.flatMap((i) => i.audio ?? []),
    ]);
    const seen = new Set<string>();
    return all.filter((l) => {
      const key = `${l.voice ?? 'narrator'}|${l.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [state]);

  const preload = async () => {
    setError(null);
    setProgress({ done: 0, total: lines.length });
    try {
      // Par petits paquets : progression visible, et on reste poli avec l'API.
      for (let i = 0; i < lines.length; i += 3) {
        const batch = lines.slice(i, i + 3);
        await synthesizeAll(
          batch.map((l) => ({
            text: l.text,
            voiceId: settings.mistralVoices[l.voice ?? 'narrator'] || undefined,
          })),
          { apiKey: settings.mistralApiKey, model: settings.mistralTtsModel },
        );
        setProgress({ done: Math.min(i + batch.length, lines.length), total: lines.length });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Préchargement interrompu.');
    } finally {
      setProgress(null);
      refresh();
    }
  };

  return (
    <Section
      title="Cache audio"
      lede={
        stats.count
          ? `${stats.count} clip${stats.count > 1 ? 's' : ''} en mémoire · ${(stats.bytes / 1_048_576).toFixed(1)} Mo. Rejoués sans réseau ni appel API.`
          : 'Les répliques synthétisées sont conservées ici pour être rejouées hors ligne.'
      }
    >
      {progress && (
        <div className="mb-3">
          <ProgressBar value={progress.done / Math.max(1, progress.total)} />
          <p className="mt-1.5 text-[12px] text-muted tabular-nums">
            {progress.done} / {progress.total} répliques
          </p>
        </div>
      )}

      {settings.ttsEngine === 'mistral' && (
        <button
          onClick={() => void preload()}
          disabled={!!progress || !canUseMistral}
          className="btn-quiet w-full"
        >
          <Download size={16} /> Précharger la banque · {lines.length} répliques
        </button>
      )}

      {error && (
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--color-clay)' }}>
          {error}
        </p>
      )}

      {stats.count > 0 && (
        <button
          onClick={() => void clearClips().then(refresh)}
          className="mt-3 w-full py-2 text-center text-[12.5px] text-muted"
        >
          Vider le cache audio
        </button>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Génération de questions                                             */
/* ------------------------------------------------------------------ */

function GenerateSection() {
  const { state, setSettings, addGenerated } = useApp();
  const canUseMistral = useMistralAccess();
  const { settings } = state;
  const auto = weakestPart(state.attempts);
  const [part, setPart] = useState<PartId | 'auto'>('auto');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const target: PartId = part === 'auto' ? (auto ?? 5) : part;

  // Catégories les plus ratées dans la partie ciblée : sert de brief au modèle.
  const weakCategories = useMemo(
    () =>
      categoryStats(state.attempts, 1)
        .filter((c) => c.part === target && c.accuracy < 0.8)
        .map((c) => c.category),
    [state.attempts, target],
  );

  const run = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const set = await generateSet({
        part: target,
        apiKey: settings.mistralApiKey.trim(),
        model: settings.mistralModel,
        weakCategories,
      });
      addGenerated(set);
      setMessage({ ok: true, text: `${set.items.length} question(s) ajoutée(s) en Part ${target}.` });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Échec de la génération.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      title="Générer des questions"
      lede={`Le mode « auto » cible ta partie la plus faible${auto ? ` — actuellement ${PARTS[auto].name}` : ', dès que tu auras assez de données'}.`}
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="eyebrow">Modèle</span>
          <select
            value={settings.mistralModel}
            onChange={(e) => setSettings({ mistralModel: e.target.value })}
            className="field mt-1.5"
          >
            <option value="mistral-large-latest">mistral-large-latest</option>
            <option value="mistral-medium-latest">mistral-medium-latest</option>
            <option value="mistral-small-latest">mistral-small-latest</option>
          </select>
        </label>
        <label className="block">
          <span className="eyebrow">Partie</span>
          <select
            value={part}
            onChange={(e) =>
              setPart(e.target.value === 'auto' ? 'auto' : (Number(e.target.value) as PartId))
            }
            className="field mt-1.5"
          >
            <option value="auto">Auto</option>
            {ALL_PARTS.map((p) => (
              <option key={p} value={p}>
                Part {p} · {PARTS[p].name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        onClick={() => void run()}
        disabled={busy || !canUseMistral}
        className="btn-primary mt-4 w-full"
      >
        <Spark size={16} /> {busy ? 'Génération en cours…' : `Générer · Part ${target}`}
      </button>

      {message && (
        <p
          className="mt-3 text-[12.5px]"
          style={{ color: message.ok ? 'var(--color-sage)' : 'var(--color-clay)' }}
        >
          {message.text}
        </p>
      )}

      <p className="mt-3 text-[11.5px] leading-relaxed text-faint">
        La clé transite par le proxy du serveur de dev — l’API Mistral n’accepte pas les appels
        navigateur directs.
      </p>
    </Section>
  );
}

/** Télécharge les blocs TypeScript à coller dans `src/data/partN.ts`. */
function downloadSource(content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `questions-generees-${new Date().toISOString().slice(0, 10)}.ts`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJson(content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `toeic-progression-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
