-- ============================================================
-- THREXA ERP — Complete Schema (carton box manufacturer)
-- Modules: Documents · Orders/Production/Inventory · Payroll ·
--          Dispatch · Dashboard (role-based access)
-- Paste this whole file into Supabase > SQL Editor > Run
-- ============================================================

-- ---------- ENUMS ----------
create type user_role as enum ('owner', 'admin', 'production', 'dispatch', 'accounts', 'staff');

create type order_status as enum (
  'pending', 'confirmed', 'in_production', 'ready', 'dispatched', 'delivered', 'closed', 'cancelled'
);

create type production_stage_name as enum (
  'corrugation', 'printing', 'die_cutting', 'pasting', 'finishing', 'quality_check'
);

create type stage_status as enum ('not_started', 'in_progress', 'completed', 'on_hold');

create type invoice_doc_type as enum ('proforma', 'tax_invoice');

create type invoice_status as enum ('draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled');

create type payment_mode as enum ('cash', 'upi', 'bank_transfer', 'cheque', 'other');

create type attendance_status as enum ('present', 'absent', 'half_day');

create type cash_entry_kind as enum ('receipt', 'payment');

-- ---------- PROFILES ----------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  role user_role not null default 'staff',
  phone text,
  created_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- MASTERS ----------
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gstin text,
  contact_person text,
  phone text,
  whatsapp text,
  email text,
  billing_address text,
  shipping_address text,
  state_code text default '29',            -- for CGST/SGST vs IGST decision
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table box_specs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers on delete cascade,
  name text not null,
  box_type text not null default 'RSC',
  length_mm numeric,
  width_mm numeric,
  height_mm numeric,
  ply int not null default 3,
  top_gsm int,
  flute_gsm int,
  liner_gsm int,
  paper_grade text,
  printing text,
  rate numeric not null default 0,
  hsn_code text default '48191010',
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- MODULE 1: DOCUMENTS ----------
-- Quotations from the GSM x BF calculator
create table quotations (
  id uuid primary key default gen_random_uuid(),
  quote_no text unique not null,
  customer_id uuid references customers,
  box_name text not null,
  ply int not null,
  length_mm numeric not null,
  width_mm numeric not null,
  height_mm numeric not null,
  layers jsonb not null,                    -- [{kind:'liner'|'flute', gsm, bf}, ...]
  flute_takeup numeric not null default 1.45,
  paper_rate_per_kg numeric not null,
  conversion_pct numeric not null default 20,
  margin_pct numeric not null default 15,
  -- computed results snapshot
  sheet_length_mm numeric,
  sheet_width_mm numeric,
  weight_kg numeric,
  bursting_strength numeric,               -- kg/cm2
  cost_per_box numeric,
  quoted_rate numeric,
  quantity int,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- MODULE 2: ORDERS / PRODUCTION / INVENTORY ----------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  customer_id uuid not null references customers,
  po_number text,
  order_date date not null default current_date,
  delivery_date date,
  status order_status not null default 'pending',
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  box_spec_id uuid not null references box_specs,
  quantity int not null,
  rate numeric not null,
  amount numeric generated always as (quantity * rate) stored
);

create table job_cards (
  id uuid primary key default gen_random_uuid(),
  job_no text unique not null,
  order_item_id uuid not null references order_items on delete cascade,
  planned_start date,
  planned_end date,
  notes text,
  created_at timestamptz not null default now()
);

create table production_stages (
  id uuid primary key default gen_random_uuid(),
  job_card_id uuid not null references job_cards on delete cascade,
  stage production_stage_name not null,
  status stage_status not null default 'not_started',
  operator text,
  started_at timestamptz,
  completed_at timestamptz,
  qty_ok int,
  qty_rejected int,
  remarks text,
  unique (job_card_id, stage)
);

create or replace function seed_production_stages()
returns trigger language plpgsql as $$
begin
  insert into production_stages (job_card_id, stage)
  values
    (new.id, 'corrugation'), (new.id, 'printing'), (new.id, 'die_cutting'),
    (new.id, 'pasting'), (new.id, 'finishing'), (new.id, 'quality_check');
  return new;
end;
$$;
create trigger on_job_card_created
  after insert on job_cards
  for each row execute function seed_production_stages();

