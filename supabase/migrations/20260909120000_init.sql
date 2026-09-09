-- Al-Maktaba schema: catalogue, structured inputs, shared-agent gates,
-- attributed publishing, reuse counting, and ratings. RLS throughout.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Reference tables (public read; seeded from the app's typed constants)
-- ---------------------------------------------------------------------------
create table if not exists public.sectors (
    id text primary key,
    name text not null,
    name_ar text,
    data_sensitivity text,
    color text
);

create table if not exists public.role_families (
    id text primary key,
    name text not null,
    name_ar text,
    ai_addressable int,
    arabic_intensity text
);

create table if not exists public.shared_agents (
    id text primary key,
    name text not null,
    name_ar text,
    role text,
    role_ar text,
    badge text,
    badge_ar text,
    description text,
    description_ar text,
    tools text[] default '{}',
    tools_ar text[] default '{}',
    color text
);

create table if not exists public.models (
    id text primary key,
    label text not null,
    label_ar text,
    slug text not null,
    vendor text,
    note text,
    note_ar text,
    is_local boolean default false
);

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    display_name text,
    organisation text,
    created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Methods and their structured children
-- ---------------------------------------------------------------------------
create table if not exists public.methods (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    title_ar text,
    title_lang text default 'en',
    description text,
    description_ar text,
    author_id uuid references public.profiles (id) on delete set null,
    author_name text,
    organisation text,
    version text default 'v1',
    sector_id text references public.sectors (id),
    role_id text references public.role_families (id),
    language text default 'English',
    sensitivity text default 'Internal',
    method_body text not null,
    output_format text,
    built_on text,
    time_before_min int default 0,
    time_after_min int default 0,
    reuse_count int default 0,
    is_published boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create index if not exists methods_sector_idx on public.methods (sector_id);
create index if not exists methods_role_idx on public.methods (role_id);
create index if not exists methods_author_idx on public.methods (author_id);

create table if not exists public.method_inputs (
    id uuid primary key default gen_random_uuid(),
    method_id uuid not null references public.methods (id) on delete cascade,
    name text not null,
    label text not null,
    label_ar text,
    type text not null default 'text' check (type in ('text', 'file', 'pdf', 'image')),
    description text,
    description_ar text,
    required boolean default true,
    position int default 0
);
create index if not exists method_inputs_method_idx on public.method_inputs (method_id);

create table if not exists public.method_agents (
    method_id uuid not null references public.methods (id) on delete cascade,
    agent_id text not null references public.shared_agents (id) on delete cascade,
    primary key (method_id, agent_id)
);

create table if not exists public.method_versions (
    id uuid primary key default gen_random_uuid(),
    method_id uuid not null references public.methods (id) on delete cascade,
    version text not null,
    note text,
    author_name text,
    is_current boolean default false,
    created_at timestamptz default now()
);

create table if not exists public.method_runs (
    id uuid primary key default gen_random_uuid(),
    method_id uuid not null references public.methods (id) on delete cascade,
    user_id uuid references public.profiles (id) on delete set null,
    model_slug text,
    created_at timestamptz default now()
);
create index if not exists method_runs_method_idx on public.method_runs (method_id);

create table if not exists public.method_ratings (
    id uuid primary key default gen_random_uuid(),
    method_id uuid not null references public.methods (id) on delete cascade,
    user_id uuid not null references public.profiles (id) on delete cascade,
    score int not null check (score between 1 and 5),
    created_at timestamptz default now(),
    unique (method_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists methods_set_updated_at on public.methods;
create trigger methods_set_updated_at before update on public.methods
    for each row execute function public.set_updated_at();

-- reuse_count = distinct users who ran the method
create or replace function public.recount_reuse() returns trigger language plpgsql security definer as $$
declare
    mid uuid;
begin
    mid := coalesce(new.method_id, old.method_id);
    update public.methods
    set reuse_count = (select count(distinct user_id) from public.method_runs where method_id = mid)
    where id = mid;
    return null;
end;
$$;

drop trigger if exists method_runs_recount on public.method_runs;
create trigger method_runs_recount after insert or delete on public.method_runs
    for each row execute function public.recount_reuse();

-- auto-create a profile when a user signs up
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
    insert into public.profiles (id, display_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
    for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.sectors enable row level security;
alter table public.role_families enable row level security;
alter table public.shared_agents enable row level security;
alter table public.models enable row level security;
alter table public.profiles enable row level security;
alter table public.methods enable row level security;
alter table public.method_inputs enable row level security;
alter table public.method_agents enable row level security;
alter table public.method_versions enable row level security;
alter table public.method_runs enable row level security;
alter table public.method_ratings enable row level security;

-- Reference tables: public read
create policy "sectors_read" on public.sectors for select using (true);
create policy "roles_read" on public.role_families for select using (true);
create policy "agents_read" on public.shared_agents for select using (true);
create policy "models_read" on public.models for select using (true);

-- Profiles
create policy "profiles_read" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Methods
create policy "methods_read" on public.methods for select using (is_published or author_id = auth.uid());
create policy "methods_insert_own" on public.methods for insert with check (author_id = auth.uid());
create policy "methods_update_own" on public.methods for update using (author_id = auth.uid());
create policy "methods_delete_own" on public.methods for delete using (author_id = auth.uid());

-- Child tables: public read; writes only by the parent method's author
create policy "method_inputs_read" on public.method_inputs for select using (true);
create policy "method_inputs_write" on public.method_inputs for all
    using (exists (select 1 from public.methods m where m.id = method_id and m.author_id = auth.uid()))
    with check (exists (select 1 from public.methods m where m.id = method_id and m.author_id = auth.uid()));

create policy "method_agents_read" on public.method_agents for select using (true);
create policy "method_agents_write" on public.method_agents for all
    using (exists (select 1 from public.methods m where m.id = method_id and m.author_id = auth.uid()))
    with check (exists (select 1 from public.methods m where m.id = method_id and m.author_id = auth.uid()));

create policy "method_versions_read" on public.method_versions for select using (true);
create policy "method_versions_write" on public.method_versions for all
    using (exists (select 1 from public.methods m where m.id = method_id and m.author_id = auth.uid()))
    with check (exists (select 1 from public.methods m where m.id = method_id and m.author_id = auth.uid()));

-- Runs: public read (for counts), each user inserts their own
create policy "runs_read" on public.method_runs for select using (true);
create policy "runs_insert_own" on public.method_runs for insert with check (auth.uid() = user_id);

-- Ratings: public read; upsert your own
create policy "ratings_read" on public.method_ratings for select using (true);
create policy "ratings_write_own" on public.method_ratings for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
