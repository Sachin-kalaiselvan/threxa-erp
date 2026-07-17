import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Employee {
  id: string;
  name: string;
  designation: string;
  baseSalary: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: "paid" | "pending" | "processing";
}

export default function Payroll() {
  const [employees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "Rajesh Kumar",
      designation: "Production Manager",
      baseSalary: 45000,
      grossSalary: 65500,
      deductions: 14350,
      netSalary: 51150,
      paymentDate: "7/5/2024",
      status: "paid",
    },
    {
      id: "EMP-002",
      name: "Priya Sharma",
      designation: "Quality Inspector",
      baseSalary: 35000,
      grossSalary: 51500,
      deductions: 10335,
      netSalary: 41165,
      paymentDate: "7/5/2024",
      status: "paid",
    },
    {
      id: "EMP-003",
      name: "Amit Patel",
      designation: "Warehouse Supervisor",
      baseSalary: 32000,
      grossSalary: 46800,
      deductions: 9412,
      netSalary: 37388,
      paymentDate: "7/5/2024",
      status: "pending",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Pending" | "Processing">("All");

  const totalEmployees = employees.length;
  const totalGross = employees.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNetPayable = employees.reduce((sum, emp) => sum + emp.netSalary, 0);

  const filteredEmployees =
    activeTab === "All"
      ? employees
      : employees.filter((emp) => emp.status === activeTab.toLowerCase());

  return (
    <PageLayout
      title="Payroll Management"
      subtitle="Employee salary processing and payment tracking"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Employees</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalEmployees}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Gross Salary</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{(totalGross / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Deductions</p>
          <p className="text-3xl font-bold text-red-600 mt-2">₹{(totalDeductions / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Net Payable</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{(totalNetPayable / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {["All", "Paid", "Pending", "Processing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">EMPLOYEE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DESIGNATION</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">BASE SALARY</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">GROSS SALARY</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">DEDUCTIONS</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">NET SALARY</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PAYMENT DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{employee.designation}</td>
                  <td className="py-4 px-6 text-right text-gray-900">₹{employee.baseSalary.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right text-gray-900">₹{employee.grossSalary.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right font-medium text-red-600">₹{employee.deductions.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right font-semibold text-green-600">₹{employee.netSalary.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-700">{employee.paymentDate}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        employee.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : employee.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
