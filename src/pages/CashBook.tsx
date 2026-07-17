import React, { useState } from "react";
import { Plus, Download, Trash2, Search } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  category: string;
  balance: number;
}

export default function CashBook() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-07-15",
      description: "Customer Payment - Rajesh Enterprises",
      type: "credit",
      amount: 75000,
      category: "Sales",
      balance: 275000,
    },
    {
      id: "2",
      date: "2024-07-15",
      description: "Electricity Bill Payment",
      type: "debit",
      amount: 5000,
      category: "Utilities",
      balance: 270000,
    },
    {
      id: "3",
      date: "2024-07-16",
      description: "Customer Payment - Priya Packaging",
      type: "credit",
      amount: 150000,
      category: "Sales",
      balance: 420000,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    type: "credit" as "credit" | "debit",
    amount: 0,
    category: "Others",
  });

  const categories = ["Sales", "Purchases", "Utilities", "Salaries", "Others"];

  const currentBalance = transactions.length > 0
    ? transactions[transactions.length - 1].balance
    : 0;

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTransaction = () => {
    if (formData.description && formData.amount > 0) {
      const lastBalance =
        transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
      const newBalance =
        formData.type === "credit"
          ? lastBalance + formData.amount
          : lastBalance - formData.amount;

      setTransactions([
        ...transactions,
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          ...formData,
          balance: newBalance,
        },
      ]);
      setFormData({
        description: "",
        type: "credit",
        amount: 0,
        category: "Others",
      });
      setShowModal(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ["Date", "Description", "Type", "Amount", "Category", "Balance"],
      ...filteredTransactions.map((t) => [
        t.date,
        t.description,
        t.type,
        t.amount,
        t.category,
        t.balance,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = `cashbook-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cash Book</h1>
        <p className="text-gray-500">Track all cash transactions</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Current Balance</p>
          <p className="text-3xl font-bold mt-2">₹{(currentBalance / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Credit</p>
          <p className="text-3xl font-bold mt-2">₹{(totalCredit / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-red-100 text-red-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Debit</p>
          <p className="text-3xl font-bold mt-2">₹{(totalDebit / 100000).toFixed(1)}L</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Download size={20} />
          Export
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Balance</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === "credit"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-sm text-right font-medium ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"}₹
                  {transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                  ₹{transaction.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
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
              New Transaction
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter transaction description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="credit"
                      checked={formData.type === "credit"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "credit" | "debit",
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Credit</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="debit"
                      checked={formData.type === "debit"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "credit" | "debit",
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Debit</span>
                  </label>
                </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
