import {
  T, Card, CardTitle, Badge, Dot, Progress, KPIStrip, Btn, Cell2,
} from "../ui/system";
import {
  Search, Bell, Plus, FileText, ShoppingCart, Zap, Truck, Receipt, Package,
} from "lucide-react";
import { useState } from "react";

/* ═══ Threxa ERP · Operations Dashboard ═══
   Answers one question: "What needs my attention right now?"
   No decorative charts. Dense, operational, executive-grade. */

export default function Dashboard() {
  const [q, setQ] = useState("");
  const h = new Date().getHours();
  const grt = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  const shift = h < 14 ? "Morning Shift" : h < 22 ? "Evening Shift" : "Night Shift";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" });

  /* ── data (wire to Supabase later; shapes are final) ── */
  const timeline = [
    ["08:00", "Corrugation Line 1 started", "done"],
    ["09:20", "WO-1255 completed — 5,500 Sq.Ft.", "done"],
    ["10:15", "Dispatch truck KA-05-AB-1234 loaded", "done"],
    ["11:10", "Machine 3 — scheduled maintenance", "warn"],
    ["12:30", "Flexo printing running — WO-1258", "live"],
    ["14:00", "Expected dispatch — CH-4809 (FreshMart)", "next"],
    ["16:30", "Shift handover — production report due", "next"],
  ] as const;

  const attention = [
    [T.red,   "4 quotations pending approval", "Oldest waiting 3 days"],
    [T.amber, "Machine 2 overloaded — 94% for 6 hrs", "Consider load balancing"],
    [T.red,   "Kraft Paper below reorder level", "1,100 Kg vs min 1,500 Kg"],
    [T.amber, "Dispatch #240 delayed", "Vehicle breakdown — ETA +2 hrs"],
    [T.green, "Payroll completed for July", "42 employees processed"],
    [T.blue,  "Supplier payment due tomorrow", "Shree Paper Mills — ₹3,25,000"],
  ] as const;

  const workOrders = [
    ["WO-1258", "Ramesh Traders", "Printing",     "Flexo Printer",    60, "Ajay"],
    ["WO-1259", "FreshMart",      "Corrugation",  "Line 1",           45, "Ramesh"],
    ["WO-1261", "Global Foods",   "Queued",       "—",                 0, "—"],
    ["WO-1262", "Bright Retail",  "Die Cutting",  "Die Cutter 1",     72, "Suresh"],
    ["WO-1263", "Super Pack",     "Stitching",    "Stitching M/C",    88, "Mahesh"],
  ] as const;

  const machines = [
    ["Corrugation Line 1", "Running",     "Ramesh", "92%", "12 Jul", T.green],
    ["Corrugation Line 2", "Running",     "Vijay",  "84%", "08 Jul", T.green],
    ["Flexo Printer",      "Running",     "Ajay",   "84%", "10 Jul", T.green],
    ["Die Cutter 1",       "Maintenance", "—",      "—",   "Today",  T.amber],
    ["Stitching Machine",  "Running",     "Mahesh", "76%", "05 Jul", T.green],
    ["Pasting Machine",    "Idle",        "—",      "—",   "01 Jul", T.muted],
  ] as const;

  const lowStock = [
    ["Test Liner · 140 GSM · BF 32",        "1,240 Kg", "2,000 Kg", T.red],
    ["Corrugating Medium · 120 GSM",         "980 Kg",  "1,500 Kg", T.red],
    ["Kraft Paper · 200 GSM · BF 40",        "1,100 Kg", "1,500 Kg", T.red],
    ["White Top Liner · 170 GSM",            "1,450 Kg", "1,500 Kg", T.amber],
  ] as const;

  const dispatches = [
    ["09:30", "CH-4807", "Ramesh Traders", "KA01AB1234", "Dispatched", T.green],
    ["11:00", "CH-4808", "Global Foods",   "KA05KJ5678", "Dispatched", T.green],
    ["13:30", "CH-4809", "FreshMart",      "KA03LM9012", "In Transit", T.blue],
    ["15:00", "CH-4810", "Bright Retail",  "KA02PQ3456", "Pending",    T.amber],
    ["17:00", "CH-4811", "Super Pack",     "KA04RS7890", "Pending",    T.amber],
  ] as const;

  const cash = {
    bank: "₹32,45,670", hand: "₹1,25,430",
    inToday: "₹9,25,800", outToday: "₹4,51,200", txns: 56,
  };

  const activity = [
    ["Quotation QT-118 approved", "Rajesh Enterprises · 10 min ago", T.green],
    ["Sales order SO-241 created", "FreshMart · 32 min ago", T.blue],
    ["Production started — WO-1263", "Super Pack · 1 hr ago", T.accent],
    ["Invoice INV-10023 generated", "₹45,000 · 2 hrs ago", T.blue],
    ["Dispatch CH-4808 completed", "Global Foods · 3 hrs ago", T.green],
    ["Payment received ₹1,25,000", "Ramesh Traders · 4 hrs ago", T.green],
  ] as const;

  const quick = [
    ["New Quotation", FileText], ["Sales Order", ShoppingCart], ["Work Order", Zap],
    ["Dispatch", Truck], ["Invoice", Receipt], ["Purchase Order", Package],
  ] as const;

  /* ── shared row style ── */
  const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: `1px solid ${T.lineSoft}` };

  return (
    <div style={{ minHeight: "100%", background: T.bg }}>

      {/* ═ Header: greeting + metadata + search + alerts + profile ═ */}
      <div style={{ borderBottom: `1px solid ${T.lineSoft}`, position: "sticky", top: 0, background: T.bg, zIndex: 10 }}>
        <div style={{ maxWidth: T.container, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{grt}, Sachin</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
              Bengaluru Plant <s style={{ textDecoration: "none", margin: "0 7px", color: "rgba(255,255,255,.15)" }}>•</s>
              {shift} <s style={{ textDecoration: "none", margin: "0 7px", color: "rgba(255,255,255,.15)" }}>•</s>
              {today} <s style={{ textDecoration: "none", margin: "0 7px", color: "rgba(255,255,255,.15)" }}>•</s>
              FY 2026–27
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search"
                style={{ height: 34, width: 210, background: T.card, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 44px 0 30px", fontSize: 12.5, color: T.text, outline: "none", boxSizing: "border-box" }} />
              <kbd style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: T.muted, background: T.card2, border: `1px solid ${T.line}`, borderRadius: 4, padding: "1px 5px" }}>Ctrl K</kbd>
            </div>
            <button style={{ position: "relative", width: 32, height: 32, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: T.sub, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={16} />
              <span style={{ position: "absolute", top: 5, right: 6, width: 7, height: 7, borderRadius: "50%", background: T.red, border: `2px solid ${T.bg}` }} />
            </button>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#5B4FDB,#9B6BF7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>S</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: T.container, margin: "0 auto", padding: "20px 32px 40px" }}>

        {/* ═ KPI strip: 6 compact operational cards with targets ═ */}
        <KPIStrip items={[
          { label: "Revenue Today",       value: "₹8,74,500",  delta: "+10.5%", sub: "Target ₹10L",     spark: [6.2,7.1,6.8,7.9,8.2,8.74], color: T.accent },
          { label: "Open Orders",         value: "24",         delta: "+2",     sub: "6 awaiting conf.", spark: [18,20,19,22,23,24],        color: T.blue },
          { label: "Production Progress", value: "24,560",     delta: "76%",    sub: "of 32,000 Sq.Ft.", spark: [12,15,18,20,22,24.5],      color: T.green },
          { label: "Dispatch Today",      value: "12 / 15",    delta: "+15.3%", sub: "3 pending",        spark: [8,9,9,10,11,12],           color: T.amber },
          { label: "Receivables",         value: "₹19.63L",    delta: "-3.2%",  up: false, sub: "₹6.85L overdue", spark: [22,21,20.6,20,19.8,19.6], color: T.red },
          { label: "Inventory Health",    value: "82%",        delta: "4 low",  up: false, sub: "45,620 Kg total", spark: [90,88,86,85,83,82], color: T.amber },
        ]} />

        {/* ═ Quick actions ═ */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {quick.map(([label, Icon]) => (
            <Btn key={label as string} icon={Plus}>{label}</Btn>
          ))}
        </div>

        {/* ═ Row: Production Timeline | Needs Attention ═ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginBottom: 12 }}>
          <Card>
            <CardTitle>Today's Production Timeline</CardTitle>
            <div style={{ padding: "2px 0 8px" }}>
              {timeline.map(([time, event, st], i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "8px 16px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, color: T.muted, fontVariantNumeric: "tabular-nums", width: 40, flexShrink: 0, paddingTop: 1 }}>{time}</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 4 }}>
                    <Dot color={st === "done" ? T.green : st === "live" ? T.accent : st === "warn" ? T.amber : T.muted} />
                    {i < timeline.length - 1 && <div style={{ width: 1, height: 18, background: T.lineSoft, marginTop: 4 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, color: st === "next" ? T.muted : T.text }}>{event}</span>
                    {st === "live" && <Badge label="LIVE" color={T.accent} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Needs Attention</CardTitle>
            <div style={{ paddingBottom: 6 }}>
              {attention.map(([color, title, sub], i) => (
                <div key={i} style={{ ...row, borderBottom: i === attention.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}>
                  <Dot color={color as string} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: T.text }}>{title}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ═ Row: Work Orders | Machine Status ═ */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginBottom: 12 }}>
          <Card>
            <CardTitle>Today's Work Orders</CardTitle>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["WO", "Customer", "Stage", "Machine", "Progress", "Operator"].map(hh => (
                  <th key={hh} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: T.sub, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${T.line}` }}>{hh}</th>
                ))}</tr>
              </thead>
              <tbody>
                {workOrders.map(([wo, cust, stage, mach, pct, op], i) => (
                  <tr key={wo as string} style={{ borderBottom: i === workOrders.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: T.text, fontWeight: 600 }}>{wo}</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: T.sub }}>{cust}</td>
                    <td style={{ padding: "10px 16px" }}><Badge label={stage as string} color={stage === "Queued" ? T.muted : T.blue} /></td>
                    <td style={{ padding: "10px 16px", fontSize: 12.5, color: T.sub }}>{mach}</td>
                    <td style={{ padding: "10px 16px", width: 130 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Progress value={pct as number} color={(pct as number) > 70 ? T.green : T.accent} />
                        <span style={{ fontSize: 11.5, color: T.sub, fontVariantNumeric: "tabular-nums", width: 30 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12.5, color: T.sub }}>{op}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <CardTitle>Machine Status</CardTitle>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Machine", "Status", "Operator", "Eff.", "Maint."].map(hh => (
                  <th key={hh} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: T.sub, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${T.line}` }}>{hh}</th>
                ))}</tr>
              </thead>
              <tbody>
                {machines.map(([m, st, op, eff, mt, c], i) => (
                  <tr key={m as string} style={{ borderBottom: i === machines.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}>
                    <td style={{ padding: "9px 14px", fontSize: 12.5, color: T.text, fontWeight: 500 }}>{m}</td>
                    <td style={{ padding: "9px 14px" }}><Badge label={st as string} color={c as string} /></td>
                    <td style={{ padding: "9px 14px", fontSize: 12.5, color: T.sub }}>{op}</td>
                    <td style={{ padding: "9px 14px", fontSize: 12.5, color: T.sub, fontVariantNumeric: "tabular-nums" }}>{eff}</td>
                    <td style={{ padding: "9px 14px", fontSize: 12.5, color: T.muted }}>{mt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* ═ Row: Low Stock | Dispatch Schedule ═ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, marginBottom: 12 }}>
          <Card>
            <CardTitle>Low Stock Materials</CardTitle>
            <div style={{ paddingBottom: 6 }}>
              {lowStock.map(([item, cur, min, c], i) => (
                <div key={i} style={{ ...row, borderBottom: i === lowStock.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}>
                  <Dot color={c as string} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: T.text }}>{item}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>Min: {min}</div>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: c as string, fontVariantNumeric: "tabular-nums" }}>{cur}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Dispatch Schedule</CardTitle>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Time", "Challan", "Customer", "Vehicle", "Status"].map(hh => (
                  <th key={hh} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: T.sub, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${T.line}` }}>{hh}</th>
                ))}</tr>
              </thead>
              <tbody>
                {dispatches.map(([tm, ch, cust, veh, st, c], i) => (
                  <tr key={ch as string} style={{ borderBottom: i === dispatches.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}>
                    <td style={{ padding: "9px 16px", fontSize: 12.5, color: T.muted, fontVariantNumeric: "tabular-nums" }}>{tm}</td>
                    <td style={{ padding: "9px 16px", fontSize: 12.5, color: T.text, fontWeight: 600 }}>{ch}</td>
                    <td style={{ padding: "9px 16px", fontSize: 12.5, color: T.sub }}>{cust}</td>
                    <td style={{ padding: "9px 16px", fontSize: 12, color: T.muted, fontFamily: "monospace" }}>{veh}</td>
                    <td style={{ padding: "9px 16px" }}><Badge label={st as string} color={c as string} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* ═ Row: Cash Book | Recent Activity ═ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12 }}>
          <Card>
            <CardTitle>Cash Position</CardTitle>
            <div style={{ padding: "0 16px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Bank Balance", cash.bank, T.text], ["Cash in Hand", cash.hand, T.text],
                ["Receipts Today", cash.inToday, T.green], ["Payments Today", cash.outToday, T.red]].map(([l, v, c]) => (
                <div key={l as string} style={{ background: T.card2, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10.5, color: T.muted, textTransform: "uppercase", letterSpacing: ".05em" }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: c as string, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{v}</div>
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1", fontSize: 11.5, color: T.muted, textAlign: "center", paddingTop: 2 }}>
                {cash.txns} transactions today
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Recent Activity</CardTitle>
            <div style={{ paddingBottom: 6 }}>
              {activity.map(([title, sub, c], i) => (
                <div key={i} style={{ ...row, borderBottom: i === activity.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}>
                  <Dot color={c as string} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12.5, color: T.text }}>{title}</span>
                  </div>
                  <span style={{ fontSize: 11, color: T.muted, whiteSpace: "nowrap" }}>{sub}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
