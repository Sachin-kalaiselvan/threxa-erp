import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Zap,
  FileText,
  Truck,
  Package,
  Inbox,
  Users2,
  Clock,
  Wallet,
  DollarSign,
  LogOut,
  Bell,
  Settings,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#111827] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo Area - icon only, no fake text box */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen ? (
            <img src={threxaIcon} alt="Threxa" className="h-8 w-8 object-contain" />
          ) : (
            <img src={threxaIcon} alt="Threxa" className="h-7 w-7 object-contain mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-800 p-1.5 rounded transition"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-600/10 text-gray-300 hover:text-red-400 transition text-sm"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content - single thin topbar, no duplicate logo, no leftover copy */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={18} className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
