import { useState } from "react";
import { ERPShell, DashboardTopbar, Card, CardHeader, T } from "../components/ERPShell";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

/* ============================================================
   DASHBOARD 1 — OWNER COMMAND CENTER
   ============================================================ */

const kpis = [
  { label: "Today's Revenue", value: "₹8,74,500", note: "vs Yesterday", spark: [30, 45, 38, 52, 48, 62, 70], color: T.green },
  { label: "Total Orders", value: "24", note: "vs Yesterday", delta: "+9.09%", up: true },
  { label: "Production Status", value: "18", note: "In Progress", sub: "6 Awaiting", subColor: T.amber },
  { label: "Dispatched Today", value: "12", note: "vs Yesterday", delta: "+15.38%", up: true },
  { label: "Outstanding Payments", value: "₹19,63,250", note: "Overdue", sub: "₹6,85,000", subColor: T.red, valueColor: T.red },
];

const timelineRows = [
  { line: "Corrugation Line 1", segs: [{ s: 8, e: 11, status: "done" }, { s: 11, e: 13.5, status: "prog" }] },
  { line: "Corrugation Line 2", segs: [{ s: 9, e: 12, status: "prog" }, { s: 14, e: 16, status: "pend" }] },
  { line: "Die Cut Machine 1", segs: [{ s: 10, e: 13, status: "done" }] },
  { line: "Flexo Printer", segs: [{ s: 13, e: 16.5, status: "prog" }] },
  { line: "Stitching Machine", segs: [{ s: 15, e: 17, status: "pend" }] },
];

const dispatchSchedule = [
  { time: "09:30", challan: "CH-4807", customer: "Ramesh Traders", vehicle: "KA01AB1234", status: "Dispatched" },
  { time: "11:00", challan: "CH-4808", customer: "Global Foods", vehicle: "KA05JS5678", status: "Dispatched" },
  { time: "13:30", challan: "CH-4809", customer: "FreshMart", vehicle: "KA03LM9012", status: "In Transit" },
  { time: "15:00", challan: "CH-4810", customer: "Bright Retail", vehicle: "KA02PQ2456", status: "Pending" },
  { time: "17:00", challan: "CH-4811", customer: "Super Pack", vehicle: "KA04RS7890", status: "Pending" },
];

const revenueVsTarget = [8, 10, 9, 13, 15, 14, 17, 16, 18, 17, 18.7];
const target = 25;

const orderStatus = [
  { label: "Confirmed", value: 24, pct: 37.5, color: T.blue },
  { label: "In Production", value: 18, pct: 28.1, color: T.purple },
  { label: "Completed", value: 14, pct: 21.9, color: T.green },
  { label: "Pending", value: 8, pct: 12.5, color: T.amber },
];

const topCustomers = [
  { name: "Ramesh Traders", revenue: 425600, pct: 100 },
  { name: "Global Foods", revenue: 315750, pct: 74 },
  { name: "FreshMart", revenue: 278900, pct: 66 },
  { name: "Bright Retail", revenue: 210300, pct: 49 },
  { name: "Super Pack", revenue: 185400, pct: 44 },
];

const lowStock = [
  { item: "Test Liner", gsm: 140, bf: 32, ply: "3 Ply", stock: 1240, min: 2000 },
  { item: "Corrugating Medium", gsm: 120, bf: 28, ply: "3 Ply", stock: 980, min: 1500 },
  { item: "Kraft Paper", gsm: 200, bf: 40, ply: "5 Ply", stock: 1100, min: 1500 },
];

