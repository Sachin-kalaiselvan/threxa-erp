# threxa-erp

ERP built specifically for corrugated box + packaging manufacturers. desktop web app for the office, phone app for the shop floor, one codebase.

built + run by [threxa](https://threxa.theingredientlist.co), part of the ingredient list, bengaluru.

## what's in it

**desktop (office)** - 13 modules covering order to cash: customers, orders, quotations, invoices, dispatch, production, products, inventory, employees, attendance, payroll, cash book, dashboard.

stuff built for this industry instead of bent out of a generic ERP:

- quotation calculator with GSM × BF bursting strength logic for 3/5/7 ply
- FEFCO box style codes on the products master
- reel stock tracking with supplier credit terms
- proforma + GST invoices, CGST/SGST/IGST split driven by the customer's state code
- delivery challans with PDFs

**mobile (shop floor)** - a PWA at `/m`, installable to the home screen, three role views:

| role | screen | can do |
|---|---|---|
| owner | `/m/owner` | read-only KPIs, live machine status, alerts |
| supervisor | `/m/supervisor` | update job card status + produced qty |
| driver | `/m/driver` | trip list, status updates, POD photo |

english / ಕನ್ನಡ toggle on every mobile screen.

## stack

react 18 + ts, vite 5, react router 6, supabase (postgres + auth + storage), tanstack query 5, lucide icons, jspdf + autotable, vercel.

## run it

```bash
npm install
cp .env.example .env.local   # the two supabase values
npm run dev
```

`npm run build` = `tsc -b && vite build`, same as vercel. passes locally → it'll deploy.

env (vercel → settings → env vars, and `.env.local`):

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

without them the app shows a config notice instead of crashing.

## layout

```
index.html              PWA meta, manifest link, SW registration
vercel.json             SPA rewrite, every path serves index.html
public/manifest.json    PWA manifest
public/sw.js            service worker (app shell cache)
public/icon-*.png       home screen icons incl. maskable
src/App.tsx             auth gate, role detection, routing
src/main.tsx            providers: router, query, lang
src/i18n/               english / kannada dictionary + context
src/mobile/             phone views (MobileShell, Owner, Supervisor, Driver)
src/pages/              the 13 desktop modules
src/components/         layout, sidebar, intro animation, charts
src/ui/system.tsx       desktop design system
src/lib/                supabase client, query client
src/utils/pdf.ts        challan + invoice PDFs
src/types/
```

**rule:** desktop pages are built from `src/ui/system.tsx`, mobile from `src/mobile/MobileShell.tsx`. don't hand-roll layout in either, that's what keeps 13 modules looking like one product.

## roles

from supabase user metadata. supabase → authentication → users → pick a user → **user metadata**:

```json
{ "role": "owner" }
```

| value | access |
|---|---|
| `admin` | full desktop ERP, default if metadata's missing |
| `owner` | desktop ERP, auto-redirects to `/m/owner` under 820px |
| `supervisor` | `/m/supervisor` only |
| `driver` | `/m/driver` only |

the route restriction is client-side, so it's a UX boundary not security. lock real access with supabase RLS on the same claim before any client goes live.

## on a phone

open the deployed url → android: chrome menu → add to home screen. iOS: share → add to home screen. launches fullscreen.

the service worker caches the shell so the UI loads on bad factory wifi. data still needs network, supabase calls are never cached.

## where it's at

mobile views + desktop modules run on seed data defined in each file. supabase write points are marked `/* TODO: supabase... */`. data shapes are final so wiring them doesn't change any layout.

not built yet:

- storage bucket for POD photos (in memory as data URLs right now)
- geo-fenced attendance
- two-way tally sync
- e-way bills from dispatch
- multi-tenant row isolation

## deploys

vercel builds every push to `main`. `vercel.json` rewrites everything to `index.html` so deep links like `/m/owner/alerts` survive a refresh.

touch anything in `public/`? bump `CACHE` in `public/sw.js` or returning devices keep serving the old shell.

licence: see `LICENSE`.
