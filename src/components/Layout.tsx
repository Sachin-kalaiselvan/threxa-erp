import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import threxaIcon from "../assets/threxa-icon.png";

const menuItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/customers", label: "Customers", icon: "👥" },
  { path: "/orders", label: "Orders", icon: "📋" },
  { path: "/production", label: "Production", icon: "⚙️" },
  { path: "/quotations", label: "Quotations", icon: "📄" },
  { path: "/invoices", label: "Invoices", icon: "💳" },
  { path: "/dispatch", label: "Dispatch", icon: "🚚" },
  { path: "/products", label: "Products", icon: "📦" },
  { path: "/inventory", label: "Inventory", icon: "🏭" },
  { path: "/employees", label: "Employees", icon: "👔" },
  { path: "/attendance", label: "Attendance", icon: "⏰" },
  { path: "/payroll", label: "Payroll", icon: "💰" },
  { path: "/cashbook", label: "Cash Book", icon: "📈" },
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={threxaIcon} alt="Threxa" className="h-10 w-10 object-contain" />
            {sidebarOpen && <span className="font-bold text-lg text-gray-900">Threxa</span>}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPath === item.path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
