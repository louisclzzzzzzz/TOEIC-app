/**
 * Cache persistant des clips audio synthétisés (IndexedDB).
 *
 * Raison d'être : un même script est réécouté souvent (bouton « Réécouter »,
 * passages en révision espacée), et la synthèse coûte du réseau, de la latence
 * et des crédits API. Une fois un bloc synthétisé, il est rejoué instantanément
 * et hors ligne — ce qui rend l'app utilisable dans les transports.
 *
 * localStorage ne conviendrait pas ici : il est limité à ~5 Mo et ne stocke que
 * du texte. IndexedDB accepte les Blob directement.
 */

const DB_NAME = 'toeic-tts';
const STORE = 'clips';
const VERSION = 1;

interface ClipRecord {
  blob: Blob;
  bytes: number;
  at: number;
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    // Navigation privée, quota refusé… : on continue sans cache plutôt que d'échouer.
    req.onerror = () => resolve(null);
  });
  return dbPromise;
}

/** Clé de cache : le même texte lu par la même voix donne le même clip. */
export const clipKey = (model: string, voiceId: string, text: string): string =>
  `${model}|${voiceId}|${text}`;

export async function getClip(key: string): Promise<Blob | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as ClipRecord | undefined)?.blob ?? null);
    req.onerror = () => resolve(null);
  });
}

export async function putClip(key: string, blob: Blob): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const record: ClipRecord = { blob, bytes: blob.size, at: Date.now() };
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(record, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve(); // quota plein : on joue quand même le clip en mémoire
  });
}

export async function clearClips(): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

/** Statistiques affichées dans les réglages. */
export async function cacheStats(): Promise<{ count: number; bytes: number }> {
  const db = await openDb();
  if (!db) return { count: 0, bytes: 0 };
  return new Promise((resolve) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => {
      const rows = (req.result ?? []) as ClipRecord[];
      resolve({ count: rows.length, bytes: rows.reduce((n, r) => n + (r.bytes ?? 0), 0) });
    };
    req.onerror = () => resolve({ count: 0, bytes: 0 });
  });
}
