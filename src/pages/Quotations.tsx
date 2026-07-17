import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Quotation {
  id: string;
  quote_no: string;
  customer: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  created_date: string;
  validity: string;
}

export default function Quotations() {
  const [quotations] = useState<Quotation[]>([
    {
      id: "1",
      quote_no: "QT-2024-001",
      customer: "ABC Packaging Ltd",
      amount: 245000,
      status: "sent",
      created_date: "15 Jul 2024",
      validity: "30 days",
    },
    {
      id: "2",
      quote_no: "QT-2024-002",
      customer: "Global Exports Inc",
      amount: 185500,
      status: "accepted",
      created_date: "14 Jul 2024",
      validity: "30 days",
    },
    {
      id: "3",
      quote_no: "QT-2024-003",
      customer: "XYZ Retail Solutions",
      amount: 312750,
      status: "draft",
      created_date: "12 Jul 2024",
      validity: "30 days",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout
      title="Quotations"
      subtitle="Create and manage customer quotations"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Quotation
        </button>
      }
    >
      {/* Quotations Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">QUOTE NO</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CUSTOMER</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">AMOUNT</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CREATED DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">VALIDITY</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{quote.quote_no}</td>
                  <td className="py-4 px-6 text-gray-700">{quote.customer}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">₹{(quote.amount / 1000).toFixed(0)}K</td>
                  <td className="py-4 px-6 text-gray-600">{quote.created_date}</td>
                  <td className="py-4 px-6 text-gray-600">{quote.validity}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        quote.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : quote.status === "sent"
                          ? "bg-blue-100 text-blue-700"
                          : quote.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Quotation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Quotation</h2>
            <div className="space-y-4">
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Select Customer</option>
                <option value="ABC">ABC Packaging Ltd</option>
                <option value="Global">Global Exports Inc</option>
                <option value="XYZ">XYZ Retail Solutions</option>
              </select>
              <input type="text" placeholder="Quote Description" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Amount" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Validity (days)" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
