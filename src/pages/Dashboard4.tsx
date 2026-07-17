import { ERPShell, DashboardTopbar, Card, CardHeader, T } from "../components/ERPShell";
import { TrendingUp, ChevronRight } from "lucide-react";

/* ============================================================
   DASHBOARD 4 — BUSINESS ANALYTICS
   ============================================================ */

const kpis = [
  { label: "Monthly Revenue", value: "₹18,74,500", note: "vs Last Month", delta: "12.49%" },
  { label: "Monthly Profit", value: "₹4,25,300", note: "vs Last Month", delta: "8.35%" },
  { label: "Total Orders", value: "64", note: "vs Last Month", delta: "9.68%" },
  { label: "Avg Order Value", value: "₹29,289", note: "vs Last Month", delta: "2.15%" },
];

const revenueTrend = [11, 14, 12, 16, 15, 13, 17, 16, 15, 18, 17, 18.7];
const revenueMonths = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const productMix = [
  { label: "3 Ply Boxes", pct: 38.5, color: T.blue },
  { label: "5 Ply Boxes", pct: 32.2, color: T.cyan },
  { label: "7 Ply Boxes", pct: 18.7, color: T.pink },
  { label: "Other Products", pct: 10.6, color: T.amber },
];
const totalRevenue = "₹18.74L";

const topCustomers = [
  { name: "Ramesh Traders", revenue: "₹4,25,600", orders: 14 },
  { name: "Global Foods", revenue: "₹3,15,750", orders: 10 },
  { name: "FreshMart", revenue: "₹2,78,900", orders: 9 },
  { name: "Bright Retail", revenue: "₹2,10,300", orders: 7 },
  { name: "Super Pack", revenue: "₹1,85,400", orders: 6 },
];

const receivables = [
  { label: "0 - 30 Days", pct: 40, amount: "₹7,85,500", color: T.blue },
  { label: "31 - 60 Days", pct: 31, amount: "₹6,10,100", color: T.purple },
  { label: "61 - 90 Days", pct: 17, amount: "₹3,25,100", color: T.amber },
  { label: "> 90 Days", pct: 12, amount: "₹2,43,100", color: T.red },
];
const receivablesTotal = "₹19.63L";

const dispatchPerf = { onTime: 92.5, delayed: 7.5, totalDispatches: 78 };

const payrollCost = "₹6,85,430";

const cashFlow = { inflow: "₹25,40,600", outflow: "₹18,55,200" };

const dailySales = [
  { day: "09 Jul", value: 131000 },
  { day: "10 Jul", value: 186000 },
  { day: "11 Jul", value: 164000 },
  { day: "12 Jul", value: 211000 },
  { day: "13 Jul", value: 171000 },
  { day: "14 Jul", value: 231000 },
  { day: "15 Jul", value: 211000 },
];

const grossMargin = { value: "22.68%", delta: "1.35%" };

