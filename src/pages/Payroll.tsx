import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  designation: string;
  base_salary: number;
  hra: number;
  dearness: number;
  conveyance: number;
  medical: number;
  gross_salary: number;
  provident_fund: number;
  income_tax: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  payment_date: string;
  status: "paid" | "pending" | "processing";
}

export default function Payroll() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        // Mock data — connect to real payroll table once schema updated
        const mockPayroll: PayrollRecord[] = [
          {
            id: "1",
            employee_id: "EMP-001",
            employee_name: "Rajesh Kumar",
            designation: "Production Manager",
            base_salary: 45000,
            hra: 13500,
            dearness: 4500,
            conveyance: 1500,
            medical: 1000,
            gross_salary: 65500,
            provident_fund: 5850,
            income_tax: 7500,
            other_deductions: 1000,
            total_deductions: 14350,
            net_salary: 51150,
            payment_date: "2024-07-05",
            status: "paid",
          },
          {
            id: "2",
            employee_id: "EMP-002",
            employee_name: "Priya Sharma",
            designation: "Quality Inspector",
            base_salary: 35000,
            hra: 10500,
            dearness: 3500,
            conveyance: 1500,
            medical: 1000,
            gross_salary: 51500,
            provident_fund: 4635,
            income_tax: 5200,
            other_deductions: 500,
            total_deductions: 10335,
            net_salary: 41165,
            payment_date: "2024-07-05",
            status: "paid",
          },
          {
            id: "3",
            employee_id: "EMP-003",
            employee_name: "Amit Patel",
            designation: "Warehouse Supervisor",
            base_salary: 32000,
            hra: 9600,
            dearness: 3200,
            conveyance: 1200,
            medical: 800,
            gross_salary: 46800,
            provident_fund: 4212,
            income_tax: 4800,
            other_deductions: 400,
            total_deductions: 9412,
            net_salary: 37388,
            payment_date: "2024-07-05",
            status: "pending",
          },
        ];
        setPayroll(mockPayroll);
      } catch (err) {
        console.error("Failed to fetch payroll:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, []);

  const filtered = filter === "all" ? payroll : payroll.filter(p => p.status === filter);
  const totalGross = filtered.reduce((sum, p) => sum + p.gross_salary, 0);
  const totalNet = filtered.reduce((sum, p) => sum + p.net_salary, 0);
  const totalDeductions = filtered.reduce((sum, p) => sum + p.total_deductions, 0);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Employee salary processing and payment tracking</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{payroll.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Total Gross Salary</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalGross.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Total Deductions</p>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{totalDeductions.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Total Net Payable</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{totalNet.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          {["all", "paid", "pending", "processing"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Employee</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Designation</th>
                  <th className="text-right py-4 px-6 text-gray-600 font-semibold">Base Salary</th>
                  <th className="text-right py-4 px-6 text-gray-600 font-semibold">Gross Salary</th>
                  <th className="text-right py-4 px-6 text-gray-600 font-semibold">Deductions</th>
                  <th className="text-right py-4 px-6 text-gray-600 font-semibold">Net Salary</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Payment Date</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">{record.employee_name}</p>
                        <p className="text-xs text-gray-600">{record.employee_id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{record.designation}</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">₹{record.base_salary.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">₹{record.gross_salary.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right text-red-600 font-medium">₹{record.total_deductions.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right font-bold text-green-600">₹{record.net_salary.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{new Date(record.payment_date).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : record.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
