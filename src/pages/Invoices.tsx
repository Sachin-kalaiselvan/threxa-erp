import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";
import { generateInvoicePDF } from "../utils/pdf";

interface Invoice { id: string; no: string; customer: string; gst: string; amount: number; date: string; due: string; status: "Draft" | "Sent" | "Paid" | "Overdue"; }

const SEED: Invoice[] = [
  { id: "1", no: "INV-10021", customer: "Rajesh Enterprises", gst: "27AABCU9603R1Z5", amount: 75000,  date: "15 Jul", due: "14 Aug", status: "Sent" },
  { id: "2", no: "INV-10022", customer: "Priya Packaging",    gst: "27AABCV9603R2Z5", amount: 150000, date: "16 Jul", due: "15 Aug", status: "Paid" },
  { id: "3", no: "INV-10023", customer: "Kumar Industries",   gst: "27AABCW9603R3Z5", amount: 45000,  date: "10 Jun", due: "10 Jul", status: "Overdue" },
];

const SC: Record<Invoice["status"], string> = { Draft: T.muted, Sent: T.blue, Paid: T.green, Overdue: T.red };

export default function Invoices() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.no.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()));
  const outstanding = rows.filter(r => r.status !== "Paid").reduce((s, r) => s + r.amount, 0);
  const paid = rows.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount, 0);

  const dl = (r: Invoice) => {
    const pdf = generateInvoicePDF({
      invoice_no: r.no, invoice_date: r.date, due_date: r.due,
      company_name: "Smart Packaging Solutions", company_gstin: "29AABCS1234A1Z5",
      customer_name: r.customer, customer_gstin: r.gst, customer_address: "—", customer_state: "Karnataka",
      items: [{ description: "Corrugated Boxes", hsn: "4819", qty: 100, rate: r.amount / 100, amount: r.amount }],
      subtotal: r.amount, gst_rate: 18, cgst: r.amount * 0.09, sgst: r.amount * 0.09, total: r.amount * 1.18, doc_type: "tax_invoice",
    });
    const a = document.createElement("a"); a.href = pdf; a.download = `${r.no}.pdf`; a.click();
  };

  return (
    <PageShell title="Invoices" subtitle="Billing and collections" meta={[`${rows.length} invoices`, `₹${(outstanding / 100000).toFixed(1)}L outstanding`, `${rows.filter(r => r.status === "Overdue").length} overdue`]}>
      <KPIStrip items={[
        { label: "Collected", value: `₹${(paid / 100000).toFixed(1)}L`, delta: "+8%", sub: "this month", spark: [0.8, 1.0, 1.1, 1.3, 1.4, 1.5], color: T.green },
        { label: "Outstanding", value: `₹${(outstanding / 100000).toFixed(1)}L`, sub: `${rows.filter(r => r.status !== "Paid").length} unpaid invoices`, spark: [1.5, 1.4, 1.3, 1.25, 1.2, 1.2], color: T.amber },
        { label: "Overdue", value: `₹${(rows.filter(r => r.status === "Overdue").reduce((s, r) => s + r.amount, 0) / 1000).toFixed(0)}k`, up: false, sub: "needs follow-up", spark: [30, 35, 40, 42, 45, 45], color: T.red },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search invoices…" primaryLabel="New Invoice" />
      <DataTable
        cols={[
          { key: "no", label: "Invoice" }, { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount", align: "right" }, { key: "dates", label: "Dates" },
          { key: "status", label: "Status", align: "center" }, { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          no: <span style={{ color: T.text, fontWeight: 600 }}>{r.no}</span>,
          customer: <Cell2 primary={r.customer} secondary={<span style={{ fontFamily: "monospace", fontSize: 11 }}>{r.gst}</span>} />,
          amount: <Cell2 primary={<span style={{ fontVariantNumeric: "tabular-nums" }}>₹{r.amount.toLocaleString("en-IN")}</span>} secondary="incl. 18% GST" />,
          dates: <Cell2 primary={`Issued ${r.date}`} secondary={`Due ${r.due}`} />,
          status: <Badge label={r.status} color={SC[r.status]} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button title="Download PDF" onClick={() => dl(r)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Download size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
