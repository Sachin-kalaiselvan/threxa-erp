import type { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

export type Document = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: "quotation" | "invoice" | "po" | "delivery_note";
  status: "draft" | "sent" | "approved" | "rejected";
  content: Record<string, unknown>;
  user_id: string;
};

export type Order = {
  id: string;
  created_at: string;
  updated_at: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  total_amount: number;
  items: OrderItem[];
  user_id: string;
};

export type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export type Production = {
  id: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  status: "queued" | "in_progress" | "completed" | "on_hold";
  start_date: string;
  end_date: string | null;
  notes: string | null;
  user_id: string;
};

export type Dispatch = {
  id: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  tracking_number: string;
  status: "pending" | "shipped" | "delivered" | "failed";
  shipped_date: string | null;
  delivered_date: string | null;
  user_id: string;
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
