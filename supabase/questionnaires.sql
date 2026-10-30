-- ============================================================
-- Cuestionarios de diagnóstico para prospectos
-- Proyecto: gem-portal  ·  Ejecutar en SQL Editor
-- ============================================================
-- Diseño: el cliente NO inicia sesión. El enlace lleva un token
-- largo e impredecible. Las tablas quedan cerradas por RLS y todo
-- el acceso pasa por funciones security definer que validan el
-- token dentro de SQL. Así la clave anónima del sitio no puede
-- leer ni escribir nada por su cuenta.

create table if not exists public.questionnaire_invites (
  id              uuid primary key default gen_random_uuid(),
  token           text unique not null,
  template        text not null,                 -- p.ej. 'diagnostico-flota'
  client_name     text not null,                 -- grupo / cliente: 'ADL'
  operation_name  text,                          -- operadora: 'Transmodal'
  subtitle        text,                          -- '13 unidades · Ciudad de México'
  locale          text not null default 'es',
  contact_email   text,
  status          text not null default 'pendiente'
                  check (status in ('pendiente','en_progreso','enviado')),
  answers         jsonb not null default '{}'::jsonb,
  progress        int  not null default 0 check (progress between 0 and 100),
  expires_at      timestamptz,
  first_opened_at timestamptz,
  submitted_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists questionnaire_invites_token_idx on public.questionnaire_invites (token);

create table if not exists public.questionnaire_files (
  id            uuid primary key default gen_random_uuid(),
  invite_id     uuid not null references public.questionnaire_invites(id) on delete cascade,
  field         text not null,                   -- a qué documento corresponde
  filename      text not null,
  storage_path  text not null,
  size_bytes    bigint,
  content_type  text,
  uploaded_at   timestamptz not null default now()
);

create index if not exists questionnaire_files_invite_idx on public.questionnaire_files (invite_id);

-- RLS: nadie entra directo. Solo las funciones de abajo.
alter table public.questionnaire_invites enable row level security;
alter table public.questionnaire_files   enable row level security;
revoke all on public.questionnaire_invites from anon, authenticated;
revoke all on public.questionnaire_files   from anon, authenticated;

-- ---------- Cargar el cuestionario a partir del token ----------
create or replace function public.q_load(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v record; v_files jsonb;
begin
  select * into v from public.questionnaire_invites where token = p_token;
  if not found then return null; end if;
  if v.expires_at is not null and v.expires_at < now() then
    return jsonb_build_object('expirado', true);
  end if;

  -- Primera apertura: queda registrada para saber si el cliente ya entró
  if v.first_opened_at is null then
    update public.questionnaire_invites
       set first_opened_at = now(),
           status = case when status = 'pendiente' then 'en_progreso' else status end,
           updated_at = now()
     where id = v.id;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'id', f.id, 'field', f.field, 'filename', f.filename,
           'size_bytes', f.size_bytes, 'uploaded_at', f.uploaded_at)), '[]'::jsonb)
    into v_files
    from public.questionnaire_files f where f.invite_id = v.id;

  return jsonb_build_object(
    'template',       v.template,
    'client_name',    v.client_name,
    'operation_name', v.operation_name,
    'subtitle',       v.subtitle,
    'locale',         v.locale,
    'status',         v.status,
    'answers',        v.answers,
    'progress',       v.progress,
    'submitted_at',   v.submitted_at,
    'files',          v_files
  );
end;
$$;

-- ---------- Guardado automático ----------
create or replace function public.q_save(p_token text, p_answers jsonb, p_progress int)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v record;
begin
  select * into v from public.questionnaire_invites where token = p_token;
  if not found then return null; end if;
  if v.status = 'enviado' then
    return jsonb_build_object('bloqueado', true);
  end if;
  if v.expires_at is not null and v.expires_at < now() then
    return jsonb_build_object('expirado', true);
  end if;

  update public.questionnaire_invites
     set answers    = coalesce(p_answers, '{}'::jsonb),
         progress   = greatest(0, least(100, coalesce(p_progress, 0))),
         status     = case when status = 'pendiente' then 'en_progreso' else status end,
         updated_at = now()
   where id = v.id;

  return jsonb_build_object('guardado', true, 'hora', now());
end;
$$;

-- ---------- Envío final ----------
create or replace function public.q_submit(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v record;
begin
  select * into v from public.questionnaire_invites where token = p_token;
  if not found then return null; end if;
  if v.status = 'enviado' then
    return jsonb_build_object('ya_enviado', true, 'submitted_at', v.submitted_at);
  end if;

  update public.questionnaire_invites
     set status = 'enviado', submitted_at = now(), updated_at = now()
   where id = v.id;

  return jsonb_build_object('enviado', true, 'submitted_at', now(),
                            'client_name', v.client_name, 'operation_name', v.operation_name);
end;
$$;

-- ---------- Registrar un archivo subido ----------
create or replace function public.q_add_file(
  p_token text, p_field text, p_filename text,
  p_path text, p_size bigint, p_type text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v record; v_id uuid;
begin
  select * into v from public.questionnaire_invites where token = p_token;
  if not found then return null; end if;
  if v.status = 'enviado' then return jsonb_build_object('bloqueado', true); end if;

  insert into public.questionnaire_files (invite_id, field, filename, storage_path, size_bytes, content_type)
  values (v.id, p_field, p_filename, p_path, p_size, p_type)
  returning id into v_id;

  update public.questionnaire_invites set updated_at = now() where id = v.id;
  return jsonb_build_object('id', v_id);
end;
$$;

-- Solo estas cuatro funciones son ejecutables desde fuera.
revoke execute on function public.q_load(text)                               from public;
revoke execute on function public.q_save(text, jsonb, int)                   from public;
revoke execute on function public.q_submit(text)                             from public;
revoke execute on function public.q_add_file(text,text,text,text,bigint,text) from public;

grant execute on function public.q_load(text)                                to anon, authenticated;
grant execute on function public.q_save(text, jsonb, int)                    to anon, authenticated;
grant execute on function public.q_submit(text)                              to anon, authenticated;
grant execute on function public.q_add_file(text,text,text,text,bigint,text) to anon, authenticated;