export default function Dashboard4() {
  const circumference = 2 * Math.PI * 42;
  let offsetA = 0;
  let offsetB = 0;

  return (
    <ERPShell activePath="/reports">
      <DashboardTopbar title="Dashboard 4 – Business Analytics" />
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* ===== KPI ROW ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {kpis.map((k) => (
            <Card key={k.label}>
              <p style={{ fontSize: "11.5px", color: T.sub, margin: "0 0 8px", fontWeight: 600 }}>{k.label}</p>
              <p style={{ fontSize: "22px", fontWeight: 700, color: T.ink, margin: "0 0 6px" }}>{k.value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "11.5px", fontWeight: 700, color: T.green }}>
                  <TrendingUp size={12} /> {k.delta}
                </span>
                <span style={{ fontSize: "11px", color: T.sub }}>{k.note}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* ===== REVENUE TREND + PRODUCT MIX ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Revenue Trend (Last 12 Months)" />
            <svg viewBox="0 0 560 180" style={{ width: "100%", height: "180px" }}>
              {(() => {
                const w = 560, h = 150, max = 25;
                const step = w / (revenueTrend.length - 1);
                const pts = revenueTrend.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (v / max) * h}`).join(" ");
                const area = `${pts} L ${w},${h} L 0,${h} Z`;
                return (
                  <>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1={0} x2={w} y1={(h / 4) * i} y2={(h / 4) * i} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                    ))}
                    <path d={area} fill={T.blue} opacity="0.08" />
                    <path d={pts} fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {revenueTrend.map((v, i) => (
                      <circle key={i} cx={i * step} cy={h - (v / max) * h} r="3" fill={T.blue} />
                    ))}
                    {revenueMonths.map((m, i) => (
                      <text key={m} x={i * step} y={h + 20} fontSize="10.5" fill={T.sub} textAnchor={i === 0 ? "start" : i === revenueMonths.length - 1 ? "end" : "middle"}>{m}</text>
                    ))}
                  </>
                );
              })()}
            </svg>
          </Card>

          <Card>
            <CardHeader title="Product Mix (By Revenue)" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: "12px" }}>
              <svg viewBox="0 0 110 110" style={{ width: "120px", height: "120px", transform: "rotate(-90deg)" }}>
                <circle cx="55" cy="55" r="42" fill="none" stroke="#F1F2F5" strokeWidth="13" />
                {productMix.map((p) => {
                  const len = (p.pct / 100) * circumference;
                  const seg = (
                    <circle key={p.label} cx="55" cy="55" r="42" fill="none" stroke={p.color} strokeWidth="13" strokeDasharray={`${len} ${circumference}`} strokeDashoffset={-offsetA} />
                  );
                  offsetA += len;
                  return seg;
                })}
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: T.ink }}>{totalRevenue}</span>
                <span style={{ fontSize: "9.5px", color: T.sub }}>Total</span>
              </div>
            </div>
            {productMix.map((p) => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: p.color }} />
                <span style={{ fontSize: "11px", color: T.sub, flex: 1 }}>{p.label}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: T.ink }}>{p.pct}%</span>
              </div>
            ))}
          </Card>
        </div>

        {/* ===== TOP CUSTOMERS + RECEIVABLES + DISPATCH PERF ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.9fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Top Customers (By Revenue)" action={<span style={{ fontSize: "11px", color: T.blue, display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>View All <ChevronRight size={12} /></span>} />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Customer", "Revenue", "Orders"].map((h) => (
                    <th key={h} style={{ fontSize: "10.5px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 8px 8px 0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={c.name} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "8px 8px 8px 0" }}>{c.name}</td>
                    <td style={{ fontSize: "11.5px", color: T.ink, padding: "8px 8px 8px 0" }}>{c.revenue}</td>
                    <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 8px 8px 0" }}>{c.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHeader title="Outstanding Receivables" />
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: "100px", height: "100px", transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F2F5" strokeWidth="12" />
                  {receivables.map((r) => {
                    const circ = 2 * Math.PI * 38;
                    const len = (r.pct / 100) * circ;
                    const seg = (
                      <circle key={r.label} cx="50" cy="50" r="38" fill="none" stroke={r.color} strokeWidth="12" strokeDasharray={`${len} ${circ}`} strokeDashoffset={-offsetB} />
                    );
                    offsetB += len;
                    return seg;
                  })}
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: T.ink }}>{receivablesTotal}</span>
                  <span style={{ fontSize: "8.5px", color: T.sub }}>Total</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {receivables.map((r) => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: r.color }} />
                    <span style={{ fontSize: "10.5px", color: T.sub }}>{r.label} ({r.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Dispatch Performance (This Month)" />
            <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 4px" }}>On Time</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: T.green, margin: "0 0 6px" }}>{dispatchPerf.onTime}%</p>
            <div style={{ width: "100%", height: "6px", background: T.page, borderRadius: "3px", marginBottom: "12px" }}>
              <div style={{ width: `${dispatchPerf.onTime}%`, height: "100%", background: T.green, borderRadius: "3px" }} />
            </div>
            <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 4px" }}>Delayed</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: T.red, margin: "0 0 6px" }}>{dispatchPerf.delayed}%</p>
            <div style={{ width: "100%", height: "6px", background: T.page, borderRadius: "3px", marginBottom: "12px" }}>
              <div style={{ width: `${dispatchPerf.delayed}%`, height: "100%", background: T.red, borderRadius: "3px" }} />
            </div>
            <p style={{ fontSize: "11px", color: T.sub, margin: 0 }}>Total Dispatches: <strong style={{ color: T.ink }}>{dispatchPerf.totalDispatches}</strong></p>
          </Card>
        </div>

        {/* ===== PAYROLL + CASH FLOW + DAILY SALES + MARGIN ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 0.9fr 1.3fr 0.8fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Payroll Cost (This Month)" />
            <p style={{ fontSize: "22px", fontWeight: 700, color: T.ink, margin: 0 }}>{payrollCost}</p>
            <span style={{ fontSize: "11px", color: T.sub }}>vs Last Month</span>
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: T.green, marginLeft: "6px" }}>+6.25%</span>
          </Card>

          <Card>
            <CardHeader title="Cash Flow (This Month)" />
            <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 2px" }}>Inflow</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: T.green, margin: "0 0 8px" }}>{cashFlow.inflow}</p>
            <p style={{ fontSize: "10.5px", color: T.sub, margin: "0 0 2px" }}>Outflow</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: T.red, margin: 0 }}>{cashFlow.outflow}</p>
          </Card>

          <Card>
            <CardHeader title="Daily Sales (Last 7 Days)" />
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "90px" }}>
              {dailySales.map((d) => {
                const max = Math.max(...dailySales.map((x) => x.value));
                return (
                  <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "9px", color: T.sub, marginBottom: "4px" }}>{(d.value / 100000).toFixed(1)}L</span>
                    <div style={{ width: "100%", height: `${(d.value / max) * 65}px`, background: T.blue, opacity: 0.8, borderRadius: "4px 4px 0 0" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              {dailySales.map((d) => (
                <span key={d.day} style={{ flex: 1, fontSize: "9.5px", color: T.sub, textAlign: "center" }}>{d.day}</span>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Gross Profit Margin" />
            <p style={{ fontSize: "22px", fontWeight: 700, color: T.ink, margin: "0 0 6px" }}>{grossMargin.value}</p>
            <span style={{ fontSize: "11px", color: T.sub }}>vs Last Month</span>
            <div>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: T.green }}>+{grossMargin.delta}</span>
            </div>
          </Card>
        </div>
      </div>
    </ERPShell>
  );
}
