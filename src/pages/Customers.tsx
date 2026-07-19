import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import {
  T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2,
} from "../ui/system";

interface Customer {
  id: string; name: string; since: string; email: string; phone: string;
  gst: string; orders: number; spent: number; lastOrder: string; active: boolean;
}

const SEED: Customer[] = [
  { id: "1", name: "Rajesh Enterprises", since: "2022", email: "rajesh@example.com", phone: "+91 98765 43210", gst: "27AABCU9603R1Z5", orders: 45, spent: 450000, lastOrder: "15 Jul", active: true },
  { id: "2", name: "Priya Packaging",    since: "2023", email: "priya@example.com",  phone: "+91 98765 43211", gst: "27AABCV9603R2Z5", orders: 32, spent: 320000, lastOrder: "12 Jul", active: true },
  { id: "3", name: "Kumar Industries",   since: "2021", email: "kumar@example.com",  phone: "+91 98765 43212", gst: "27AABCW9603R3Z5", orders: 18, spent: 180000, lastOrder: "02 Jun", active: false },
];

export default function Customers() {
  const [rows, setRows] = useState<Customer[]>(SEED);
  const [q, setQ] = useState("");

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.email.toLowerCase().includes(q.toLowerCase())
  );

  const totalRevenue = rows.reduce((s, r) => s + r.spent, 0);

  const exportCSV = () => {
    const csv = [
      ["Name", "Email", "Phone", "GST", "Orders", "Total Spent", "Status"],
      ...filtered.map(r => [r.name, r.email, r.phone, r.gst, r.orders, r.spent, r.active ? "Active" : "Inactive"]),
    ].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "customers.csv"; a.click();
  };

  return (
    <PageShell
      title="Customers"
      subtitle="Manage your customer database"
      meta={[`${rows.length} customers`, `${rows.filter(r => r.active).length} active`, "Updated just now"]}
    >
      <KPIStrip items={[
        { label: "Total Customers", value: String(rows.length), delta: "+1", sub: "this month", spark: [1, 1, 2, 2, 3, 3], color: T.accent },
        { label: "Active", value: String(rows.filter(r => r.active).length), sub: `${Math.round(rows.filter(r => r.active).length / rows.length * 100)}% of base`, spark: [1, 2, 2, 2, 2, 2], color: T.green },
        { label: "Lifetime Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, delta: "+12%", sub: "vs last quarter", spark: [6, 7, 7.5, 8, 9, 9.5], color: T.blue },
      ]} />

      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search customers…"
        primaryLabel="New Customer"
        showImport
        onExport={exportCSV}
      />

      <DataTable
        cols={[
          { key: "name",   label: "Customer" },
          { key: "contact",label: "Contact" },
          { key: "gst",    label: "GST IN" },
          { key: "orders", label: "Orders", align: "center" },
          { key: "spent",  label: "Total Spent", align: "right" },
          { key: "status", label: "Status", align: "center" },
          { key: "act",    label: "", align: "right", width: 80 },
        ]}
        rows={filtered.map(r => ({
          name:   <Cell2 primary={r.name} secondary={`Customer since ${r.since}`} />,
          contact:<Cell2 primary={r.email} secondary={r.phone} />,
          gst:    <span style={{ fontFamily: "monospace", fontSize: 12 }}>{r.gst}</span>,
          orders: <span style={{ color: T.text, fontWeight: 600 }}>{r.orders}</span>,
          spent:  <Cell2 primary={<span style={{ fontVariantNumeric: "tabular-nums" }}>₹{r.spent.toLocaleString("en-IN")}</span>} secondary={`Last order: ${r.lastOrder}`} />,
          status: <Badge label={r.active ? "Active" : "Inactive"} color={r.active ? T.green : T.muted} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5, borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.blue)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                <Edit2 size={14} />
              </button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5, borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.red)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                <Trash2 size={14} />
              </button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
