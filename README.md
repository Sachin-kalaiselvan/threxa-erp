# Threxa ERP — Carton Box Manufacturer

Custom ERP built on Vite + React + TypeScript + Supabase, deployed on Vercel.
Four modules: Document Automation · Order & Production · Dispatch & Delivery · Dashboard & Reporting.

## Browser-only setup (no terminal, ~20 minutes)

### 1. Get this code into GitHub
- Create a new **private** repo on github.com (e.g. `threxa-erp`). Do NOT initialize with a README.
- On the empty-repo page click **"uploading an existing file"**, then drag the *contents* of this
  folder (not the folder itself) into the upload area. Chrome preserves the folder structure.
- Commit to `main`.

### 2. Supabase
- supabase.com → New project (region: Mumbai `ap-south-1`).
- SQL Editor → paste the whole of `supabase/migrations/001_initial_schema.sql` → **Run**.
- Authentication → Users → **Add user** → create the client's login (email + password).
  Turn OFF public signups: Authentication → Providers → Email → disable "Allow new users to sign up".
- Project Settings → API: copy the **Project URL** and **anon public key**.

### 3. Vercel
- vercel.com → Add New Project → import the GitHub repo.
- Framework preset: **Vite** (auto-detected). No build settings to change.
- Environment Variables:
  - `VITE_SUPABASE_URL` = your project URL
  - `VITE_SUPABASE_ANON_KEY` = your anon key
- Deploy. Every future push to `main` redeploys automatically.

### 4. Daily development, no terminal
- **Quick edits**: open the repo on github.com and press `.` → github.dev (VS Code in browser).
  Commit → Vercel redeploys in ~1 min.
- **Live dev server with hot reload**: open
  `https://stackblitz.com/github/<your-username>/threxa-erp`
  StackBlitz runs `npm install` + `vite dev` inside your browser tab.
  Add the two env vars in StackBlitz via a `.env` file (never commit it — it's for the sandbox only).
  Commit back to GitHub from StackBlitz when done.

## Where things are
- `supabase/migrations/` — schema is source-controlled here; run new files in the SQL Editor.
- `src/pages/Customers.tsx` — the reference CRUD pattern. Every list/master page copies this shape.
- `src/components/ThrexaIntro.tsx` — the cinematic opening. Plays once per session;
  `logoTarget` is tuned to where the sidebar lockup sits in `Layout.tsx`.
- Document numbering — call the Postgres function: `select next_doc_number('order')`
  (keys: `order`, `job`, `challan`, `invoice`).

## Modules status
- Module 1 — Documents: Quotation Calculator ✅ (GSM x BF, 3/5/7-ply) · Proforma/GST invoices + Challan PDFs → Phase 3
- Module 2 — Orders/Production/Inventory: Reel Stock ✅ (30-day credit) · Cash Book ✅ · Orders/Production → Phase 2
- Module 3 — Payroll: Employees ✅ · Attendance ✅ · Payroll register + CSV export ✅
- Module 4 — Dispatch: schema live, UI → Phase 4
- Module 5 — Dashboard: live counts ✅ · charts/receivables → Phase 5
- Role-based login ✅ (owner/admin/production/dispatch/accounts/staff — set role in profiles table)

## Build phases
0. ✅ Scaffold, auth, shell, schema (this repo)
1. Masters: customers ✅ + box specs
2. Orders pipeline + production stage tracking
3. Documents: invoice / challan / quotation PDFs (jsPDF) + numbering
4. Dispatch + WhatsApp automation (n8n webhook on Hetzner)
5. Dashboard: revenue, funnel, production load (Recharts)
6. Roles (RLS tightening), polish, client onboarding
