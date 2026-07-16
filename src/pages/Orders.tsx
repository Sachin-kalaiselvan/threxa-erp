import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Order, Customer, BoxSpec } from "../types/db";

interface OrderWithDetails extends Order {
  customers?: { name: string };
  order_items?: OrderItem[];
  total_amount?: number;
}

interface OrderItem {
  id: string;
  order_id: string;
  box_spec_id: string;
  quantity: number;
  rate: number;
  amount: number;
  box_specs?: { name: string; box_type: string; ply: number };
}

const emptyOrder = {
  customer_id: "", po_number: "", delivery_date: "", notes: "",
};
type OrderFormState = typeof emptyOrder;

const emptyItem = { box_spec_id: "", quantity: 0, rate: 0 };
type ItemFormState = typeof emptyItem;

export default function Orders() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<OrderWithDetails | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<OrderFormState>(emptyOrder);
  const [items, setItems] = useState<ItemFormState[]>([]);
  const [newItem, setNewItem] = useState<ItemFormState>(emptyItem);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `*, customers!inner(name), order_items(id, box_spec_id, quantity, rate, amount, box_specs(name, box_type, ply))`
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as OrderWithDetails[];
    },
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("is_active", true);
      if (error) throw error;
      return data as Customer[];
    },
  });

  // Fetch box specs for selected customer
  const { data: boxSpecs = [] } = useQuery({
    queryKey: ["boxSpecs", form.customer_id],
    queryFn: async () => {
      if (!form.customer_id) return [];
      const { data, error } = await supabase
        .from("box_specs")
        .select("*")
        .eq("customer_id", form.customer_id)
        .eq("is_active", true);
      if (error) throw error;
      return data as BoxSpec[];
    },
    enabled: !!form.customer_id,
  });

  // Save order
  const saveOrder = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase
          .from("orders")
          .update({
            customer_id: form.customer_id,
            po_number: form.po_number || null,
            delivery_date: form.delivery_date || null,
            notes: form.notes || null,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const orderNo = await generateOrderNumber();
        const { error } = await supabase.from("orders").insert({
          order_no: orderNo,
          customer_id: form.customer_id,
          po_number: form.po_number || null,
          delivery_date: form.delivery_date || null,
          notes: form.notes || null,
          order_date: new Date().toISOString().split("T")[0],
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      closeForm();
    },
  });

  // Generate order number
  const generateOrderNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("next_doc_number", { seq_key: "order" });
    if (error) throw error;
    return data;
  };

  // Add order item to DB
  const addOrderItem = useMutation({
    mutationFn: async () => {
      if (!editing?.id || !newItem.box_spec_id || !newItem.quantity || !newItem.rate) return;
      const { error } = await supabase.from("order_items").insert({
        order_id: editing.id,
        box_spec_id: newItem.box_spec_id,
        quantity: newItem.quantity,
        rate: newItem.rate,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      setNewItem(emptyItem);
    },
  });

  // Remove order item
  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("order_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  // Update order status
  const updateStatus = useMutation({
    mutationFn: async (orderId: string, status: string) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyOrder);
    setItems([]);
    setNewItem(emptyItem);
    setShowForm(true);
  };

  const openEdit = (order: OrderWithDetails) => {
    setEditing(order);
    setForm({
      customer_id: order.customer_id,
      po_number: order.po_number ?? "",
      delivery_date: order.delivery_date ?? "",
      notes: order.notes ?? "",
    });
    setItems(order.order_items || []);
    setNewItem(emptyItem);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyOrder);
    setItems([]);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_no.toLowerCase().includes(search.toLowerCase()) ||
      (o.customers?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getTotal = (orderItems: OrderItem[] | undefined) => {
    return (orderItems || []).reduce((sum, item) => sum + item.amount, 0);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    confirmed: "bg-blue-500/10 text-blue-600",
    in_production: "bg-purple-500/10 text-purple-600",
    ready: "bg-green-500/10 text-green-600",
    dispatched: "bg-cyan-500/10 text-cyan-600",
    delivered: "bg-emerald-500/10 text-emerald-600",
    cancelled: "bg-red-500/10 text-red-600",
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Orders</h1>
        <div className="flex gap-3">
          <input
            className="input w-[220px]"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input w-[150px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_production">In Production</option>
            <option value="ready">Ready</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn flex items-center gap-1.5" onClick={openCreate}>
            <Plus size={14} /> New Order
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Order No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 w-[90px]"></th>
            </tr>
          </thead>
          <tbody>
            {ordersLoading && (
              <tr>
                <td className="px-4 py-6 text-[#B9BAC5]" colSpan={7}>
                  Loading...
                </td>
              </tr>
            )}
            {!ordersLoading && filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-[#B9BAC5]" colSpan={7}>
                  No orders yet.
                </td>
              </tr>
            )}
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-white/[.04] hover:bg-white/[.02]">
                <td className="px-4 py-3 font-mono text-sm font-medium">{order.order_no}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{order.customers?.name || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{(order.order_items || []).length}</td>
                <td className="px-4 py-3 font-medium">₹{getTotal(order.order_items).toLocaleString()}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">
                  {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="text-[#B9BAC5] hover:text-white" onClick={() => openEdit(order)}>
                      <Pencil size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={closeForm}>
          <div
            className="h-full w-[500px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editing ? "Edit Order" : "New Order"}</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={closeForm}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 pb-6">
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Customer *</label>
                <select
                  className="input"
                  value={form.customer_id}
                  onChange={(e) => {
                    setForm({ ...form, customer_id: e.target.value });
                    setNewItem(emptyItem);
                  }}
                >
                  <option value="">Select customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">PO Number</label>
                <input
                  className="input"
                  value={form.po_number}
                  onChange={(e) => setForm({ ...form, po_number: e.target.value })}
                  placeholder="e.g., PO-2024-001"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Delivery Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.delivery_date}
                  onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Notes</label>
                <textarea
                  className="input min-h-[60px]"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {editing && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Order Items</h3>

                  <div className="mb-4 space-y-2">
                    {(editing.order_items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded bg-white/[.03] p-2 text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.box_specs?.name}</p>
                          <p className="text-xs text-[#B9BAC5]">
                            {item.quantity} × ₹{item.rate.toLocaleString()} = ₹{item.amount.toLocaleString()}
                          </p>
                        </div>
                        <button
                          className="text-[#B9BAC5] hover:text-red-400"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 rounded border border-white/[.08] p-3">
                    <select
                      className="input"
                      value={newItem.box_spec_id}
                      onChange={(e) => setNewItem({ ...newItem, box_spec_id: e.target.value })}
                    >
                      <option value="">Select box spec...</option>
                      {boxSpecs.map((bs) => (
                        <option key={bs.id} value={bs.id}>
                          {bs.name} ({bs.ply}-ply)
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="input flex-1"
                        placeholder="Qty"
                        value={newItem.quantity || ""}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      />
                      <input
                        type="number"
                        className="input flex-1"
                        placeholder="Rate"
                        value={newItem.rate || ""}
                        onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <button
                      className="btn w-full"
                      onClick={() => addOrderItem.mutate()}
                      disabled={!newItem.box_spec_id || !newItem.quantity || !newItem.rate || addOrderItem.isPending}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              )}

              {editing && (
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Status</label>
                  <select
                    className="input"
                    value={editing.status}
                    onChange={(e) => updateStatus.mutate(editing.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_production">In Production</option>
                    <option value="ready">Ready</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              {saveOrder.isError && <p className="text-xs text-red-400">{(saveOrder.error as Error).message}</p>}

              <button
                className="btn w-full"
                disabled={!form.customer_id || saveOrder.isPending}
                onClick={() => saveOrder.mutate()}
              >
                {saveOrder.isPending ? "Saving..." : editing ? "Save changes" : "Create order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
