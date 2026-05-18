# GS E-Mobility Website V2

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **next-intl** — bilingual ES/EN with auto browser-locale detection

## Pages
| Route | Description |
|---|---|
| `/` | Auto-redirects based on browser language |
| `/es` or `/en` | Home — Hero, Stats, Solutions, Electric Highway, Partners, CTA |
| `/es/electric-highway` | Electric Highway + Electric Hub + Roadmap |
| `/es/products` | Product catalog (Wallbox + use cases) |
| `/es/about` | Company story, Mission/Vision, Team, Partners |
| `/es/contact` | Contact form + FAQ |

## Getting started

### 1. Install Node.js
Download from https://nodejs.org (LTS version recommended)

### 2. Install dependencies
```bash
cd "gs-emobility-web"
npm install
```

### 3. Run in development
```bash
npm run dev
```
Open http://localhost:3000

### 4. Build for production
```bash
npm run build
npm start
```

## Environment Variables

All secrets live in Vercel → Project → Settings → Environment Variables (never committed to git).
See `.env.example` for the full list. Required vars:

| Variable | Where to get it |
|---|---|
| `GMAIL_USER` | Gmail address used for sending |
| `GMAIL_APP_PASSWORD` | Google Account → Security → App Passwords |
| `GOOGLE_SITE_VERIFICATION` | [Google Search Console](https://search.google.com/search-console) → Add property → HTML tag → `content=` value |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `CRON_SECRET` | Any random string — must match what Vercel Cron sends |
| `UNSPLASH_ACCESS_KEY` | unsplash.com/developers (optional) |

### Adding GOOGLE_SITE_VERIFICATION

1. Go to [Google Search Console](https://search.google.com/search-console) and select the `gs-emobility.com` property.
2. Choose **Settings → Ownership verification → HTML tag**.
3. Copy the value inside `content="…"` (looks like `abc123XYZ`).
4. In Vercel dashboard: **Project → Settings → Environment Variables → Add** → name `GOOGLE_SITE_VERIFICATION`, paste the value, enable for **Production + Preview + Development**.
5. Redeploy (or trigger a new deploy) — Google Search Console will detect the meta tag within minutes.

## Deploying to Vercel (recommended)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → New Project → Import from GitHub
3. Vercel auto-detects Next.js — click **Deploy**
4. Add all environment variables from the table above
5. Add your custom domain `gs-emobility.com` in Vercel → Settings → Domains

## Adding your logo and images

Place files in `public/images/`:
- `logo.png` — main logo (used in Header/Footer)
- `logo-white.png` — white version
- `hero-bg.jpg` — hero background (optional, replaces gradient)
- `neo.jpg`, `pulsar.jpg` etc. — product images

Then update the `<Image>` tags in the relevant components.

## Adding your videos

Place `.mp4` files in `public/videos/`:
- `hero.mp4` — for the hero background
- `cargando-con-neo.mp4`
- `costanera.mp4`

To enable the video hero, update `app/[locale]/page.tsx` HeroSection to use a `<video>` tag.

## Translation / Content

All text lives in:
- `messages/es.json` — Spanish
- `messages/en.json` — English

Edit those files to update any copy without touching code.

## Brand colors
- **Navy (primary):** `#0A1628`
- **Green (accent):** `#00C853`

To change brand colors, update `tailwind.config.ts` and `app/globals.css`.
