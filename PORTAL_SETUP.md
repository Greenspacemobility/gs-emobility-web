# Project Portal Setup Guide

External partners (installers, engineers) can log in at `/portal/login` to see their assigned projects, submit updates, and upload files.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `gem-portal` (or similar)
3. Copy your **Project URL** and **anon public key** from Settings → API

---

## 2. Add environment variables

Create (or update) `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Also add these to **Vercel** → Project → Settings → Environment Variables.

---

## 3. Run the database schema

1. Supabase Dashboard → **SQL Editor** → New Query
2. Paste the contents of `supabase/schema.sql` and click Run

---

## 4. Create the storage bucket

1. Supabase Dashboard → **Storage** → New Bucket
2. Name: `project-files`
3. Public: **No** (keep private)
4. Add these storage policies (Storage → Policies → New policy):

**Upload policy** (INSERT):
```sql
(bucket_id = 'project-files') AND (auth.role() = 'authenticated')
```

**Download policy** (SELECT):
```sql
(bucket_id = 'project-files') AND (auth.role() = 'authenticated')
```

---

## 5. Create projects

In Supabase Dashboard → **Table Editor** → `projects`, insert a row for each project:

| Field | Example |
|---|---|
| name | Flash EV Charging Hub |
| slug | flash |
| description | EV charging hub at Flash locations |
| status | active |
| location | Panama City, Panama |
| client | Flash |

The `slug` becomes the URL: `/portal/flash`

---

## 6. Invite external users

1. Supabase Dashboard → **Authentication** → Users → **Invite user**
2. Enter their email — they'll receive a link to set their password
3. After they accept, copy their **User UID** from the users list

---

## 7. Assign users to projects

In the SQL Editor, run (replace the UUIDs):

```sql
-- Get the project ID
select id from projects where slug = 'flash';

-- Assign the user
insert into project_members (project_id, user_id, role)
values ('<PROJECT_UUID>', '<USER_UUID>', 'installer');
```

**Roles:**
- `installer` — can view + submit updates + upload files
- `engineer` — same as installer
- `viewer` — read-only (no updates/uploads)
- `admin` — full access (future use)

---

## 8. Test locally

```bash
npm run dev
```

Navigate to `http://localhost:3000/portal/login` and sign in with an invited user's credentials.

---

## URLs

| Path | Description |
|---|---|
| `/portal/login` | Sign-in page |
| `/portal` | Project list (or auto-redirect to single project) |
| `/portal/[slug]` | Project dashboard |

---

## Install the Supabase packages

If not already installed:

```bash
npm install @supabase/supabase-js @supabase/ssr
```
