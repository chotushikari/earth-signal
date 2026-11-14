create table public.earth_signal_collections (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('place','topic','investigation')),
  item_id text not null check (length(item_id) between 1 and 160),
  metadata jsonb not null default '{}'::jsonb check (pg_column_size(metadata) < 16384),
  created_at timestamptz not null default now(),
  primary key (user_id, kind, item_id)
);
alter table public.earth_signal_collections enable row level security;
revoke all on public.earth_signal_collections from anon;
grant select, insert, update, delete on public.earth_signal_collections to authenticated;
create policy earth_signal_own_collections on public.earth_signal_collections
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
