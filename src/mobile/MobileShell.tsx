/* ═══════════════════════════════════════════════════════════
   THREXA MOBILE · SHELL
   Phone-shaped chrome shared by Owner / Supervisor / Driver.
   Safe-area aware, thumb-reachable bottom nav, language toggle.
   ═══════════════════════════════════════════════════════════ */
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Languages } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useLang } from "../i18n";
import type { TKey } from "../i18n";
import threxaIcon from "../assets/threxa-icon.png";

export const M = {
  bg: "#0A0B14",
  card: "#171923",
  card2: "#1E2130",
  line: "rgba(255,255,255,0.08)",
  text: "#E6E7F2",
  sub: "#9DA0BC",
  muted: "#5C5F7E",
  accent: "#7B68FF",
  green: "#34D399",
  red: "#F87171",
  amber: "#FBBF24",
  blue: "#60A5FA",
} as const;

export const fmtINR = (n: number) =>
  n >= 1e7
    ? `₹${(n / 1e7).toFixed(2)} Cr`
    : n >= 1e5
    ? `₹${(n / 1e5).toFixed(2)}L`
    : `₹${n.toLocaleString("en-IN")}`;

export type NavItem = { path: string; label: TKey; icon: any };

export function MobileShell({
  roleLabel,
  nav,
  children,
}: {
  roleLabel: TKey;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const { t, toggle } = useLang();
  const navigate = useNavigate();
  const loc = useLocation();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: M.bg,
        color: M.text,
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Kannada', sans-serif",
      }}
    >
      {/* ── header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(10,11,20,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${M.line}`,
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div
          style={{
            height: 54,
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <img
              src={threxaIcon}
              alt=""
              style={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  color: "#D8D9EE",
                  lineHeight: 1.1,
                }}
              >
                THREXA
              </div>
              <div style={{ fontSize: 11, color: M.muted, lineHeight: 1.3 }}>
                {t(roleLabel)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={toggle}
              aria-label="Switch language"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: M.card,
                border: `1px solid ${M.line}`,
                color: M.sub,
                borderRadius: 8,
                padding: "7px 10px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Languages size={13} />
              {t("language")}
            </button>
            <button
              onClick={signOut}
              aria-label={t("signOut")}
              style={{
                background: M.card,
                border: `1px solid ${M.line}`,
                color: M.muted,
                borderRadius: 8,
                padding: "8px 9px",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── content ── */}
      <main
        style={{
          flex: 1,
          padding: "14px 14px 92px",
          maxWidth: 560,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {children}
      </main>

      {/* ── bottom nav ── */}
      {nav.length > 1 && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            background: "rgba(13,14,28,0.96)",
            backdropFilter: "blur(12px)",
            borderTop: `1px solid ${M.line}`,
            paddingBottom: "env(safe-area-inset-bottom)",
            display: "flex",
          }}
        >
          {nav.map(({ path, label, icon: Icon }) => {
            const on = loc.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 4px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  color: on ? "#9D87FF" : M.muted,
                  fontSize: 11,
                  fontWeight: on ? 600 : 400,
                }}
              >
                <Icon size={19} />
                <span>{t(label)}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

/* ── shared bits ── */

export function MCard({
  children,
  pad = 14,
  style = {},
}: {
  children: React.ReactNode;
  pad?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: M.card,
        border: `1px solid ${M.line}`,
        borderRadius: 12,
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 20,
        background: `${color}1c`,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export function MBtn({
  children,
  onClick,
  variant = "ghost",
  disabled = false,
  full = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "success" | "danger";
  disabled?: boolean;
  full?: boolean;
}) {
  const bg =
    variant === "primary"
      ? M.accent
      : variant === "success"
      ? M.green
      : variant === "danger"
      ? M.red
      : M.card2;
  const solid = variant !== "ghost";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: full ? 1 : undefined,
        width: full ? "100%" : undefined,
        minHeight: 44,
        padding: "11px 16px",
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        background: solid ? bg : M.card2,
        color: solid ? (variant === "primary" ? "#fff" : "#08210F") : M.sub,
        border: solid ? "none" : `1px solid ${M.line}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
      }}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: M.muted,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        margin: "20px 0 9px",
      }}
    >
      {children}
    </h2>
  );
}
