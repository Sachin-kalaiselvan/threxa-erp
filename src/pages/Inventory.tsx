import { useState } from "react";
import { Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Item { id: string; name: string; gsm: number; bf: number; ply: string; kg: number; min: number; reams: number; location: string; updated: string; }

const SEED: Item[] = [
  { id: "1", name: "Test Liner",         gsm: 140, bf: 32, ply: "3 Ply", kg: 1240, min: 2000, reams: 25, location: "Godown A · Rack 01", updated: "16 Jul" },
  { id: "2", name: "Corrugating Medium", gsm: 120, bf: 28, ply: "3 Ply", kg: 980,  min: 1500, reams: 15, location: "Godown A · Rack 02", updated: "16 Jul" },
  { id: "3", name: "Kraft Paper",        gsm: 200, bf: 40, ply: "5 Ply", kg: 1100, min: 1500, reams: 22, location: "Godown B · Rack 01", updated: "15 Jul" },
  { id: "4", name: "Duplex Board",       gsm: 250, bf: 45, ply: "5 Ply", kg: 2300, min: 2500, reams: 40, location: "Godown B · Rack 03", updated: "14 Jul" },
  { id: "5", name: "White Top Liner",    gsm: 170, bf: 35, ply: "5 Ply", kg: 1450, min: 1500, reams: 28, location: "Godown C · Rack 01", updated: "16 Jul" },
];

export default function Inventory() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.location.toLowerCase().includes(q.toLowerCase()));
  const low = rows.filter(r => r.kg < r.min).length;
  const total = rows.reduce((s, r) => s + r.kg, 0);

  const exportCSV = () => {
    const csv = [["Item", "GSM", "BF", "Ply", "Stock Kg", "Min Kg", "Reams", "Location"], ...f.map(r => [r.name, r.gsm, r.bf, r.ply, r.kg, r.min, r.reams, r.location])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "inventory.csv"; a.click();
  };

  return (
    <PageShell title="Inventory" subtitle="Raw material reels and stock levels" meta={[`${total.toLocaleString("en-IN")} Kg total`, `${low} below reorder`, "Updated today"]}>
      <KPIStrip items={[
        { label: "Total Reel Stock", value: `${(total / 1000).toFixed(1)}T`, sub: `${rows.length} materials`, spark: [7.5, 7.4, 7.2, 7.1, 7.1, 7.07], color: T.accent },
        { label: "Below Reorder", value: String(low), up: false, sub: "need purchase orders", spark: [1, 2, 2, 3, 3, 3], color: T.red },
        { label: "Health Score", value: `${Math.round((rows.length - low) / rows.length * 100)}%`, sub: "stocked adequately", spark: [90, 85, 80, 70, 60, 40], color: T.amber },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search materials, locations…" primaryLabel="Add Stock" onExport={exportCSV} />
      <DataTable
        cols={[
          { key: "name", label: "Material" }, { key: "spec", label: "Spec" },
          { key: "stock", label: "Stock", align: "right" }, { key: "reams", label: "Reams", align: "center" },
          { key: "location", label: "Location" }, { key: "level", label: "Level", align: "center" },
          { key: "act", label: "", align: "right", width: 50 },
        ]}
        rows={f.map(r => {
          const ok = r.kg >= r.min, near = r.kg >= r.min * 0.9;
          return {
            name: <Cell2 primary={r.name} secondary={`Updated ${r.updated}`} />,
            spec: <span style={{ fontSize: 12.5 }}>{r.gsm} GSM · BF {r.bf} · {r.ply}</span>,
            stock: <Cell2 primary={<span style={{ fontVariantNumeric: "tabular-nums", color: ok ? T.text : T.red, fontWeight: 600 }}>{r.kg.toLocaleString("en-IN")} Kg</span>} secondary={`Min ${r.min.toLocaleString("en-IN")} Kg`} />,
            reams: <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.reams}</span>,
            location: <span style={{ fontSize: 12.5, color: T.muted }}>{r.location}</span>,
            level: <Badge label={ok ? "OK" : near ? "Low" : "Critical"} color={ok ? T.green : near ? T.amber : T.red} />,
            act: <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>,
          };
        })}
      />
    </PageShell>
  );
}
