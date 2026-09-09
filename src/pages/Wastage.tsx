import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, fmtINR, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";

interface WastageEntry {
  id: string;
  date: string;
  jobNo: string;
  material: string;
  reelWeight: number;
  boardConsumed: number;
  reason: "Trim Loss" | "Machine Setup" | "Reel Defect" | "Order Change";
  ratePerKg: number;
}

const SEED: WastageEntry[] = [
  { id: "1", date: "05 Sep", jobNo: "JC-3298", material: "Kraft Test Liner", reelWeight: 420, boardConsumed: 368, reason: "Trim Loss",     ratePerKg: 42 },
  { id: "2", date: "05 Sep", jobNo: "JC-3299", material: "Corrugating Medium", reelWeight: 310, boardConsumed: 289, reason: "Machine Setup", ratePerKg: 38 },
  { id: "3", date: "06 Sep", jobNo: "JC-3301", material: "Kraft Test Liner", reelWeight: 560, boardConsumed: 481, reason: "Trim Loss",     ratePerKg: 42 },
  { id: "4", date: "06 Sep", jobNo: "JC-3303", material: "Duplex Board",     reelWeight: 275, boardConsumed: 231, reason: "Reel Defect",   ratePerKg: 44 },
  { id: "5", date: "07 Sep", jobNo: "JC-3305", material: "Kraft Test Liner", reelWeight: 340, boardConsumed: 322, reason: "Trim Loss",     ratePerKg: 42 },
  { id: "6", date: "07 Sep", jobNo: "JC-3306", material: "White Top Liner",  reelWeight: 190, boardConsumed: 142, reason: "Order Change",  ratePerKg: 48 },
];

const REASON_OPTS = ["Trim Loss", "Machine Setup", "Reel Defect", "Order Change"] as const;

const FIELDS: readonly FieldSpec[] = [
  { key: "jobNo", label: "Job card no.", placeholder: "JC-3310", required: true, half: true },
  { key: "date", label: "Date", placeholder: "08 Sep", half: true },
  { key: "material", label: "Material" },
  { key: "reelWeight", label: "Reel issued (kg)", type: "number", half: true },
  { key: "boardConsumed", label: "Board consumed (kg)", type: "number", half: true },
  { key: "ratePerKg", label: "Rate (₹/kg)", type: "number", half: true },
  { key: "reason", label: "Wastage reason", type: "select", options: REASON_OPTS, half: true },
] as const;

const wastageKg = (e: WastageEntry) => Math.max(0, e.reelWeight - e.boardConsumed);
const wastagePct = (e: WastageEntry) => (e.reelWeight > 0 ? (wastageKg(e) / e.reelWeight) * 100 : 0);

export default function Wastage() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: WastageEntry } | null>(null);

  const f = rows
    .filter(r => r.jobNo.toLowerCase().includes(q.toLowerCase()) || r.material.toLowerCase().includes(q.toLowerCase()))
    .filter(r => reasonFilter === "All" || r.reason === reasonFilter);

  const totalIssued = rows.reduce((s, r) => s + r.reelWeight, 0);
  const totalWaste = rows.reduce((s, r) => s + wastageKg(r), 0);
  const overallPct = totalIssued > 0 ? (totalWaste / totalIssued) * 100 : 0;
  const costImpact = rows.reduce((s, r) => s + wastageKg(r) * r.ratePerKg, 0);
  const benchmark = 14.5;

  const save = (v: Record<string, any>) => {
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...v } : r))
      : [{ id: newId(), ...v } as WastageEntry, ...p]);
    setModal(null);
  };

  return (
    <PageShell
      title="Wastage"
      subtitle="Reel and board wastage against the industry 14–15% trim-loss benchmark"
      meta={[`${rows.length} jobs logged`, `${totalIssued.toLocaleString("en-IN")} kg reel issued`]}
    >
      <KPIStrip items={[
        { label: "Overall Wastage", value: `${overallPct.toFixed(1)}%`, up: overallPct <= benchmark, sub: overallPct <= benchmark ? "under benchmark" : "above benchmark", color: overallPct <= benchmark ? T.green : T.red },
        { label: "Wastage Volume", value: `${totalWaste.toFixed(0)} kg`, sub: `of ${totalIssued.toLocaleString("en-IN")} kg issued`, color: T.amber },
        { label: "Cost Impact", value: fmtINR(costImpact), sub: "at logged rates", color: T.red },
        { label: "Industry Benchmark", value: `${benchmark}%`, sub: "typical corrugator trim loss", color: T.muted },
      ]} />

      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search job no., material…"
        primaryLabel="Log Wastage"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Reason" filterValue={reasonFilter} filterOptions={REASON_OPTS} onFilter={setReasonFilter}
        showExport
        onExport={() => {
          const csv = [["Date", "Job No", "Material", "Reel Issued (kg)", "Consumed (kg)", "Wastage (kg)", "Wastage %", "Reason", "Cost Impact"],
            ...f.map(r => [r.date, r.jobNo, r.material, r.reelWeight, r.boardConsumed, wastageKg(r).toFixed(1), wastagePct(r).toFixed(1), r.reason, (wastageKg(r) * r.ratePerKg).toFixed(0)])]
            .map(r => r.join(",")).join("\n");
          const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "wastage-log.csv"; a.click();
        }}
      />

      <DataTable
        cols={[
          { key: "job", label: "Job" }, { key: "reel", label: "Reel Issued", align: "right" },
          { key: "waste", label: "Wastage", align: "right" }, { key: "cost", label: "Cost Impact", align: "right" },
          { key: "reason", label: "Reason", align: "center" }, { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          job: <Cell2 primary={r.jobNo} secondary={`${r.material} · ${r.date}`} />,
          reel: <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.reelWeight} kg</span>,
          waste: (
            <span style={{ fontVariantNumeric: "tabular-nums", color: wastagePct(r) > benchmark ? T.red : T.sub }}>
              {wastageKg(r).toFixed(0)} kg ({wastagePct(r).toFixed(1)}%)
            </span>
          ),
          cost: <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtINR(Math.round(wastageKg(r) * r.ratePerKg))}</span>,
          reason: <Badge label={r.reason} color={r.reason === "Trim Loss" ? T.amber : r.reason === "Reel Defect" ? T.red : T.blue} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />

      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Wastage Entry" : "Log Wastage"}
          fields={FIELDS}
          initial={modal.row}
          submitLabel={modal.mode === "edit" ? "Save changes" : "Log entry"}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageShell>
  );
}
