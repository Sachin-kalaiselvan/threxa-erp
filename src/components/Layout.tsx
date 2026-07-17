import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";
import {
  DashboardIcon,
  UsersIcon,
  OrdersIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronDownIcon,
} from "./Icons";

const menuItems = [
  { path: "/", label: "Dashboard", icon: DashboardIcon },
  { path: "/customers", label: "Customers", icon: UsersIcon },
  { path: "/orders", label: "Orders", icon: OrdersIcon },
  { path: "/production", label: "Production", icon: SettingsIcon },
  { path: "/quotations", label: "Quotations", icon: OrdersIcon },
  { path: "/invoices", label: "Invoices", icon: SettingsIcon },
  { path: "/dispatch", label: "Dispatch", icon: UsersIcon },
  { path: "/products", label: "Products", icon: OrdersIcon },
  { path: "/inventory", label: "Inventory", icon: SettingsIcon },
  { path: "/employees", label: "Employees", icon: UsersIcon },
  { path: "/attendance", label: "Attendance", icon: SettingsIcon },
  { path: "/payroll", label: "Payroll", icon: OrdersIcon },
  { path: "/cashbook", label: "Cash Book", icon: SettingsIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col border-r border-gray-100`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={threxaIcon} alt="Threxa" className="h-10 w-10 object-contain flex-shrink-0" />
            {sidebarOpen && (
              <div>
                <div className="font-bold text-lg text-gray-900">Threxa</div>
                <div className="text-xs text-gray-500">Manufacturing ERP</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-all font-medium text-sm ${
                  currentPath === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={sidebarOpen ? "" : item.label}
              >
                <Icon />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm transition-all"
            title={sidebarOpen ? "" : "Logout"}
          >
            <LogoutIcon />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-all"
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
