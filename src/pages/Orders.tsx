import { useState } from "react";
import PageLayout from "../components/PageLayout";

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
    <PageLayout
      title="Orders"
      subtitle="Track and manage manufacturing orders"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Order
        </button>
      }
    >
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
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{order.order_no}</td>
                  <td className="py-4 px-6 text-gray-700">{order.customer}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{order.items}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">₹{(order.total / 1000).toFixed(0)}K</td>
                  <td className="py-4 px-6 text-gray-600">{order.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Order</h2>
            <div className="space-y-4">
              <select
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Customer</option>
                <option value="ABC Packaging Ltd">ABC Packaging Ltd</option>
                <option value="Global Exports Inc">Global Exports Inc</option>
                <option value="XYZ Retail Solutions">XYZ Retail Solutions</option>
              </select>
              <input
                type="number"
                placeholder="Items"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              />
              <input
                type="number"
                placeholder="Total Amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.delivery}
                onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
