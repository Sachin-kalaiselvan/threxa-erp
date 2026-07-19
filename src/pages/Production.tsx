import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, Progress } from "../ui/system";

interface Job { id: string; wo: string; product: string; spec: string; customer: string; machine: string; operator: string; qty: string; pct: number; status: "Queued" | "In Progress" | "Completed" | "On Hold"; }

const SEED: Job[] = [
  { id: "1", wo: "WO-1258", product: "5 Ply Corrugated Box", spec: "200 GSM · BF 40", customer: "Ramesh Traders", machine: "Flexo Printer",     operator: "Ajay",   qty: "7,600 Sq.Ft.", pct: 60, status: "In Progress" },
  { id: "2", wo: "WO-1259", product: "3 Ply Corrugated Box", spec: "140 GSM · BF 32", customer: "FreshMart",      machine: "Corrugation L1",    operator: "Ramesh", qty: "6,000 Sq.Ft.", pct: 45, status: "In Progress" },
  { id: "3", wo: "WO-1261", product: "Duplex Board Box",     spec: "250 GSM · BF 45", customer: "Global Foods",   machine: "—",                 operator: "—",      qty: "5,000 Sq.Ft.", pct: 0,  status: "Queued" },
  { id: "4", wo: "WO-1255", product: "5 Ply Corrugated Box", spec: "200 GSM · BF 40", customer: "Super Pack",     machine: "Stitching M/C",     operator: "Mahesh", qty: "5,500 Sq.Ft.", pct: 100, status: "Completed" },
];

const SC: Record<Job["status"], string> = { Queued: T.muted, "In Progress": T.blue, Completed: T.green, "On Hold": T.red };

export default function Production() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.wo.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()) || r.product.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageShell title="Production" subtitle="Work orders and shop-floor progress" meta={["5 / 8 machines running", "73% capacity", "24,560 Sq.Ft. today"]}>
      <KPIStrip items={[
        { label: "Active Jobs", value: String(rows.filter(r => r.status === "In Progress").length), sub: `${rows.filter(r => r.status === "Queued").length} queued`, spark: [1, 2, 2, 3, 2, 2], color: T.blue },
        { label: "Completed Today", value: String(rows.filter(r => r.status === "Completed").length), delta: "+1", sub: "vs yesterday", spark: [0, 1, 1, 1, 1, 1], color: T.green },
        { label: "Output", value: "24,560", sub: "of 32,000 Sq.Ft. target", delta: "76%", spark: [12, 15, 18, 20, 22, 24.5], color: T.accent },
        { label: "Rejection Rate", value: "2.35%", delta: "-0.45%", up: false, sub: "7-day trend", spark: [3.1, 2.9, 2.8, 2.7, 2.5, 2.35], color: T.red },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search work orders…" primaryLabel="New Work Order" />
      <DataTable
        cols={[
          { key: "wo", label: "Work Order" }, { key: "product", label: "Product" },
          { key: "customer", label: "Customer" }, { key: "machine", label: "Machine" },
          { key: "progress", label: "Progress", width: 150 }, { key: "status", label: "Status", align: "center" },
          { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          wo: <Cell2 primary={r.wo} secondary={r.qty} />,
          product: <Cell2 primary={r.product} secondary={r.spec} />,
          customer: <span>{r.customer}</span>,
          machine: <Cell2 primary={r.machine} secondary={r.operator !== "—" ? `Op: ${r.operator}` : undefined} />,
          progress: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Progress value={r.pct} color={r.pct === 100 ? T.green : T.accent} />
              <span style={{ fontSize: 11.5, color: T.sub, width: 32, fontVariantNumeric: "tabular-nums" }}>{r.pct}%</span>
            </div>
          ),
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
