/**
 * Client Supabase, optionnel.
 *
 * `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` sont absentes par défaut (repo
 * public, pas de clé committée) : sans elles, `supabase` vaut `null` et l'app
 * continue de fonctionner en pur local, comme avant.
 */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
