# PROJECT BRIEF: Greenspace E-mobility website — optimization & improvement flow

> Self-contained onboarding for any agent (Cowork) or developer working on this site.
> Read this first, then you can check, optimize, and improve the site without guessing.

## Mission
Greenspace E-mobility builds and operates solar-powered, high-power EV charging hubs and
electrifies freight corridors across Panama, Mexico, Texas (USA) and Norway. **Business goal:
become the most-visited e-mobility website in Panama, Mexico, the US, and Norway.** Optimize the
site for SEO, performance, accessibility, conversion, and content quality toward that goal.

## Where the project lives
- Repo root: this directory (`gs-emobility-web`)
- Verified company data: `COMPANY-REFERENCE.md` (repo root — legal names, addresses, descriptions, socials, founding date 2020-09-22). Use it for any company facts.
- Live site: https://www.gs-emobility.com

## Tech stack
- Next.js 14.2 (App Router) · React 18 · TypeScript
- next-intl 4.12 (i18n) — locales `en` + `es`, **default locale `es`**; routing in `middleware.ts`, config in `i18n.ts`
- Tailwind CSS (`tailwind.config.ts`, `app/globals.css`) — NO @tailwindcss/typography plugin
- framer-motion, leaflet/react-leaflet (map), lucide-react (icons)
- Email: resend + nodemailer · @anthropic-ai/sdk (content cron) · @vercel/analytics
- Hosted on Vercel

## How to run, validate, and deploy — READ THIS, there are gotchas
- `npm run dev` — local dev server.
- ⚠️ **`npm run build` / `next build` FAILS locally** on the current machine: `@parcel/watcher-darwin-arm64` native module is missing. This is environmental, NOT a code error. **To validate code, run `npx tsc --noEmit`** (typecheck) instead of build. Vercel's build environment is unaffected.
- ⚠️ **Deploy with `npx vercel --prod`** (run from the repo). The GitHub push token is broken, so git-push auto-deploy does NOT work — always deploy via the Vercel CLI directly. Wait for "● Ready" via `npx vercel ls`. **Do NOT deploy autonomously — see Guardrails: validate, show the diff, and wait for explicit approval before running the deploy.**
- After deploy, verify live pages with `curl` (the site returns 403 to some bots but 200 to a normal browser UA + to Googlebot).
- Commit messages: end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Site structure (routes under app/[locale]/)
home (`/`) · products · platform · electric-highway · projects · about · contact · faq · **blog** (+ `blog/[slug]`) · investors (noindex, investor-only) · partner-site · privacy · terms
- API routes: `app/api/contact`, `book-visit`, `partner-site`, `cron/weekly-article`, `cron/weekly-report`
- SEO files: `app/sitemap.ts`, `app/robots.ts`

## Content & i18n conventions
- All UI strings live in `messages/en.json` and `messages/es.json` (namespaced: nav, hero, footer, highway, products, platform, contact, etc.). Every text change must be made in BOTH files.
- Pages use `setRequestLocale(locale)` + `generateMetadata` with `title`, `description`, `keywords`, and `alternates` (canonical + en/es hreflang).
- Root layout applies title template `%s | Greenspace E-mobility` — page titles must NOT repeat the brand suffix.
- Blog content source: `content/blog.ts` (bilingual article objects). Article pages render `body` HTML inside `.article-prose` (styles in globals.css).
- Reusable components in `components/`: Header, Footer, AnimateIn, Badge, ContactForm, BookVisitForm, SiteForm, BrandSelector, SolutionsSection, SolutionModal, HighwayMap(+Inner), VideoPlayer, CountUp.

## SEO status (already done — don't redo, build on it)
- Google Search Console: VERIFIED (HTML-file method; `public/google*.html` files committed). Sitemap submitted.
- `sitemap.ts` lists all pages × en/es + each blog article. `robots.ts` allows search crawlers.
- Dead legacy Wix URL `/services-1` 308-redirects to `/contact` (see `next.config.mjs` redirects).
- `/blog` section live with 3 bilingual cornerstone articles + JSON-LD (BlogPosting). FAQ page has FAQPage JSON-LD.

