/**
 * Accès bas niveau à l'API Mistral, partagé par la génération de questions
 * (chat) et la synthèse vocale (audio/speech).
 *
 * On ne parle JAMAIS à `api.mistral.ai` directement : l'API ne renvoie pas
 * d'en-têtes CORS, donc un appel navigateur serait bloqué. Tout passe par
 * `/api/mistral` — le proxy Vite en dev (`vite.config.ts`), une fonction
 * serverless en production (`api/mistral/[...path].ts`).
 *
 * Ce proxy permet aussi de garder la clé côté serveur : si `MISTRAL_API_KEY`
 * est définie sur l'hébergeur, l'app fonctionne avec le champ « Clé API » vide.
 */

const BASE = '/api/mistral';

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
  const key = apiKey.trim();

  // Pas de clé côté client ⇒ on tente quand même : le proxy prendra le relais
  // avec `MISTRAL_API_KEY` s'il en a une, et répondra 401 sinon.
  if (!key && !serverKey) {
    throw new MistralError('Clé API Mistral absente (à renseigner dans Réglages).');
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
        ...init.headers,
      },
    });
  } catch (err) {
    // Cause la plus fréquente : le proxy n'est pas là (build statique servi tel
    // quel, ou fonction serverless non déployée).
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new MistralError(
      "Appel réseau impossible : le proxy /api/mistral n'a pas répondu.",
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

/* ------------------------------------------------------------------ */
/* Clé côté serveur                                                    */
/* ------------------------------------------------------------------ */

/**
 * Vrai quand l'hébergeur fournit la clé (variable `MISTRAL_API_KEY`).
 *
 * Drapeau synchrone : il est lu à chaque décision « peut-on utiliser Mistral ? »,
 * y compris pendant un rendu React. Il reste `false` tant que la sonde n'a pas
 * répondu — au pire, l'app démarre sur les voix du système et bascule ensuite.
 */
let serverKey = false;
let probe: Promise<boolean> | null = null;

export const hasServerKey = (): boolean => serverKey;

/** Vrai si la synthèse Mistral est possible, par la clé du client ou du serveur. */
export const hasMistralAccess = (apiKey: string): boolean =>
  Boolean(apiKey.trim()) || serverKey;

/**
 * Interroge `/api/mistral-status` une seule fois par chargement de page.
 * Un échec (pas de backend, hors ligne) laisse simplement le drapeau à `false`.
 */
export function probeServerKey(): Promise<boolean> {
  probe ??= fetch('/api/mistral-status')
    .then((res) => (res.ok ? res.json() : { serverKey: false }))
    .then((body: { serverKey?: boolean }) => (serverKey = Boolean(body.serverKey)))
    .catch(() => false);
  return probe;
}
