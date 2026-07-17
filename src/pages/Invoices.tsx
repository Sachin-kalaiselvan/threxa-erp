import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Invoice {
  id: string;
  invoice_no: string;
  customer: string;
  amount: number;
  status: "draft" | "issued" | "paid" | "overdue";
  issue_date: string;
  due_date: string;
}

export default function Invoices() {
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      invoice_no: "INV-2024-001",
      customer: "ABC Packaging Ltd",
      amount: 245000,
      status: "paid",
      issue_date: "15 Jul 2024",
      due_date: "30 Jul 2024",
    },
    {
      id: "2",
      invoice_no: "INV-2024-002",
      customer: "Global Exports Inc",
      amount: 185500,
      status: "issued",
      issue_date: "14 Jul 2024",
      due_date: "29 Jul 2024",
    },
    {
      id: "3",
      invoice_no: "INV-2024-003",
      customer: "XYZ Retail Solutions",
      amount: 312750,
      status: "overdue",
      issue_date: "5 Jul 2024",
      due_date: "20 Jul 2024",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout
      title="Invoices"
      subtitle="Generate and manage customer invoices"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Invoice
        </button>
      }
    >
      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">INVOICE NO</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CUSTOMER</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">AMOUNT</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">ISSUE DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DUE DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{invoice.invoice_no}</td>
                  <td className="py-4 px-6 text-gray-700">{invoice.customer}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">₹{(invoice.amount / 1000).toFixed(0)}K</td>
                  <td className="py-4 px-6 text-gray-600">{invoice.issue_date}</td>
                  <td className="py-4 px-6 text-gray-600">{invoice.due_date}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "issued"
                          ? "bg-blue-100 text-blue-700"
                          : invoice.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Invoice</h2>
            <div className="space-y-4">
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Select Customer</option>
                <option value="ABC">ABC Packaging Ltd</option>
                <option value="Global">Global Exports Inc</option>
                <option value="XYZ">XYZ Retail Solutions</option>
              </select>
              <input type="number" placeholder="Amount" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Issue Date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Due Date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
