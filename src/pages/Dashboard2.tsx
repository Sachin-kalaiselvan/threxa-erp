import { useState } from "react";
import { ERPShell, DashboardTopbar, Card, CardHeader, T } from "../components/ERPShell";
import { ChevronRight } from "lucide-react";

/* ============================================================
   DASHBOARD 2 — PRODUCTION CONTROL ROOM
   ============================================================ */

const kpis = [
  { label: "Machines Running", value: "5 / 8", note: "", progress: 62.5 },
  { label: "Work Orders", value: "18", note: "In Progress" },
  { label: "Capacity Utilization", value: "73%", note: "", progress: 73 },
  { label: "Today's Output", value: "24,560", note: "Sq. Ft." },
  { label: "Rejection Rate", value: "2.35%", note: "vs Yesterday", delta: "0.45%", up: false },
];

const kanban = {
  pending: [
    { wo: "WO-1261", customer: "Good Foods", qty: "5,000 Sq. Ft.", due: "16 Jul" },
    { wo: "WO-1262", customer: "Bright Retail", qty: "3,200 Sq. Ft.", due: "16 Jul" },
    { wo: "WO-1263", customer: "Super Pack", qty: "4,500 Sq. Ft.", due: "17 Jul" },
  ],
  inProgress: [
    { wo: "WO-1258", customer: "Ramesh Traders", qty: "7,600 Sq. Ft.", pct: 60 },
    { wo: "WO-1259", customer: "FreshMart", qty: "6,000 Sq. Ft.", pct: 45 },
    { wo: "WO-1260", customer: "ABC Industries", qty: "8,000 Sq. Ft.", pct: 73 },
  ],
  completed: [
    { wo: "WO-1255", customer: "Global Foods", qty: "5,000 Sq. Ft.", pct: 100 },
    { wo: "WO-1256", customer: "Bright Retail", qty: "3,300 Sq. Ft.", pct: 100 },
    { wo: "WO-1257", customer: "Super Pack", qty: "4,500 Sq. Ft.", pct: 100 },
  ],
};

const machineLoad = [
  { name: "Corrugation Line 1", pct: 78 },
  { name: "Corrugation Line 2", pct: 65 },
  { name: "Die Cut Machine 1", pct: 82 },
  { name: "Flexo Printer", pct: 60 },
  { name: "Stitching Machine", pct: 45 },
  { name: "Slotting Machine", pct: 50 },
  { name: "Pasting Machine", pct: 30 },
  { name: "Tube Cutting Machine", pct: 20 },
];

const progressPlanned = [0, 6, 13, 19, 26, 32];
const progressActual = [0, 5, 11, 18, 22, 24.56];
const progressTimes = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

const todaysSummary = [
  { label: "Planned Output", value: "32,000 Sq.Ft." },
  { label: "Actual Output", value: "24,560 Sq.Ft." },
  { label: "Pending Output", value: "7,440 Sq.Ft." },
  { label: "Avg. Production/Hr", value: "2,730 Sq.Ft." },
];

const pendingQC = [
  { wo: "WO-1258", item: "5 Ply Box", qty: 1200 },
  { wo: "WO-1259", item: "3 Ply Box", qty: 1000 },
  { wo: "WO-1260", item: "7 Ply Box", qty: 1500 },
  { wo: "WO-1261", item: "5 Ply Box", qty: 800 },
];

const completedToday = [
  { wo: "WO-1255", customer: "Global Foods", item: "5 Ply Box", qty: "5,000", time: "08:15 AM", operator: "Ramesh" },
  { wo: "WO-1256", customer: "Bright Retail", item: "3 Ply Box", qty: "3,300", time: "10:40 AM", operator: "Mahesh" },
  { wo: "WO-1257", customer: "Super Pack", item: "5 Ply Box", qty: "4,500", time: "12:20 PM", operator: "Suresh" },
];

