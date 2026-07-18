import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ShoppingCart, Zap, FileText,
  Truck, Package, Inbox, Users2, Clock, Wallet,
  DollarSign, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";

const NAV = [
  { label: "Dashboard",  icon: LayoutDashboard, path: "/" },
  { label: "Customers",  icon: Users,            path: "/customers" },
  { label: "Orders",     icon: ShoppingCart,     path: "/orders" },
  { label: "Production", icon: Zap,              path: "/production" },
  { label: "Quotations", icon: FileText,         path: "/quotations" },
  { label: "Invoices",   icon: FileText,         path: "/invoices" },
  { label: "Dispatch",   icon: Truck,            path: "/dispatch" },
  { label: "Products",   icon: Package,          path: "/products" },
  { label: "Inventory",  icon: Inbox,            path: "/inventory" },
  { label: "Employees",  icon: Users2,           path: "/employees" },
  { label: "Attendance", icon: Clock,            path: "/attendance" },
  { label: "Payroll",    icon: Wallet,           path: "/payroll" },
  { label: "Cash Book",  icon: DollarSign,       path: "/cashbook" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [col, setCol] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const on  = (p: string) => loc.pathname === p;
  const out = async () => { await supabase.auth.signOut(); nav("/login"); };

  const S: React.CSSProperties = { width: col ? 64 : 220, minWidth: col ? 64 : 220, transition: "width .2s ease, min-width .2s ease", background: "#0D0E1C", borderRight: "1px solid rgba(255,255,255,0.055)", display: "flex", flexDirection: "column" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0A0B14", overflow: "hidden" }}>
      <aside style={S}>

        {/* brand */}
        <div style={{ height: 56, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: col ? "center" : "space-between", borderBottom: "1px solid rgba(255,255,255,0.055)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, overflow: "hidden" }}>
            <img src={threxaIcon} style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} />
            {!col && <span style={{ color: "#D8D9EE", fontWeight: 600, fontSize: 13, letterSpacing: "0.32em", whiteSpace: "nowrap" }}>THREXA</span>}
          </div>
          <button onClick={() => setCol(!col)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3D3F5E", padding: 4, borderRadius: 6, display: "flex", flexShrink: 0 }}>
            {col ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* nav */}
        <nav style={{ flex: 1, padding: "10px 7px", overflowY: "auto", overflowX: "hidden" }}>
          {NAV.map(({ label, icon: Icon, path }) => (
            <button key={path} onClick={() => nav(path)} title={col ? label : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: col ? "9px 0" : "8px 11px", justifyContent: col ? "center" : "flex-start", borderRadius: 7, marginBottom: 1, border: "none", cursor: "pointer", background: on(path) ? "rgba(100,80,255,0.16)" : "transparent", color: on(path) ? "#9D87FF" : "#4E5070", fontSize: 13, fontWeight: on(path) ? 600 : 400, transition: "all .12s" }}
              onMouseEnter={e => { if (!on(path)) { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.035)"; el.style.color = "#8E90B8"; }}}
              onMouseLeave={e => { if (!on(path)) { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "#4E5070"; }}}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {!col && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
            </button>
          ))}
        </nav>

        {/* user */}
        <div style={{ padding: "10px 7px", borderTop: "1px solid rgba(255,255,255,0.055)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: col ? "7px 0" : "7px 11px", justifyContent: col ? "center" : "flex-start" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#5B4FDB,#9B6BF7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>S</div>
            {!col && <>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#B8BAD8", fontSize: 12, fontWeight: 500 }}>Sachin K.</div>
                <div style={{ color: "#3D3F5E", fontSize: 11 }}>Admin</div>
              </div>
              <button onClick={out} style={{ background: "none", border: "none", cursor: "pointer", color: "#3D3F5E", padding: 4, borderRadius: 6, display: "flex" }} title="Sign out">
                <LogOut size={14} />
              </button>
            </>}
          </div>
          {col && <button onClick={out} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#3D3F5E", padding: "5px 0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}><LogOut size={14} /></button>}
        </div>
      </aside>

      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}
