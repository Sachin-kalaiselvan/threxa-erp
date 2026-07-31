import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Order { id: string; no: string; customer: string; contact: string; date: string; due: string; qty: number; sqft: string; amount: number; status: "Pending" | "Confirmed" | "In Production" | "Shipped" | "Delivered"; }

const SEED: Order[] = [
  { id: "1",  no: "ORD-001", customer: "Rajesh Enterprises",    contact: "Rajesh Kumar",  date: "15 Jul", due: "22 Jul", qty: 500,   sqft: "7,600 Sq.Ft.",  amount: 75000,  status: "Confirmed" },
  { id: "2",  no: "ORD-002", customer: "Priya Packaging",       contact: "Priya Singh",   date: "16 Jul", due: "23 Jul", qty: 1000,  sqft: "12,400 Sq.Ft.", amount: 150000, status: "Shipped" },
  { id: "3",  no: "ORD-003", customer: "Kumar Industries",      contact: "Kumar S.",      date: "17 Jul", due: "25 Jul", qty: 250,   sqft: "3,100 Sq.Ft.",  amount: 37500,  status: "Pending" },
  { id: "4",  no: "ORD-004", customer: "Ramesh Traders",        contact: "Ramesh Gowda",  date: "18 Jul", due: "26 Jul", qty: 5000,  sqft: "62,000 Sq.Ft.", amount: 640000, status: "In Production" },
  { id: "5",  no: "ORD-005", customer: "Global Foods Pvt Ltd",  contact: "Anita Menon",   date: "19 Jul", due: "27 Jul", qty: 3200,  sqft: "38,400 Sq.Ft.", amount: 412000, status: "In Production" },
  { id: "6",  no: "ORD-006", customer: "FreshMart Retail",      contact: "Sandeep Rao",   date: "21 Jul", due: "29 Jul", qty: 1800,  sqft: "21,600 Sq.Ft.", amount: 234000, status: "Shipped" },
  { id: "7",  no: "ORD-007", customer: "Bright Retail Chain",   contact: "Neha Kulkarni", date: "22 Jul", due: "30 Jul", qty: 2400,  sqft: "28,800 Sq.Ft.", amount: 306000, status: "In Production" },
  { id: "8",  no: "ORD-008", customer: "Super Pack Industries", contact: "Vinod Shetty",  date: "23 Jul", due: "31 Jul", qty: 1500,  sqft: "18,000 Sq.Ft.", amount: 195000, status: "Confirmed" },
  { id: "9",  no: "ORD-009", customer: "Vettiyil Packaging",    contact: "Anoop V.",      date: "24 Jul", due: "02 Aug", qty: 1200,  sqft: "14,400 Sq.Ft.", amount: 156000, status: "Confirmed" },
  { id: "10", no: "ORD-010", customer: "Marudhar Packaging",    contact: "Dinesh M.",     date: "25 Jul", due: "04 Aug", qty: 800,   sqft: "9,600 Sq.Ft.",  amount: 104000, status: "Pending" },
  { id: "11", no: "ORD-011", customer: "Nandi Agro Exports",    contact: "Shivaraj B.",   date: "27 Jul", due: "05 Aug", qty: 6000,  sqft: "74,000 Sq.Ft.", amount: 762000, status: "Delivered" },
  { id: "12", no: "ORD-012", customer: "Zenith Pharma Labs",    contact: "Farida Ansari", date: "29 Jul", due: "07 Aug", qty: 2200,  sqft: "26,400 Sq.Ft.", amount: 289000, status: "Pending" },
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
