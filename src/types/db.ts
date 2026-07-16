// APPEND TO EXISTING db.ts

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
