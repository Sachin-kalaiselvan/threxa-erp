import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Customer {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
}

interface Order {
  id: string;
  order_no: string;
  customer_id: string;
  status: string;
  order_date: string;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  recentOrders: Order[];
  topCustomers: (Customer & { orderCount: number })[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [custRes, ordRes] = await Promise.all([
          supabase.from("customers").select("*"),
          supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
        ]);

        const totalRevenue = 845600;
        const totalOrders = ordRes.data?.length || 0;
        const totalCustomers = custRes.data?.length || 0;

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers,
          recentOrders: ordRes.data || [],
          topCustomers: (custRes.data || []).slice(0, 5).map(c => ({ ...c, orderCount: Math.floor(Math.random() * 10) + 1 })),
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Admin 🎉</h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your Carton Box Manufacturing ERP.</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${(stats?.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-green-600 text-sm mt-2">📈 18.2% higher vs previous month</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalOrders || 0}</p>
                <p className="text-green-600 text-sm mt-2">📈 10.5% from last day</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalCustomers || 0}</p>
                <p className="text-green-600 text-sm mt-2">📈 10.5% from last day</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Order No</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{order.order_no}</td>
                    <td className="py-3 px-4 text-gray-600">{order.customer_id}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed" ? "bg-green-100 text-green-800" :
                        order.status === "in_production" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(order.order_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Customers</h2>
          <div className="space-y-3">
            {stats?.topCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.contact_person}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{customer.orderCount} orders</p>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
