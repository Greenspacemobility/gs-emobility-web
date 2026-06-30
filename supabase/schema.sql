-- ============================================================
-- GEM Project Portal — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Projects
create table if not exists public.projects (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  slug        text unique not null,
  description text,
  status      text default 'active' check (status in ('active', 'completed', 'on_hold')),
  location    text,
  client      text,
  start_date  date,
  metadata    jsonb default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Project members (links Supabase Auth users to projects)
create table if not exists public.project_members (
  id          uuid default gen_random_uuid() primary key,
  project_id  uuid references public.projects(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        text default 'installer' check (role in ('installer', 'engineer', 'admin', 'viewer')),
  created_at  timestamptz default now(),
  unique (project_id, user_id)
);

-- Activity updates / notes
create table if not exists public.project_updates (
  id          uuid default gen_random_uuid() primary key,
  project_id  uuid references public.projects(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text default 'note' check (type in ('note', 'status_update', 'issue', 'milestone')),
  content     text not null,
  metadata    jsonb default '{}',
  created_at  timestamptz default now()
);

-- Uploaded files (metadata; actual files go in Supabase Storage)
create table if not exists public.project_files (
  id           uuid default gen_random_uuid() primary key,
  project_id   uuid references public.projects(id) on delete cascade not null,
  user_id      uuid references auth.users(id) on delete cascade not null,
  filename     text not null,
  storage_path text not null,
  file_size    bigint,
  content_type text,
  created_at   timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────

alter table public.projects        enable row level security;
alter table public.project_members enable row level security;
alter table public.project_updates enable row level security;
alter table public.project_files   enable row level security;

-- Helper: is current user a member of a project?
create or replace function public.is_project_member(pid uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.project_members
    where project_id = pid and user_id = auth.uid()
  );
$$;

-- Projects: members can read their own projects
create policy "members_select_projects" on public.projects
  for select using (public.is_project_member(id));

-- Project members: members can see the member list for their projects
create policy "members_select_members" on public.project_members
  for select using (public.is_project_member(project_id));

-- Updates: members can read + insert
create policy "members_select_updates" on public.project_updates
  for select using (public.is_project_member(project_id));

create policy "members_insert_updates" on public.project_updates
  for insert with check (
    public.is_project_member(project_id) and user_id = auth.uid()
  );

-- Files: members can read + insert
create policy "members_select_files" on public.project_files
  for select using (public.is_project_member(project_id));

create policy "members_insert_files" on public.project_files
  for insert with check (
    public.is_project_member(project_id) and user_id = auth.uid()
  );

-- ── Storage bucket ───────────────────────────────────────────
-- Run separately in Supabase Dashboard > Storage > New bucket
-- Name: project-files  |  Private: true

-- Storage policies (after creating the bucket):
-- insert policy: authenticated users can upload to their project folder
-- select policy: authenticated users can read files in projects they belong to

-- ── Seed example data ────────────────────────────────────────
-- Insert sample projects (update slugs/names to match real ones):
/*
insert into public.projects (name, slug, description, status, location, client) values
  ('Flash EV Charging Hub', 'flash', 'EV charging hub installation at Flash Panama locations', 'active', 'Panama City, Panama', 'Flash'),
  ('Hotel el Panama', 'hotel-el-panama', 'EV charging infrastructure for Hotel el Panama', 'active', 'Panama City, Panama', 'Hotel el Panama');

-- After inviting users via Supabase Auth > Invite User, get their user_id and run:
-- insert into public.project_members (project_id, user_id, role)
-- select p.id, '<USER_UUID>', 'installer'
-- from public.projects p where p.slug = 'flash';
*/
