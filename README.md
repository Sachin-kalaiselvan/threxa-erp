# Threxa ERP — Carton Box Manufacturer

A custom ERP system for order management, production tracking, dispatch, and financial reporting. Built with Vite + React + TypeScript + Supabase, deployed on Vercel.

## Modules

- **Documents**: Quotation calculator (GSM/BF/ply), invoices, challans
- **Orders & Production**: Order pipeline, inventory, production tracking
- **Payroll**: Employees, attendance, payroll register
- **Dispatch**: Shipment tracking
- **Dashboard**: Orders, revenue, receivables at a glance

## Quick Start (Browser Only)

### 1. Set up GitHub
- Create a private repo: `threxa-erp`
- On GitHub, click "uploading an existing file" and drag the folder contents into the upload area
- Commit to `main`

### 2. Set up Supabase
- Create a new project at supabase.com (region: Mumbai)
- SQL Editor → paste `supabase/migrations/001_initial_schema.sql` → Run
- Authentication → Users → Add user (email + password)
- Turn off public signups: Authentication → Providers → Email → disable "Allow new users to sign up"
- Copy your Project URL and anon public key from Project Settings → API

### 3. Deploy to Vercel
- Go to vercel.com → Add New Project → select your GitHub repo
- Framework: Vite (auto-detected)
- Add Environment Variables:
  - `VITE_SUPABASE_URL` = your Project URL
  - `VITE_SUPABASE_ANON_KEY` = your anon key
- Deploy (future pushes to `main` redeploy automatically)

### 4. Local Development

**Quick edits**: Open the repo on github.com, press `.` to open github.dev, edit, and commit.

**Full dev with live reload**: Open `https://stackblitz.com/github/<your-username>/threxa-erp` — StackBlitz runs the dev server in your browser. Add a `.env` file there with your Supabase credentials (never commit it). When done, commit back to GitHub.

## Key Patterns

- **CRUD example**: `src/pages/Customers.tsx`
- **Opening animation**: `src/components/ThrexaIntro.tsx` (plays once per session)
- **Document numbering**: Call the SQL function `select next_doc_number('order')` — keys: `order`, `job`, `challan`, `invoice`
- **Roles**: Set `role` in the profiles table — supports owner, admin, production, dispatch, accounts, staff

## File Structure

- `supabase/migrations/` — database schema (run new migrations in Supabase SQL Editor)
- `src/pages/` — list and detail pages for each module
- `src/components/` — reusable UI and modal components
- `.env.example` — copy to `.env` locally with your Supabase keys
