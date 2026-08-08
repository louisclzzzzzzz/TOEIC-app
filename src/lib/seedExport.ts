/**
 * Conversion des sets générés par IA en code source prêt à coller dans
 * `src/data/partN.ts`.
 *
 * Sans ça, une question générée reste prisonnière du `localStorage` du
 * navigateur : elle disparaît au reset, ne suit pas d'un appareil à l'autre et
 * ne profite à personne d'autre. Le passage par le dépôt est ce qui la rend
 * permanente — d'où cet export, qui évite de tout retranscrire à la main.
 *
 * Deux ajustements sont appliqués au passage :
 *  - `source: 'ai'` devient `'seed'`, et `createdAt` disparaît : une fois dans
 *    le fichier, la question fait partie de la banque de départ ;
 *  - les ids `ai-5-lz3k9x` sont renumérotés selon la convention `p5-41`, en
 *    repartant du dernier index déjà utilisé dans la partie.
 */

import type { QuestionSet } from '../types';

/** Indentation d'un niveau, alignée sur les fichiers existants. */
const IND = '  ';

/**
 * Littéral de chaîne TypeScript.
 *
 * Le texte est en français : il contient des apostrophes typographiques (’),
 * sans danger entre guillemets simples, mais aussi parfois des apostrophes
 * ASCII et des retours à la ligne (corps des passages). D'où ces trois cas.
 */
function str(value: string): string {
  if (value.includes('\n')) {
    // Gabarit : seuls le backtick et l'ouverture d'interpolation gênent.
    const body = value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return `\`${body}\``;
  }
  if (!value.includes("'")) return `'${value.replace(/\\/g, '\\\\')}'`;
  return JSON.stringify(value);
}

/** Objet sur une seule ligne, pour les entrées courtes (choix, vocabulaire). */
function inlineObject(entries: [string, string | undefined][]): string {
  const body = entries
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
  return `{ ${body} }`;
}

function emitAudio(lines: NonNullable<QuestionSet['audio']>, indent: string): string {
  const rows = lines.map(
    (l) =>
      `${indent}${IND}${inlineObject([
        ['speaker', l.speaker ? str(l.speaker) : undefined],
        ['text', str(l.text)],
        ['voice', l.voice ? str(l.voice) : undefined],
      ])},`,
  );
  return `[\n${rows.join('\n')}\n${indent}]`;
}

function emitItem(item: QuestionSet['items'][number], indent: string): string {
  const i = indent + IND;
  const out: string[] = [`${indent}{`, `${i}id: ${str(item.id)},`];

  if (item.vocab?.length) {
    const rows = item.vocab.map(
      (v) =>
        `${i}${IND}${inlineObject([
          ['term', str(v.term)],
          ['translation', str(v.translation)],
          ['example', v.example ? str(v.example) : undefined],
          ['note', v.note ? str(v.note) : undefined],
        ])},`,
    );
    out.push(`${i}vocab: [`, ...rows, `${i}],`);
  }

  out.push(`${i}category: ${str(item.category)},`);
  if (item.prompt) out.push(`${i}prompt: ${str(item.prompt)},`);

  out.push(`${i}choices: [`);
  for (const c of item.choices) {
    out.push(`${i}${IND}${inlineObject([['id', str(c.id)], ['text', str(c.text)]])},`);
  }
  out.push(`${i}],`);

  out.push(`${i}answer: ${str(item.answer)},`);
  out.push(`${i}explanation:`, `${i}${IND}${str(item.explanation)},`);

  if (item.audio?.length) out.push(`${i}audio: ${emitAudio(item.audio, i)},`);

  out.push(`${indent}},`);
  return out.join('\n');
}

/** Un `QuestionSet` en littéral TypeScript, indenté pour un collage direct. */
export function setToSource(set: QuestionSet): string {
  const i = IND + IND;
  const out: string[] = [
    `${IND}{`,
    `${i}id: ${str(set.id)},`,
    `${i}part: ${set.part},`,
    `${i}title: ${str(set.title)},`,
    // La provenance bascule : dans le fichier, ce n'est plus une question « IA ».
    `${i}source: 'seed',`,
  ];

  if (set.scene) {
    out.push(
      `${i}scene: ${inlineObject([
        ['id', set.scene.id ? str(set.scene.id) : undefined],
        ['image', set.scene.image ? str(set.scene.image) : undefined],
        ['alt', str(set.scene.alt)],
      ])},`,
    );
  }

  if (set.audio?.length) out.push(`${i}audio: ${emitAudio(set.audio, i)},`);

  if (set.passages?.length) {
    out.push(`${i}passages: [`);
    for (const p of set.passages) {
      out.push(
        `${i}${IND}{`,
        `${i}${IND}${IND}kind: ${str(p.kind)},`,
        ...(p.heading ? [`${i}${IND}${IND}heading: ${str(p.heading)},`] : []),
        `${i}${IND}${IND}body: ${str(p.body)},`,
        `${i}${IND}},`,
      );
    }
    out.push(`${i}],`);
  }

  out.push(`${i}items: [`);
  for (const item of set.items) out.push(emitItem(item, i + IND));
  out.push(`${i}],`, `${IND}},`);

  return out.join('\n');
}

/**
 * Renumérote un set selon la convention `p{part}-{NN}` / `p{part}-{NN}-q{i}`.
 * Les ids générés (`ai-5-lz3k9x`) sont uniques mais illisibles dans un fichier.
 */
export function renumber(set: QuestionSet, index: number): QuestionSet {
  const id = `p${set.part}-${String(index).padStart(2, '0')}`;
  return {
    ...set,
    id,
    items: set.items.map((item, n) => ({ ...item, id: `${id}-q${n + 1}` })),
  };
}

/**
 * Prochain numéro libre d'une partie, d'après les ids déjà présents dans la
 * banque : évite de produire un `p5-07` alors que la partie va jusqu'à `p5-40`.
 */
export function nextIndex(existing: QuestionSet[], part: number): number {
  const used = existing
    .filter((s) => s.part === part)
    .map((s) => Number(/^p\d-(\d+)$/.exec(s.id)?.[1] ?? 0));
  return Math.max(0, ...used) + 1;
}

/**
 * Fichier complet à coller : les sets regroupés par partie, avec en commentaire
 * le fichier de destination de chaque bloc.
 */
export function generatedToSource(generated: QuestionSet[], bank: QuestionSet[]): string {
  const byPart = new Map<number, QuestionSet[]>();
  for (const set of generated) {
    byPart.set(set.part, [...(byPart.get(set.part) ?? []), set]);
  }

  const blocks: string[] = [
    '/*',
    ' * Questions générées, converties pour la banque de départ.',
    ' *',
    " * Coller chaque bloc à la fin du tableau du fichier indiqué, puis lancer",
    ' * `npm run check` pour valider ids, propositions, énoncés et vocabulaire.',
    ' */',
    '',
  ];

  for (const [part, sets] of [...byPart.entries()].sort((a, b) => a[0] - b[0])) {
    let index = nextIndex(bank, part);
    blocks.push(`/* ---------- src/data/part${part}.ts ---------- */`, '');
    for (const set of sets) {
      blocks.push(setToSource(renumber(set, index++)), '');
    }
  }

  return blocks.join('\n');
}
