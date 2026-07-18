import { useState } from "react";
import {
  BarChart3, TrendingUp, ShoppingCart, FolderKanban, Workflow, Bot,
  Search, ArrowUpRight, ArrowDownRight, AlertCircle, PackageSearch,
  UserPlus, ChevronDown, Factory, Package, Sparkles, Bell, Settings,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   THREXA DARK THEME TOKENS
   bg      #0B0C14   panel #12131D   panel-2 #171826
   border  rgba(255,255,255,.06)
   accent  #8B5CF6 → #6D5CFF gradient
   ───────────────────────────────────────────────────────────── */

const T = {
  bg: "#0B0C14",
  panel: "#12131D",
  panel2: "#171826",
  border: "1px solid rgba(255,255,255,0.06)",
  text: "#E7E8F0",
  dim: "#8A8CA3",
  accent: "#8B5CF6",
};

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ background: T.panel, border: T.border }}
    >
      {children}
    </div>
  );
}

/* ── KPI card: icon square + label + value + delta ─────────── */
function KPI({
  icon: Icon, label, value, delta, up = true,
}: {
  icon: any; label: string; value: string; delta: string; up?: boolean;
}) {
  return (
    <Panel className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(139,92,246,0.14)" }}
        >
          <Icon size={16} color={T.accent} />
        </div>
        <span className="text-xs" style={{ color: T.dim }}>{label}</span>
      </div>
      <div className="text-xl font-bold" style={{ color: T.text }}>{value}</div>
      <div className="flex items-center gap-1 text-xs font-medium"
        style={{ color: up ? "#34D399" : "#F87171" }}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {delta}
      </div>
    </Panel>
  );
}

/* ── Revenue line chart (purple, dark grid) ────────────────── */
function RevenueChart() {
  const data = [1.2, 2.1, 2.6, 3.0, 2.8, 2.9, 2.85, 3.1, 4.6];
  const labels = ["Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15"];
  const max = 5;
  const W = 760, H = 220, PX = 44, PY = 16;
  const pts = data.map((v, i) => [
    PX + (i * (W - PX - 16)) / (data.length - 1),
    H - PY - (v / max) * (H - PY * 2.4),
  ]);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H + 26}`} className="w-full">
      {[0, 1, 2, 3, 4, 5].map((v) => {
        const y = H - PY - (v / max) * (H - PY * 2.4);
        return (
          <g key={v}>
            <line x1={PX} y1={y} x2={W - 12} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PX - 10} y={y + 4} textAnchor="end" fontSize="11" fill={T.dim}>
              {v === 0 ? "0" : `${v}L`}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="rvFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(139,92,246,0.22)" />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
      </defs>
      <path d={`${path} L${pts[pts.length - 1][0]},${H - PY} L${pts[0][0]},${H - PY} Z`}
        fill="url(#rvFill)" />
      <path d={path} fill="none" stroke={T.accent} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3}
          fill={i === pts.length - 1 ? "#fff" : T.accent}
          stroke={T.accent} strokeWidth="2" />
      ))}
      {labels.map((l, i) => (
        <text key={l} x={PX + (i * (W - PX - 16)) / (labels.length - 1)} y={H + 18}
          textAnchor="middle" fontSize="11" fill={T.dim}>{l}</text>
      ))}
    </svg>
  );
}

/* ── AI-style insight row ──────────────────────────────────── */
function Insight({
  icon: Icon, tint, title, sub,
}: { icon: any; tint: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${tint}22` }}>
        <Icon size={14} color={tint} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: T.text }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: T.dim }}>{sub}</p>
      </div>
    </div>
  );
}

/* ── Status pill ───────────────────────────────────────────── */
function Pill({ label, tone }: { label: string; tone: "ok" | "warn" | "info" }) {
  const c = tone === "ok" ? "#34D399" : tone === "warn" ? "#FBBF24" : "#60A5FA";
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
      style={{ background: `${c}1e`, color: c }}>
      {label}
    </span>
  );
}

/* ═══════════════════════ DASHBOARD ═══════════════════════ */

