-- À exécuter une fois dans Supabase : dashboard du projet > SQL Editor > New query.
--
-- Une seule table : une ligne par utilisateur, l'état complet de l'app en jsonb
-- (même format que ce qui était stocké en localStorage). RLS empêche un
-- utilisateur de lire ou écrire la ligne d'un autre.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "select own progress" on public.progress
  for select using (auth.uid () = user_id);

create policy "insert own progress" on public.progress
  for insert
  with check (auth.uid () = user_id);

create policy "update own progress" on public.progress
  for update using (auth.uid () = user_id);
