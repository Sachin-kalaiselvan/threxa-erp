import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { TrendingIcon } from "../components/Icons";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  monthlyGrowth: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 8456000,
    totalOrders: 47,
    totalCustomers: 23,
    monthlyGrowth: 18.2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [custRes, ordRes] = await Promise.all([
          supabase.from("customers").select("*"),
          supabase.from("orders").select("*"),
        ]);

        setStats(prev => ({
          ...prev,
          totalCustomers: custRes.data?.length || 0,
          totalOrders: ordRes.data?.length || 0,
        }));
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, Admin</h1>
          <p className="text-gray-600 mt-2">Carton Box Manufacturing ERP Dashboard</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 mt-3 text-green-600 text-sm font-medium">
                  <TrendingIcon />
                  <span>{stats.monthlyGrowth}% vs last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                <p className="text-gray-500 text-sm mt-3">Active & Completed</p>
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-emerald-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
                <p className="text-gray-500 text-sm mt-3">Registered</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-amber-600">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                <p className="text-gray-500 text-sm mt-3">Awaiting Production</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-gray-600 text-sm mt-1">Latest activity from your manufacturing pipeline</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Order ID</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Customer</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Amount</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">ORD-2024-001</td>
                  <td className="py-4 px-6 text-gray-700">ABC Packaging Ltd</td>
                  <td className="py-4 px-6 font-medium text-gray-900">₹2,45,000</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">In Production</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">15 Jul 2024</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">ORD-2024-002</td>
                  <td className="py-4 px-6 text-gray-700">XYZ Retail Solutions</td>
                  <td className="py-4 px-6 font-medium text-gray-900">₹1,85,500</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Completed</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">14 Jul 2024</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">ORD-2024-003</td>
                  <td className="py-4 px-6 text-gray-700">Global Exports Inc</td>
                  <td className="py-4 px-6 font-medium text-gray-900">₹3,12,750</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">12 Jul 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Production Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                  <span className="text-sm font-bold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">In Progress</span>
                  <span className="text-sm font-bold text-gray-900">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-sm font-bold text-gray-900">4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "4%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Customers</h3>
            <div className="space-y-4">
              {[
                { name: "ABC Packaging Ltd", orders: 12, value: "₹42.5L" },
                { name: "Global Exports Inc", orders: 8, value: "₹31.2L" },
                { name: "XYZ Retail Solutions", orders: 6, value: "₹18.5L" },
              ].map((customer, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.orders} orders</p>
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