export default function Dashboard() {
  const [tab, setTab] = useState<"command" | "production" | "inventory" | "analytics">("command");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const tabs = [
    { id: "command", label: "Command Centre", icon: BarChart3 },
    { id: "production", label: "Production", icon: Factory },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ] as const;

  /* ── COMMAND CENTRE ── */
  const command = (
    <>
      {/* KPI row — mirrors reference */}
      <div className="grid grid-cols-5 gap-4">
        <KPI icon={BarChart3} label="Revenue" value="₹4.2 Cr" delta="+14.3%" />
        <KPI icon={ShoppingCart} label="Sales" value="127" delta="+8.2%" />
        <KPI icon={FolderKanban} label="Projects" value="18" delta="+12.5%" />
        <KPI icon={Workflow} label="Automation" value="42 Active" delta="+5.1%" />
        <KPI icon={Bot} label="AI Agents" value="7 Running" delta="+3" />
      </div>

      {/* Revenue + Insights */}
      <div className="grid grid-cols-3 gap-4">
        <Panel className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold" style={{ color: T.text }}>Revenue Overview</h3>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: T.panel2, color: T.dim, border: T.border }}>
              This Week <ChevronDown size={13} />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold" style={{ color: T.text }}>₹4,20,90.20</span>
            <span className="text-xs font-medium" style={{ color: "#34D399" }}>+14.3% vs last week</span>
          </div>
          <RevenueChart />
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold" style={{ color: T.text }}>AI Insights</h3>
            <button className="text-xs" style={{ color: T.accent }}>View all</button>
          </div>
          <Insight icon={TrendingUp} tint="#34D399"
            title="Revenue increased by 14.3%" sub="Compared to last week" />
          <Insight icon={AlertCircle} tint="#F87171"
            title="3 invoices are overdue" sub="Total value ₹2,45,000" />
          <Insight icon={PackageSearch} tint="#FBBF24"
            title="Inventory running low" sub="12 items need attention" />
          <Insight icon={UserPlus} tint="#34D399"
            title="7 new leads this week" sub="+22% vs last week" />
        </Panel>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        <Panel className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>Top Products</h3>
          {[
            ["Product A", "₹88,900", "+8.3%"],
            ["Product B", "₹83,000", "+6.2%"],
            ["Product C", "₹68,900", "+9.3%"],
          ].map(([n, v, d]) => (
            <div key={n} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.14)" }}>
                  <Package size={13} color={T.accent} />
                </div>
                <span className="text-sm" style={{ color: T.text }}>{n}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: T.text }}>{v}</span>
                <span className="text-xs font-medium" style={{ color: "#34D399" }}>{d}</span>
              </div>
            </div>
          ))}
        </Panel>

        <Panel className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>Recent Transactions</h3>
          {([
            ["INV-10023", "₹45,000", "Paid", "ok"],
            ["INV-10022", "₹32,500", "Pending", "warn"],
            ["INV-10021", "₹18,900", "Paid", "ok"],
          ] as const).map(([id, v, s, tone]) => (
            <div key={id} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm" style={{ color: T.dim }}>{id}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: T.text }}>{v}</span>
                <Pill label={s} tone={tone} />
              </div>
            </div>
          ))}
        </Panel>

        <Panel className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>AI Agent Activity</h3>
          {([
            ["Lead Qualification", "Active"],
            ["Invoice Processing", "Active"],
            ["Payment Reconciliation", "Active"],
          ] as const).map(([n, s]) => (
            <div key={n} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.14)" }}>
                  <Bot size={13} color={T.accent} />
                </div>
                <span className="text-sm" style={{ color: T.text }}>{n}</span>
              </div>
              <Pill label={s} tone="ok" />
            </div>
          ))}
        </Panel>
      </div>
    </>
  );

  /* ── PRODUCTION ── */
  const production = (
    <>
      <div className="grid grid-cols-5 gap-4">
        <KPI icon={Factory} label="Machines Running" value="5 / 8" delta="62.5% util" />
        <KPI icon={FolderKanban} label="Work Orders" value="18" delta="+5%" />
        <KPI icon={TrendingUp} label="Capacity" value="73%" delta="+3%" />
        <KPI icon={Package} label="Today's Output" value="24,560" delta="+8% Sq.Ft." />
        <KPI icon={AlertCircle} label="Rejection Rate" value="2.35%" delta="-0.45%" up={false} />
      </div>
      <Panel className="p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: T.text }}>Machine Load</h3>
        {([
          ["Corrugation Line 1", 78], ["Corrugation Line 2", 65], ["Die Cut Machine 1", 82],
          ["Flexo Printer", 60], ["Stitching Machine", 45],
        ] as const).map(([n, v]) => (
          <div key={n} className="flex items-center gap-4 py-2">
            <span className="w-44 text-xs" style={{ color: T.dim }}>{n}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: T.panel2 }}>
              <div className="h-full rounded-full"
                style={{ width: `${v}%`, background: `linear-gradient(90deg,#6D5CFF,#8B5CF6)` }} />
            </div>
            <span className="text-xs font-semibold w-9 text-right" style={{ color: T.text }}>{v}%</span>
          </div>
        ))}
      </Panel>
      <Panel className="p-5">
        <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>Production Queue</h3>
        {([
          ["WO-1258 · Ramesh Traders · 7,600 Sq.Ft.", "In Progress 60%", "info"],
          ["WO-1259 · FreshMart · 6,000 Sq.Ft.", "In Progress 45%", "info"],
          ["WO-1261 · Global Foods · 5,000 Sq.Ft.", "Pending · Due 16 Jul", "warn"],
          ["WO-1255 · Global Foods · 5,500 Sq.Ft.", "Completed", "ok"],
        ] as const).map(([n, s, tone]) => (
          <div key={n} className="flex items-center justify-between py-2.5 border-b last:border-0"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-sm" style={{ color: T.text }}>{n}</span>
            <Pill label={s} tone={tone} />
          </div>
        ))}
      </Panel>
    </>
  );

  /* ── INVENTORY ── */
  const inventory = (
    <>
      <div className="grid grid-cols-5 gap-4">
        <KPI icon={Package} label="Total Reel Stock" value="45,620 Kg" delta="+5%" />
        <KPI icon={PackageSearch} label="Paper Used (Month)" value="32,450 Kg" delta="+8%" />
        <KPI icon={FolderKanban} label="BF Boards" value="26,500 Sq.Ft." delta="+2%" />
        <KPI icon={AlertCircle} label="Supplier Credit" value="₹12,75,300" delta="30 days" up={false} />
        <KPI icon={ShoppingCart} label="POs in Transit" value="6" delta="+1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Panel className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>Low Stock Reels</h3>
          {([
            ["Test Liner · 140 GSM · 3 Ply", "1,240 Kg", "warn"],
            ["Corrugating Medium · 120 GSM", "980 Kg", "warn"],
            ["Kraft Paper · 200 GSM · 5 Ply", "1,100 Kg", "ok"],
          ] as const).map(([n, v, tone]) => (
            <div key={n} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm" style={{ color: T.text }}>{n}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: T.text }}>{v}</span>
                <Pill label={tone === "warn" ? "Low" : "OK"} tone={tone} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>Supplier Payments Due</h3>
          {([
            ["Shree Paper Mills", "₹3,25,000 · 20 Jul"],
            ["Krishna Paper Co.", "₹2,85,000 · 22 Jul"],
            ["Sai Packaging", "₹2,10,300 · 25 Jul"],
            ["Bharat Pulp & Paper", "₹2,49,000 · 30 Jul"],
          ] as const).map(([n, v]) => (
            <div key={n} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm" style={{ color: T.text }}>{n}</span>
              <span className="text-sm font-semibold" style={{ color: T.text }}>{v}</span>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );

  /* ── ANALYTICS ── */
  const analytics = (
    <>
      <div className="grid grid-cols-5 gap-4">
        <KPI icon={BarChart3} label="Monthly Revenue" value="₹18.74L" delta="+12.45%" />
        <KPI icon={TrendingUp} label="Monthly Profit" value="₹4.25L" delta="+8.35%" />
        <KPI icon={ShoppingCart} label="Total Orders" value="64" delta="+9.68%" />
        <KPI icon={FolderKanban} label="Avg Order Value" value="₹29,289" delta="+2.15%" />
        <KPI icon={AlertCircle} label="Receivables" value="₹19.63L" delta="-5.2%" up={false} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Panel className="col-span-2 p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: T.text }}>Revenue Trend (12 Months)</h3>
          <RevenueChart />
        </Panel>
        <Panel className="p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: T.text }}>Top Customers</h3>
          {([
            ["Ramesh Traders", "₹4,25,600", "14"],
            ["Global Foods", "₹3,15,750", "10"],
            ["FreshMart", "₹2,78,900", "9"],
            ["Bright Retail", "₹2,10,300", "7"],
            ["Super Pack", "₹1,85,400", "6"],
          ] as const).map(([n, v, o]) => (
            <div key={n} className="flex items-center justify-between py-2.5 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm" style={{ color: T.text }}>{n}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: T.text }}>{v}</span>
                <span className="text-xs" style={{ color: T.dim }}>{o} orders</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );

  return (
    <div className="min-h-full" style={{ background: T.bg }}>
      {/* ── Greeting · Ask-Threxa search · AI status ── */}
      <div className="px-8 pt-6 pb-2 flex items-center gap-6">
        <div className="shrink-0">
          <h1 className="text-xl font-bold" style={{ color: T.text }}>
            {greeting}, Sachin <span className="align-middle">👋</span>
          </h1>
          <p className="text-sm mt-0.5" style={{ color: T.dim }}>
            Your business is performing well today.
          </p>
        </div>

        <div className="flex-1 max-w-md relative mx-auto">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" color={T.dim} />
          <input
            placeholder="Ask Threxa anything…"
            className="w-full pl-10 pr-14 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: T.panel, border: T.border, color: T.text }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] px-1.5 py-0.5 rounded"
            style={{ background: T.panel2, color: T.dim, border: T.border }}
          >
            ⌘K
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right leading-tight">
            <div className="flex items-center gap-1.5 justify-end">
              <Sparkles size={13} color={T.accent} />
              <span className="text-xs font-semibold" style={{ color: T.text }}>THREXA AI</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
              <span className="text-[11px]" style={{ color: T.dim }}>Online</span>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5 transition">
            <Bell size={16} color={T.dim} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 transition">
            <Settings size={16} color={T.dim} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ background: "linear-gradient(90deg,#6D5CFF,#8B5CF6)" }}
          >
            <Sparkles size={13} /> Ask AI
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="px-8 py-3 flex gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
              style={active
                ? { background: "linear-gradient(90deg,#6D5CFF,#8B5CF6)", color: "#fff" }
                : { background: T.panel, color: T.dim, border: T.border }}>
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="px-8 pb-8 pt-2 space-y-4">
        {tab === "command" && command}
        {tab === "production" && production}
        {tab === "inventory" && inventory}
        {tab === "analytics" && analytics}
      </div>
    </div>
  );
}
