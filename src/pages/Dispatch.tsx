import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Send, Trash2, X, FileText } from "lucide-react";
import { supabase } from "../lib/supabase";
import { generateChallanPDF } from "../utils/pdf";
import type { Order } from "../types/db";

interface Dispatch {
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
  orders?: { order_no: string; customers?: { name: string; whatsapp: string | null; phone: string | null }; order_items?: any[] };
}

const emptyDispatch = {
  order_id: "",
  vehicle_no: "",
  driver_name: "",
  driver_phone: "",
  notes: "",
};

export default function Dispatch() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyDispatch);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");

  const { data: dispatches = [], isLoading } = useQuery({
    queryKey: ["dispatches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dispatches")
        .select(
          `*, orders(order_no, customers(name, whatsapp, phone), order_items(id, box_spec_id, quantity, rate, box_specs(name)))`
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Dispatch[];
    },
  });

  const { data: readyOrders = [] } = useQuery({
    queryKey: ["readyOrders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, customers(name, whatsapp, phone), order_items(id, box_spec_id, quantity, box_specs(name))`)
        .eq("status", "ready")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as (Order & { order_items?: any[] })[];
    },
  });

  // Create dispatch
  const createDispatch = useMutation({
    mutationFn: async () => {
      if (!form.order_id) throw new Error("Select order");

      const challanNo = await generateChallanNumber();
      const { error } = await supabase.from("dispatches").insert({
        challan_no: challanNo,
        order_id: form.order_id,
        dispatch_date: new Date().toISOString().split("T")[0],
        vehicle_no: form.vehicle_no || null,
        driver_name: form.driver_name || null,
        driver_phone: form.driver_phone || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dispatches"] });
      closeForm();
    },
  });

  const generateChallanNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("next_doc_number", { seq_key: "challan" });
    if (error) throw error;
    return data;
  };

  // Send via WhatsApp
  const sendWhatsApp = useMutation({
    mutationFn: async (dispatch: Dispatch) => {
      if (!dispatch.orders?.customers?.whatsapp) throw new Error("No WhatsApp number");

      const pdf = generateChallanPDF({
        challan_no: dispatch.challan_no,
        dispatch_date: dispatch.dispatch_date,
        order_no: dispatch.orders.order_no,
        customer_name: dispatch.orders.customers.name,
        customer_address: "Delivery Address", // TODO: fetch from order
        vehicle_no: dispatch.vehicle_no || undefined,
        driver_name: dispatch.driver_name || undefined,
        items: dispatch.orders.order_items?.map((item: any) => ({
          description: item.box_specs?.name,
          qty: item.quantity,
        })) || [],
      });

      // Call n8n webhook
      const response = await fetch("https://your-hetzner-vps.com/webhook/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: dispatch.orders.customers.whatsapp,
          message: `Hi ${dispatch.orders.customers.name}, your order ${dispatch.orders.order_no} has been dispatched!\n\nChallan: ${dispatch.challan_no}\nVehicle: ${dispatch.vehicle_no || "N/A"}`,
          document_url: pdf,
          document_name: `${dispatch.challan_no}.pdf`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send WhatsApp");
      return response.json();
    },
    onSuccess: () => {
      alert("WhatsApp sent!");
      qc.invalidateQueries({ queryKey: ["dispatches"] });
    },
  });

  // Download Challan
  const downloadChallan = (dispatch: Dispatch) => {
    if (!dispatch.orders?.order_items) return;

    const pdf = generateChallanPDF({
      challan_no: dispatch.challan_no,
      dispatch_date: dispatch.dispatch_date,
      order_no: dispatch.orders.order_no,
      customer_name: dispatch.orders.customers?.name || "Customer",
      customer_address: "Delivery Address",
      vehicle_no: dispatch.vehicle_no || undefined,
      driver_name: dispatch.driver_name || undefined,
      items: dispatch.orders.order_items.map((item: any) => ({
        description: item.box_specs?.name || "Item",
        qty: item.quantity,
      })),
    });

    const link = document.createElement("a");
    link.href = pdf;
    link.download = `${dispatch.challan_no}.pdf`;
    link.click();
  };

  const openCreate = () => {
    setForm(emptyDispatch);
    setSelectedOrder(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyDispatch);
    setSelectedOrder(null);
  };

  const filtered = dispatches.filter((d) =>
    d.challan_no.toLowerCase().includes(search.toLowerCase()) ||
    (d.orders?.order_no || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dispatch</h1>
        <div className="flex gap-3">
          <input
            className="input w-[220px]"
            placeholder="Search challan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn flex items-center gap-1.5" onClick={openCreate}>
            <Plus size={14} /> New Dispatch
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Challan No</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 w-[120px]"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-[#B9BAC5]" colSpan={6}>
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-[#B9BAC5]" colSpan={6}>
                  No dispatches yet.
                </td>
              </tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id} className="border-b border-white/[.04] hover:bg-white/[.02]">
                <td className="px-4 py-3 font-mono font-medium">{d.challan_no}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{d.orders?.order_no || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{d.orders?.customers?.name || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{d.vehicle_no || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">
                  {new Date(d.dispatch_date).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-green-500 hover:text-green-400"
                      title="Send via WhatsApp"
                      onClick={() => sendWhatsApp.mutate(d)}
                      disabled={sendWhatsApp.isPending}
                    >
                      <Send size={14} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-400"
                      title="Download Challan"
                      onClick={() => downloadChallan(d)}
                    >
                      <FileText size={14} />
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
            className="h-full w-[420px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">New Dispatch</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={closeForm}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Order *</label>
                <select
                  className="input"
                  value={form.order_id}
                  onChange={(e) => {
                    setForm({ ...form, order_id: e.target.value });
                    setSelectedOrder(readyOrders.find((o) => o.id === e.target.value) || null);
                  }}
                >
                  <option value="">Select order...</option>
                  {readyOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {(o as any).order_no} — {(o as any).customers?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Vehicle No</label>
                <input
                  className="input"
                  value={form.vehicle_no}
                  onChange={(e) => setForm({ ...form, vehicle_no: e.target.value })}
                  placeholder="e.g., MH02AB1234"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Driver Name</label>
                <input
                  className="input"
                  value={form.driver_name}
                  onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
                  placeholder="e.g., Rajesh Kumar"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Driver Phone</label>
                <input
                  className="input"
                  value={form.driver_phone}
                  onChange={(e) => setForm({ ...form, driver_phone: e.target.value })}
                  placeholder="e.g., +919876543210"
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

              {createDispatch.isError && <p className="text-xs text-red-400">{(createDispatch.error as Error).message}</p>}

              <button
                className="btn w-full"
                disabled={!form.order_id || createDispatch.isPending}
                onClick={() => createDispatch.mutate()}
              >
                {createDispatch.isPending ? "Creating..." : "Create Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
