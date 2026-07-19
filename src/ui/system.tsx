/* ═══════════════════════════════════════════════════════════
   THREXA ERP · DESIGN SYSTEM v1.0
   Single source of truth for every page.
   Rule: modules NEVER hand-roll layout — they compose these.
   ═══════════════════════════════════════════════════════════ */
import { useState } from "react";
import { Search, Filter, Download, Upload, Plus, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

/* ── tokens ─────────────────────────────────────────────── */
export const T = {
  bg:       "#0A0B14",
  sidebar:  "#0D0E1C",
  card:     "#171923",
  card2:    "#1E2130",
  line:     "rgba(255,255,255,0.08)",
  lineSoft: "rgba(255,255,255,0.05)",
  text:     "#E6E7F2",
  sub:      "#9DA0BC",
  muted:    "#5C5F7E",
  accent:   "#7B68FF",
  green:    "#34D399",
  red:      "#F87171",
  amber:    "#FBBF24",
  blue:     "#60A5FA",
  radius:   10,
  container: 1600,
} as const;

export const fmtINR = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` :
  n >= 1e5 ? `₹${(n / 1e5).toFixed(2)}L` :
  `₹${n.toLocaleString("en-IN")}`;

/* ── Card ───────────────────────────────────────────────── */
export function Card({ children, pad = 0, style = {} }:
  { children: React.ReactNode; pad?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: T.radius, padding: pad, ...style }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{children}</span>
      {action}
    </div>
  );
}

/* ── Buttons ────────────────────────────────────────────── */
export function Btn({ children, variant = "ghost", icon: Icon, onClick }:
  { children?: React.ReactNode; variant?: "primary" | "ghost"; icon?: any; onClick?: () => void }) {
  const primary = variant === "primary";
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "8px 14px", fontSize: 13, fontWeight: 500,
      borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
      background: primary ? T.accent : T.card,
      color: primary ? "#fff" : T.sub,
      border: primary ? "none" : `1px solid ${T.line}`,
      transition: "opacity .12s",
    }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

/* ── Badge ──────────────────────────────────────────────── */
export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: `${color}1c`, color, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export function Dot({ color }: { color: string }) {
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
}

/* ── Progress bar ───────────────────────────────────────── */
export function Progress({ value, color = T.accent, height = 5 }:
  { value: number; color?: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, background: "rgba(255,255,255,0.07)", overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${Math.min(value, 100)}%`, borderRadius: 99, background: color, transition: "width .3s" }} />
    </div>
  );
}

/* ── Sparkline ──────────────────────────────────────────── */
export function Spark({ values, color, w = 64, h = 22 }:
  { values: number[]; color: string; w?: number; h?: number }) {
  const mx = Math.max(...values), mn = Math.min(...values), r = mx - mn || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - mn) / r) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── PageShell: identical skeleton for every module ─────── */
export function PageShell({ title, subtitle, meta, children }:
  { title: string; subtitle?: string; meta?: string[]; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100%", background: T.bg }}>
      <div style={{ maxWidth: T.container, margin: "0 auto", padding: "28px 32px 40px" }}>
        <div style={{ marginBottom: 6 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13, color: T.muted, margin: "3px 0 0" }}>{subtitle}</p>}
          {meta && (
            <div style={{ display: "flex", gap: 0, marginTop: 6, flexWrap: "wrap" }}>
              {meta.map((m, i) => (
                <span key={m} style={{ fontSize: 12, color: T.muted }}>
                  {i > 0 && <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.15)" }}>•</span>}
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ height: 1, background: T.lineSoft, margin: "16px 0 20px" }} />
        {children}
      </div>
    </div>
  );
}

/* ── Compact KPI strip (cards ≈100px tall) ──────────────── */
export function KPIStrip({ items }: {
  items: { label: string; value: string; sub?: string; delta?: string; up?: boolean; spark?: number[]; color?: string }[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 10, marginBottom: 20 }}>
      {items.map(k => (
        <Card key={k.label} pad={0} style={{ padding: "12px 14px", minHeight: 96 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 11, color: T.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</span>
            {k.spark && <Spark values={k.spark} color={k.color ?? T.accent} />}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: T.text, marginTop: 6, letterSpacing: "-0.02em" }}>{k.value}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginTop: 3 }}>
            {k.delta && <span style={{ fontSize: 11, fontWeight: 600, color: k.up === false ? T.red : T.green }}>{k.delta}</span>}
            {k.sub && <span style={{ fontSize: 11, color: T.muted }}>{k.sub}</span>}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── ActionBar: search · filter · export · import · primary ─ */
export function ActionBar({ search, onSearch, placeholder = "Search…", primaryLabel, onPrimary, showFilter = true, showExport = true, showImport = false, onExport }:
  { search: string; onSearch: (v: string) => void; placeholder?: string; primaryLabel?: string; onPrimary?: () => void; showFilter?: boolean; showExport?: boolean; showImport?: boolean; onExport?: () => void }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
      <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.muted }} />
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", height: 38, background: T.card, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px 0 32px", fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ flex: 1 }} />
      {showFilter && <Btn icon={Filter}>Filter</Btn>}
      {showExport && <Btn icon={Download} onClick={onExport}>Export</Btn>}
      {showImport && <Btn icon={Upload}>Import</Btn>}
      {primaryLabel && <Btn variant="primary" icon={Plus} onClick={onPrimary}>{primaryLabel}</Btn>}
    </div>
  );
}

/* ── DataTable: light header, dividers, 2-line cells, pagination ─ */
export type Col = { key: string; label: string; align?: "left" | "right" | "center"; width?: number };

export function DataTable({ cols, rows, pageSize = 8 }:
  { cols: Col[]; rows: Record<string, React.ReactNode>[]; pageSize?: number }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const slice = rows.slice(page * pageSize, (page + 1) * pageSize);

  if (!rows.length) {
    return (
      <Card style={{ padding: "56px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Inbox size={28} color={T.muted} />
        <span style={{ fontSize: 13, color: T.muted }}>No records yet</span>
      </Card>
    );
  }

  return (
    <Card>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{
                padding: "11px 16px", textAlign: c.align ?? "left",
                fontSize: 11, fontWeight: 600, color: T.sub, letterSpacing: "0.06em", textTransform: "uppercase",
                borderBottom: `1px solid ${T.line}`, whiteSpace: "nowrap", width: c.width,
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((r, i) => (
            <tr key={i}
              style={{ borderBottom: i === slice.length - 1 ? "none" : `1px solid ${T.lineSoft}` }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "11px 16px", fontSize: 13, color: T.sub, textAlign: c.align ?? "left", verticalAlign: "middle" }}>
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: `1px solid ${T.line}` }}>
          <span style={{ fontSize: 12, color: T.muted }}>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} of {rows.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              style={{ background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: 5, cursor: page === 0 ? "default" : "pointer", color: page === 0 ? T.muted : T.sub, display: "flex" }}>
              <ChevronLeft size={14} />
            </button>
            <button disabled={page === pages - 1} onClick={() => setPage(p => p + 1)}
              style={{ background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: 5, cursor: page === pages - 1 ? "default" : "pointer", color: page === pages - 1 ? T.muted : T.sub, display: "flex" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ── Two-line cell helper (primary + secondary info) ────── */
export function Cell2({ primary, secondary }: { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <div>
      <div style={{ color: T.text, fontWeight: 500, fontSize: 13 }}>{primary}</div>
      {secondary && <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{secondary}</div>}
    </div>
  );
}
