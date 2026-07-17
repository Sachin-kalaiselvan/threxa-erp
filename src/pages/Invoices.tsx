import React, { useState } from "react";
import { Plus, Download, Trash2, Search, Eye } from "lucide-react";
import { generateInvoicePDF } from "../utils/pdf";

interface Invoice {
  id: string;
  invoice_no: string;
  customer: string;
  amount: number;
  date: string;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoice_no: "INV-001",
      customer: "Rajesh Enterprises",
      amount: 75000,
      date: "2024-07-15",
      due_date: "2024-08-15",
      status: "sent",
    },
    {
      id: "2",
      invoice_no: "INV-002",
      customer: "Priya Packaging",
      amount: 150000,
      date: "2024-07-16",
      due_date: "2024-08-16",
      status: "paid",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    invoice_no: "",
    customer: "",
    amount: 0,
  });

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  const filteredInvoices = invoices.filter(
    (i) =>
      i.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = () => {
    if (formData.invoice_no && formData.customer) {
      setInvoices([
        ...invoices,
        {
          id: Date.now().toString(),
          ...formData,
          date: new Date().toISOString().split("T")[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "draft",
        },
      ]);
      setFormData({ invoice_no: "", customer: "", amount: 0 });
      setShowModal(false);
    }
  };

  const handleDownload = (invoice: Invoice) => {
    const pdfData = generateInvoicePDF({
      invoice_no: invoice.invoice_no,
      invoice_date: invoice.date,
      due_date: invoice.due_date,
      company_name: "Threxa Manufacturing",
      company_gstin: "27AABCU9603R1Z5",
      customer_name: invoice.customer,
      customer_gstin: "27AABCV9603R2Z5",
      customer_address: "Sample Address",
      customer_state: "Karnataka",
      items: [
        {
          description: "Corrugated Box",
          hsn: "4819",
          qty: 100,
          rate: invoice.amount / 100,
          amount: invoice.amount,
        },
      ],
      subtotal: invoice.amount,
      gst_rate: 18,
      cgst: (invoice.amount * 0.09),
      sgst: (invoice.amount * 0.09),
      total: invoice.amount * 1.18,
      doc_type: "tax_invoice",
    });
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = `${invoice.invoice_no}.pdf`;
    link.click();
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoices</h1>
        <p className="text-gray-500">Generate and track invoices</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Invoices</p>
          <p className="text-3xl font-bold mt-2">{invoices.length}</p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Paid</p>
          <p className="text-3xl font-bold mt-2">
            ₹
            {(
              invoices
                .filter((i) => i.status === "paid")
                .reduce((sum, i) => sum + i.amount, 0) / 100000
            ).toFixed(1)}
            L
          </p>
        </div>
        <div className="bg-red-100 text-red-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Outstanding</p>
          <p className="text-3xl font-bold mt-2">
            ₹
            {(
              invoices
                .filter((i) => i.status !== "paid")
                .reduce((sum, i) => sum + i.amount, 0) / 100000
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
            placeholder="Search invoices..."
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
          New Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Invoice No
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Customer
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Due Date
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
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {invoice.invoice_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {invoice.customer}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{invoice.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[invoice.status]
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    <Download size={18} />
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Eye size={18} />
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
              New Invoice
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoice_no}
                  onChange={(e) =>
                    setFormData({ ...formData, invoice_no: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="INV-001"
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
                onClick={handleAddInvoice}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
