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
- Verified company data: `../COMPANY-REFERENCE.md` (one level up — legal names, addresses, descriptions, socials, founding date 2020-09-22). Use it for any company facts.
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
- ⚠️ **Deploy with `npx vercel --prod`** (run from the repo). The GitHub push token is broken, so git-push auto-deploy does NOT work — always deploy via the Vercel CLI directly. Wait for "● Ready" via `npx vercel ls`.
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
- Validate every change with `npx tsc --noEmit` before deploying.
- Deploy only via `npx vercel --prod`; confirm "● Ready" and curl-verify the affected pages.
- Make all copy changes in both `en.json` and `es.json`.
- Never commit secrets or `.env*`. Never expose env var values.
- For destructive or far-reaching changes, summarize the plan before applying.

## How to verify a change worked
1. `npx tsc --noEmit` passes.
2. `npx vercel --prod` → wait for Ready.
3. `curl -A "Mozilla/5.0" https://www.gs-emobility.com/<path>` → check HTTP 200 + expected content (title, JSON-LD, copy).
