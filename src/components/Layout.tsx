import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, BarChart3, Package, Zap, FileText, Truck, Users, LogOut, Menu, X, DollarSign, User } from "lucide-react";
import { supabase } from "../lib/supabase";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <BarChart3 size={18} /> },
  { label: "Customers", path: "/customers", icon: <Users size={18} /> },
  { label: "Orders", path: "/orders", icon: <Package size={18} /> },
  { label: "Production", path: "/production", icon: <Zap size={18} /> },
  { label: "Quotations", path: "/quotations", icon: <FileText size={18} /> },
  { label: "Invoices", path: "/invoices", icon: <DollarSign size={18} /> },
  { label: "Dispatch", path: "/dispatch", icon: <Truck size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#0a0b13]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } border-r border-white/[.06] bg-[#0b0c14] transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-white/[.06] flex items-center justify-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {sidebarOpen ? "Threxa" : "T"}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-[#B9BAC5] hover:bg-white/[.05]"
                }`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Toggle & Logout */}
        <div className="border-t border-white/[.06] p-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-4 py-2 text-[#B9BAC5] hover:bg-white/[.05] rounded-lg transition-colors"
          >
            {sidebarOpen ? <ChevronDown size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#B9BAC5] hover:text-red-400 text-sm rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-white/[.06] bg-[#0b0c14] px-8 flex items-center justify-between">
          <h2 className="text-sm text-[#B9BAC5]">Threxa ERP — Carton Box Manufacturer</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#B9BAC5] hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