-- Reel stock (raw material) with 30-day supplier credit tracking
create table reels (
  id uuid primary key default gen_random_uuid(),
  supplier_name text not null,
  gsm int not null,
  bf int not null,                          -- bursting factor
  deckle_mm numeric,                        -- reel width
  weight_kg numeric not null,
  rate_per_kg numeric not null,
  amount numeric generated always as (weight_kg * rate_per_kg) stored,
  received_date date not null default current_date,
  credit_days int not null default 30,
  due_date date generated always as (received_date + credit_days) stored,
  is_paid boolean not null default false,
  paid_date date,
  consumed_kg numeric not null default 0,   -- running consumption
  notes text,
  created_at timestamptz not null default now()
);

-- Cash book — daily receipts, payments, running balance (computed in app)
create table cash_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  kind cash_entry_kind not null,
  party text,
  description text,
  amount numeric not null,
  mode payment_mode not null default 'cash',
  reference text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ---------- MODULE 3: PAYROLL & ATTENDANCE ----------
create table employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text,
  daily_wage numeric not null default 0,
  phone text,
  joined_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees on delete cascade,
  att_date date not null,
  status attendance_status not null default 'present',
  remarks text,
  unique (employee_id, att_date)
);

-- ---------- MODULE 4: DISPATCH ----------
create table dispatches (
  id uuid primary key default gen_random_uuid(),
  challan_no text unique not null,
  order_id uuid not null references orders,
  dispatch_date date not null default current_date,
  vehicle_no text,
  driver_name text,
  driver_phone text,
  delivered_at timestamptz,
  pod_url text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- BILLING (proforma + GST tax invoice, CGST/SGST split) ----------
create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text unique not null,
  doc_type invoice_doc_type not null default 'tax_invoice',
  order_id uuid references orders,
  customer_id uuid not null references customers,
  invoice_date date not null default current_date,
  due_date date,
  subtotal numeric not null default 0,
  gst_rate numeric not null default 18,     -- total GST %
  is_interstate boolean not null default false,
  cgst_amount numeric not null default 0,   -- half of GST when intrastate
  sgst_amount numeric not null default 0,
  igst_amount numeric not null default 0,   -- full GST when interstate
  total numeric not null default 0,
  status invoice_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices on delete cascade,
  amount numeric not null,
  payment_date date not null default current_date,
  mode payment_mode not null default 'bank_transfer',
  reference text,
  created_at timestamptz not null default now()
);

-- ---------- DOCUMENT NUMBERING ----------
create table number_sequences (
  key text primary key,
  prefix text not null,
  next_value int not null default 1
);
insert into number_sequences (key, prefix) values
  ('quotation', 'QTN-'),
  ('order',     'ORD-'),
  ('job',       'JOB-'),
  ('challan',   'CHN-'),
  ('proforma',  'PI-'),
  ('invoice',   'INV-');

create or replace function next_doc_number(seq_key text)
returns text language plpgsql as $$
declare
  result text;
begin
  update number_sequences
    set next_value = next_value + 1
    where key = seq_key
    returning prefix || lpad((next_value - 1)::text, 5, '0') into result;
  if result is null then
    raise exception 'Unknown sequence key: %', seq_key;
  end if;
  return result;
end;
$$;

-- ---------- ACTIVITY LOG ----------
create table activity_log (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  entity text not null,
  entity_id uuid,
  action text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
-- Prototype: any authenticated user can read/write everything.
-- Role-based tightening (owner vs staff) happens in the hardening phase —
-- the UI already hides finance/payroll from non-privileged roles, but real
-- enforcement must land here before go-live.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','customers','box_specs','quotations','orders','order_items',
    'job_cards','production_stages','reels','cash_entries','employees',
    'attendance','dispatches','invoices','payments','number_sequences','activity_log'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy "authenticated full access" on %I for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ---------- INDEXES ----------
create index on orders (customer_id);
create index on orders (status);
create index on order_items (order_id);
create index on job_cards (order_item_id);
create index on production_stages (job_card_id);
create index on dispatches (order_id);
create index on invoices (customer_id);
create index on invoices (status);
create index on payments (invoice_id);
create index on box_specs (customer_id);
create index on quotations (customer_id);
create index on attendance (employee_id, att_date);
create index on cash_entries (entry_date);
create index on reels (is_paid, due_date);
