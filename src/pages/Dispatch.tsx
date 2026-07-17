import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Dispatch {
  id: string;
  dispatch_no: string;
  order_no: string;
  customer: string;
  qty: number;
  status: "pending" | "dispatched" | "in_transit" | "delivered";
  dispatch_date: string;
  expected_delivery: string;
}

export default function Dispatch() {
  const [dispatches] = useState<Dispatch[]>([
    {
      id: "1",
      dispatch_no: "DISP-2024-001",
      order_no: "ORD-2024-001",
      customer: "ABC Packaging Ltd",
      qty: 5000,
      status: "delivered",
      dispatch_date: "15 Jul 2024",
      expected_delivery: "18 Jul 2024",
    },
    {
      id: "2",
      dispatch_no: "DISP-2024-002",
      order_no: "ORD-2024-002",
      customer: "Global Exports Inc",
      qty: 3000,
      status: "in_transit",
      dispatch_date: "17 Jul 2024",
      expected_delivery: "20 Jul 2024",
    },
    {
      id: "3",
      dispatch_no: "DISP-2024-003",
      order_no: "ORD-2024-003",
      customer: "XYZ Retail Solutions",
      qty: 2000,
      status: "pending",
      dispatch_date: "19 Jul 2024",
      expected_delivery: "22 Jul 2024",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout
      title="Dispatch"
      subtitle="Track order dispatch and delivery"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Dispatch
        </button>
      }
    >
      {/* Dispatch Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DISPATCH NO</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">ORDER NO</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CUSTOMER</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">QTY</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DISPATCH DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">EXPECTED DELIVERY</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{dispatch.dispatch_no}</td>
                  <td className="py-4 px-6 text-gray-700">{dispatch.order_no}</td>
                  <td className="py-4 px-6 text-gray-700">{dispatch.customer}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{dispatch.qty}</td>
                  <td className="py-4 px-6 text-gray-600">{dispatch.dispatch_date}</td>
                  <td className="py-4 px-6 text-gray-600">{dispatch.expected_delivery}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        dispatch.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : dispatch.status === "in_transit"
                          ? "bg-blue-100 text-blue-700"
                          : dispatch.status === "dispatched"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {dispatch.status.charAt(0).toUpperCase() + dispatch.status.slice(1).replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Dispatch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Dispatch</h2>
            <div className="space-y-4">
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Select Order</option>
                <option value="ORD-001">ORD-2024-001</option>
                <option value="ORD-002">ORD-2024-002</option>
                <option value="ORD-003">ORD-2024-003</option>
              </select>
              <input type="number" placeholder="Quantity" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Dispatch Date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Expected Delivery" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
                Create Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
