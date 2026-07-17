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
    <div className="flex h-screen" style={{ background: "#e8e8e8" }}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } transition-all duration-300 flex flex-col border-r border-gray-300 shadow-md`}
        style={{ background: "#f0f0f0" }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <img src={threxaIcon} alt="Threxa" className="h-10 w-10 object-contain flex-shrink-0" />
            {sidebarOpen && (
              <div>
                <div className="font-bold text-lg text-gray-900" style={{ letterSpacing: "-0.5px" }}>
                  Threxa
                </div>
                <div className="text-xs text-gray-600">Manufacturing ERP</div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all font-medium text-sm ${
                currentPath === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              title={sidebarOpen ? "" : item.label}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm transition-all"
            title={sidebarOpen ? "" : "Logout"}
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-300 flex justify-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-all font-bold"
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