const activity = [
  { text: "New Order ORD-1044 created", time: "30m ago" },
  { text: "Challan CH-4807 dispatched", time: "1h ago" },
  { text: "Payment received from Ramesh Traders ₹1,25,000", time: "2h ago" },
  { text: "Work Order WO-1258 completed", time: "3h ago" },
  { text: "Attendance marked for 28 employees", time: "4h ago" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 90, h = 30;
  const max = Math.max(...data), min = Math.min(...data);
  const step = w / (data.length - 1);
  const norm = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step},${norm(v)}`).join(" ");
  const area = `${path} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={area} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Dashboard1() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const totalOrders = orderStatus.reduce((s, o) => s + o.value, 0);
  const circumference = 2 * Math.PI * 48;
  let offset = 0;

  return (
    <ERPShell activePath="/">
      <DashboardTopbar title="Dashboard 1 – Owner Command Center" />
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* ===== KPI ROW ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          {kpis.map((k) => (
            <Card key={k.label}>
              <p style={{ fontSize: "11.5px", color: T.sub, margin: "0 0 8px", fontWeight: 600 }}>{k.label}</p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <span style={{ fontSize: "22px", fontWeight: 700, color: k.valueColor || T.ink }}>{k.value}</span>
                {k.spark && <Sparkline data={k.spark} color={T.green} />}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                {k.delta && (
                  <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "11.5px", fontWeight: 700, color: k.up ? T.green : T.red }}>
                    {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {k.delta}
                  </span>
                )}
                <span style={{ fontSize: "11.5px", color: T.sub }}>{k.note}</span>
                {k.sub && <span style={{ fontSize: "11.5px", fontWeight: 700, color: k.subColor, marginLeft: "auto" }}>{k.sub}</span>}
              </div>
            </Card>
          ))}
        </div>

        {/* ===== TIMELINE + DISPATCH SCHEDULE ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader
              title="Production Timeline (Live)"
              action={
                <div style={{ display: "flex", gap: "12px" }}>
                  {[{ l: "Completed", c: T.green }, { l: "In Progress", c: T.amber }, { l: "Pending", c: T.sub }].map((x) => (
                    <span key={x.l} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", color: T.sub }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "2px", background: x.c }} />
                      {x.l}
                    </span>
                  ))}
                </div>
              }
            />
            <div style={{ display: "flex", fontSize: "10px", color: T.sub, marginBottom: "6px", paddingLeft: "112px" }}>
              {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map((t) => (
                <span key={t} style={{ flex: 1 }}>{t}</span>
              ))}
            </div>
            {timelineRows.map((row) => (
              <div key={row.line} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ width: "112px", fontSize: "11.5px", color: T.ink, fontWeight: 500, flexShrink: 0 }}>{row.line}</span>
                <div style={{ flex: 1, position: "relative", height: "16px", background: T.page, borderRadius: "4px" }}>
                  {row.segs.map((seg, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${((seg.s - 8) / 10) * 100}%`,
                        width: `${((seg.e - seg.s) / 10) * 100}%`,
                        height: "100%",
                        borderRadius: "4px",
                        background: seg.status === "done" ? T.green : seg.status === "prog" ? T.amber : "#D1D5DB",
                        opacity: seg.status === "prog" ? 0.9 : 0.8,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Today's Dispatch Schedule" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Time", "Challan No.", "Customer", "Status"].map((h) => (
                    <th key={h} style={{ fontSize: "10.5px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 0 8px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dispatchSchedule.map((d, i) => (
                  <tr key={d.challan} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)} style={{ background: hoveredRow === i ? T.page : "transparent" }}>
                    <td style={{ fontSize: "11.5px", color: T.sub, padding: "7px 0" }}>{d.time}</td>
                    <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "7px 0" }}>{d.challan}</td>
                    <td style={{ fontSize: "11.5px", color: T.ink, padding: "7px 0" }}>{d.customer}</td>
                    <td style={{ padding: "7px 0" }}>
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background:
                            d.status === "Dispatched" ? "#DCFCE7" : d.status === "In Transit" ? "#FEF3C7" : "#F3F4F6",
                          color: d.status === "Dispatched" ? T.green : d.status === "In Transit" ? T.amber : T.sub,
                        }}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* ===== REVENUE VS TARGET + ORDER STATUS + TOP CUSTOMERS ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.9fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Revenue vs Target (This Month)" action={<span style={{ fontSize: "11px", color: T.sub }}>Target: ₹25,00,000</span>} />
            <p style={{ fontSize: "22px", fontWeight: 700, color: T.ink, margin: "0 0 4px" }}>₹18,74,500</p>
            <div style={{ width: "100%", height: "6px", background: T.page, borderRadius: "4px", marginBottom: "4px" }}>
              <div style={{ width: "74.98%", height: "100%", background: T.green, borderRadius: "4px" }} />
            </div>
            <p style={{ fontSize: "11px", color: T.sub, margin: "0 0 12px" }}>74.98%</p>
            <svg viewBox="0 0 300 90" style={{ width: "100%", height: "90px" }}>
              {(() => {
                const w = 300, h = 90, max = target;
                const step = w / (revenueVsTarget.length - 1);
                const pts = revenueVsTarget.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (v / max) * h}`).join(" ");
                const area = `${pts} L ${w},${h} L 0,${h} Z`;
                return (
                  <>
                    <path d={area} fill={T.blue} opacity="0.08" />
                    <path d={pts} fill="none" stroke={T.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              })()}
            </svg>
          </Card>

          <Card>
            <CardHeader title="Order Status" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <svg viewBox="0 0 120 120" style={{ width: "130px", height: "130px", transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#F1F2F5" strokeWidth="14" />
                {orderStatus.map((o) => {
                  const len = (o.pct / 100) * circumference;
                  const seg = (
                    <circle
                      key={o.label}
                      cx="60" cy="60" r="48" fill="none" stroke={o.color} strokeWidth="14"
                      strokeDasharray={`${len} ${circumference}`} strokeDashoffset={-offset} strokeLinecap="butt"
                    />
                  );
                  offset += len;
                  return seg;
                })}
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: T.sub }}>Total</span>
                <span style={{ fontSize: "22px", fontWeight: 700, color: T.ink }}>{totalOrders}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
              {orderStatus.map((o) => (
                <div key={o.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: o.color }} />
                  <span style={{ fontSize: "11px", color: T.sub, flex: 1 }}>{o.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: T.ink }}>{o.value} ({o.pct}%)</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Top Customers (This Month)" />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "10.5px", color: T.sub, fontWeight: 600 }}>Customer</span>
              <span style={{ fontSize: "10.5px", color: T.sub, fontWeight: 600 }}>Revenue</span>
            </div>
            {topCustomers.map((c) => (
              <div key={c.name} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11.5px", color: T.ink }}>{c.name}</span>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: T.ink }}>₹{c.revenue.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ width: "100%", height: "5px", background: T.page, borderRadius: "3px" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: T.green, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ===== LOW STOCK + CASH BOOK + ACTIVITY ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Low Stock Reels" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Item", "GSM", "BF", "Ply", "Stock (Kgs)", "Min Stock"].map((h) => (
                    <th key={h} style={{ fontSize: "10px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 6px 8px 0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStock.map((r) => (
                  <tr key={r.item}>
                    <td style={{ fontSize: "11px", color: T.ink, fontWeight: 600, padding: "6px 6px 6px 0" }}>{r.item}</td>
                    <td style={{ fontSize: "11px", color: T.sub, padding: "6px 6px 6px 0" }}>{r.gsm}</td>
                    <td style={{ fontSize: "11px", color: T.sub, padding: "6px 6px 6px 0" }}>{r.bf}</td>
                    <td style={{ fontSize: "11px", color: T.sub, padding: "6px 6px 6px 0" }}>{r.ply}</td>
                    <td style={{ fontSize: "11px", fontWeight: 700, color: T.red, padding: "6px 6px 6px 0" }}>{r.stock.toLocaleString()}</td>
                    <td style={{ fontSize: "11px", color: T.sub, padding: "6px 6px 6px 0" }}>{r.min.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHeader title="Cash Book Summary" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              <div>
                <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 2px" }}>Bank Balance</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: T.ink, margin: 0 }}>₹32,45,670</p>
              </div>
              <div>
                <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 2px" }}>Cash in Hand</p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: T.ink, margin: 0 }}>₹1,25,430</p>
              </div>
            </div>
            <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 10px" }}>Today's Transactions: 56</p>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: `1px solid ${T.border}` }}>
              <div>
                <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 2px" }}>Today's Receipts</p>
                <p style={{ fontSize: "14px", fontWeight: 700, color: T.green, margin: 0 }}>₹9,25,000</p>
              </div>
              <div>
                <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 2px" }}>Today's Payments</p>
                <p style={{ fontSize: "14px", fontWeight: 700, color: T.red, margin: 0 }}>₹4,51,200</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent Activity" action={<span style={{ fontSize: "11px", color: T.blue, display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>View All <ChevronRight size={12} /></span>} />
            {activity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: i < activity.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.blue, flexShrink: 0 }} />
                <span style={{ fontSize: "11.5px", color: T.ink, flex: 1 }}>{a.text}</span>
                <span style={{ fontSize: "10.5px", color: T.sub, flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </ERPShell>
  );
}
