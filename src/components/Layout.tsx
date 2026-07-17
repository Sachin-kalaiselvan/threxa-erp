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
} from "lucide-react";
import { supabase } from "../lib/supabase";

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
    <div className="flex h-screen bg-[#e8e8e8]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1a1a1a] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo Area */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-sm">Threxa</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-700 p-2 rounded transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-600/20 text-gray-300 hover:text-red-400 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-700 font-semibold">Manufacturing ERP</h2>
          <div className="text-sm text-gray-500">Welcome to Threxa</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen p-8 bg-[#e8e8e8]">{children}</div>
        </div>
      </div>
    </div>
  );
}
