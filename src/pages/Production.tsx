import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface ProductionBatch {
  id: string;
  batch_no: string;
  product: string;
  quantity: number;
  status: "pending" | "in_progress" | "completed" | "on_hold";
  start_date: string;
  end_date: string;
  progress: number;
}

export default function Production() {
  const [batches] = useState<ProductionBatch[]>([
    {
      id: "1",
      batch_no: "BATCH-2024-001",
      product: "Corrugated Box 500x300x200",
      quantity: 5000,
      status: "in_progress",
      start_date: "15 Jul 2024",
      end_date: "20 Jul 2024",
      progress: 65,
    },
    {
      id: "2",
      batch_no: "BATCH-2024-002",
      product: "Kraft Paper Box 300x200x100",
      quantity: 3000,
      status: "pending",
      start_date: "18 Jul 2024",
      end_date: "22 Jul 2024",
      progress: 0,
    },
    {
      id: "3",
      batch_no: "BATCH-2024-003",
      product: "Display Box 600x400x300",
      quantity: 2000,
      status: "completed",
      start_date: "10 Jul 2024",
      end_date: "14 Jul 2024",
      progress: 100,
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout
      title="Production"
      subtitle="Manage production schedules and batch status"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Batch
        </button>
      }
    >
      {/* Production Batches Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">BATCH NO</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PRODUCT</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">QUANTITY</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">START DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">END DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PROGRESS</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{batch.batch_no}</td>
                  <td className="py-4 px-6 text-gray-700">{batch.product}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{batch.quantity}</td>
                  <td className="py-4 px-6 text-gray-600">{batch.start_date}</td>
                  <td className="py-4 px-6 text-gray-600">{batch.end_date}</td>
                  <td className="py-4 px-6">
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${batch.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">{batch.progress}%</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        batch.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : batch.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : batch.status === "pending"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1).replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Batch</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Batch Number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Product" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Quantity" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
                Create Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
