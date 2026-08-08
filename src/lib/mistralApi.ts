/**
 * Accès bas niveau à l'API Mistral, partagé par la génération de questions
 * (chat) et la synthèse vocale (audio/speech).
 *
 * En dev, on passe par le proxy Vite : l'API ne renvoie pas d'en-têtes CORS,
 * donc un appel navigateur direct est bloqué. Voir `vite.config.ts`.
 */

// `import.meta.env` n'existe qu'avec Vite : l'optional chaining garde le module
// importable depuis Node (scripts/check.ts) sans planter au chargement.
const BASE = import.meta.env?.DEV ? '/api/mistral' : 'https://api.mistral.ai';

export class MistralError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'MistralError';
  }
}

/**
 * Appelle l'API et lève une `MistralError` lisible en cas d'échec.
 * Les messages sont volontairement explicites : ils s'affichent tels quels
 * dans les réglages ou sous le lecteur audio.
 */
export async function mistralFetch(
  path: string,
  apiKey: string,
  init: RequestInit = {},
): Promise<Response> {
  if (!apiKey.trim()) {
    throw new MistralError('Clé API Mistral absente (à renseigner dans Réglages).');
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
        ...init.headers,
      },
    });
  } catch (err) {
    // Cause la plus fréquente hors `npm run dev` : le proxy n'existe pas.
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new MistralError(
      "Appel réseau impossible. L'API Mistral exige le proxy du serveur de dev (`npm run dev`).",
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const hint =
      res.status === 401
        ? 'Clé API refusée.'
        : res.status === 429
          ? 'Quota ou débit dépassé, réessaie dans un instant.'
          : detail.slice(0, 160) || res.statusText;
    throw new MistralError(`Mistral ${res.status} — ${hint}`, res.status);
  }

  return res;
}
