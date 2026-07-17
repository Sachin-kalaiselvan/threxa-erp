import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  reference: string;
  balance: number;
}

export default function CashBook() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "17 Jul 2024",
      description: "Order ORD-2024-001 Payment",
      type: "income",
      amount: 245000,
      category: "Sales",
      reference: "INV-2024-001",
      balance: 1245000,
    },
    {
      id: "2",
      date: "16 Jul 2024",
      description: "Raw Material Purchase",
      type: "expense",
      amount: 85000,
      category: "Materials",
      reference: "PO-2024-001",
      balance: 1000000,
    },
    {
      id: "3",
      date: "15 Jul 2024",
      description: "Salary Payment",
      type: "expense",
      amount: 129703,
      category: "Payroll",
      reference: "PAY-2024-001",
      balance: 1085000,
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <PageLayout
      title="Cash Book"
      subtitle="Record and manage cash transactions"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Transaction
        </button>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Income</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{(totalIncome / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Expense</p>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{(totalExpense / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Balance</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{(balance / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DESCRIPTION</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CATEGORY</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">REFERENCE</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">TYPE</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">AMOUNT</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">BALANCE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-700">{transaction.date}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{transaction.description}</td>
                  <td className="py-4 px-6 text-gray-700">{transaction.category}</td>
                  <td className="py-4 px-6 text-gray-600">{transaction.reference}</td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-6 text-right font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-blue-600">₹{transaction.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Transaction</h2>
            <div className="space-y-4">
              <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Description" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Transaction Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Category</option>
                <option value="Sales">Sales</option>
                <option value="Materials">Materials</option>
                <option value="Payroll">Payroll</option>
                <option value="Other">Other</option>
              </select>
              <input type="number" placeholder="Amount" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Reference" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
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
