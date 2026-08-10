/**
 * Traduction automatique anglais → français pour l'ajout manuel au carnet.
 *
 * L'app reste un site statique sans backend (voir README) : pas question de
 * réintroduire une clé ou un proxy juste pour ça. MyMemory expose une API de
 * traduction publique, sans clé, appelable directement depuis le navigateur.
 * Le résultat reste une suggestion : le champ traduction n'est jamais verrouillé.
 *
 * Le champ `responseData.translatedText` de MyMemory choisit parfois un match
 * obscur plutôt que le plus fiable (ex. "postpone" → "subordonner"). On
 * reclasse donc `matches[]` par score de qualité et on ne garde que les
 * entrées qui correspondent exactement au terme demandé.
 */

interface MyMemoryMatch {
  segment: string;
  translation: string;
  quality?: string | number;
}

const ENDPOINT = 'https://api.mymemory.translated.net/get';

function bestMatch(term: string, matches: MyMemoryMatch[]): string | null {
  const exact = matches.filter((m) => m.segment?.trim().toLowerCase() === term.toLowerCase());
  if (!exact.length) return null;

  const quality = (m: MyMemoryMatch) => {
    const n = typeof m.quality === 'string' ? parseFloat(m.quality) : m.quality;
    return Number.isFinite(n) ? (n as number) : 0;
  };
  exact.sort((a, b) => quality(b) - quality(a));
  return exact[0].translation;
}

/**
 * MyMemory renvoie des entrées extraites de phrases : casse capitale en début
 * de segment ("Rembourser") ou tout en capitales. Le carnet n'a pas de noms
 * propres, donc une minuscule initiale est toujours la bonne forme.
 */
function normalizeCase(text: string): string {
  if (text.length > 3 && text === text.toUpperCase()) {
    return text[0].toLowerCase() + text.slice(1).toLowerCase();
  }
  return text[0].toLowerCase() + text.slice(1);
}

export async function translateToFrench(term: string): Promise<string | null> {
  const q = term.trim();
  if (!q) return null;

  try {
    const url = `${ENDPOINT}?q=${encodeURIComponent(q)}&langpair=en|fr`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const matches: MyMemoryMatch[] = Array.isArray(data?.matches) ? data.matches : [];
    const text = bestMatch(q, matches) ?? data?.responseData?.translatedText ?? null;
    if (!text) return null;

    // Message d'erreur textuel (quota, etc.) au lieu d'un statut HTTP non-200.
    if (/MYMEMORY WARNING|QUOTA/i.test(text)) return null;

    return normalizeCase(text.trim());
  } catch {
    return null;
  }
}
