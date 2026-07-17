import React, { useState } from "react";
import { BarChart3, Factory, Package, TrendingUp } from "lucide-react";
import AnalyticsLayout from "../components/dashboard/layouts/AnalyticsLayout";
import ExecutiveLayout from "../components/dashboard/layouts/ExecutiveLayout";
import InventoryLayout from "../components/dashboard/layouts/InventoryLayout";
import ProductionLayout from "../components/dashboard/layouts/ProductionLayout";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "owner" | "production" | "inventory" | "analytics"
  >("owner");

  const tabs = [
    {
      id: "owner",
      label: "Owner Command Center",
      icon: BarChart3,
    },
    {
      id: "production",
      label: "Production Control Room",
      icon: Factory,
    },
    {
      id: "inventory",
      label: "Inventory & Procurement",
      icon: Package,
    },
    {
      id: "analytics",
      label: "Business Analytics",
      icon: TrendingUp,
    },
  ];

  const dummyData = {
    kpis: [
      {
        title: "Total Revenue",
        value: "₹85,500",
        change: 10.5,
        icon: "💰",
        bgColor: "bg-yellow-50",
      },
      {
        title: "Total Orders",
        value: "1000",
        change: 10.5,
        icon: "📦",
        bgColor: "bg-purple-50",
      },
      {
        title: "Total Customers",
        value: "300",
        change: 10.5,
        icon: "👥",
        bgColor: "bg-cyan-50",
      },
    ],
    chartData: [
      { month: "Jan", value: 25000 },
      { month: "Feb", value: 32000 },
      { month: "Mar", value: 38000 },
      { month: "Apr", value: 42000 },
      { month: "May", value: 48000 },
      { month: "Jun", value: 55000 },
    ],
    tableData: [
      { name: "Rajesh Enterprises", orders: 45, revenue: 450000 },
      { name: "Priya Packaging", orders: 32, revenue: 320000 },
      { name: "Kumar Industries", orders: 18, revenue: 180000 },
    ],
  };

  return (
    <div className="min-h-screen bg-[#e8e8e8]">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "owner" && <ExecutiveLayout data={dummyData} />}
        {activeTab === "production" && <ProductionLayout data={dummyData} />}
        {activeTab === "inventory" && <InventoryLayout data={dummyData} />}
        {activeTab === "analytics" && <AnalyticsLayout data={dummyData} />}
      </div>
    </div>
  );
}