## Brand & content rules (IMPORTANT)
- Brand name is **"Greenspace E-mobility"** — lowercase "m" (except where intentionally all-caps in logos/headings). Never "E-Mobility".
- **Avoid third-party brand names (Autel, Windrose) in marketing/roadmap copy** — use generic terms: "high-power DC chargers", "Class 8 electric trucks". (Existing FAQ + weekly-article cron still reference them — flag, don't silently rewrite, unless asked.)
- No specific financial figures from investor materials on public pages.
- Markets: Panama (HQ) · Monterrey, Mexico · Texas, USA (Laredo–Dallas corridor) · Oslo, Norway.

## Automations already running (Vercel crons, see vercel.json)
- `weekly-article` (Mon 9:00) — AI-generates a blog article DRAFT, emails it for approval. Approved articles get added to `content/blog.ts`.
- `weekly-report` (Sun 8:00) — internal report.
- Secrets (ANTHROPIC_API_KEY, GMAIL_*, CRON_SECRET, RESEND/UNSPLASH keys) live in Vercel env vars. **NEVER commit `.env` or print secret values.**

## Improvement backlog — good places to optimize
1. **Performance**: audit Core Web Vitals (LCP/CLS), image sizing (`next/image` `sizes`), font loading, unused JS.
2. **SEO depth**: add Organization JSON-LD with `sameAs` (socials + Wikidata once it exists); per-page OpenGraph images; internal linking from blog → product/highway pages.
3. **Content**: more bilingual blog articles targeting "EV charging hub Panama", "carga camiones eléctricos México", "electric truck corridor Texas"; keep brand-free.
4. **Accessibility**: alt text, color contrast, keyboard nav, heading order, ARIA on interactive components.
5. **Conversion**: CTA clarity, contact-form UX, mobile nav.
6. **Consistency**: brand-name casing sweep; en/es parity check (no missing translation keys).
7. **Tech hygiene**: fix the broken GitHub deploy path; resolve the local `@parcel/watcher` build issue.

## Guardrails
- **Ask before deploying — this is the default.** After making changes: run `npx tsc --noEmit`, then STOP and show the user the diff (`git diff`) plus a short summary. Do NOT run `npx vercel --prod` until the user explicitly approves. The user reviews everything before it goes live.
- Validate every change with `npx tsc --noEmit` before requesting approval.
- Make all copy changes in both `en.json` and `es.json`.
- Never commit secrets or `.env*`. Never expose env var values.
- Summarize the plan before applying any destructive or far-reaching change.

## Standard workflow for each change
1. Make the edit(s).
2. `npx tsc --noEmit` → must pass.
3. Show `git diff` + a 1–2 line summary of what changed and why. **Wait for the user's go-ahead.**
4. On approval: `git commit`, then `npx vercel --prod` → wait for "● Ready" via `npx vercel ls`.
5. Verify live: `curl -A "Mozilla/5.0" https://www.gs-emobility.com/<path>` → confirm HTTP 200 + expected content (title, JSON-LD, copy).

---

# CORRIDOR-SIM: EV freight corridor planner (`corridor-sim/`)

This repo also hosts **Corridor-Sim**, our internal simulation and
investment-planning tool for the I-35 Laredo↔Dallas electric truck corridor
(separate from the website — pure Python, no Next.js involvement).

## What it does
Discrete-event simulation (SimPy) of our truck fleet, plus an infrastructure
optimizer and financial model. It answers: where to put charging hubs, how
many chargers of which vendor, what grid connection each site needs, and
whether the investment pays back. Designs live as **scenario JSON files** in
`corridor-sim/scenarios/`.

## Quick start
```bash
cd corridor-sim
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m pytest tests/ -q          # 50 tests, ~1s — run after ANY engine change
streamlit run ui/app.py             # dashboard on localhost:8501
```
In the dashboard sidebar use **"Load saved scenario"**:
- `kyle_warehouse_depots` — CURRENT recommended design
- `kyle_20trucks_dual_standard` — earlier cabinet-based variant

Headless studies live in `corridor-sim/examples/` (hub location sweep, grid
requirements, warehouse depot sizing, Case-1 Windrose study).

## Current recommended design (July 2026)
- **Single owned hub at Kyle, TX (mile 215)** — replaces Encinal+Waco;
  Windrose range physics pins the hub to mile 188–242.
- Fleet: 10 Tesla Semi + 10 Windrose R700 at 80,000 lb, 80% departure rule.
  **Policy: Tesla trucks charge only on Tesla hardware.**
- Kyle (buys @$0.10/kWh, sells @$0.20 own / $0.30 third-party, charges every
  truck to 90%): 1× Tesla V4 cabinet + 2 MCS posts, 1× Autel 1.2MW 3-gun
  cabinet. Grid: 1.4 MW.
- Warehouses (2h charge-while-loading, "hop" policy): per warehouse 2× Tesla
  V4 Integrated 125 kW posts, 2× Lifeyounger 217 kWh mobiles (dual gun),
  6× Autel 50 kW DC Wallboxes (3 per mobile — feeders, not truck chargers).
  Laredo energy is free. Grid <500 kW each.
- Results: 44.3 trips/day, 0 stranded, 0 rescues, **$3.10M total CAPEX**.
- Mobile units double as roadside-rescue capacity (sellable service, in the
  engine and the financial model).

## Design rules encoded in the model — don't accidentally break
1. Kyle charges to 90% (shrinks warehouse top-ups AND maximizes revenue).
2. 3 Wallboxes per Lifeyounger (~140 kW, the unit's DC-input cap); fewer and
   buffers can't recover between back-to-back sessions.
3. Each Windrose needs a SOLO 180 kW gun during its warehouse break.
4. Dispatch staggered at 75-min headways (we control truck flow).

## Code map
- `corridor_sim/vehicles/models.py` — truck registry
- `corridor_sim/charging/chargers.py` — charger registry incl. **hardware
  costs (PLACEHOLDER estimates — replace with real vendor quotes)**
- `corridor_sim/sim/engine.py` — DES: truck agents, queues, mobile-buffer
  physics, wallbox↔mobile pairing, roadside rescue
- `corridor_sim/costs/model.py` — CAPEX/OPEX/NPV/two-tier charging revenue
- `ui/app.py` — Streamlit dashboard (thin layer over the same engine)

## Known placeholders needing real data
- Charger hardware prices (Tesla V4, Autel cabinets/DT1500, Lifeyounger)
- Tesla MCS charging curve (generic taper; datasheet pending)
- Windrose MCS capability (currently modeled as CCS-group / Autel-only)
- Kyle land/construction costs (Waco-like defaults)
