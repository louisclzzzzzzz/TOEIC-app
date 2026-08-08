/**
 * Proxy vers l'API Mistral.
 *
 * Deux raisons d'exister :
 *  1. CORS — `api.mistral.ai` ne renvoie pas d'en-têtes CORS, donc un appel
 *     direct depuis le navigateur est bloqué. En dev, `vite.config.ts` joue ce
 *     rôle ; en production, c'est cette fonction.
 *  2. La clé API — quand `MISTRAL_API_KEY` est définie côté serveur, elle est
 *     injectée ici et ne quitte jamais Vercel. Le navigateur n'en voit rien.
 *
 * Si aucune clé serveur n'est configurée, on relaie celle que le client a posée
 * dans l'en-tête `Authorization` (mode « clé perso », comme en local).
 */


/** Déclaré ici plutôt que via @types/node, comme dans `scripts/check.ts`. */
declare const process: { env: Record<string, string | undefined> };

export const config = { runtime: 'edge' };

const UPSTREAM = 'https://api.mistral.ai';

/** En-têtes de réponse à ne pas recopier : ils décrivent la connexion amont. */
const STRIPPED = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection']);

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Le client appelle /api/mistral/v1/... ; `vercel.json` réécrit vers ce
  // fichier en passant le chemin amont dans `upstream`. On ne s'appuie pas sur
  // une route dynamique `[...path]` : hors Next.js elle ne capture qu'un seul
  // segment, ce qui mettait /v1/chat/completions en 404.
  const rewritten = url.searchParams.get('upstream');
  const path = rewritten
    ? `/${rewritten.replace(/^\/+/, '')}`
    : url.pathname.replace(/^\/api\/mistral/, '');

  if (path === '/' || !path.startsWith('/')) {
    return json({ message: 'Chemin invalide.' }, 400);
  }

  // `upstream` est notre paramètre de routage : il ne doit pas partir chez Mistral.
  const query = new URLSearchParams(url.search);
  query.delete('upstream');
  const search = query.toString();

  // La clé du client est prioritaire : elle traduit un choix explicite dans les
  // réglages. La clé serveur prend le relais quand le champ est laissé vide.
  const clientAuth = req.headers.get('authorization');
  const serverKey = process.env.MISTRAL_API_KEY?.trim();
  const authorization = clientAuth || (serverKey ? `Bearer ${serverKey}` : null);

  if (!authorization) {
    return json(
      {
        message:
          'Aucune clé API Mistral. Renseigne-la dans Réglages, ou définis MISTRAL_API_KEY côté serveur.',
      },
      401,
    );
  }

  const headers: HeadersInit = { Authorization: authorization };
  const contentType = req.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;

  let upstream: Response;
  try {
    upstream = await fetch(`${UPSTREAM}${path}${search ? `?${search}` : ''}`, {
      method: req.method,
      headers,
      // GET/HEAD n'ont pas de corps ; le passer ferait échouer `fetch`.
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
      // Requis par le runtime edge dès qu'on transmet un corps en flux.
      duplex: 'half',
    } as RequestInit);
  } catch {
    return json({ message: "L'API Mistral est injoignable depuis le serveur." }, 502);
  }

  // Le corps est relayé en flux : indispensable pour l'audio de la synthèse,
  // qui peut peser plusieurs centaines de kilo-octets.
  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIPPED.has(key.toLowerCase())) out.set(key, value);
  });

  return new Response(upstream.body, { status: upstream.status, headers: out });
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
