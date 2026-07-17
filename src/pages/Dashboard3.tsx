import { ERPShell, DashboardTopbar, Card, CardHeader, T } from "../components/ERPShell";
import { ChevronRight } from "lucide-react";

/* ============================================================
   DASHBOARD 3 — INVENTORY & PROCUREMENT
   ============================================================ */

const kpis = [
  { label: "Total Reel Stock", value: "45,620", note: "Kgs" },
  { label: "Paper Used (This Month)", value: "32,450", note: "Kgs" },
  { label: "BF Boards in Stock", value: "26,500", note: "Sq. Ft." },
  { label: "Supplier Credit (30 Days)", value: "₹12,75,300", note: "" },
  { label: "POs in Transit", value: "6", note: "Orders" },
];

const heatmapItems = ["Test Liner", "Corrugating Medium", "Kraft Paper", "Duplex Board", "White Top Liner"];
const heatmapCols = ["3 Ply", "5 Ply", "7 Ply"];
const heatmapData: Record<string, number[]> = {
  "Test Liner": [1240, 2850, 1100],
  "Corrugating Medium": [980, 1500, 750],
  "Kraft Paper": [1100, 2400, 1250],
  "Duplex Board": [2300, 3600, 1800],
  "White Top Liner": [1400, 2100, 980],
};

function heatColor(v: number) {
  if (v < 1200) return "#FCA5A5";
  if (v < 2000) return "#FDE68A";
  return "#BBF7D0";
}

const supplierPayments = [
  { supplier: "Shree Paper Mills", due: "20 Jul 2026", amount: "₹3,25,000" },
  { supplier: "Krishna Paper Co.", due: "22 Jul 2026", amount: "₹2,85,600" },
  { supplier: "Sai Packaging", due: "25 Jul 2026", amount: "₹2,10,300" },
  { supplier: "Star Paper Industries", due: "28 Jul 2026", amount: "₹2,05,400" },
  { supplier: "Bharat Pulp & Paper", due: "30 Jul 2026", amount: "₹2,49,000" },
];
const supplierTotal = "₹12,75,300";

const purchaseTrend = [22000, 34000, 28000, 41000, 36000, 47000];
const purchaseMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const materialConsumption = {
  months: ["Jan", "Mar", "Apr", "May", "Jun", "Jul"],
  testLiner: [22000, 28000, 24000, 31000, 27000, 33000],
  corrugatingMedium: [18000, 21000, 19000, 24000, 22000, 26000],
  kraftPaper: [15000, 17000, 16000, 20000, 18000, 21000],
};

const inventoryDetails = [
  { item: "Test Liner", gsm: 140, bf: 32, ply: "3 Ply", unit: "Kgs", stock: 2000, min: 1500, max: 5000, location: "Godown A", lastPurchase: "05 Jul 2026" },
  { item: "Corrugating Medium", gsm: 120, bf: 28, ply: "3 Ply", unit: "Kgs", stock: 980, min: 1500, max: 3000, location: "Godown A", lastPurchase: "03 Jul 2026" },
  { item: "Kraft Paper", gsm: 200, bf: 40, ply: "5 Ply", unit: "Kgs", stock: 1100, min: 1500, max: 4000, location: "Godown B", lastPurchase: "04 Jul 2026" },
  { item: "Duplex Board", gsm: 250, bf: 45, ply: "5 Ply", unit: "Kgs", stock: 2300, min: 1500, max: 4500, location: "Godown B", lastPurchase: "02 Jul 2026" },
  { item: "White Top Liner", gsm: 170, bf: 35, ply: "3 Ply", unit: "Kgs", stock: 1450, min: 2000, max: 4500, location: "Godown C", lastPurchase: "06 Jul 2026" },
];

