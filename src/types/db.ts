// Hand-written types for Phase 0/1 tables.
// (Later you can generate these from Supabase: Dashboard > API Docs > Types.)

export type OrderStatus =
  | "pending" | "confirmed" | "in_production" | "ready"
  | "dispatched" | "delivered" | "closed" | "cancelled";

export interface Customer {
  id: string;
  name: string;
  gstin: string | null;
  contact_person: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  billing_address: string | null;
  shipping_address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BoxSpec {
  id: string;
  customer_id: string;
  name: string;
  box_type: string;
  length_mm: number | null;
  width_mm: number | null;
  height_mm: number | null;
  ply: number;
  top_gsm: number | null;
  flute_gsm: number | null;
  liner_gsm: number | null;
  paper_grade: string | null;
  printing: string | null;
  rate: number;
  hsn_code: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_no: string;
  customer_id: string;
  po_number: string | null;
  order_date: string;
  delivery_date: string | null;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  box_spec_id: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface JobCard {
  id: string;
  job_no: string;
  order_item_id: string;
  planned_start: string | null;
  planned_end: string | null;
  notes: string | null;
  created_at: string;
}

export interface ProductionStage {
  id: string;
  job_card_id: string;
  stage: "corrugation" | "printing" | "die_cutting" | "pasting" | "finishing" | "quality_check";
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  operator: string | null;
  started_at: string | null;
  completed_at: string | null;
  qty_ok: number | null;
  qty_rejected: number | null;
  remarks: string | null;
}
