import { useState } from "react";
import {
  Search, Bell, TrendingUp, TrendingDown,
  BarChart3, ShoppingCart, Zap, Truck,
  AlertTriangle, Users, Package, DollarSign,
  Activity, CheckCircle2, Clock,
} from "lucide-react";

/* ── design tokens ───────────────────────────── */
const C = {
  bg:      "#0A0B14",
  surface: "#111220",
  surface2:"#161727",
  line:    "rgba(255,255,255,0.06)",
  text:    "#D8D9EE",
  muted:   "#5C5E80",
  sub:     "#8A8CB8",
  accent:  "#7B68FF",
  green:   "#34D399",
  red:     "#F87171",
  amber:   "#FBBF24",
  blue:    "#60A5FA",
};

/* ── primitives ──────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, ...style }}>
      {children}
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: `${color}22`, color }}>
      {label}
    </span>
  );
}

/* ── sparkline ───────────────────────────────── */
function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values), min = Math.min(...values), range = max - min || 1;
  const W = 80, H = 28;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── KPI card ────────────────────────────────── */
function KPICard({ label, value, delta, up, spark, color, icon: Icon }:
  { label: string; value: string; delta: string; up: boolean; spark: number[]; color: string; icon: any }) {
  return (
    <Card style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={15} color={color} />
            </div>
            <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>{label}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>{value}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
            {up ? <TrendingUp size={12} color={C.green} /> : <TrendingDown size={12} color={C.red} />}
            <span style={{ fontSize: 12, color: up ? C.green : C.red, fontWeight: 600 }}>{delta}</span>
          </div>
        </div>
        <Spark values={spark} color={color} />
      </div>
    </Card>
  );
}

