import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Eye, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { generateInvoicePDF } from "../utils/pdf";
import type { Order, Customer } from "../types/db";

interface Invoice {
  id: string;
  invoice_no: string;
  doc_type: "proforma" | "tax_invoice";
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
  status: "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled";
  created_at: string;
  customers?: { name: string; gstin: string | null; billing_address: string | null; state_code: string | null };
  orders?: { order_no: string; order_items?: any[] };
}

interface OrderWithCustomer extends Order {
  customers?: { name: string };
  order_items?: any[];
}

const emptyInvoice = {
  customer_id: "",
  doc_type: "tax_invoice" as const,
  invoice_date: new Date().toISOString().split("T")[0],
  due_date: "",
  subtotal: 0,
  gst_rate: 18,
};

export default function Invoices() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyInvoice);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [showPDF, setShowPDF] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Fetch invoices
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`*, customers(name, gstin, billing_address, state_code), orders(order_no, order_items(id, box_spec_id, quantity, rate, amount, box_specs(name, hsn_code)))`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Invoice[];
    },
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("is_active", true);
      if (error) throw error;
      return data as Customer[];
    },
  });

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, customers(name), order_items(id, box_spec_id, quantity, rate, amount, box_specs(name, hsn_code))`)
        .eq("status", "ready")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as OrderWithCustomer[];
    },
  });

  // Save invoice
  const saveInvoice = useMutation({
    mutationFn: async () => {
      if (!form.customer_id) throw new Error("Select customer");

      if (selectedOrder) {
        const order = orders.find((o) => o.id === selectedOrder);
        if (order?.order_items) {
          const subtotal = order.order_items.reduce((sum: number, item: any) => sum + item.amount, 0);
          const isInterstate = form.gst_rate === 18; // Simplified
          const gstAmount = (subtotal * form.gst_rate) / 100;
          const cgstAmount = isInterstate ? 0 : gstAmount / 2;
          const sgstAmount = isInterstate ? 0 : gstAmount / 2;
          const igstAmount = isInterstate ? gstAmount : 0;

          if (editing) {
            const { error } = await supabase
              .from("invoices")
              .update({
                customer_id: form.customer_id,
                invoice_date: form.invoice_date,
                due_date: form.due_date || null,
                subtotal,
                gst_rate: form.gst_rate,
                is_interstate: isInterstate,
                cgst_amount: cgstAmount,
                sgst_amount: sgstAmount,
                igst_amount: igstAmount,
                total: subtotal + cgstAmount + sgstAmount + igstAmount,
              })
              .eq("id", editing.id);
            if (error) throw error;
          } else {
            const invoiceNo = await generateInvoiceNumber();
            const { error } = await supabase.from("invoices").insert({
              invoice_no: invoiceNo,
              doc_type: form.doc_type,
              order_id: selectedOrder,
              customer_id: form.customer_id,
              invoice_date: form.invoice_date,
              due_date: form.due_date || null,
              subtotal,
              gst_rate: form.gst_rate,
              is_interstate: isInterstate,
              cgst_amount: cgstAmount,
              sgst_amount: sgstAmount,
              igst_amount: igstAmount,
              total: subtotal + cgstAmount + sgstAmount + igstAmount,
            });
            if (error) throw error;
          }
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      closeForm();
    },
  });

  const generateInvoiceNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("next_doc_number", { seq_key: "invoice" });
    if (error) throw error;
    return data;
  };

  // Download PDF
  const downloadPDF = (invoice: Invoice) => {
    if (!invoice.customers || !invoice.orders?.order_items) return;

    const pdfData = generateInvoicePDF({
      invoice_no: invoice.invoice_no,
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date || undefined,
      company_name: "Carton Box Manufacturer",
      company_gstin: "29XXXXX1234X1Z5",
      customer_name: invoice.customers.name,
      customer_gstin: invoice.customers.gstin || "N/A",
      customer_address: invoice.customers.billing_address || "N/A",
      customer_state: invoice.customers.state_code || "29",
      items: invoice.orders.order_items.map((item: any) => ({
        description: item.box_specs?.name || "Box",
        hsn: item.box_specs?.hsn_code || "48191010",
        qty: item.quantity,
        rate: item.rate,
        amount: item.amount,
      })),
      subtotal: invoice.subtotal,
      gst_rate: invoice.gst_rate,
      cgst: invoice.is_interstate ? undefined : invoice.cgst_amount,
      sgst: invoice.is_interstate ? undefined : invoice.sgst_amount,
      igst: invoice.is_interstate ? invoice.igst_amount : undefined,
      total: invoice.total,
      doc_type: invoice.doc_type,
    });

    const link = document.createElement("a");
    link.href = pdfData;
    link.download = `${invoice.invoice_no}.pdf`;
    link.click();
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyInvoice);
    setSelectedOrder("");
    setShowForm(true);
  };

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({
      customer_id: inv.customer_id,
      doc_type: inv.doc_type,
      invoice_date: inv.invoice_date,
      due_date: inv.due_date || "",
      subtotal: inv.subtotal,
      gst_rate: inv.gst_rate,
    });
    setSelectedOrder(inv.order_id || "");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyInvoice);
  };

  const filtered = invoices.filter((inv) =>
    inv.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
    (inv.customers?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-600",
    sent: "bg-blue-500/10 text-blue-600",
    partially_paid: "bg-yellow-500/10 text-yellow-600",
    paid: "bg-green-500/10 text-green-600",
    overdue: "bg-red-500/10 text-red-600",
    cancelled: "bg-slate-500/10 text-slate-600",
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Invoices</h1>
        <div className="flex gap-3">
          <input
            className="input w-[220px]"
            placeholder="Search invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn flex items-center gap-1.5" onClick={openCreate}>
            <Plus size={14} /> New Invoice
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Invoice No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
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
                  No invoices yet.
                </td>
              </tr>
            )}
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-white/[.04] hover:bg-white/[.02]">
                <td className="px-4 py-3 font-mono font-medium">{inv.invoice_no}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{inv.customers?.name || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{inv.doc_type === "tax_invoice" ? "Tax Invoice" : "Proforma"}</td>
                <td className="px-4 py-3 font-medium">₹{inv.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[inv.status]}`}>
                    {inv.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="text-[#B9BAC5] hover:text-white" onClick={() => downloadPDF(inv)}>
                      <Download size={14} />
                    </button>
                    <button className="text-[#B9BAC5] hover:text-white" onClick={() => openEdit(inv)}>
                      <Eye size={14} />
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
              <h2 className="text-base font-semibold">{editing ? "Edit Invoice" : "New Invoice"}</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={closeForm}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Type</label>
                <select
                  className="input"
                  value={form.doc_type}
                  onChange={(e) => setForm({ ...form, doc_type: e.target.value as "tax_invoice" | "proforma" })}
                >
                  <option value="tax_invoice">Tax Invoice</option>
                  <option value="proforma">Proforma</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Order *</label>
                <select
                  className="input"
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                >
                  <option value="">Select order...</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.order_no} — {o.customers?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Invoice Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.invoice_date}
                  onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Due Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">GST Rate (%)</label>
                <input
                  type="number"
                  className="input"
                  value={form.gst_rate}
                  onChange={(e) => setForm({ ...form, gst_rate: parseFloat(e.target.value) || 18 })}
                />
              </div>

              {saveInvoice.isError && <p className="text-xs text-red-400">{(saveInvoice.error as Error).message}</p>}

              <button
                className="btn w-full"
                disabled={!selectedOrder || saveInvoice.isPending}
                onClick={() => saveInvoice.mutate()}
              >
                {saveInvoice.isPending ? "Creating..." : editing ? "Update" : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