export default function Dashboard3() {
  return (
    <ERPShell activePath="/inventory">
      <DashboardTopbar title="Dashboard 3 – Inventory & Procurement" />
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* ===== KPI ROW ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          {kpis.map((k) => (
            <Card key={k.label}>
              <p style={{ fontSize: "11.5px", color: T.sub, margin: "0 0 8px", fontWeight: 600 }}>{k.label}</p>
              <p style={{ fontSize: "20px", fontWeight: 700, color: T.ink, margin: "0 0 4px" }}>{k.value}</p>
              {k.note && <span style={{ fontSize: "11px", color: T.sub }}>{k.note}</span>}
            </Card>
          ))}
        </div>

        {/* ===== HEATMAP + SUPPLIER PAYMENTS ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Inventory Heatmap (Reel Stock)" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ fontSize: "11px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 8px 8px 0" }}>Item</th>
                  {heatmapCols.map((c) => (
                    <th key={c} style={{ fontSize: "11px", color: T.sub, textAlign: "center", fontWeight: 600, padding: "0 8px 8px" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapItems.map((item) => (
                  <tr key={item}>
                    <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "5px 8px 5px 0" }}>{item}</td>
                    {heatmapData[item].map((v, i) => (
                      <td key={i} style={{ padding: "3px" }}>
                        <div style={{ background: heatColor(v), borderRadius: "6px", padding: "8px 6px", textAlign: "center" }}>
                          <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#374151" }}>{v.toLocaleString()}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHeader title="Supplier Payments Due (Within 30 Days)" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Supplier", "Due Date", "Due Amount"].map((h) => (
                    <th key={h} style={{ fontSize: "10.5px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 8px 8px 0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supplierPayments.map((s) => (
                  <tr key={s.supplier} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "8px 8px 8px 0" }}>{s.supplier}</td>
                    <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 8px 8px 0" }}>{s.due}</td>
                    <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "8px 8px 8px 0" }}>{s.amount}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: `2px solid ${T.border}` }}>
                  <td style={{ fontSize: "11.5px", fontWeight: 700, color: T.ink, padding: "8px 8px 8px 0" }}>Total</td>
                  <td />
                  <td style={{ fontSize: "12.5px", fontWeight: 700, color: T.ink, padding: "8px 8px 8px 0" }}>{supplierTotal}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* ===== PURCHASE TREND + MATERIAL CONSUMPTION ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <Card>
            <CardHeader title="Purchase Trend (Last 6 Months)" />
            <svg viewBox="0 0 380 140" style={{ width: "100%", height: "140px" }}>
              {(() => {
                const w = 380, h = 120, max = 50000;
                const step = w / (purchaseTrend.length - 1);
                const pts = purchaseTrend.map((v, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (v / max) * h}`).join(" ");
                return (
                  <>
                    {[0, 1, 2, 3].map((i) => (
                      <line key={i} x1={0} x2={w} y1={(h / 3) * i} y2={(h / 3) * i} stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                    ))}
                    <path d={pts} fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {purchaseTrend.map((v, i) => (
                      <circle key={i} cx={i * step} cy={h - (v / max) * h} r="3.5" fill={T.blue} />
                    ))}
                    {purchaseMonths.map((m, i) => (
                      <text key={m} x={i * step} y={h + 18} fontSize="10.5" fill={T.sub} textAnchor={i === 0 ? "start" : i === purchaseMonths.length - 1 ? "end" : "middle"}>{m}</text>
                    ))}
                  </>
                );
              })()}
            </svg>
          </Card>

          <Card>
            <CardHeader
              title="Material Consumption (Last 6 Months)"
              action={
                <div style={{ display: "flex", gap: "10px" }}>
                  {[{ l: "Test Liner", c: T.blue }, { l: "Corrugating Medium", c: T.purple }, { l: "Kraft Paper", c: T.green }].map((x) => (
                    <span key={x.l} style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "9.5px", color: T.sub }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "2px", background: x.c }} />
                      {x.l}
                    </span>
                  ))}
                </div>
              }
            />
            <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "120px" }}>
              {materialConsumption.months.map((m, i) => (
                <div key={m} style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "3px", height: "100%" }}>
                  {[materialConsumption.testLiner[i], materialConsumption.corrugatingMedium[i], materialConsumption.kraftPaper[i]].map((v, j) => (
                    <div
                      key={j}
                      style={{
                        flex: 1,
                        height: `${(v / 35000) * 100}%`,
                        background: [T.blue, T.purple, T.green][j],
                        borderRadius: "3px 3px 0 0",
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              {materialConsumption.months.map((m) => (
                <span key={m} style={{ fontSize: "10.5px", color: T.sub, flex: 1, textAlign: "center" }}>{m}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* ===== INVENTORY DETAILS ===== */}
        <Card>
          <CardHeader title="Inventory Details" action={<span style={{ fontSize: "11px", color: T.blue, display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>View All <ChevronRight size={12} /></span>} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Item", "GSM", "BF", "Ply", "Unit", "Stock (Kgs)", "Min Stock", "Max Stock", "Location", "Last Purchase"].map((h) => (
                  <th key={h} style={{ fontSize: "10.5px", color: T.sub, textAlign: "left", fontWeight: 600, padding: "0 10px 8px 0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventoryDetails.map((r) => (
                <tr key={r.item} style={{ borderTop: `1px solid ${T.border}` }}>
                  <td style={{ fontSize: "11.5px", color: T.ink, fontWeight: 600, padding: "8px 10px 8px 0" }}>{r.item}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.gsm}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.bf}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.ply}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.unit}</td>
                  <td style={{ fontSize: "11.5px", color: r.stock < r.min ? T.red : T.ink, fontWeight: 600, padding: "8px 10px 8px 0" }}>{r.stock.toLocaleString()}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.min.toLocaleString()}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.max.toLocaleString()}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.location}</td>
                  <td style={{ fontSize: "11.5px", color: T.sub, padding: "8px 10px 8px 0" }}>{r.lastPurchase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </ERPShell>
  );
}
