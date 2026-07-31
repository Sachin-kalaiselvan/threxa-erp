import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";

interface Product { id: string; code: string; name: string; gsm: number; bf: number; ply: string; weight: number; price: number; stock: number; }

const SEED: Product[] = [
  { id: "1",  code: "PRD-001", name: "Corrugated Box A4",        gsm: 150, bf: 32, ply: "3 Ply", weight: 250,  price: 30,  stock: 500 },
  { id: "2",  code: "PRD-002", name: "Corrugated Box A3",        gsm: 200, bf: 40, ply: "5 Ply", weight: 350,  price: 42,  stock: 300 },
  { id: "3",  code: "PRD-003", name: "Duplex Board Box",         gsm: 250, bf: 45, ply: "5 Ply", weight: 420,  price: 55,  stock: 80 },
  { id: "4",  code: "PRD-004", name: "Mono Carton — Pharma",     gsm: 250, bf: 45, ply: "3 Ply", weight: 180,  price: 24,  stock: 1200 },
  { id: "5",  code: "PRD-005", name: "Die-Cut Produce Tray",     gsm: 170, bf: 35, ply: "3 Ply", weight: 210,  price: 27,  stock: 640 },
  { id: "6",  code: "PRD-006", name: "Heavy Duty Export Carton", gsm: 220, bf: 45, ply: "7 Ply", weight: 780,  price: 96,  stock: 145 },
  { id: "7",  code: "PRD-007", name: "Pizza Box 12in",           gsm: 160, bf: 32, ply: "3 Ply", weight: 195,  price: 22,  stock: 2400 },
  { id: "8",  code: "PRD-008", name: "Telescopic Two-Piece Box", gsm: 200, bf: 40, ply: "5 Ply", weight: 510,  price: 68,  stock: 95 },
  { id: "9",  code: "PRD-009", name: "Partition / Divider Set",  gsm: 140, bf: 28, ply: "3 Ply", weight: 120,  price: 14,  stock: 3100 },
  { id: "10", code: "PRD-010", name: "Printed Retail Shelf Box", gsm: 170, bf: 35, ply: "5 Ply", weight: 390,  price: 58,  stock: 220 },
];

const FIELDS: readonly FieldSpec[] = [
  { key: "code", label: "Product code", placeholder: "PRD-011", required: true, half: true },
  { key: "ply", label: "Ply", type: "select", options: ["3 Ply", "5 Ply", "7 Ply"], half: true },
  { key: "name", label: "Product name", placeholder: "Corrugated Box A4", required: true },
  { key: "gsm", label: "GSM", type: "number", half: true },
  { key: "bf", label: "Bursting factor", type: "number", half: true },
  { key: "weight", label: "Unit weight (g)", type: "number", half: true },
  { key: "price", label: "Unit price (₹)", type: "number", half: true },
  { key: "stock", label: "Stock (units)", type: "number", half: true },
] as const;

const FILTER_OPTS = ["Healthy", "Low", "Critical"] as const;

export default function Products() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Product } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = v;
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Product, ...p]);
    setModal(null);
  };
  const rowsF = status === "All" ? rows : rows.filter(r => (status === "Healthy" ? r.stock > 200 : status === "Low" ? r.stock > 100 && r.stock <= 200 : r.stock <= 100));
  const f = rowsF.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.code.toLowerCase().includes(q.toLowerCase()));
  const value = rows.reduce((s, r) => s + r.price * r.stock, 0);

  const exportCSV = () => {
    const csv = [["Code", "Name", "GSM", "BF", "Ply", "Weight", "Price", "Stock"], ...f.map(r => [r.code, r.name, r.gsm, r.bf, r.ply, r.weight, r.price, r.stock])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "products.csv"; a.click();
  };

  return (
    <PageShell title="Products" subtitle="Product catalogue and specifications" meta={[`${rows.length} SKUs`, `₹${(value / 1000).toFixed(0)}k stock value`]}>
      <KPIStrip items={[
        { label: "Total SKUs", value: String(rows.length), sub: `${rows.filter(r => r.stock > 0).length} in stock`, spark: [2, 2, 3, 3, 3, 3], color: T.accent },
        { label: "Units in Stock", value: rows.reduce((s, r) => s + r.stock, 0).toLocaleString("en-IN"), sub: "across all SKUs", spark: [700, 750, 800, 820, 850, 880], color: T.blue },
        { label: "Stock Value", value: `₹${(value / 1000).toFixed(0)}k`, delta: "+4%", sub: "at list price", spark: [30, 32, 33, 34, 35, 36], color: T.green },
      ]} />
      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search products…"
        primaryLabel="New Product"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Stock" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
      />
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
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Product" : "New Product"}
          subtitle={modal.mode === "edit" ? "Update this product" : "Add a new product"}
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
