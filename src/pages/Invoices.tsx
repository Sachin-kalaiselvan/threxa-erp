import { useState } from "react";
import { Edit2, Download, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";
import { generateInvoicePDF } from "../utils/pdf";

interface Invoice { id: string; no: string; customer: string; gst: string; amount: number; date: string; due: string; status: "Draft" | "Sent" | "Paid" | "Overdue"; }

const SEED: Invoice[] = [
  { id: "1",  no: "INV-10021", customer: "Rajesh Enterprises",    gst: "29AABCR9603R1Z5", amount: 75000,  date: "15 Jul", due: "14 Aug", status: "Sent" },
  { id: "2",  no: "INV-10022", customer: "Priya Packaging",       gst: "29AABCV9603R2Z5", amount: 150000, date: "16 Jul", due: "15 Aug", status: "Paid" },
  { id: "3",  no: "INV-10023", customer: "Kumar Industries",      gst: "29AABCW9603R3Z5", amount: 45000,  date: "10 Jun", due: "10 Jul", status: "Overdue" },
  { id: "4",  no: "INV-10024", customer: "Ramesh Traders",        gst: "29AACCR4521M1Z9", amount: 640000, date: "18 Jul", due: "17 Aug", status: "Sent" },
  { id: "5",  no: "INV-10025", customer: "Global Foods Pvt Ltd",  gst: "29AAGCG7712K1ZB", amount: 412000, date: "19 Jul", due: "18 Aug", status: "Paid" },
  { id: "6",  no: "INV-10026", customer: "FreshMart Retail",      gst: "29AAFCF3390L1ZP", amount: 234000, date: "21 Jul", due: "20 Aug", status: "Sent" },
  { id: "7",  no: "INV-10027", customer: "Bright Retail Chain",   gst: "29AABCB8821N1ZQ", amount: 306000, date: "22 Jul", due: "21 Aug", status: "Paid" },
  { id: "8",  no: "INV-10028", customer: "Super Pack Industries", gst: "29AASCS1140P1ZR", amount: 195000, date: "23 Jul", due: "22 Aug", status: "Sent" },
  { id: "9",  no: "INV-10029", customer: "Vettiyil Packaging",    gst: "32AAVCV2210Q1ZT", amount: 156000, date: "24 Jul", due: "23 Aug", status: "Draft" },
  { id: "10", no: "INV-10030", customer: "Marudhar Packaging",    gst: "27AAMCM6650R1ZU", amount: 104000, date: "12 Jun", due: "12 Jul", status: "Overdue" },
  { id: "11", no: "INV-10031", customer: "Nandi Agro Exports",    gst: "29AANCN9930S1ZV", amount: 762000, date: "27 Jul", due: "26 Aug", status: "Paid" },
  { id: "12", no: "INV-10032", customer: "Zenith Pharma Labs",    gst: "29AAZCZ4470T1ZW", amount: 289000, date: "29 Jul", due: "28 Aug", status: "Draft" },
];

const SC: Record<Invoice["status"], string> = { Draft: T.muted, Sent: T.blue, Paid: T.green, Overdue: T.red };

const FIELDS: readonly FieldSpec[] = [
  { key: "no", label: "Invoice no.", placeholder: "INV-10033", required: true, half: true },
  { key: "status", label: "Status", type: "select", options: ["Draft", "Sent", "Paid", "Overdue"], half: true },
  { key: "customer", label: "Customer", required: true },
  { key: "gst", label: "Customer GSTIN", placeholder: "29AABCR9603R1Z5", half: true },
  { key: "amount", label: "Taxable value (₹)", type: "number", half: true },
  { key: "date", label: "Invoice date", placeholder: "31 Jul", half: true },
  { key: "due", label: "Due date", placeholder: "30 Aug", half: true },
] as const;

const FILTER_OPTS = ["Draft", "Sent", "Paid", "Overdue"] as const;

export default function Invoices() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Invoice } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = v;
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Invoice, ...p]);
    setModal(null);
  };
  const rowsF = status === "All" ? rows : rows.filter(r => r.status === status);
  const f = rowsF.filter(r => r.no.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()));
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

  const exportCSV = () => {
    const csv = [["Invoice", "Customer", "GSTIN", "Amount", "Date", "Due", "Status"], ...f.map(r => [r.no, r.customer, r.gst, r.amount, r.date, r.due, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "invoices.csv"; a.click();
  };

  return (
    <PageShell title="Invoices" subtitle="Billing and collections" meta={[`${rows.length} invoices`, `₹${(outstanding / 100000).toFixed(1)}L outstanding`, `${rows.filter(r => r.status === "Overdue").length} overdue`]}>
      <KPIStrip items={[
        { label: "Collected", value: `₹${(paid / 100000).toFixed(1)}L`, delta: "+8%", sub: "this month", spark: [0.8, 1.0, 1.1, 1.3, 1.4, 1.5], color: T.green },
        { label: "Outstanding", value: `₹${(outstanding / 100000).toFixed(1)}L`, sub: `${rows.filter(r => r.status !== "Paid").length} unpaid invoices`, spark: [1.5, 1.4, 1.3, 1.25, 1.2, 1.2], color: T.amber },
        { label: "Overdue", value: `₹${(rows.filter(r => r.status === "Overdue").reduce((s, r) => s + r.amount, 0) / 1000).toFixed(0)}k`, up: false, sub: "needs follow-up", spark: [30, 35, 40, 42, 45, 45], color: T.red },
      ]} />
      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search invoices…"
        primaryLabel="New Invoice"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Status" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
      />
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
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button title="Download PDF" onClick={() => dl(r)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Download size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Invoice" : "New Invoice"}
          subtitle={modal.mode === "edit" ? "Update this invoice" : "Add a new invoice"}
          fields={FIELDS}
          initial={modal.row}
          submitLabel={modal.mode === "edit" ? "Save changes" : "Create"}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageShell>
  );
}
