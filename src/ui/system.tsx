/* ═══════════════════════════════════════════════════════════
   THREXA ERP · DESIGN SYSTEM v1.0
   Single source of truth for every page.
   Rule: modules NEVER hand-roll layout — they compose these.
   ═══════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from "react";
import { Search, Filter, Download, Upload, Plus, ChevronLeft, ChevronRight, Inbox, X } from "lucide-react";

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
export function ActionBar({
  search, onSearch, placeholder = "Search…", primaryLabel, onPrimary,
  showExport = true, showImport = false, onExport, onImport,
  filterLabel = "Status", filterValue = "All", filterOptions, onFilter,
}: {
  search: string; onSearch: (v: string) => void; placeholder?: string;
  primaryLabel?: string; onPrimary?: () => void;
  showExport?: boolean; showImport?: boolean;
  onExport?: () => void; onImport?: (file: File) => void;
  filterLabel?: string; filterValue?: string;
  filterOptions?: readonly string[]; onFilter?: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
      <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.muted }} />
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", height: 38, background: T.card, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px 0 32px", fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ flex: 1 }} />

      {filterOptions && filterOptions.length > 0 && (
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <Filter size={13} style={{ position: "absolute", left: 12, color: T.muted, pointerEvents: "none" }} />
          <select
            value={filterValue}
            onChange={e => onFilter?.(e.target.value)}
            style={{ height: 38, background: filterValue === "All" ? T.card : T.card2, border: `1px solid ${filterValue === "All" ? T.line : T.accent}`, borderRadius: 8, padding: "0 30px 0 32px", fontSize: 13, color: filterValue === "All" ? T.sub : T.text, outline: "none", cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
            <option value="All">{filterLabel}: All</option>
            {filterOptions.map(o => <option key={o} value={o}>{filterLabel}: {o}</option>)}
          </select>
          <ChevronRight size={13} style={{ position: "absolute", right: 11, color: T.muted, pointerEvents: "none", transform: "rotate(90deg)" }} />
        </div>
      )}

      {showExport && <Btn icon={Download} onClick={onExport}>Export</Btn>}

      {showImport && (
        <>
          <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) onImport?.(f); e.target.value = ""; }} />
          <Btn icon={Upload} onClick={() => fileRef.current?.click()}>Import</Btn>
        </>
      )}

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

/* ═══════════════════════════════════════════════════════════
   INTERACTION PRIMITIVES
   Modal · FormModal · Menu · MenuItem · Toggle · useClickOutside
   ═══════════════════════════════════════════════════════════ */

/* ── useClickOutside: closes on outside mousedown or Escape ── */
export function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  const cb = useRef(onClose);
  cb.current = onClose;
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb.current();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") cb.current(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return ref;
}

