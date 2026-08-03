# Threxa SPS ERP

Vertical ERP for corrugated box and packaging manufacturers. Desktop web app for
the office, phone app for the shop floor, one codebase.

Built and maintained by [Threxa](https://threxa.theingredientlist.co), a unit of
The Ingredient List, Bengaluru.

---

## What it does

**Desktop (office)** — 13 modules covering the full order-to-cash cycle:
Customers, Orders, Quotations, Invoices, Dispatch, Production, Products,
Inventory, Employees, Attendance, Payroll, Cash Book, Dashboard.

Domain-specific pieces built for this industry rather than adapted from a
generic ERP:

- Quotation calculator using GSM × BF bursting-strength logic for 3/5/7-ply board
- FEFCO box style codes on the Products master
- Reel stock tracking with supplier credit terms
- Proforma and GST tax invoices with CGST/SGST/IGST split driven by customer state code
- Delivery challans with PDF generation

**Mobile (shop floor)** — a PWA at `/m`, installable to the home screen, with
three role-scoped views:

| Role | Screen | Can do |
|---|---|---|
| Owner | `/m/owner` | Read-only KPIs, live machine status, alerts |
| Supervisor | `/m/supervisor` | Update job card status and produced quantity |
| Driver | `/m/driver` | Trip list, status updates, POD photo capture |

Full English / ಕನ್ನಡ toggle on every mobile screen.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router 6 |
| Data | Supabase (Postgres + Auth + Storage) |
| Server state | TanStack Query 5 |
| Icons | lucide-react |
| PDF | jsPDF + jspdf-autotable |
| Hosting | Vercel |

---

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the two Supabase values
npm run dev
```

`npm run build` runs `tsc -b && vite build` — the same command Vercel runs. If it
passes locally it will deploy.

### Environment variables

Set these in Vercel → Settings → Environment Variables, and in `.env.local` for
local work:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Without them the app renders a configuration notice instead of crashing.

---

## Project structure

```
threxa-sps-erp/
├── index.html              PWA meta tags, manifest link, SW registration
├── vercel.json             SPA rewrite — all paths serve index.html
├── public/
│   ├── manifest.json       PWA manifest
│   ├── sw.js               Service worker (app shell cache)
│   └── icon-*.png          Home screen icons incl. maskable
└── src/
    ├── App.tsx             Auth gate, role detection, all routing
    ├── main.tsx            Providers: Router, Query, Lang
    ├── i18n/               English / Kannada dictionary + context
    ├── mobile/             Phone views
    │   ├── MobileShell.tsx Shared chrome, tokens, buttons, cards
    │   ├── Owner.tsx
    │   ├── Supervisor.tsx
    │   └── Driver.tsx
    ├── pages/              13 desktop module pages
    ├── components/         Layout, sidebar, intro animation, charts
    ├── ui/system.tsx       Desktop design system — do not hand-roll layout
    ├── lib/                Supabase client, query client
    ├── utils/pdf.ts        Challan and invoice PDF generation
    └── types/
```

**Rule:** desktop pages compose primitives from `src/ui/system.tsx`. Mobile views
compose from `src/mobile/MobileShell.tsx`. Neither should hand-roll layout — that
is what keeps 13 modules looking like one product.

---

## Roles

Roles come from Supabase user metadata. Supabase Dashboard → Authentication →
Users → select a user → **User Metadata**:

```json
{ "role": "owner" }
```

| Value | Access |
|---|---|
| `admin` | Full desktop ERP. Default when metadata is absent. |
| `owner` | Desktop ERP; auto-redirects to `/m/owner` on screens under 820px. |
| `supervisor` | `/m/supervisor` only. Cannot reach the desktop ERP. |
| `driver` | `/m/driver` only. Cannot reach the desktop ERP. |

Route-level restriction is client-side and is a UX boundary, not a security one.
Enforce actual access with Supabase Row Level Security policies keyed on the same
metadata claim before any client goes live.

---

## Installing on a phone

1. Open the deployed URL on the device
2. Android: Chrome menu → Add to Home screen. iOS: Share → Add to Home Screen
3. Launches full-screen with no browser chrome

The service worker caches the app shell, so the interface loads on a weak factory
connection. Data still requires network — Supabase calls are never cached.

---

## Current state

The mobile views and desktop modules run on seed data defined in each file.
Supabase write points are marked with `/* TODO: supabase... */` comments; the data
shapes are final, so wiring them up does not change any layout.

Not yet built:

- Supabase Storage bucket for POD photos (currently held in memory as data URLs)
- Geo-fenced worker attendance
- Two-way Tally sync
- E-way bill generation from dispatch records
- Multi-tenant row isolation

---

## Deployment

Vercel builds on every push to `main`. `vercel.json` rewrites all paths to
`index.html` so deep links like `/m/owner/alerts` survive a page refresh.

When changing anything in `public/`, bump the `CACHE` constant in `public/sw.js`
or returning devices will serve the old shell from cache.

---

## Licence

See `LICENSE`.
