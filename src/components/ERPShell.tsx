import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  ShoppingCart,
  Factory,
  Boxes,
  Truck,
  IndianRupee,
  BarChart3,
  BookOpen,
  Users2,
  Settings,
  HelpCircle,
  MessageSquare,
  UserCircle,
  Bell,
} from "lucide-react";

/* ============================================================
   THREXA ERP — SHARED DARK SIDEBAR LAYOUT
   Used by all 4 command-center dashboards.
   ============================================================ */

export const T = {
  navy: "#12162B",
  navyHover: "#1C2140",
  active: "#5B4FE9",
  page: "#F3F4F7",
  card: "#FFFFFF",
  border: "#E8E9EE",
  ink: "#171923",
  sub: "#6B7280",
  green: "#16A34A",
  red: "#DC2626",
  amber: "#D97706",
  blue: "#2563EB",
  purple: "#7C3AED",
  cyan: "#0891B2",
  pink: "#DB2777",
};

const menu = [
  { path: "/", label: "Dashboard", icon: LayoutGrid },
  { path: "/quotations", label: "Quotations", icon: FileText },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/production", label: "Production", icon: Factory },
  { path: "/inventory", label: "Inventory", icon: Boxes },
  { path: "/dispatch", label: "Dispatch", icon: Truck },
  { path: "/payroll", label: "Payroll", icon: IndianRupee },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/cashbook", label: "Cash Book", icon: BookOpen },
  { path: "/masters", label: "Masters", icon: Users2 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function ERPShell({
  children,
  activePath,
}: {
  children: React.ReactNode;
  activePath?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  let navigate: (p: string) => void = () => {};
  let location = { pathname: activePath || "/" };
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    location = useLocation();
  } catch {
    // running outside router context — fallback to activePath prop
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.page, fontFamily: "Inter, -apple-system, sans-serif" }}>
      {/* ===== SIDEBAR ===== */}
      <aside
        style={{
          width: "208px",
          flexShrink: 0,
          background: T.navy,
          display: "flex",
          flexDirection: "column",
          padding: "16px 10px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 10px 20px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: T.active,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "14px",
              color: "white",
              flexShrink: 0,
            }}
          >
            T
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>Threxa ERP</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {menu.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: active ? T.active : hovered === item.path ? T.navyHover : "transparent",
                  color: active ? "white" : "#9CA3C4",
                  fontSize: "12.5px",
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 10px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#5B4FE9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            SK
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "white", margin: 0 }}>Sachin K</p>
            <p style={{ fontSize: "10.5px", color: "#8B90A8", margin: 0 }}>Administrator</p>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}

/* ---- Shared topbar used inside every dashboard page ---- */
export function DashboardTopbar({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 22px",
        borderBottom: `1px solid ${T.border}`,
        background: T.card,
      }}
    >
      <h1 style={{ fontSize: "19px", fontWeight: 700, color: T.ink, margin: 0 }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <HelpCircle size={17} style={{ color: T.sub, cursor: "pointer" }} />
        <MessageSquare size={17} style={{ color: T.sub, cursor: "pointer" }} />
        <UserCircle size={17} style={{ color: T.sub, cursor: "pointer" }} />
        <span style={{ width: "1px", height: "18px", background: T.border }} />
        <span style={{ fontSize: "12.5px", color: T.sub }}>17 Jul 2026, Fri</span>
        <Bell size={17} style={{ color: T.sub, cursor: "pointer" }} />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: T.ink,
            background: T.page,
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Today ▾
        </span>
      </div>
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        padding: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
      <p style={{ fontSize: "13.5px", fontWeight: 700, color: T.ink, margin: 0 }}>{title}</p>
      {action}
    </div>
  );
}
