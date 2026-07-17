import React, { useState } from "react";
import { Plus, Download, Trash2, Search } from "lucide-react";

interface PayrollRecord {
  id: string;
  emp_id: string;
  name: string;
  month: string;
  base_salary: number;
  allowance: number;
  deduction: number;
  net_salary: number;
  status: "draft" | "approved" | "paid";
}

export default function Payroll() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([
    {
      id: "1",
      emp_id: "EMP-001",
      name: "Rajesh Kumar",
      month: "July 2024",
      base_salary: 50000,
      allowance: 5000,
      deduction: 3000,
      net_salary: 52000,
      status: "paid",
    },
    {
      id: "2",
      emp_id: "EMP-002",
      name: "Priya Singh",
      month: "July 2024",
      base_salary: 45000,
      allowance: 4500,
      deduction: 2500,
      net_salary: 47000,
      status: "approved",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("July 2024");

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    approved: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
  };

  const filteredPayrolls = payrolls.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayroll = payrolls.reduce((sum, p) => sum + p.net_salary, 0);
  const paidPayroll = payrolls
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.net_salary, 0);

  const handleExport = () => {
    const csv = [
      ["Emp ID", "Name", "Month", "Base Salary", "Allowance", "Deduction", "Net Salary", "Status"],
      ...filteredPayrolls.map((p) => [
        p.emp_id,
        p.name,
        p.month,
        p.base_salary,
        p.allowance,
        p.deduction,
        p.net_salary,
        p.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = `payroll-${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Payroll</h1>
        <p className="text-gray-500">Manage employee salaries and payroll</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Payroll</p>
          <p className="text-3xl font-bold mt-2">₹{(totalPayroll / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Paid</p>
          <p className="text-3xl font-bold mt-2">₹{(paidPayroll / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Pending</p>
          <p className="text-3xl font-bold mt-2">
            ₹{((totalPayroll - paidPayroll) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option>June 2024</option>
          <option>July 2024</option>
          <option>August 2024</option>
        </select>
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
          New Payroll
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Emp ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Base Salary</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Allowance</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Deduction</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Net Salary</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayrolls.map((payroll) => (
              <tr key={payroll.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {payroll.emp_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{payroll.name}</td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{payroll.base_salary.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{payroll.allowance.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-red-600">
                  ₹{payroll.deduction.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                  ₹{payroll.net_salary.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[payroll.status]
                    }`}
                  >
                    {payroll.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    <Download size={18} />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Payroll</h2>
            <p className="text-gray-600 text-sm mb-6">
              Payroll generation for {selectedMonth} is ready to process.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
