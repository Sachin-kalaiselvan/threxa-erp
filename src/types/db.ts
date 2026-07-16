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

export interface Quotation {
  id: string;
  quote_no: string;
  customer_id: string;
  box_name: string;
  ply: number;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  layers: any[];
  flute_takeup: number;
  paper_rate_per_kg: number;
  conversion_pct: number;
  margin_pct: number;
  sheet_length_mm: number | null;
  sheet_width_mm: number | null;
  weight_kg: number | null;
  bursting_strength: number | null;
  cost_per_box: number | null;
  quoted_rate: number | null;
  quantity: number | null;
  notes: string | null;
  created_at: string;
}

export type InvoiceDocType = "proforma" | "tax_invoice";
export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  invoice_no: string;
  doc_type: InvoiceDocType;
  order_id: string | null;
  customer_id: string;
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  gst_rate: number;
  is_interstate: boolean;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total: number;
  status: InvoiceStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  mode: "cash" | "upi" | "bank_transfer" | "cheque" | "other";
  reference: string | null;
  created_at: string;
}

export interface Dispatch {
  id: string;
  challan_no: string;
  order_id: string;
  dispatch_date: string;
  vehicle_no: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  delivered_at: string | null;
  pod_url: string | null;
  notes: string | null;
  created_at: string;
}