/* ── revenue line chart ──────────────────────── */
function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const [hover, setHover] = useState<number | null>(null);
  if (!data.length) return null;
  const max = Math.max(...data) * 1.1;
  const W = 700, H = 180, PL = 48, PR = 16, PT = 8, PB = 24;
  const iW = W - PL - PR, iH = H - PT - PB;
  const px = (i: number) => PL + (i / (data.length - 1)) * iW;
  const py = (v: number) => PT + iH - (v / max) * iH;
  const pts = data.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const area = `${pts} ${px(data.length-1)},${PT+iH} ${PL},${PT+iH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => max * t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block", overflow: "visible" }}
      onMouseLeave={() => setHover(null)}>
      <defs>
        <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid */}
      {ticks.map((v) => {
        const y = py(v);
        const fmt = v >= 100 ? `${(v/100).toFixed(0)}Cr` : v >= 1 ? `${v.toFixed(0)}L` : "0";
        return (
          <g key={v}>
            <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={C.line} strokeWidth="1" />
            <text x={PL-8} y={y+4} textAnchor="end" fontSize="11" fill={C.muted}>{fmt}</text>
          </g>
        );
      })}

      {/* area + line */}
      <path d={area} fill="url(#aFill)" />
      <polyline points={pts} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* hover zones */}
      {data.map((v, i) => (
        <rect key={i} x={px(i) - iW/data.length/2} y={PT} width={iW/data.length} height={iH}
          fill="transparent" style={{ cursor: "crosshair" }}
          onMouseEnter={() => setHover(i)} />
      ))}

      {/* dots + tooltip */}
      {data.map((v, i) => (
        <g key={i}>
          <circle cx={px(i)} cy={py(v)} r={hover === i ? 5 : 3} fill={hover === i ? "#fff" : C.accent}
            stroke={C.accent} strokeWidth="2" style={{ transition: "r .1s" }} />
          {hover === i && (
            <g>
              <rect x={px(i)-34} y={py(v)-32} width={68} height={22} rx="5" fill={C.surface2} stroke={C.line} strokeWidth="1" />
              <text x={px(i)} y={py(v)-17} textAnchor="middle" fontSize="11" fontWeight="600" fill={C.text}>
                {v >= 100 ? `₹${(v/100).toFixed(1)}Cr` : `₹${v.toFixed(1)}L`}
              </text>
            </g>
          )}
        </g>
      ))}

      {/* x labels */}
      {labels.map((l, i) => (
        <text key={l} x={px(i)} y={H-2} textAnchor="middle" fontSize="11" fill={C.muted}>{l}</text>
      ))}
    </svg>
  );
}

/* ── insight row ─────────────────────────────── */
function Insight({ icon: Icon, tint, title, sub }: { icon: any; tint: string; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${tint}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <Icon size={14} color={tint} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{title}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

/* ── data table row ──────────────────────────── */
function TRow({ cells, lastRow }: { cells: React.ReactNode[]; lastRow?: boolean }) {
  return (
    <tr style={{ borderBottom: lastRow ? "none" : `1px solid ${C.line}` }}>
      {cells.map((c, i) => (
        <td key={i} style={{ padding: "10px 14px", fontSize: 13, color: C.sub, verticalAlign: "middle", whiteSpace: "nowrap" }}>{c}</td>
      ))}
    </tr>
  );
}

function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map(c => (
          <th key={c} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.05em", borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{c.toUpperCase()}</th>
        ))}
      </tr>
    </thead>
  );
}

/* ═══════════════ DASHBOARD ════════════════════ */
export default function Dashboard() {
  const [tab, setTab]     = useState<"overview"|"production"|"inventory"|"analytics">("overview");
  const [period, setPeriod] = useState<"Day"|"Week"|"Month">("Week");
  const [search, setSearch] = useState("");

  const hour = new Date().getHours();
  const grt  = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const PERIODS = {
    Day: {
      data:   [1.2, 1.8, 1.4, 2.1, 1.9, 2.6, 3.1, 2.8, 3.4],
      labels: ["09", "10", "11", "12", "13", "14", "15", "16", "17"],
      total: "₹3,40,800", delta: "+6.8% vs yesterday", up: true,
    },
    Week: {
      data:   [1.2, 2.1, 2.6, 3.0, 2.8, 2.9, 2.85, 3.1, 4.6],
      labels: ["Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15"],
      total: "₹4,20,90.20", delta: "+14.3% vs last week", up: true,
    },
    Month: {
      data:   [180, 200, 220, 205, 240, 260, 255, 290, 340],
      labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      total: "₹18.74L", delta: "+12.4% vs last month", up: true,
    },
  };
  const chartData = PERIODS[period];

  const TABS = [
    { id: "overview",    label: "Command Centre" },
    { id: "production",  label: "Production" },
    { id: "inventory",   label: "Inventory" },
    { id: "analytics",   label: "Analytics" },
  ] as const;

  /* ── OVERVIEW ─────────────────────────────── */
  const overview = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
        <KPICard label="Revenue" value="₹4.2 Cr" delta="+14.3%" up spark={[1.2,1.8,2.1,2.6,3.0,4.6]} color={C.accent} icon={BarChart3} />
        <KPICard label="Orders" value="127" delta="+8.2%" up spark={[40,55,48,62,70,80,127]} color={C.blue} icon={ShoppingCart} />
        <KPICard label="Production" value="24,560" delta="+5.1%" up spark={[18,20,19,22,21,24]} color={C.green} icon={Zap} />
        <KPICard label="Dispatched" value="42" delta="+3 today" up spark={[28,31,29,34,38,42]} color={C.amber} icon={Truck} />
        <KPICard label="Outstanding" value="₹19.6L" delta="-3.2%" up={false} spark={[22,20,21,19,20,19.6]} color={C.red} icon={AlertTriangle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12, marginBottom: 16 }}>

        {/* Revenue chart */}
        <Card style={{ padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Revenue Overview</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>{chartData.total}</span>
                <span style={{ fontSize: 12, color: chartData.up ? C.green : C.red, fontWeight: 600 }}>{chartData.delta}</span>
              </div>
            </div>
            <div style={{ display: "flex", borderRadius: 7, overflow: "hidden", border: `1px solid ${C.line}` }}>
              {(["Day","Week","Month"] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: "5px 14px", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer",
                  background: period === p ? C.accent : C.surface2,
                  color: period === p ? "#fff" : C.muted,
                  transition: "all .12s",
                }}>{p}</button>
              ))}
            </div>
          </div>
          <LineChart data={chartData.data} labels={chartData.labels} />
        </Card>

        {/* AI Insights */}
        <Card style={{ padding: "18px 18px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Insights</span>
            <span style={{ fontSize: 11, color: C.accent, cursor: "pointer" }}>View all</span>
          </div>
          <Insight icon={TrendingUp}    tint={C.green} title="Revenue up 14.3%"          sub="Compared to last week" />
          <Insight icon={AlertTriangle} tint={C.red}   title="3 invoices overdue"         sub="Total ₹2,45,000 — action needed" />
          <Insight icon={Package}       tint={C.amber} title="Inventory running low"      sub="12 items below reorder level" />
          <Insight icon={Users}         tint={C.blue}  title="7 new leads this week"      sub="+22% vs last week" />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {/* Top Products */}
        <Card>
          <div style={{ padding: "14px 14px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Top Products</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <THead cols={["Product", "Revenue", "Δ"]} />
            <tbody>
              {[["5 Ply Corrugated Box","₹88,900","+8.3%",true],["3 Ply Corrugated Box","₹83,000","+6.2%",true],["Duplex Board Box","₹68,900","+9.3%",true]].map(([n,v,d,up],i,arr) => (
                <TRow key={n as string} lastRow={i===arr.length-1} cells={[
                  <span style={{ color: C.text, fontWeight: 500 }}>{n}</span>,
                  <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>,
                  <span style={{ color: up ? C.green : C.red, fontWeight: 600 }}>{d}</span>,
                ]} />
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent transactions */}
        <Card>
          <div style={{ padding: "14px 14px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Recent Transactions</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <THead cols={["Invoice", "Amount", "Status"]} />
            <tbody>
              {[["INV-10023","₹45,000","Paid",C.green],["INV-10022","₹32,500","Pending",C.amber],["INV-10021","₹18,900","Paid",C.green]].map(([id,v,s,c],i,arr) => (
                <TRow key={id as string} lastRow={i===arr.length-1} cells={[
                  <span style={{ color: C.sub }}>{id}</span>,
                  <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>,
                  <Badge label={s as string} color={c as string} />,
                ]} />
              ))}
            </tbody>
          </table>
        </Card>

        {/* Machine status */}
        <Card style={{ padding: "14px 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>Machine Status</div>
          {[["Corrugation Line 1",85,C.green],["Die Cut Machine 1",72,C.blue],["Flexo Printer",61,C.amber],["Stitching Machine",44,C.red]].map(([n,v,c]) => (
            <div key={n as string} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.sub }}>{n}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c as string }}>{v}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${v}%`, borderRadius: 99, background: c as string, transition: "width .3s ease" }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );

  /* ── PRODUCTION ──────────────────────────── */
  const production = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
        <KPICard label="Machines Active" value="5 / 8" delta="62.5%" up spark={[5,6,5,6,5,5]} color={C.accent} icon={Activity} />
        <KPICard label="Work Orders" value="18" delta="+5%" up spark={[12,14,15,16,17,18]} color={C.blue} icon={CheckCircle2} />
        <KPICard label="Capacity" value="73%" delta="+3%" up spark={[65,68,70,71,72,73]} color={C.green} icon={Zap} />
        <KPICard label="Output Today" value="24,560 Sq.Ft." delta="+8%" up spark={[18,20,21,22,23,24.5]} color={C.amber} icon={BarChart3} />
        <KPICard label="Rejection Rate" value="2.35%" delta="-0.45%" up={false} spark={[3.1,2.9,2.8,2.7,2.5,2.35]} color={C.red} icon={AlertTriangle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <div style={{ padding: "14px 14px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Production Queue</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <THead cols={["Work Order", "Customer", "Qty", "Due", "Status"]} />
            <tbody>
              {[
                ["WO-1258","Ramesh Traders","7,600","16 Jul","In Progress",C.blue],
                ["WO-1259","FreshMart","6,000","16 Jul","In Progress",C.blue],
                ["WO-1255","Global Foods","5,000","15 Jul","Completed",C.green],
                ["WO-1261","Super Pack","4,500","17 Jul","Pending",C.amber],
              ].map(([id,cust,qty,due,s,c],i,arr) => (
                <TRow key={id as string} lastRow={i===arr.length-1} cells={[
                  <span style={{ color: C.text, fontWeight: 600 }}>{id}</span>,
                  <span>{cust}</span>,
                  <span>{qty}</span>,
                  <span>{due}</span>,
                  <Badge label={s as string} color={c as string} />,
                ]} />
              ))}
            </tbody>
          </table>
        </Card>
        <Card style={{ padding: "18px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Machine Load</div>
          {[["Corrugation Line 1",85,C.green],["Corrugation Line 2",67,C.green],["Die Cut Machine 1",78,C.blue],["Flexo Printer",61,C.amber],["Stitching Machine",44,C.red],["Slotting Machine",52,C.amber],["Pasting Machine",33,C.red],["Tube Cutting",21,C.red]].map(([n,v,c]) => (
            <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: C.sub, width: 160, flexShrink: 0 }}>{n}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${v}%`, borderRadius: 99, background: c as string }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: c as string, width: 36, textAlign: "right" }}>{v}%</span>
            </div>
          ))}
        </Card>
      </div>
    </>
  );

  /* ── INVENTORY ───────────────────────────── */
  const inventory = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
        <KPICard label="Total Stock" value="45,620 Kg" delta="+5%" up spark={[40,42,44,43,45,45.6]} color={C.accent} icon={Package} />
        <KPICard label="Paper Used" value="32,450 Kg" delta="This month" up spark={[25,28,29,30,31,32.4]} color={C.blue} icon={Activity} />
        <KPICard label="BF Boards" value="26,500 Sq.Ft." delta="+2%" up spark={[22,23,24,25,26,26.5]} color={C.green} icon={BarChart3} />
        <KPICard label="Supplier Credit" value="₹12.75L" delta="30 days" up={false} spark={[15,14,13.5,13,12.8,12.75]} color={C.amber} icon={Clock} />
        <KPICard label="POs in Transit" value="6 Orders" delta="+1" up spark={[3,4,4,5,5,6]} color={C.blue} icon={Truck} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card>
          <div style={{ padding: "14px 14px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Raw Material Stock</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <THead cols={["Item", "GSM", "BF", "Ply", "Stock (Kg)", "Min Stock"]} />
            <tbody>
              {[
                ["Test Liner",140,32,"3 Ply","1,240","2,000",C.red],
                ["Corrugating Medium",120,28,"3 Ply","980","1,500",C.red],
                ["Kraft Paper",200,40,"5 Ply","1,100","1,500",C.red],
                ["Duplex Board",250,45,"5 Ply","2,300","2,500",C.amber],
                ["White Top Liner",170,35,"5 Ply","1,450","1,500",C.amber],
              ].map(([n,gsm,bf,ply,stock,min,c],i,arr) => (
                <TRow key={n as string} lastRow={i===arr.length-1} cells={[
                  <span style={{ color: C.text, fontWeight: 500 }}>{n}</span>,
                  <span>{gsm}</span>,
                  <span>{bf}</span>,
                  <span>{ply}</span>,
                  <span style={{ color: c as string, fontWeight: 600 }}>{stock}</span>,
                  <span style={{ color: C.muted }}>{min}</span>,
                ]} />
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <div style={{ padding: "14px 14px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Supplier Payments Due (30 Days)</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <THead cols={["Supplier", "Due Date", "Amount"]} />
            <tbody>
              {[
                ["Shree Paper Mills","20 Jul 2026","₹3,25,000"],
                ["Krishna Paper Co.","22 Jul 2026","₹2,85,000"],
                ["Sai Packaging","25 Jul 2026","₹2,10,300"],
                ["Star Paper Industries","28 Jul 2026","₹2,05,400"],
                ["Bharat Pulp & Paper","30 Jul 2026","₹2,49,000"],
              ].map(([n,d,v],i,arr) => (
                <TRow key={n as string} lastRow={i===arr.length-1} cells={[
                  <span style={{ color: C.text, fontWeight: 500 }}>{n}</span>,
                  <span style={{ color: C.muted }}>{d}</span>,
                  <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>,
                ]} />
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );

  /* ── ANALYTICS ───────────────────────────── */
  const analytics = (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
        <KPICard label="Monthly Revenue" value="₹18.74L" delta="+12.45%" up spark={[14,15,16,17,17.5,18.7]} color={C.accent} icon={BarChart3} />
        <KPICard label="Monthly Profit" value="₹4.25L" delta="+8.35%" up spark={[3.5,3.7,3.9,4.0,4.1,4.25]} color={C.green} icon={TrendingUp} />
        <KPICard label="Total Orders" value="64" delta="+9.68%" up spark={[48,52,55,57,60,64]} color={C.blue} icon={ShoppingCart} />
        <KPICard label="Avg Order Value" value="₹29,289" delta="+2.15%" up spark={[27,28,28.5,29,29.1,29.3]} color={C.amber} icon={DollarSign} />
        <KPICard label="Receivables" value="₹19.63L" delta="-5.2%" up={false} spark={[22,21,20.5,20,19.8,19.6]} color={C.red} icon={AlertTriangle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: "20px 20px 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 14 }}>Revenue Trend (12 Months)</div>
          <LineChart data={[180,200,220,205,240,260,255,290,340]} labels={["Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"]} />
        </Card>
        <Card>
          <div style={{ padding: "14px 14px 0", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Top Customers by Revenue</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <THead cols={["Customer", "Revenue", "Orders", "Δ"]} />
            <tbody>
              {[
                ["Ramesh Traders","₹4,25,600","14","+18.3%",true],
                ["Global Foods","₹3,15,750","10","+6.2%",true],
                ["FreshMart","₹2,78,900","9","+9.3%",true],
                ["Bright Retail","₹2,10,300","7","-2.1%",false],
                ["Super Pack","₹1,85,400","6","+4.5%",true],
              ].map(([n,v,o,d,up],i,arr) => (
                <TRow key={n as string} lastRow={i===arr.length-1} cells={[
                  <span style={{ color: C.text, fontWeight: 500 }}>{n}</span>,
                  <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>,
                  <span>{o}</span>,
                  <span style={{ color: up ? C.green : C.red, fontWeight: 600 }}>{d}</span>,
                ]} />
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100%", background: C.bg, color: C.text }}>

      {/* ── topbar: only search + bell + avatar ── */}
      <div style={{ height: 56, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>

        {/* greeting */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{grt}, Sachin</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Your business is performing well today.</div>
        </div>

        {/* search + bell + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search anything…"
              style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 36px 7px 32px", fontSize: 13, color: C.text, outline: "none", width: 240 }}
            />
            <kbd style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: C.muted, background: C.surface2, border: `1px solid ${C.line}`, borderRadius: 4, padding: "1px 5px" }}>⌘K</kbd>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <Bell size={16} />
          </button>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#5B4FDB,#9B6BF7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>S</div>
        </div>
      </div>

      {/* ── tabs ── */}
      <div style={{ padding: "16px 28px 0", display: "flex", gap: 6, borderBottom: `1px solid ${C.line}` }}>
        {TABS.map(({ id, label }) => {
          const on = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "8px 16px", fontSize: 13, fontWeight: on ? 600 : 400,
              color: on ? C.accent : C.muted,
              borderBottom: on ? `2px solid ${C.accent}` : "2px solid transparent",
              transition: "all .12s", marginBottom: -1,
            }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* ── content ── */}
      <div style={{ padding: "20px 28px 32px" }}>
        {tab === "overview"    && overview}
        {tab === "production"  && production}
        {tab === "inventory"   && inventory}
        {tab === "analytics"   && analytics}
      </div>
    </div>
  );
}
