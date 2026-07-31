import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";

interface Txn { id: string; date: string; desc: string; ref: string; category: string; type: "Credit" | "Debit"; amount: number; balance: number; }

const SEED: Txn[] = [
  { id: "1", date: "02 Jul", desc: "Payment received — Ramesh Traders", ref: "RCPT-0451", category: "Sales", type: "Credit", amount: 185000, balance: 435000 },
  { id: "2", date: "03 Jul", desc: "Kraft paper purchase — Shree Paper Mills", ref: "PO-0338", category: "Purchases", type: "Debit", amount: 142000, balance: 293000 },
  { id: "3", date: "05 Jul", desc: "Freight & diesel — Sri Balaji Transport", ref: "FRT-0119", category: "Logistics", type: "Debit", amount: 18500, balance: 274500 },
  { id: "4", date: "07 Jul", desc: "Payment received — Global Foods", ref: "RCPT-0452", category: "Sales", type: "Credit", amount: 96000, balance: 370500 },
  { id: "5", date: "09 Jul", desc: "Machine spares — Nagpal Engineering", ref: "PO-0339", category: "Maintenance", type: "Debit", amount: 24800, balance: 345700 },
  { id: "6", date: "10 Jul", desc: "Electricity bill — BESCOM", ref: "UTIL-078", category: "Utilities", type: "Debit", amount: 61200, balance: 284500 },
  { id: "7", date: "12 Jul", desc: "Payment received — Bright Retail Chain", ref: "RCPT-0453", category: "Sales", type: "Credit", amount: 142500, balance: 427000 },
  { id: "8", date: "15 Jul", desc: "Payment received — Rajesh Enterprises", ref: "INV-10021", category: "Sales", type: "Credit", amount: 75000, balance: 502000 },
  { id: "9", date: "16 Jul", desc: "Payment received — Priya Packaging", ref: "INV-10022", category: "Sales", type: "Credit", amount: 150000, balance: 652000 },
  { id: "10", date: "17 Jul", desc: "Kraft paper purchase — Shree Paper Mills", ref: "PO-0341", category: "Purchases", type: "Debit", amount: 82000, balance: 570000 },
  { id: "11", date: "18 Jul", desc: "Salary advance — production staff", ref: "ADV-0022", category: "Payroll", type: "Debit", amount: 35000, balance: 535000 },
  { id: "12", date: "20 Jul", desc: "GST payment — June 2026", ref: "GST-0626", category: "Statutory", type: "Debit", amount: 47800, balance: 487200 },
  { id: "13", date: "22 Jul", desc: "Payment received — Super Pack Industries", ref: "RCPT-0454", category: "Sales", type: "Credit", amount: 118000, balance: 605200 },
  { id: "14", date: "24 Jul", desc: "Ink & adhesive — Vibgyor Chemicals", ref: "PO-0343", category: "Purchases", type: "Debit", amount: 29600, balance: 575600 },
  { id: "15", date: "27 Jul", desc: "Godown rent — July", ref: "RENT-07", category: "Rent", type: "Debit", amount: 45000, balance: 530600 },
  { id: "16", date: "29 Jul", desc: "Payment received — Nandi Agro Exports", ref: "RCPT-0455", category: "Sales", type: "Credit", amount: 208000, balance: 738600 },
];

const FIELDS: readonly FieldSpec[] = [
  { key: "date", label: "Date", placeholder: "31 Jul", required: true, half: true },
  { key: "type", label: "Type", type: "select", options: ["Credit", "Debit"], half: true },
  { key: "desc", label: "Description", placeholder: "Payment received — Ramesh Traders", required: true },
  { key: "ref", label: "Reference", placeholder: "RCPT-0456", half: true },
  { key: "category", label: "Category", type: "select", options: ["Sales", "Purchases", "Utilities", "Logistics", "Maintenance", "Payroll", "Statutory", "Rent"], half: true },
  { key: "amount", label: "Amount (₹)", type: "number", half: true },
] as const;

const FILTER_OPTS = ["Credit", "Debit"] as const;

const OPENING = 250000;

const recalc = (list: Txn[]): Txn[] => {
  let bal = OPENING;
  return list.map(t => {
    bal = t.type === "Credit" ? bal + Number(t.amount) : bal - Number(t.amount);
    return { ...t, balance: bal };
  });
};

export default function CashBook() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Txn } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = v;
    setRows(p => recalc(
      modal?.mode === "edit" && modal.row
        ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
        : [...p, { id: newId(), balance: 0, ...patch } as Txn]
    ));
    setModal(null);
  };
  const rowsF = status === "All" ? rows : rows.filter(r => r.type === status);
  const f = rowsF.filter(r => r.desc.toLowerCase().includes(q.toLowerCase()) || r.category.toLowerCase().includes(q.toLowerCase()) || r.ref.toLowerCase().includes(q.toLowerCase()));
  const credit = rows.filter(r => r.type === "Credit").reduce((s, r) => s + r.amount, 0);
  const debit  = rows.filter(r => r.type === "Debit").reduce((s, r) => s + r.amount, 0);
  const balance = rows.length ? rows[rows.length - 1].balance : 0;

  const exportCSV = () => {
    const csv = [["Date", "Description", "Ref", "Category", "Type", "Amount", "Balance"], ...f.map(r => [r.date, r.desc, r.ref, r.category, r.type, r.amount, r.balance])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "cashbook.csv"; a.click();
  };

  return (
    <PageShell title="Cash Book" subtitle="All receipts and payments" meta={[`Balance ₹${(balance / 100000).toFixed(2)}L`, `${rows.length} transactions this month`]}>
      <KPIStrip items={[
        { label: "Current Balance", value: `₹${(balance / 100000).toFixed(2)}L`, sub: "bank + cash", spark: [2.7, 2.75, 2.7, 4.2, 3.4, 3.38], color: T.accent },
        { label: "Receipts", value: `₹${(credit / 100000).toFixed(2)}L`, delta: "+12%", sub: "July 2026", spark: [0.7, 0.75, 0.75, 2.25, 2.25, 2.25], color: T.green },
        { label: "Payments", value: `₹${(debit / 1000).toFixed(0)}k`, sub: "July 2026", spark: [5, 5, 5, 5, 87, 87], color: T.red },
      ]} />
      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search transactions…"
        primaryLabel="New Transaction"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Type" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
      />
      <DataTable
        cols={[
          { key: "date", label: "Date" }, { key: "desc", label: "Description" },
          { key: "category", label: "Category", align: "center" }, { key: "amount", label: "Amount", align: "right" },
          { key: "balance", label: "Balance", align: "right" }, { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          date: <span style={{ color: T.muted, fontSize: 12.5, whiteSpace: "nowrap" }}>{r.date}</span>,
          desc: <Cell2 primary={r.desc} secondary={r.ref} />,
          category: <Badge label={r.category} color={r.category === "Sales" ? T.green : r.category === "Purchases" ? T.blue : T.muted} />,
          amount: <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: r.type === "Credit" ? T.green : T.red }}>{r.type === "Credit" ? "+" : "−"}₹{r.amount.toLocaleString("en-IN")}</span>,
          balance: <span style={{ fontVariantNumeric: "tabular-nums", color: T.text, fontWeight: 600 }}>₹{r.balance.toLocaleString("en-IN")}</span>,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button onClick={() => setRows(p => recalc(p.filter(x => x.id !== r.id)))} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Transaction" : "New Transaction"}
          subtitle={modal.mode === "edit" ? "Update this transaction" : "Add a new transaction"}
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
