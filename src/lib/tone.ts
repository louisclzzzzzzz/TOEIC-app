/**
 * Petits sons fabriqués dans le navigateur : silences et repère de réflexion.
 *
 * Pourquoi générer du silence plutôt que d'attendre avec un `setTimeout` ?
 * Parce que le mode Écoute sert écran verrouillé, dans une poche. Un minuteur
 * y est bridé (voire suspendu) par le navigateur, alors qu'un élément `<audio>`
 * qui joue continue de dérouler sa file et d'émettre ses événements `ended`.
 * En faisant des pauses de VRAIS clips, le fil audio reste seul maître du
 * tempo : la réflexion dure cinq secondes en marchant comme sur le bureau.
 *
 * WAV brut plutôt que MP3 : c'est quelques lignes d'en-tête, ça n'exige aucun
 * encodeur, et à 8 kHz mono un silence de cinq secondes pèse 80 Ko.
 */

const SAMPLE_RATE = 8000;

/** Un blob par durée demandée : une séance ne compte qu'une poignée de valeurs. */
const cache = new Map<string, Blob>();

function encodeWav(samples: Int16Array): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const text = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  text(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true); // taille du bloc fmt
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true); // octets par seconde
  view.setUint16(32, 2, true); // alignement de bloc
  view.setUint16(34, 16, true); // bits par échantillon
  text(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) view.setInt16(44 + i * 2, samples[i], true);

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Silence de `ms`, précédé si demandé d'un bref repère sonore.
 *
 * Le repère (une note courte et douce) marque le début du temps de réflexion.
 * Sans lui, six secondes de blanc dans un casque ressemblent à une panne ;
 * avec lui, on sait que c'est à soi de répondre — sans sortir le téléphone.
 */
export function silenceClip(ms: number, opts: { tick?: boolean } = {}): Blob {
  const key = `${Math.round(ms)}|${opts.tick ? 1 : 0}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const total = Math.max(1, Math.round((ms / 1000) * SAMPLE_RATE));
  const samples = new Int16Array(total);

  if (opts.tick) {
    const length = Math.min(total, Math.round(0.11 * SAMPLE_RATE));
    for (let i = 0; i < length; i++) {
      const t = i / SAMPLE_RATE;
      // Décroissance rapide : une note qui s'éteint, pas un bip d'alarme.
      const envelope = Math.exp(-t * 26);
      samples[i] = Math.round(Math.sin(2 * Math.PI * 784 * t) * envelope * 7000);
    }
  }

  const blob = encodeWav(samples);
  cache.set(key, blob);
  return blob;
}
