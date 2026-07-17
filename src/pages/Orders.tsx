import { useState } from "react";

interface Order {
  id: string;
  order_no: string;
  customer: string;
  items: number;
  total: number;
  delivery: string;
}

export default function Orders() {
  const [orders] = useState<Order[]>([
    { id: "1", order_no: "ORD-2024-001", customer: "ABC Packaging Ltd", items: 3, total: 245000, delivery: "20 Jul 2024" },
    { id: "2", order_no: "ORD-2024-002", customer: "Global Exports Inc", items: 2, total: 185500, delivery: "18 Jul 2024" },
    { id: "3", order_no: "ORD-2024-003", customer: "XYZ Retail Solutions", items: 4, total: 312750, delivery: "25 Jul 2024" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer: "", items: "", total: "", delivery: "" });

  const handleCreateOrder = () => {
    if (formData.customer) {
      setShowModal(false);
      setFormData({ customer: "", items: "", total: "", delivery: "" });
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: "#e8e8e8" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage manufacturing orders</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
          >
            + New Order
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: "#1a1a1a" }}>
                <tr>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">ORDER NO</th>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">CUSTOMER</th>
                  <th className="text-center py-4 px-6 text-white font-semibold text-sm">ITEMS</th>
                  <th className="text-right py-4 px-6 text-white font-semibold text-sm">TOTAL</th>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">DELIVERY</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 px-6 text-center text-gray-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-semibold text-gray-900">{order.order_no}</td>
                      <td className="py-4 px-6 text-gray-700">{order.customer}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{order.items}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">₹{(order.total / 1000).toFixed(0)}K</td>
                      <td className="py-4 px-6 text-gray-600">{order.delivery}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Create Order</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
                  <select
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select customer...</option>
                    <option value="ABC Packaging Ltd">ABC Packaging Ltd</option>
                    <option value="Global Exports Inc">Global Exports Inc</option>
                    <option value="XYZ Retail Solutions">XYZ Retail Solutions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
                  <input
                    type="text"
                    placeholder="e.g., PO-2024-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="text"
                    placeholder="dd-mm-yyyy"
                    value={formData.delivery}
                    onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    placeholder="Additional notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={handleCreateOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
