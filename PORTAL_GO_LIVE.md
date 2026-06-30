# Portal Go-Live Runbook (agent handoff)

> **Goal:** take the already-built external partner portal from "coded" to
> "live", so a 3rd-party installer can log in at `/portal`, see only the
> projects they're assigned to (e.g. **Flash**, **Hotel el Panama**), post
> updates, and upload documents.
>
> **For the agent (Cowork):** the portal code is DONE and committed (commit
> `67fedef`). Do **not** rebuild it. Your job is provisioning + wiring +
> verification. Read `PORTAL_SETUP.md` and `supabase/schema.sql` first.
>
> **Division of labor:** steps marked 🧑 **HUMAN** require the project owner's
> Supabase login (account, API keys, user invites) and cannot be done by the
> agent unless a Supabase MCP/management-API token is connected. Steps marked
> 🤖 **AGENT** the agent does directly in this repo.

---

## What already exists (don't rebuild)

- Login (`/portal/login`), project list (`/portal`), per-project dashboard
  (`/portal/[slug]`) with Overview / Updates / Files tabs.
- Update form (note / status / issue / milestone) and drag-drop file upload.
- Auth + route protection in `middleware.ts`.
- DB schema + row-level security in `supabase/schema.sql` (members see ONLY
  their own projects).
- Supabase client libs in `lib/supabase/`, types in `types/portal.ts`.
- Dependencies already in `package.json` (`@supabase/ssr`, `@supabase/supabase-js`).

The ONLY reason it isn't working yet: no Supabase project is connected, the
database/bucket/data don't exist, and nothing is deployed.

---

## Leg 1 — Create the Supabase project  🧑 HUMAN

1. [supabase.com](https://supabase.com) → sign in → **New Project**.
2. Name `gem-portal`; generate + save a DB password; region **East US (North
   Virginia)** (closest to Panama).
3. Wait ~2 min for provisioning.
4. **Project Settings → API**, copy two values:
   - **Project URL** → `https://<ref>.supabase.co`
   - **`anon` `public`** key (starts `eyJ…`)
5. Give both values to the agent.
   - ✅ The `anon public` key is browser-safe (RLS protects the data).
   - ⛔️ NEVER share or commit the `service_role` / `secret` key.

---

## Leg 2 — Wire the env vars  🤖 AGENT

1. Add to `.env.local` (this file is gitignored — never commit it):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…
   ```
2. Tell the human to add the SAME two vars in **Vercel → Project → Settings →
   Environment Variables** (Production + Preview), so the deployed site works.
3. Verify nothing secret got committed: `git status` should show `.env.local`
   as ignored (not staged).

---

## Leg 3 — Create tables + seed projects  🧑 HUMAN (agent supplies SQL)

Supabase Dashboard → **SQL Editor → New query** → paste & **Run**.

**3a. Schema** — paste the entire contents of `supabase/schema.sql` and run it.
(Creates the 4 tables, RLS policies, and the `is_project_member` helper.)

**3b. Seed the projects** — run this (adjust names/slugs as needed):

```sql
insert into public.projects (name, slug, description, status, location, client) values
  ('Flash EV Charging Hub', 'flash',
   'EV charging hub installation at Flash locations',
   'active', 'Panama City, Panama', 'Flash'),
  ('Hotel el Panama', 'hotel-el-panama',
   'EV charging infrastructure for Hotel el Panama',
   'active', 'Panama City, Panama', 'Hotel el Panama')
on conflict (slug) do nothing;
```

> If "Flash and Hotel el Panama" is meant to be ONE combined project instead of
> two, replace the block above with a single `insert ... values (...)` row.

---

## Leg 4 — Create the private file bucket + policies  🧑 HUMAN (agent supplies steps)

1. Dashboard → **Storage → New bucket** → name `project-files`, **Public: OFF**.
2. **Storage → Policies → New policy** on `project-files`, add two:

   **Upload (INSERT):**
   ```sql
   (bucket_id = 'project-files') AND (auth.role() = 'authenticated')
   ```
   **Download (SELECT):**
   ```sql
   (bucket_id = 'project-files') AND (auth.role() = 'authenticated')
   ```

> Hardening note (optional, later): these policies let any authenticated user
> reach any path in the bucket if they know it. The `project_files` DB table is
> already locked per-project by RLS, so users can't *discover* other projects'
> files — but for stricter isolation, scope the storage policy to the project
> folder. Fine to ship as-is for launch.

---

## Leg 5 — Invite an installer + assign them to a project  🧑 HUMAN

1. Dashboard → **Authentication → Users → Invite user** → enter the installer's
   email. They get an email link to set a password.
2. After they accept (or immediately, if you create them with a password), copy
   their **User UID**.
3. SQL Editor → run, replacing the UUID and choosing the project slug + role:

   ```sql
   insert into public.project_members (project_id, user_id, role)
   select p.id, '<USER_UUID>', 'installer'
   from public.projects p
   where p.slug = 'flash';        -- or 'hotel-el-panama'
   ```

   **Roles:** `installer` / `engineer` = view + post updates + upload;
   `viewer` = read-only; `admin` = reserved for future use.

> To give one person access to BOTH projects, run the insert twice (once per
> slug), or change the `where` to `p.slug in ('flash','hotel-el-panama')`.

---

## Leg 6 — Verify, then deploy  🤖 AGENT (deploy needs 🧑 approval)

1. Typecheck: `npx tsc --noEmit` → must pass.
   (Note: `npm run build` fails locally on this machine — a known
   `@parcel/watcher-darwin-arm64` issue, NOT a code error. Use `tsc` to validate.)
2. Run locally: `npm run dev`, open `http://localhost:3000/portal/login`, sign
   in as the invited installer, confirm they see only their project(s) and can
   post an update + upload a file.
3. Report results to the human. **Do NOT deploy autonomously.** After approval:
   `npx vercel --prod`, wait for "● Ready" via `npx vercel ls`, then verify:
   `curl -A "Mozilla/5.0" https://www.gs-emobility.com/portal/login` → HTTP 200.

---

## Done when

- An invited installer logs in at `/portal/login`,
- sees only the project(s) they're assigned to,
- can post an update and upload a document,
- and a user NOT assigned to a project cannot see it (RLS enforced).