export default function Dashboard2() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <ERPShell activePath="/production">
      <DashboardTopbar title="Dashboard 2 – Production Control Room" />
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* ===== KPI ROW ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          {kpis.map((k) => (
            <Card key={k.label}>
              <p style={{ fontSize: "11.5px", color: T.sub, margin: "0 0 8px", fontWeight: 600 }}>{k.label}</p>
              <p style={{ fontSize: "22px", fontWeight: 700, color: T.ink, margin: "0 0 6px" }}>{k.value}</p>
              {k.progress !== undefined ? (
                <div style={{ width: "100%", height: "5px", background: T.page, borderRadius: "3px" }}>
                  <div style={{ width: `${k.progress}%`, height: "100%", background: T.purple, borderRadius: "3px" }} />
                </div>
              ) : k.delta ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: k.up ? T.green : T.green }}>▼ {k.delta}</span>
                  <span style={{ fontSize: "11px", color: T.sub }}>{k.note}</span>
                </div>
              ) : (
                <span style={{ fontSize: "11px", color: T.sub }}>{k.note}</span>
              )}
            </Card>
          ))}
        </div>

        {/* ===== KANBAN + MACHINE LOAD ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Production Queue (Kanban)" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              {[
                { title: `Pending (${kanban.pending.length})`, items: kanban.pending, color: T.sub },
                { title: `In Progress (${kanban.inProgress.length})`, items: kanban.inProgress, color: T.amber },
                { title: `Completed (${kanban.completed.length})`, items: kanban.completed, color: T.green },
              ].map((col) => (
                <div key={col.title}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: col.color, margin: "0 0 8px" }}>{col.title}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {col.items.map((item: any) => (
                      <div key={item.wo} style={{ background: T.page, borderRadius: "8px", padding: "10px" }}>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: T.ink, margin: "0 0 3px" }}>{item.wo}</p>
                        <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 3px" }}>{item.customer}</p>
                        <p style={{ fontSize: "10px", color: T.sub, margin: "0 0 6px" }}>{item.qty}</p>
                        {item.pct !== undefined ? (
                          <div style={{ width: "100%", height: "4px", background: "#E5E7EB", borderRadius: "2px" }}>
                            <div style={{ width: `${item.pct}%`, height: "100%", background: item.pct === 100 ? T.green : T.amber, borderRadius: "2px" }} />
                          </div>
                        ) : (
                          <p style={{ fontSize: "10px", color: T.sub, margin: 0 }}>Due: {item.due}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Machine Load" action={<span style={{ fontSize: "10px", color: T.sub, display: "flex", gap: "24px" }}><span>0%</span><span>50%</span><span>100%</span></span>} />
            {machineLoad.map((m) => (
              <div key={m.name} style={{ marginBottom: "9px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "11px", color: T.ink }}>{m.name}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: T.ink }}>{m.pct}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: T.page, borderRadius: "3px" }}>
                  <div style={{ width: `${m.pct}%`, height: "100%", background: T.purple, borderRadius: "3px", opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ===== PROGRESS CHART + SUMMARY + PENDING QC ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr 0.9fr", gap: "14px" }}>
          <Card>
            <CardHeader
              title="Production Progress (Today)"
              action={
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontSize: "10.5px", color: T.sub, display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "12px", height: "0", borderTop: `2px dashed ${T.sub}` }} /> Planned (Sq. Ft.)
                  </span>
                  <span style={{ fontSize: "10.5px", color: T.purple, display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "12px", height: "2px", background: T.purple }} /> Actual (Sq. Ft.)
                  </span>
                </div>
              }
            />
            <svg viewBox="0 0 400 160" style={{ width: "100%", height: "160px" }}>
              {(() => {
                const w = 400, h = 140, max = 34;
                const step = w / (progressPlanned.length - 1);
                const plannedPts = progressPlanned.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (v / max) * h}`).join(" ");
                const actualPts = progressActual.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (v / max) * h}`).join(" ");
                const area = `${actualPts} L ${w},${h} L 0,${h} Z`;
                return (
                  <>
                    {[0, 1, 2, 3].map((i) => (
                      <line key={i} x1={0} x2={w} y1={(h / 3) * i} y2={(h / 3) * i} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                    ))}
                    <path d={area} fill={T.purple} opacity="0.08" />
                    <path d={plannedPts} fill="none" stroke={T.sub} strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d={actualPts} fill="none" stroke={T.purple} strokeWidth="2.5" strokeLinecap="round" />
                    {progressTimes.map((t, i) => (
                      <text key={t} x={i * step} y={h + 18} fontSize="10" fill={T.sub} textAnchor={i === 0 ? "start" : i === progressTimes.length - 1 ? "end" : "middle"}>{t}</text>
                    ))}
                  </>
                );
              })()}
            </svg>
          </Card>

          <Card>
            <CardHeader title="Today's Summary" />
            {todaysSummary.map((s) => (
              <div key={s.label} style={{ marginBottom: "12px" }}>
                <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 3px" }}>{s.label}</p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: T.ink, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Pending QC" action={<span style={{ fontSize: "11px", color: T.blue, display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>View All <ChevronRight size={12} /></span>} />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["WO No.", "Item", "Qty (Sq.Ft.)"].map((h) => (
                    <th key={h} style={{ fontSize: "10px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 4px 6px 0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingQC.map((q) => (
                  <tr key={q.wo}>
                    <td style={{ fontSize: "11px", color: T.ink, fontWeight: 600, padding: "5px 4px 5px 0" }}>{q.wo}</td>
                    <td style={{ fontSize: "11px", color: T.sub, padding: "5px 4px 5px 0" }}>{q.item}</td>
                    <td style={{ fontSize: "11px", color: T.ink, padding: "5px 4px 5px 0" }}>{q.qty.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* ===== COMPLETED ORDERS TODAY ===== */}
        <Card>
          <CardHeader title="Completed Orders Today" />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["WO No.", "Customer", "Item", "Qty (Sq.Ft.)", "Completed At", "Operator"].map((h) => (
                  <th key={h} style={{ fontSize: "10.5px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 12px 8px 0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completedToday.map((c, i) => (
                <tr key={c.wo} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ background: hoveredRow === i ? T.page : "transparent" }}>
                  <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "8px 12px 8px 0" }}>{c.wo}</td>
                  <td style={{ fontSize: "11.5px", color: T.ink, padding: "8px 12px 8px 0" }}>{c.customer}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 12px 8px 0" }}>{c.item}</td>
                  <td style={{ fontSize: "11.5px", color: T.ink, padding: "8px 12px 8px 0" }}>{c.qty}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 12px 8px 0" }}>{c.time}</td>
                  <td style={{ fontSize: "11.5px", color: T.ink, padding: "8px 12px 8px 0" }}>{c.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </ERPShell>
  );
}
