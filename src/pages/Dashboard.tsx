import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    order_no: string;
    amount: number;
    status: "completed" | "in_production" | "pending";
    date: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 8456000,
    totalOrders: 47,
    totalCustomers: 23,
    recentOrders: [
      {
        id: "1",
        order_no: "ORD-2024-001",
        amount: 245000,
        status: "in_production",
        date: "15 Jul 2024",
      },
      {
        id: "2",
        order_no: "ORD-2024-002",
        amount: 185500,
        status: "completed",
        date: "14 Jul 2024",
      },
      {
        id: "3",
        order_no: "ORD-2024-003",
        amount: 312750,
        status: "pending",
        date: "12 Jul 2024",
      },
    ],
  });

  return (
    <div className="min-h-screen p-8" style={{ background: "#e8e8e8" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900" style={{ letterSpacing: "-0.5px" }}>
              Welcome, Admin
            </h1>
            <p className="text-gray-500 mt-1">Here's what's happening in your manufacturing pipeline.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium border border-gray-200">
              🔍
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium border border-gray-200">
              🌙
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium border border-gray-200">
              🔔
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ background: "linear-gradient(135deg, #fff8e6 0%, #ffe8cc 100%)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-green-600 text-sm font-medium mt-3">📈 18.2% higher vs previous month</p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ background: "linear-gradient(135deg, #e6f0ff 0%, #cce0ff 100%)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">{stats.totalOrders}</p>
                <p className="text-blue-600 text-sm font-medium mt-3">Active & Completed</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ background: "linear-gradient(135deg, #e6ffe6 0%, #ccffcc 100%)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">{stats.totalCustomers}</p>
                <p className="text-green-600 text-sm font-medium mt-3">Registered partners</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ background: "linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">12</p>
                <p className="text-red-600 text-sm font-medium mt-3">Awaiting attention</p>
              </div>
              <div className="text-5xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{order.order_no}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{(order.amount / 1000).toFixed(0)}K</p>
                  <p
                    className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1 ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "in_production"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status === "completed" ? "Completed" : order.status === "in_production" ? "In Production" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Production Status */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Production Status</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                  <span className="text-sm font-bold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">In Progress</span>
                  <span className="text-sm font-bold text-gray-900">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-sm font-bold text-gray-900">4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-amber-500 h-3 rounded-full" style={{ width: "4%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Customers</h3>
            <div className="space-y-4">
              {[
                { name: "ABC Packaging Ltd", orders: "12 orders", value: "₹42.5L" },
                { name: "Global Exports Inc", orders: "8 orders", value: "₹31.2L" },
                { name: "XYZ Retail Solutions", orders: "6 orders", value: "₹18.5L" },
              ].map((customer, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.orders}</p>
                  </div>
                  <span className="font-bold text-gray-900">{customer.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
