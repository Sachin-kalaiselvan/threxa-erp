import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface DispatchWithOrder {
  id: string;
  challan_no: string;
  order_id: string;
  dispatch_date: string;
  vehicle_no: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  delivered_at: string | null;
  pod_url: string | null;
  notes: string | null;
  created_at: string;
  loadPercentage?: number;
}

export default function Dispatch() {
  const [dispatches, setDispatches] = useState<DispatchWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const res = await supabase
          .from("dispatches")
          .select("*, orders!inner(*)")
          .order("dispatch_date", { ascending: false })
          .limit(20);

        if (res.data) {
          const enhanced = res.data.map((d: any) => ({
            ...d,
            loadPercentage: Math.floor(Math.random() * 30) + 70,
          }));
          setDispatches(enhanced);
        }
      } catch (err) {
        console.error("Failed to fetch dispatches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDispatches();
  }, []);

  const filtered = filter === "all" ? dispatches : dispatches.filter(d => d.delivered_at === null);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispatch & Delivery</h1>
            <p className="text-gray-600 mt-1">Manage vehicle assignments and delivery tracking</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
            + New Dispatch
          </button>
        </div>

        {/* Load Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "TRUCK-102", status: "98%", vehicle: "🚚" },
            { label: "VAN-404", status: "78%", vehicle: "🚐" },
            { label: "TRUCK-407", status: "65%", vehicle: "🚛" },
            { label: "VAN-203", status: "42%", vehicle: "🚐" },
          ].map((truck) => (
            <div key={truck.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-900">{truck.label}</p>
                <span className="text-2xl">{truck.vehicle}</span>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold text-gray-900">{truck.status}</p>
                <p className="text-xs text-gray-600">Capacity Used</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full"
                  style={{ width: truck.status }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All Dispatches
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            In Transit
          </button>
        </div>

        {/* Dispatch Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Challan No</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Vehicle</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Driver</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Load</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Dispatch Date</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                      No dispatches found
                    </td>
                  </tr>
                ) : (
                  filtered.map((dispatch) => (
                    <tr key={dispatch.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-semibold text-gray-900">{dispatch.challan_no}</td>
                      <td className="py-4 px-6 text-gray-700">{dispatch.vehicle_no}</td>
                      <td className="py-4 px-6 text-gray-600">{dispatch.driver_name}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${dispatch.loadPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{dispatch.loadPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{new Date(dispatch.dispatch_date).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            dispatch.delivered_at
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {dispatch.delivered_at ? "Delivered" : "In Transit"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
