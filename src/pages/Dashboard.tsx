import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface KPICard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  bgColor: string;
}

export default function Dashboard() {
  const [userName] = useState("Josiah");

  const kpiCards: KPICard[] = [
    {
      title: "Total Revenue",
      value: "$85,500",
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
  ];

  const topProducts = [
    { name: "Realistic", code: "8812", avatar: "🎨" },
    { name: "Monstera", code: "8832", avatar: "🌿" },
    { name: "Product", code: "9871", avatar: "📦" },
    { name: "Product", code: "2211", avatar: "🎯" },
  ];

  const salesData = [
    { month: "Jan", value: 25000 },
    { month: "Feb", value: 32000 },
    { month: "Mar", value: 38000 },
    { month: "Apr", value: 42000 },
    { month: "May", value: 48000 },
    { month: "Jun", value: 55000 },
    { month: "Jul", value: 62000 },
    { month: "Aug", value: 70000 },
    { month: "Sep", value: 65000 },
    { month: "Oct", value: 72000 },
  ];

  const maxValue = Math.max(...salesData.map((d) => d.value));

  return (
    <div className="min-h-screen p-8" style={{ background: "#e8e8e8" }}>
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {userName} 🎉</h1>
            <p className="text-gray-500 mt-1">Here's what's happening in your store.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
              🔍
            </button>
            <button className="bg-white text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
              🌙
            </button>
            <div className="relative">
              <button className="bg-white text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
                🔔
              </button>
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - KPI Cards */}
          <div className="col-span-3 space-y-6">
            {kpiCards.map((card, index) => (
              <div key={index} className={`${card.bgColor} rounded-2xl p-6 shadow-sm`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center gap-1 mt-3">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium text-sm">{card.change}%</span>
                  <span className="text-gray-500 text-sm">From Last Day</span>
                </div>
              </div>
            ))}

            {/* Sales Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sales</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">9,586</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">9,586</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-gray-900">9,586</p>
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium text-sm">20% increased</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Charts */}
          <div className="col-span-6 space-y-6">
            {/* Orders Overview Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Orders Overview</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                    <span className="text-xs text-gray-600">Orders</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                    <span className="text-xs text-gray-600">Profit</span>
                  </span>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="h-64 flex items-flex-end justify-between gap-2 px-2">
                {salesData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end">
                    <div className="relative w-full h-48 flex items-flex-end justify-center">
                      {/* Dual bars for Orders and Profit */}
                      <div className="flex gap-1 items-flex-end h-full">
                        <div
                          className="bg-amber-400 rounded-t-sm flex-1"
                          style={{ height: `${(data.value / maxValue) * 180}px` }}
                        ></div>
                        <div
                          className="bg-purple-400 rounded-t-sm flex-1"
                          style={{ height: `${((data.value + 15000) / maxValue) * 180}px` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Purchase Analytics</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                    <span className="text-xs text-gray-600">Sold</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
                    <span className="text-xs text-gray-600">Purchased</span>
                  </span>
                </div>
              </div>
              <div className="h-24 flex items-center justify-center text-gray-400">
                <p>100k baseline</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3 space-y-6">
            {/* Sale Analytics - Donut Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Sale Analytics</h3>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Cyan segment (70% - Returned) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="20"
                      strokeDasharray="131.95 188.5"
                      strokeLinecap="round"
                    />
                    {/* Orange segment (20% - Completed) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="20"
                      strokeDasharray="56.55 188.5"
                      strokeDashoffset="-131.95"
                      strokeLinecap="round"
                    />
                    {/* Purple segment (10% - Distributed) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="20"
                      strokeDasharray="28.275 188.5"
                      strokeDashoffset="-188.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">20% Completed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">70% Returned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">10% Distributed</span>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">Product</p>
                  <p className="text-sm font-medium text-gray-700 text-right">Code</p>
                </div>
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{product.avatar}</span>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{product.code}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
