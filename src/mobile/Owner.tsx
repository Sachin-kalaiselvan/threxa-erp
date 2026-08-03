/* ═══════════════════════════════════════════════════════════
   THREXA MOBILE · OWNER
   Read-only. Answers one question: is my factory OK right now?
   Data shapes match the desktop modules — swap SEED for Supabase
   queries later without touching the layout.
   ═══════════════════════════════════════════════════════════ */
import { M, MCard, MBadge, SectionTitle, fmtINR } from "./MobileShell";
import { useLang } from "../i18n";
import type { TKey } from "../i18n";
import { AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";

/* ── seed data (mirrors desktop dummy data) ── */
const KPIS: { label: TKey; value: string; delta?: string; up?: boolean }[] = [
  { label: "revenueToday", value: fmtINR(284000), delta: "+12%", up: true },
  { label: "ordersToday", value: "14", delta: "+3", up: true },
  { label: "inProduction", value: "6" },
  { label: "pendingDispatch", value: "5" },
  { label: "outstanding", value: fmtINR(1840000), delta: "-4%", up: false },
  { label: "revenueMonth", value: fmtINR(6720000), delta: "+8%", up: true },
];

const FLOOR: { name: string; state: "running" | "idle" | "maintenance"; job: string; pct: number }[] = [
  { name: "Corrugation Line 1", state: "running", job: "WO-1258", pct: 72 },
  { name: "Flexo Printer", state: "running", job: "WO-1259", pct: 41 },
  { name: "Die Cutter", state: "idle", job: "—", pct: 0 },
  { name: "Pasting Machine", state: "maintenance", job: "—", pct: 0 },
];

const ORDERS = [
  { id: "ORD-012", customer: "Zenith Pharma Labs", value: 248000, status: "In production" },
  { id: "ORD-011", customer: "Nandi Agro Exports", value: 412000, status: "Dispatched" },
  { id: "ORD-009", customer: "Vettiyil Packaging", value: 96000, status: "Pending" },
  { id: "ORD-008", customer: "Super Pack Industries", value: 134000, status: "In production" },
];

export const OWNER_ALERTS = [
  { level: "red" as const, text: "CH-4809 · FreshMart Retail — dispatch overdue by 4 hrs" },
  { level: "amber" as const, text: "Kraft reel 180 GSM — 2 days of stock remaining" },
  { level: "amber" as const, text: "Rajesh Enterprises — ₹3,20,000 overdue 46 days" },
  { level: "red" as const, text: "Pasting machine down since 11:10" },
];

const STATE_COLOR = { running: M.green, idle: M.muted, maintenance: M.amber };

/* ── Overview tab ── */
export default function OwnerHome() {
  const { t } = useLang();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  return (
    <>
      <div style={{ fontSize: 12, color: M.muted, marginBottom: 12 }}>{today}</div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {KPIS.map((k) => (
          <MCard key={k.label} pad={13}>
            <div style={{ fontSize: 11, color: M.muted, marginBottom: 6 }}>{t(k.label)}</div>
            <div style={{ fontSize: 19, fontWeight: 700, color: M.text, letterSpacing: "-0.01em" }}>
              {k.value}
            </div>
            {k.delta && (
              <div
                style={{
                  fontSize: 11,
                  marginTop: 5,
                  color: k.up ? M.green : M.red,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <TrendingUp size={11} style={{ transform: k.up ? "none" : "scaleY(-1)" }} />
                {k.delta}
              </div>
            )}
          </MCard>
        ))}
      </div>

      {/* live floor */}
      <SectionTitle>{t("liveFloor")}</SectionTitle>
      <MCard pad={0}>
        {FLOOR.map((m, i) => (
          <div
            key={m.name}
            style={{
              padding: "13px 14px",
              borderTop: i === 0 ? "none" : `1px solid ${M.line}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: m.pct > 0 ? 9 : 0,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: M.text }}>{m.name}</div>
                <div style={{ fontSize: 11, color: M.muted, marginTop: 2 }}>{m.job}</div>
              </div>
              <MBadge label={t(m.state as TKey)} color={STATE_COLOR[m.state]} />
            </div>
            {m.pct > 0 && (
              <div
                style={{
                  height: 5,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${m.pct}%`,
                    borderRadius: 99,
                    background: M.accent,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </MCard>

      {/* recent orders */}
      <SectionTitle>{t("recentOrders")}</SectionTitle>
      <MCard pad={0}>
        {ORDERS.map((o, i) => (
          <div
            key={o.id}
            style={{
              padding: "13px 14px",
              borderTop: i === 0 ? "none" : `1px solid ${M.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: M.text }}>{o.customer}</div>
              <div style={{ fontSize: 11, color: M.muted, marginTop: 2 }}>
                {o.id} · {o.status}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: M.text, whiteSpace: "nowrap" }}>
              {fmtINR(o.value)}
            </div>
          </div>
        ))}
      </MCard>
    </>
  );
}

/* ── Alerts tab ── */
export function OwnerAlerts() {
  const { t } = useLang();

  if (OWNER_ALERTS.length === 0) {
    return (
      <MCard style={{ textAlign: "center", padding: 34 }}>
        <CheckCircle2 size={30} color={M.green} style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 13, color: M.sub }}>{t("noAlerts")}</div>
      </MCard>
    );
  }

  return (
    <>
      <SectionTitle>{t("alerts")}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {OWNER_ALERTS.map((a, i) => {
          const c = a.level === "red" ? M.red : M.amber;
          return (
            <MCard key={i} pad={13} style={{ borderLeft: `3px solid ${c}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertTriangle size={16} color={c} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 13, color: M.text, lineHeight: 1.45 }}>{a.text}</div>
              </div>
            </MCard>
          );
        })}
      </div>
    </>
  );
}
