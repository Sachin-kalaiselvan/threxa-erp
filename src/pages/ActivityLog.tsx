import { useState } from "react";
import { Undo2, CheckCircle2 } from "lucide-react";
import { T, PageShell, KPIStrip, Card, Badge, ActionBar, Cell2 } from "../ui/system";

/* ═══════════════════════════════════════════════════════════
   Activity Log — easy correction / undo
   The database already writes an audit_log row (entity, action,
   detail) for every change; nothing has ever shown it. This
   surfaces recent edits with a one-click Undo — the single most
   repeated complaint in ERP reviews is that fixing a mistake once
   it's entered is "very cumbersome".
   ═══════════════════════════════════════════════════════════ */

interface Entry {
  id: string;
  entity: string;
  entityRef: string;
  action: "created" | "updated" | "deleted";
  detail: string;
  before?: string;
  after?: string;
  user: string;
  at: string;
  undone: boolean;
}

const SEED: Entry[] = [
  { id: "1", entity: "Quotation",  entityRef: "QT-1042", action: "updated", detail: "Quoted rate changed", before: "₹18.40 / box", after: "₹17.90 / box", user: "Sachin",   at: "Today, 11:42 AM", undone: false },
  { id: "2", entity: "Job Card",   entityRef: "JC-3301",  action: "updated", detail: "Quantity corrected",  before: "6,200 pcs",   after: "6,000 pcs",   user: "Ramesh",   at: "Today, 10:15 AM", undone: false },
  { id: "3", entity: "Reel",       entityRef: "RL-8821",  action: "updated", detail: "Weight entry fixed",  before: "1,050 Kg",    after: "850 Kg",      user: "Suresh",   at: "Today, 9:30 AM",  undone: false },
  { id: "4", entity: "Invoice",    entityRef: "INV-4471", action: "created", detail: "Invoice generated",  user: "Sachin",   at: "Yesterday, 6:05 PM", undone: false },
  { id: "5", entity: "Customer",   entityRef: "Ramesh Traders", action: "updated", detail: "GSTIN corrected", before: "29AAAPL...Z1", after: "29AAAPL...Z8", user: "Sachin", at: "Yesterday, 3:20 PM", undone: false },
  { id: "6", entity: "Order",      entityRef: "SO-2210",  action: "deleted", detail: "Duplicate order removed", user: "Sachin", at: "2 days ago", undone: false },
];

export default function ActivityLog() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const undo = (id: string) => setRows(p => p.map(r => (r.id === id ? { ...r, undone: true } : r)));

  const f = rows.filter(r =>
    (r.entityRef.toLowerCase().includes(q.toLowerCase()) || r.detail.toLowerCase().includes(q.toLowerCase()) || r.user.toLowerCase().includes(q.toLowerCase())) &&
    (filter === "All" || r.entity === filter)
  );

  const undoable = rows.filter(r => r.action === "updated" && !r.undone).length;
  const entities = Array.from(new Set(rows.map(r => r.entity)));

  return (
    <PageShell title="Activity Log" subtitle="Every change, who made it, and a one-click undo" meta={[`${rows.length} changes logged`, `${undoable} can be undone`]}>
      <KPIStrip items={[
        { label: "Changes Today", value: String(rows.filter(r => r.at.startsWith("Today")).length), sub: "across all modules", color: T.accent },
        { label: "Corrections Made", value: String(rows.filter(r => r.action === "updated").length), sub: "caught and fixed", color: T.blue },
        { label: "Currently Undoable", value: String(undoable), sub: "within edit window", color: T.amber },
      ]} />

      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search by record, user, or change…"
        filterLabel="Module" filterValue={filter} onFilter={setFilter} filterOptions={entities}
        showExport={false}
      />

      <Card pad={0}>
        <div style={{ padding: "4px 0" }}>
          {f.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", color: T.muted, fontSize: 13 }}>No matching activity</div>
          )}
          {f.map((r, i) => (
            <div key={r.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
              borderBottom: i < f.length - 1 ? `1px solid ${T.lineSoft}` : "none",
            }}>
              <ActionDot action={r.action} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Cell2
                  primary={<>{r.entity} <span style={{ color: T.muted, fontWeight: 400 }}>{r.entityRef}</span> — {r.detail}</>}
                  secondary={`${r.user} · ${r.at}`}
                />
                {r.before && r.after && (
                  <div style={{ marginTop: 5, fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: T.red, textDecoration: "line-through" }}>{r.before}</span>
                    <span style={{ color: T.muted }}>→</span>
                    <span style={{ color: T.green }}>{r.after}</span>
                  </div>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                {r.action === "updated" && !r.undone && (
                  <button onClick={() => undo(r.id)} style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
                    background: T.card2, border: `1px solid ${T.line}`, borderRadius: 7, cursor: "pointer",
                    color: T.sub, fontSize: 12, fontWeight: 500,
                  }}>
                    <Undo2 size={13} /> Undo
                  </button>
                )}
                {r.undone && <Badge label="Reverted" color={T.blue} />}
                {r.action === "created" && <Badge label="Created" color={T.green} />}
                {r.action === "deleted" && <Badge label="Deleted" color={T.red} />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

function ActionDot({ action }: { action: Entry["action"] }) {
  const color = action === "created" ? T.green : action === "deleted" ? T.red : T.amber;
  return (
    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}1c`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {action === "created" ? <CheckCircle2 size={14} color={color} /> : <Undo2 size={14} color={color} style={{ transform: action === "deleted" ? "none" : "scaleX(-1)" }} />}
    </div>
  );
}
