/**
 * Indique au client si une clé Mistral est configurée côté serveur.
 *
 * Sans cet appel, l'app ne peut pas savoir si les voix Mistral sont utilisables
 * quand le champ « Clé API » des réglages est vide : elle désactiverait à tort
 * la synthèse alors que `MISTRAL_API_KEY` est définie sur Vercel.
 *
 * Ne renvoie qu'un booléen — jamais la clé, ni un fragment de la clé.
 */


/** Déclaré ici plutôt que via @types/node, comme dans `scripts/check.ts`. */
declare const process: { env: Record<string, string | undefined> };

export const config = { runtime: 'edge' };

export default function handler(): Response {
  const serverKey = Boolean(process.env.MISTRAL_API_KEY?.trim());

  return new Response(JSON.stringify({ serverKey }), {
    headers: {
      'Content-Type': 'application/json',
      // La réponse ne change qu'au redéploiement : inutile de la redemander.
      'Cache-Control': 'public, max-age=300',
    },
  });
}