/* ── Menu: anchored dropdown panel. Parent must be position:relative ── */
export function Menu({ open, onClose, width = 280, align = "right", children }:
  { open: boolean; onClose: () => void; width?: number; align?: "left" | "right"; children: React.ReactNode }) {
  const ref = useClickOutside<HTMLDivElement>(onClose);
  if (!open) return null;
  const pos: React.CSSProperties = align === "right" ? { right: 0 } : { left: 0 };
  return (
    <div ref={ref} style={{
      position: "absolute", top: "calc(100% + 10px)", ...pos, width,
      background: T.card, border: `1px solid ${T.line}`, borderRadius: T.radius,
      boxShadow: "0 20px 56px rgba(0,0,0,0.6)", zIndex: 80, overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

/* ── MenuItem ── */
export function MenuItem({ icon: Icon, label, sub, danger = false, onClick }:
  { icon?: any; label: string; sub?: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
      textAlign: "left", color: danger ? T.red : T.sub, fontSize: 13,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={e => (e.currentTarget.style.background = "none")}>
      {Icon && <Icon size={15} style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", color: danger ? T.red : T.text, fontWeight: 500 }}>{label}</span>
        {sub && <span style={{ display: "block", color: T.muted, fontSize: 11.5, marginTop: 1 }}>{sub}</span>}
      </span>
    </button>
  );
}

/* ── Toggle ── */
export function Toggle({ on, onChange, label, sub }:
  { on: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!on)} style={{
        width: 38, height: 21, borderRadius: 11, border: "none", cursor: "pointer", flexShrink: 0,
        background: on ? T.accent : "rgba(255,255,255,0.12)", position: "relative", transition: "background .15s",
      }}>
        <span style={{
          position: "absolute", top: 3, left: on ? 20 : 3, width: 15, height: 15,
          borderRadius: "50%", background: "#fff", transition: "left .15s",
        }} />
      </button>
    </div>
  );
}

/* ── Modal: overlay + centred card. Render conditionally. ── */
export function Modal({ title, subtitle, onClose, children, footer, width = 580 }:
  { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div onMouseDown={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(4,5,12,0.72)", backdropFilter: "blur(3px)",
      zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "60px 20px 40px", overflowY: "auto",
    }}>
      <div onMouseDown={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: width, background: T.card, border: `1px solid ${T.line}`,
        borderRadius: 14, boxShadow: "0 32px 80px rgba(0,0,0,0.65)", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "18px 20px 14px", borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: "none", border: "none", cursor: "pointer", color: T.muted,
            padding: 5, borderRadius: 6, display: "flex", flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = T.text)}
            onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
            <X size={17} />
          </button>
        </div>

        <div style={{ padding: "18px 20px" }}>{children}</div>

        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 20px", borderTop: `1px solid ${T.lineSoft}`, background: T.card2 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── FormModal: declarative create/edit form ── */
export type FieldSpec = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "date";
  options?: readonly string[];
  placeholder?: string;
  required?: boolean;
  half?: boolean;
};

const inputStyle: React.CSSProperties = {
  width: "100%", height: 38, background: T.bg, border: `1px solid ${T.line}`,
  borderRadius: 8, padding: "0 11px", fontSize: 13, color: T.text,
  outline: "none", boxSizing: "border-box",
};

export function FormModal({ title, subtitle, fields, initial, submitLabel = "Save", onClose, onSave }: {
  title: string;
  subtitle?: string;
  fields: readonly FieldSpec[];
  initial?: Record<string, any>;
  submitLabel?: string;
  onClose: () => void;
  onSave: (values: Record<string, any>) => void;
}) {
  const [v, setV] = useState<Record<string, any>>(() => {
    const o: Record<string, any> = {};
    for (const f of fields) {
      const seed = initial?.[f.key];
      o[f.key] = seed !== undefined && seed !== null
        ? String(seed)
        : f.type === "select" ? (f.options?.[0] ?? "") : "";
    }
    return o;
  });
  const [missing, setMissing] = useState<string[]>([]);

  const set = (k: string, val: string) => {
    setV(p => ({ ...p, [k]: val }));
    setMissing(p => p.filter(x => x !== k));
  };

  const submit = () => {
    const bad = fields.filter(f => f.required && !String(v[f.key] ?? "").trim()).map(f => f.key);
    if (bad.length) { setMissing(bad); return; }
    const out: Record<string, any> = {};
    for (const f of fields) {
      const raw = String(v[f.key] ?? "").trim();
      out[f.key] = f.type === "number" ? (raw === "" ? 0 : Number(raw.replace(/[^0-9.-]/g, "")) || 0) : raw;
    }
    onSave(out);
  };

  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose} footer={
      <>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={submit}>{submitLabel}</Btn>
      </>
    }>
      {missing.length > 0 && (
        <div style={{ background: "rgba(248,113,113,0.10)", border: `1px solid rgba(248,113,113,0.35)`, color: T.red, fontSize: 12.5, borderRadius: 8, padding: "9px 12px", marginBottom: 14 }}>
          Please fill the highlighted {missing.length === 1 ? "field" : "fields"}.
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "13px 14px" }}>
        {fields.map(f => {
          const bad = missing.includes(f.key);
          const border = bad ? T.red : T.line;
          return (
            <div key={f.key} style={{ gridColumn: f.half ? "span 1" : "span 2" }}>
              <label style={{ display: "block", fontSize: 11.5, color: T.sub, marginBottom: 5, fontWeight: 500 }}>
                {f.label}{f.required && <span style={{ color: T.red, marginLeft: 3 }}>*</span>}
              </label>
              {f.type === "select" ? (
                <select value={v[f.key]} onChange={e => set(f.key, e.target.value)}
                  style={{ ...inputStyle, borderColor: border, cursor: "pointer" }}>
                  {(f.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  value={v[f.key]}
                  placeholder={f.placeholder}
                  onChange={e => set(f.key, e.target.value)}
                  style={{ ...inputStyle, borderColor: border, colorScheme: "dark" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

/* ── newId: stable-enough client id for locally created rows ── */
export const newId = () => `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ── parseCSV: header row + quoted cells, used by ActionBar imports ── */
export function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cell = "", row: string[] = [], q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  if (rows.length < 2) return [];
  const head = rows[0].map(h => h.trim());
  return rows.slice(1).filter(r => r.some(c => c.trim() !== "")).map(r => {
    const o: Record<string, string> = {};
    head.forEach((h, i) => (o[h] = (r[i] ?? "").trim()));
    return o;
  });
}
