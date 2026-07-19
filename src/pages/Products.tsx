import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Product { id: string; code: string; name: string; gsm: number; bf: number; ply: string; weight: number; price: number; stock: number; }

const SEED: Product[] = [
  { id: "1", code: "PRD-001", name: "Corrugated Box A4",  gsm: 150, bf: 32, ply: "3 Ply", weight: 250, price: 30, stock: 500 },
  { id: "2", code: "PRD-002", name: "Corrugated Box A3",  gsm: 200, bf: 40, ply: "5 Ply", weight: 350, price: 42, stock: 300 },
  { id: "3", code: "PRD-003", name: "Duplex Board Box",   gsm: 250, bf: 45, ply: "5 Ply", weight: 420, price: 55, stock: 80 },
];

export default function Products() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.code.toLowerCase().includes(q.toLowerCase()));
  const value = rows.reduce((s, r) => s + r.price * r.stock, 0);

  return (
    <PageShell title="Products" subtitle="Product catalogue and specifications" meta={[`${rows.length} SKUs`, `₹${(value / 1000).toFixed(0)}k stock value`]}>
      <KPIStrip items={[
        { label: "Total SKUs", value: String(rows.length), sub: "active catalogue", spark: [2, 2, 3, 3, 3, 3], color: T.accent },
        { label: "Units in Stock", value: rows.reduce((s, r) => s + r.stock, 0).toLocaleString("en-IN"), sub: "across all SKUs", spark: [700, 750, 800, 820, 850, 880], color: T.blue },
        { label: "Stock Value", value: `₹${(value / 1000).toFixed(0)}k`, delta: "+4%", sub: "at list price", spark: [30, 32, 33, 34, 35, 36], color: T.green },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search products…" primaryLabel="New Product" />
      <DataTable
        cols={[
          { key: "code", label: "Product" }, { key: "spec", label: "Specification" },
          { key: "weight", label: "Weight", align: "right" }, { key: "price", label: "Unit Price", align: "right" },
          { key: "stock", label: "Stock", align: "center" }, { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          code: <Cell2 primary={r.name} secondary={r.code} />,
          spec: <Cell2 primary={`${r.gsm} GSM · BF ${r.bf}`} secondary={r.ply} />,
          weight: <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.weight} g</span>,
          price: <span style={{ color: T.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>₹{r.price}/unit</span>,
          stock: <Badge label={String(r.stock)} color={r.stock > 200 ? T.green : r.stock > 100 ? T.amber : T.red} />,
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
