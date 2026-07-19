import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Order { id: string; no: string; customer: string; contact: string; date: string; due: string; qty: number; sqft: string; amount: number; status: "Pending" | "Confirmed" | "In Production" | "Shipped" | "Delivered"; }

const SEED: Order[] = [
  { id: "1", no: "ORD-001", customer: "Rajesh Enterprises", contact: "Rajesh Kumar", date: "15 Jul", due: "22 Jul", qty: 500,  sqft: "7,600 Sq.Ft.",  amount: 75000,  status: "Confirmed" },
  { id: "2", no: "ORD-002", customer: "Priya Packaging",    contact: "Priya Singh",  date: "16 Jul", due: "23 Jul", qty: 1000, sqft: "12,400 Sq.Ft.", amount: 150000, status: "Shipped" },
  { id: "3", no: "ORD-003", customer: "Kumar Industries",   contact: "Kumar S.",     date: "17 Jul", due: "25 Jul", qty: 250,  sqft: "3,100 Sq.Ft.",  amount: 37500,  status: "Pending" },
];

const SC: Record<Order["status"], string> = { Pending: T.amber, Confirmed: T.blue, "In Production": T.accent, Shipped: T.blue, Delivered: T.green };

export default function Orders() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.no.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()));
  const rev = rows.reduce((s, r) => s + r.amount, 0);

  const exportCSV = () => {
    const csv = [["Order", "Customer", "Date", "Due", "Qty", "Amount", "Status"], ...f.map(r => [r.no, r.customer, r.date, r.due, r.qty, r.amount, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "orders.csv"; a.click();
  };

  return (
    <PageShell title="Orders" subtitle="Track and manage customer orders" meta={[`${rows.length} orders`, `${rows.filter(r => r.status === "Pending").length} pending`, `₹${(rev / 100000).toFixed(1)}L pipeline`]}>
      <KPIStrip items={[
        { label: "Total Orders", value: String(rows.length), delta: "+1", sub: "this week", spark: [1, 1, 2, 2, 3, 3], color: T.accent },
        { label: "Pending", value: String(rows.filter(r => r.status === "Pending").length), sub: "awaiting confirmation", spark: [2, 2, 1, 1, 1, 1], color: T.amber },
        { label: "Order Value", value: `₹${(rev / 100000).toFixed(1)}L`, delta: "+9%", sub: "vs last week", spark: [1.8, 2.0, 2.2, 2.3, 2.5, 2.6], color: T.green },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search orders…" primaryLabel="New Order" onExport={exportCSV} />
      <DataTable
        cols={[
          { key: "no", label: "Order" }, { key: "customer", label: "Customer" },
          { key: "dates", label: "Dates" }, { key: "qty", label: "Quantity", align: "right" },
          { key: "amount", label: "Amount", align: "right" }, { key: "status", label: "Status", align: "center" },
          { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          no: <span style={{ color: T.text, fontWeight: 600 }}>{r.no}</span>,
          customer: <Cell2 primary={r.customer} secondary={r.contact} />,
          dates: <Cell2 primary={`Ordered ${r.date}`} secondary={`Due ${r.due}`} />,
          qty: <Cell2 primary={<span style={{ fontVariantNumeric: "tabular-nums" }}>{r.qty.toLocaleString("en-IN")} boxes</span>} secondary={r.sqft} />,
          amount: <span style={{ color: T.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>₹{r.amount.toLocaleString("en-IN")}</span>,
          status: <Badge label={r.status} color={SC[r.status]} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
