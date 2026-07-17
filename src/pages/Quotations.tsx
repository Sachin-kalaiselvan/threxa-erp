import React, { useState } from "react";
import { Plus, FileText, Trash2, Search } from "lucide-react";

interface Quotation {
  id: string;
  quote_no: string;
  customer: string;
  amount: number;
  date: string;
  validity: string;
  status: "draft" | "sent" | "accepted" | "rejected";
}

export default function Quotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "1",
      quote_no: "QT-001",
      customer: "Rajesh Enterprises",
      amount: 75000,
      date: "2024-07-15",
      validity: "2024-08-15",
      status: "sent",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    quote_no: "",
    customer: "",
    amount: 0,
  });

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const filteredQuotes = quotations.filter(
    (q) =>
      q.quote_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuote = () => {
    if (formData.quote_no && formData.customer) {
      setQuotations([
        ...quotations,
        {
          id: Date.now().toString(),
          ...formData,
          date: new Date().toISOString().split("T")[0],
          validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "draft",
        },
      ]);
      setFormData({ quote_no: "", customer: "", amount: 0 });
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quotations</h1>
        <p className="text-gray-500">Manage customer quotes</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Quotes</p>
          <p className="text-3xl font-bold mt-2">{quotations.length}</p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Accepted</p>
          <p className="text-3xl font-bold mt-2">
            {quotations.filter((q) => q.status === "accepted").length}
          </p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Pending Value</p>
          <p className="text-3xl font-bold mt-2">
            ₹
            {(
              quotations.reduce((sum, q) => sum + q.amount, 0) / 100000
            ).toFixed(1)}
            L
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search quotations..."
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
          New Quote
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Quote No
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Customer
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Validity
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {quote.quote_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {quote.customer}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{quote.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(quote.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(quote.validity).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[quote.status]
                    }`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <FileText size={18} />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              New Quotation
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quote Number
                </label>
                <input
                  type="text"
                  value={formData.quote_no}
                  onChange={(e) =>
                    setFormData({ ...formData, quote_no: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="QT-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseInt(e.target.value) || 0,
                    })
                  }
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
                onClick={handleAddQuote}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
