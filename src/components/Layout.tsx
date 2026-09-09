import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ShoppingCart, Zap, FileText,
  Truck, Package, Inbox, Users2, Clock, Wallet,
  DollarSign, LogOut, ChevronLeft, ChevronRight,
  Scissors, CalendarClock, Calculator, ShieldCheck, Building2, History,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useLang } from "../i18n";
import type { TKey } from "../i18n";
import threxaIcon from "../assets/threxa-icon.png";

const NAV: { label: TKey; icon: any; path: string }[] = [
  { label: "navDashboard",  icon: LayoutDashboard, path: "/" },
  { label: "navCustomers",  icon: Users,            path: "/customers" },
  { label: "navOrders",     icon: ShoppingCart,     path: "/orders" },
  { label: "navProduction", icon: Zap,              path: "/production" },
  { label: "navScheduling", icon: CalendarClock,     path: "/scheduling" },
  { label: "navQuality",    icon: ShieldCheck,       path: "/quality" },
  { label: "navQuotations", icon: FileText,         path: "/quotations" },
  { label: "navQuoteCalc",  icon: Calculator,        path: "/quote-calculator" },
  { label: "navInvoices",   icon: FileText,         path: "/invoices" },
  { label: "navDispatch",   icon: Truck,            path: "/dispatch" },
  { label: "navProducts",   icon: Package,          path: "/products" },
  { label: "navInventory",  icon: Inbox,            path: "/inventory" },
  { label: "navWastage",    icon: Scissors,         path: "/wastage" },
  { label: "navVendors",    icon: Building2,        path: "/vendors" },
  { label: "navEmployees",  icon: Users2,           path: "/employees" },
  { label: "navAttendance", icon: Clock,            path: "/attendance" },
  { label: "navPayroll",    icon: Wallet,           path: "/payroll" },
  { label: "navCashBook",   icon: DollarSign,       path: "/cashbook" },
  { label: "navActivity",   icon: History,          path: "/activity" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [col, setCol] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const t = useLang();

  const on = (p: string) => loc.pathname === p;

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0B14" }}>
      <div style={{ width: col ? 60 : 260, background: "#0D0E1C", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", transition: "width .2s", paddingTop: 16, paddingBottom: 16 }}>
        <button onClick={() => setCol(!col)} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, padding: "0 12px", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}>
          <img src={threxaIcon} alt="Threxa" style={{ height: col ? 32 : 24, width: "auto" }} />
        </button>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, paddingX: 8, overflowY: "auto" }}>
          {NAV.map(({ label, icon: Icon, path }) => (
            <button key={path} onClick={() => nav(path)} title={col ? t(label) : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: col ? "9px 0" : "8px 11px", justifyContent: col ? "center" : "flex-start", borderRadius: 7, marginBottom: 1, border: "none", cursor: "pointer", background: on(path) ? "rgba(100,80,255,0.16)" : "transparent", color: on(path) ? "#9D87FF" : "#4E5070", fontSize: 13, fontWeight: on(path) ? 600 : 400, transition: "all .12s" }}
              onMouseEnter={e => { if (!on(path)) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.035)"; el.style.color = "#8E90B8"; }}}
              onMouseLeave={e => { if (!on(path)) { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#4E5070"; }}}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!col && <span style={{ whiteSpace: "nowrap" }}>{t(label)}</span>}
            </button>
          ))}
        </nav>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 9, padding: col ? "9px 0" : "8px 11px", justifyContent: col ? "center" : "flex-start", width: "100%", borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", color: "#4E5070", fontSize: 13, transition: "all .12s" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(248,113,113,0.1)"; el.style.color = "#F87171"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#4E5070"; }}>
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!col && <span>{t("logout")}</span>}
        </button>
        <button onClick={() => setCol(!col)} title="Toggle sidebar" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 38, marginTop: 8, background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, cursor: "pointer", color: "#8E90B8", transition: "all .12s" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(123,104,255,0.3)"; el.style.color = "#9D87FF"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.color = "#8E90B8"; }}>
          {col ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}
