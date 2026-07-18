import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, LayoutDashboard, Users, ShoppingCart, Zap, FileText, Truck,
  Package, Inbox, Users2, Clock, Wallet, DollarSign, LogOut, Bell, Settings,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";

const BG = "#0B0C14";
const SIDEBAR = "#0E0F18";
const BORDER = "1px solid rgba(255,255,255,0.06)";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Customers", icon: Users, path: "/customers" },
    { label: "Orders", icon: ShoppingCart, path: "/orders" },
    { label: "Production", icon: Zap, path: "/production" },
    { label: "Quotations", icon: FileText, path: "/quotations" },
    { label: "Invoices", icon: FileText, path: "/invoices" },
    { label: "Dispatch", icon: Truck, path: "/dispatch" },
    { label: "Products", icon: Package, path: "/products" },
    { label: "Inventory", icon: Inbox, path: "/inventory" },
    { label: "Employees", icon: Users2, path: "/employees" },
    { label: "Attendance", icon: Clock, path: "/attendance" },
    { label: "Payroll", icon: Wallet, path: "/payroll" },
    { label: "Cash Book", icon: DollarSign, path: "/cashbook" },
  ];

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen" style={{ background: BG }}>
      {/* ── Sidebar ── */}
      <aside
        className={`${open ? "w-60" : "w-[68px]"} flex flex-col transition-all duration-300`}
        style={{ background: SIDEBAR, borderRight: BORDER }}
      >
        {/* Brand: icon + tracked wordmark (text = always crisp) */}
        <div className="h-16 px-4 flex items-center justify-between"
          style={{ borderBottom: BORDER }}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src={threxaIcon} alt="Threxa" className="h-8 w-8 object-contain shrink-0" />
            {open && (
              <span
                className="text-[15px] font-semibold select-none"
                style={{ color: "#E7E8F0", letterSpacing: "0.34em" }}
              >
                THREXA
              </span>
            )}
          </div>
          <button onClick={() => setOpen(!open)}
            className="p-1.5 rounded transition hover:bg-white/5 text-gray-400">
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menu.map((m) => {
            const Icon = m.icon;
            const active = location.pathname === m.path;
            return (
              <button key={m.path} onClick={() => navigate(m.path)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition"
                style={active
                  ? { background: "linear-gradient(90deg,#6D5CFF,#8B5CF6)", color: "#fff" }
                  : { color: "#8A8CA3" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={17} className="shrink-0" />
                {open && <span>{m.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-3" style={{ borderTop: BORDER }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#6D5CFF,#8B5CF6)" }}>
              S
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#E7E8F0" }}>Sachin</p>
                <p className="text-[11px]" style={{ color: "#8A8CA3" }}>Administrator</p>
              </div>
            )}
            <button onClick={logout}
              className="p-1.5 rounded transition hover:bg-white/5 text-gray-400 hover:text-red-400 shrink-0">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 px-6 flex items-center justify-end gap-1 shrink-0"
          style={{ background: BG, borderBottom: BORDER }}>
          <button className="p-2 rounded-lg transition hover:bg-white/5 text-gray-400">
            <Bell size={17} />
          </button>
          <button className="p-2 rounded-lg transition hover:bg-white/5 text-gray-400">
            <Settings size={17} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
