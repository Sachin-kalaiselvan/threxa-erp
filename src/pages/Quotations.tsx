import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Quote { id: string; no: string; customer: string; contact: string; amount: number; items: string; date: string; validity: string; status: "Draft" | "Sent" | "Accepted" | "Rejected"; }

const SEED: Quote[] = [
  { id: "1",  no: "QT-118", customer: "Rajesh Enterprises",    contact: "Rajesh Kumar",  amount: 75000,  items: "5 Ply Box × 500",    date: "15 Jul", validity: "14 Aug", status: "Accepted" },
  { id: "2",  no: "QT-119", customer: "Vettiyil Packaging",    contact: "Anoop V.",      amount: 156000, items: "3 Ply Box × 1,200",  date: "16 Jul", validity: "15 Aug", status: "Sent" },
  { id: "3",  no: "QT-120", customer: "Marudhar Packaging",    contact: "Dinesh M.",     amount: 104000, items: "Duplex Box × 800",   date: "18 Jul", validity: "17 Aug", status: "Draft" },
  { id: "4",  no: "QT-121", customer: "Ramesh Traders",        contact: "Ramesh Gowda",  amount: 640000, items: "5 Ply Box × 5,000",  date: "18 Jul", validity: "17 Aug", status: "Accepted" },
  { id: "5",  no: "QT-122", customer: "Global Foods Pvt Ltd",  contact: "Anita Menon",   amount: 412000, items: "5 Ply Box × 3,200",  date: "19 Jul", validity: "18 Aug", status: "Accepted" },
  { id: "6",  no: "QT-123", customer: "Bright Retail Chain",   contact: "Neha Kulkarni", amount: 306000, items: "3 Ply Box × 2,400",  date: "22 Jul", validity: "21 Aug", status: "Accepted" },
  { id: "7",  no: "QT-124", customer: "Zenith Pharma Labs",    contact: "Farida Ansari", amount: 289000, items: "Mono Carton × 2,200",date: "23 Jul", validity: "22 Aug", status: "Sent" },
  { id: "8",  no: "QT-125", customer: "Kumar Industries",      contact: "Kumar S.",      amount: 168000, items: "3 Ply Box × 1,400",  date: "24 Jul", validity: "23 Aug", status: "Rejected" },
  { id: "9",  no: "QT-126", customer: "Nandi Agro Exports",    contact: "Shivaraj B.",   amount: 762000, items: "5 Ply Box × 6,000",  date: "27 Jul", validity: "26 Aug", status: "Accepted" },
  { id: "10", no: "QT-127", customer: "FreshMart Retail",      contact: "Sandeep Rao",   amount: 198000, items: "Die-Cut Tray × 1,600",date: "29 Jul", validity: "28 Aug", status: "Sent" },
];

const SC: Record<Quote["status"], string> = { Draft: T.muted, Sent: T.blue, Accepted: T.green, Rejected: T.red };

export default function Quotations() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.no.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()));
  const pipeline = rows.filter(r => r.status === "Sent" || r.status === "Draft").reduce((s, r) => s + r.amount, 0);

  return (
    <PageShell title="Quotations" subtitle="Quotes and conversion pipeline" meta={[`${rows.length} quotes`, `₹${(pipeline / 100000).toFixed(1)}L open pipeline`]}>
      <KPIStrip items={[
        { label: "Total Quotes", value: String(rows.length), delta: "+1", sub: "this week", spark: [1, 1, 2, 2, 3, 3], color: T.accent },
        { label: "Accepted", value: String(rows.filter(r => r.status === "Accepted").length), sub: `${Math.round(rows.filter(r => r.status === "Accepted").length / rows.length * 100)}% conversion`, spark: [0, 0, 1, 1, 1, 1], color: T.green },
        { label: "Open Pipeline", value: `₹${(pipeline / 100000).toFixed(1)}L`, sub: "awaiting response", spark: [1.5, 1.8, 2.0, 2.1, 2.2, 2.17], color: T.amber },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search quotations…" primaryLabel="New Quotation" />
      <DataTable
        cols={[
          { key: "no", label: "Quote" }, { key: "customer", label: "Customer" },
          { key: "items", label: "Items" }, { key: "amount", label: "Amount", align: "right" },
          { key: "dates", label: "Validity" }, { key: "status", label: "Status", align: "center" },
          { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          no: <span style={{ color: T.text, fontWeight: 600 }}>{r.no}</span>,
          customer: <Cell2 primary={r.customer} secondary={r.contact} />,
          items: <span style={{ fontSize: 12.5 }}>{r.items}</span>,
          amount: <span style={{ color: T.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>₹{r.amount.toLocaleString("en-IN")}</span>,
          dates: <Cell2 primary={`Sent ${r.date}`} secondary={`Valid till ${r.validity}`} />,
          status: <Badge label={r.status} color={SC[r.status]} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button title="Generate PDF" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><FileText size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
