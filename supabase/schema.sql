-- supabase/schema.sql — run once in Supabase → SQL editor.
--
-- The site is a static SPA, so the browser holds the anon key and these
-- policies are the only gate: guests may insert, nobody may read. Read the
-- answers in the dashboard (Table editor → rsvp_responses).

-- ── table ───────────────────────────────────────────────────────────────────
create table if not exists public.rsvp_responses (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  guest_name   text        not null check (char_length(trim(guest_name)) between 2 and 80),
  is_attending boolean     not null,
  guest_count  smallint    not null default 1 check (guest_count between 1 and 10),
  message      text        check (char_length(message) <= 500),
  -- object path inside the rsvp-photos bucket, null when no photo was picked
  photo_path   text
);

alter table public.rsvp_responses enable row level security;

drop policy if exists "anon can insert rsvp" on public.rsvp_responses;
create policy "anon can insert rsvp" on public.rsvp_responses
  for insert to anon with check (true);

-- ── storage ─────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('rsvp-photos', 'rsvp-photos', true)
on conflict (id) do nothing;

drop policy if exists "anon can upload rsvp photo" on storage.objects;
create policy "anon can upload rsvp photo" on storage.objects
  for insert to anon with check (bucket_id = 'rsvp-photos');

drop policy if exists "anyone can read rsvp photo" on storage.objects;
create policy "anyone can read rsvp photo" on storage.objects
  for select to public using (bucket_id = 'rsvp-photos');

-- ── changing an answer ──────────────────────────────────────────────────────
-- Guests can re-open their card and update the row they created. The browser
-- mints the row id (`crypto.randomUUID()`) and keeps it in localStorage — an
-- insert cannot read its own id back, because there is deliberately no select
-- policy.
--
-- Scope of this policy, stated plainly: it lets the anon key update ANY row in
-- the table, and the only thing standing between a stranger and someone else's
-- answer is not knowing the row's uuid. Nobody can list ids (no select policy)
-- and v4 uuids are not guessable, so in practice a guest can only edit the row
-- their own browser created — but the database is not enforcing that. For a
-- one-evening guest list that is the trade being made; drop this policy if you
-- would rather answers be final once sent.
drop policy if exists "anon can update own rsvp" on public.rsvp_responses;
create policy "anon can update own rsvp" on public.rsvp_responses
  for update to anon using (true) with check (true);

-- Bookkeeping, so the dashboard shows which answers were changed and when.
alter table public.rsvp_responses
  add column if not exists updated_at timestamptz;
