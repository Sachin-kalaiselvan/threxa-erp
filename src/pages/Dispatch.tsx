import React, { useState } from "react";
import { Plus, Truck, Trash2, Search } from "lucide-react";

interface Dispatch {
  id: string;
  dispatch_no: string;
  order_no: string;
  customer: string;
  qty: number;
  vehicle: string;
  dispatch_date: string;
  status: "pending" | "in_transit" | "delivered";
}

export default function Dispatch() {
  const [dispatches, setDispatches] = useState<Dispatch[]>([
    {
      id: "1",
      dispatch_no: "DSP-001",
      order_no: "ORD-001",
      customer: "Rajesh Enterprises",
      qty: 5000,
      vehicle: "KA-05-AB-1234",
      dispatch_date: "2024-07-15",
      status: "in_transit",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    dispatch_no: "",
    order_no: "",
    customer: "",
    qty: 0,
    vehicle: "",
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };

  const filteredDispatches = dispatches.filter(
    (d) =>
      d.dispatch_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDispatch = () => {
    if (formData.dispatch_no && formData.order_no) {
      setDispatches([
        ...dispatches,
        {
          id: Date.now().toString(),
          ...formData,
          dispatch_date: new Date().toISOString().split("T")[0],
          status: "pending",
        },
      ]);
      setFormData({ dispatch_no: "", order_no: "", customer: "", qty: 0, vehicle: "" });
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dispatch</h1>
        <p className="text-gray-500">Track shipments and deliveries</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Dispatches</p>
          <p className="text-3xl font-bold mt-2">{dispatches.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">In Transit</p>
          <p className="text-3xl font-bold mt-2">
            {dispatches.filter((d) => d.status === "in_transit").length}
          </p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Delivered</p>
          <p className="text-3xl font-bold mt-2">
            {dispatches.filter((d) => d.status === "delivered").length}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search dispatches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Dispatch
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Dispatch No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Vehicle</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDispatches.map((dispatch) => (
              <tr key={dispatch.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {dispatch.dispatch_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{dispatch.order_no}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{dispatch.customer}</td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {dispatch.qty}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{dispatch.vehicle}</td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[dispatch.status]
                    }`}
                  >
                    {dispatch.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Truck size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Dispatch</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispatch Number
                </label>
                <input
                  type="text"
                  value={formData.dispatch_no}
                  onChange={(e) => setFormData({ ...formData, dispatch_no: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="DSP-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  value={formData.order_no}
                  onChange={(e) => setFormData({ ...formData, order_no: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ORD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="KA-05-AB-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDispatch}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
