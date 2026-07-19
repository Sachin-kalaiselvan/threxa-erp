import { useState } from "react";
import { Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Txn { id: string; date: string; desc: string; ref: string; category: string; type: "Credit" | "Debit"; amount: number; balance: number; }

const SEED: Txn[] = [
  { id: "1", date: "15 Jul", desc: "Payment received — Rajesh Enterprises", ref: "INV-10021", category: "Sales",     type: "Credit", amount: 75000,  balance: 275000 },
  { id: "2", date: "15 Jul", desc: "Electricity bill — BESCOM",             ref: "UTIL-078",  category: "Utilities", type: "Debit",  amount: 5000,   balance: 270000 },
  { id: "3", date: "16 Jul", desc: "Payment received — Priya Packaging",    ref: "INV-10022", category: "Sales",     type: "Credit", amount: 150000, balance: 420000 },
  { id: "4", date: "17 Jul", desc: "Kraft paper purchase — Shree Mills",    ref: "PO-0341",   category: "Purchases", type: "Debit",  amount: 82000,  balance: 338000 },
];

export default function CashBook() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.desc.toLowerCase().includes(q.toLowerCase()) || r.category.toLowerCase().includes(q.toLowerCase()) || r.ref.toLowerCase().includes(q.toLowerCase()));
  const credit = rows.filter(r => r.type === "Credit").reduce((s, r) => s + r.amount, 0);
  const debit  = rows.filter(r => r.type === "Debit").reduce((s, r) => s + r.amount, 0);
  const balance = rows.length ? rows[rows.length - 1].balance : 0;

  const exportCSV = () => {
    const csv = [["Date", "Description", "Ref", "Category", "Type", "Amount", "Balance"], ...f.map(r => [r.date, r.desc, r.ref, r.category, r.type, r.amount, r.balance])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "cashbook.csv"; a.click();
  };

  return (
    <PageShell title="Cash Book" subtitle="All receipts and payments" meta={[`Balance ₹${(balance / 100000).toFixed(2)}L`, `${rows.length} transactions this week`]}>
      <KPIStrip items={[
        { label: "Current Balance", value: `₹${(balance / 100000).toFixed(2)}L`, sub: "bank + cash", spark: [2.7, 2.75, 2.7, 4.2, 3.4, 3.38], color: T.accent },
        { label: "Receipts", value: `₹${(credit / 100000).toFixed(2)}L`, delta: "+12%", sub: "this week", spark: [0.7, 0.75, 0.75, 2.25, 2.25, 2.25], color: T.green },
        { label: "Payments", value: `₹${(debit / 1000).toFixed(0)}k`, sub: "this week", spark: [5, 5, 5, 5, 87, 87], color: T.red },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search transactions…" primaryLabel="New Transaction" onExport={exportCSV} />
      <DataTable
        cols={[
          { key: "date", label: "Date" }, { key: "desc", label: "Description" },
          { key: "category", label: "Category", align: "center" }, { key: "amount", label: "Amount", align: "right" },
          { key: "balance", label: "Balance", align: "right" }, { key: "act", label: "", align: "right", width: 50 },
        ]}
        rows={f.map(r => ({
          date: <span style={{ color: T.muted, fontSize: 12.5, whiteSpace: "nowrap" }}>{r.date}</span>,
          desc: <Cell2 primary={r.desc} secondary={r.ref} />,
          category: <Badge label={r.category} color={r.category === "Sales" ? T.green : r.category === "Purchases" ? T.blue : T.muted} />,
          amount: <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600, color: r.type === "Credit" ? T.green : T.red }}>{r.type === "Credit" ? "+" : "−"}₹{r.amount.toLocaleString("en-IN")}</span>,
          balance: <span style={{ fontVariantNumeric: "tabular-nums", color: T.text, fontWeight: 600 }}>₹{r.balance.toLocaleString("en-IN")}</span>,
          act: <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>,
        }))}
      />
    </PageShell>
  );
}
