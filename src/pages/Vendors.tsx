import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, Progress, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";

/* ═══════════════════════════════════════════════════════════
   Vendor & Reel Supplier Scorecard
   Reels already carry a supplier name and rate — this adds the
   two things that were missing: on-time delivery and quality
   consistency, so the factory owner can negotiate from data
   instead of gut feel.
   ═══════════════════════════════════════════════════════════ */

interface Vendor {
  id: string;
  name: string;
  material: string;
  ordersFilled: number;
  onTimePct: number;
  qualityRejects: number;   // % of received reels flagged for quality
  avgRate: number;          // ₹/kg
  lastDelivery: string;
}

const SEED: Vendor[] = [
  { id: "1", name: "Sri Balaji Paper Mills",  material: "Test Liner, Kraft",     ordersFilled: 34, onTimePct: 94, qualityRejects: 1.2, avgRate: 42, lastDelivery: "05 Sep" },
  { id: "2", name: "Om Sai Kraft Traders",    material: "Corrugating Medium",    ordersFilled: 28, onTimePct: 78, qualityRejects: 4.6, avgRate: 46, lastDelivery: "03 Sep" },
  { id: "3", name: "Karnataka Paperboards",   material: "Duplex Board",          ordersFilled: 19, onTimePct: 88, qualityRejects: 2.1, avgRate: 44, lastDelivery: "06 Sep" },
  { id: "4", name: "Golden Yellow Kraft Co.", material: "Kraft Paper",           ordersFilled: 22, onTimePct: 65, qualityRejects: 6.8, avgRate: 40, lastDelivery: "01 Sep" },
  { id: "5", name: "Shree Ganesh Board Mart", material: "White Top Liner",       ordersFilled: 15, onTimePct: 97, qualityRejects: 0.8, avgRate: 48, lastDelivery: "07 Sep" },
];

const FIELDS: readonly FieldSpec[] = [
  { key: "name", label: "Supplier", placeholder: "Sri Balaji Paper Mills", required: true },
  { key: "material", label: "Material supplied", placeholder: "Test Liner, Kraft", half: true },
  { key: "avgRate", label: "Avg rate (₹/kg)", type: "number", half: true },
  { key: "ordersFilled", label: "Orders filled", type: "number", half: true },
  { key: "onTimePct", label: "On-time %", type: "number", half: true },
  { key: "qualityRejects", label: "Quality reject %", type: "number", half: true },
  { key: "lastDelivery", label: "Last delivery", placeholder: "07 Sep", half: true },
] as const;

function scoreOf(v: Vendor) {
  // simple blended score: on-time weighted 60%, quality (inverse of rejects) weighted 40%
  const qualityScore = Math.max(0, 100 - v.qualityRejects * 10);
  return Math.round(v.onTimePct * 0.6 + qualityScore * 0.4);
}

export default function Vendors() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Vendor } | null>(null);

  const f = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.material.toLowerCase().includes(q.toLowerCase()));
  const ranked = [...f].sort((a, b) => scoreOf(b) - scoreOf(a));

  const avgOnTime = rows.length ? rows.reduce((s, r) => s + r.onTimePct, 0) / rows.length : 0;
  const worst = [...rows].sort((a, b) => scoreOf(a) - scoreOf(b))[0];
  const best = [...rows].sort((a, b) => scoreOf(b) - scoreOf(a))[0];

  const save = (v: Record<string, any>) => {
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...v } : r))
      : [{ id: newId(), ...v } as Vendor, ...p]);
    setModal(null);
  };

  return (
    <PageShell title="Vendor Scorecard" subtitle="Reel supplier reliability, by on-time delivery and quality" meta={[`${rows.length} suppliers tracked`, `${avgOnTime.toFixed(0)}% average on-time delivery`]}>
      <KPIStrip items={[
        { label: "Suppliers Tracked", value: String(rows.length), sub: `${rows.reduce((s, r) => s + r.ordersFilled, 0)} orders total`, color: T.accent },
        { label: "Avg On-Time", value: `${avgOnTime.toFixed(0)}%`, up: avgOnTime >= 85, sub: avgOnTime >= 85 ? "healthy" : "needs attention", color: avgOnTime >= 85 ? T.green : T.amber },
        { label: "Best Supplier", value: best?.name.split(" ").slice(0, 2).join(" ") ?? "—", sub: `score ${best ? scoreOf(best) : 0}`, color: T.green },
        { label: "Needs A Conversation", value: worst?.name.split(" ").slice(0, 2).join(" ") ?? "—", sub: `score ${worst ? scoreOf(worst) : 0}`, color: T.red },
      ]} />

      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search suppliers, materials…"
        primaryLabel="Add Supplier"
        onPrimary={() => setModal({ mode: "new" })}
        showExport
        onExport={() => {
          const csv = [["Supplier", "Material", "Orders", "On-Time %", "Reject %", "Rate", "Score"], ...ranked.map(r => [r.name, r.material, r.ordersFilled, r.onTimePct, r.qualityRejects, r.avgRate, scoreOf(r)])].map(r => r.join(",")).join("\n");
          const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "vendor-scorecard.csv"; a.click();
        }}
      />

      <DataTable
        cols={[
          { key: "name", label: "Supplier" }, { key: "ontime", label: "On-Time" },
          { key: "quality", label: "Quality Rejects", align: "right" }, { key: "rate", label: "Avg Rate", align: "right" },
          { key: "score", label: "Score", align: "center" }, { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={ranked.map(r => {
          const score = scoreOf(r);
          return {
            name: <Cell2 primary={r.name} secondary={`${r.material} · ${r.ordersFilled} orders · last ${r.lastDelivery}`} />,
            ontime: (
              <div style={{ width: 120 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.sub, marginBottom: 3 }}>
                  <span>{r.onTimePct}%</span>
                </div>
                <Progress value={r.onTimePct} color={r.onTimePct >= 85 ? T.green : r.onTimePct >= 70 ? T.amber : T.red} />
              </div>
            ),
            quality: <span style={{ fontVariantNumeric: "tabular-nums", color: r.qualityRejects > 4 ? T.red : T.sub }}>{r.qualityRejects}%</span>,
            rate: <span style={{ fontVariantNumeric: "tabular-nums" }}>₹{r.avgRate}/kg</span>,
            score: <Badge label={String(score)} color={score >= 85 ? T.green : score >= 70 ? T.amber : T.red} />,
            act: (
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
                <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
              </div>
            ),
          };
        })}
      />

      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Supplier" : "Add Supplier"}
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
