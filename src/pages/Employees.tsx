import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joining_date: string;
  status: "active" | "inactive";
}

export default function Employees() {
  const [employees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "Rajesh Kumar",
      designation: "Production Manager",
      department: "Production",
      email: "rajesh@company.com",
      phone: "98765-43210",
      joining_date: "10 Jan 2022",
      status: "active",
    },
    {
      id: "EMP-002",
      name: "Priya Sharma",
      designation: "Quality Inspector",
      department: "Quality",
      email: "priya@company.com",
      phone: "98765-43211",
      joining_date: "15 Mar 2022",
      status: "active",
    },
    {
      id: "EMP-003",
      name: "Amit Patel",
      designation: "Warehouse Supervisor",
      department: "Warehouse",
      email: "amit@company.com",
      phone: "98765-43212",
      joining_date: "20 Jun 2022",
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout
      title="Employees"
      subtitle="Manage employee records and details"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + Add Employee
        </button>
      }
    >
      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">EMPLOYEE ID</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">NAME</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DESIGNATION</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DEPARTMENT</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">EMAIL</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PHONE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">JOINING DATE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{employee.id}</td>
                  <td className="py-4 px-6 text-gray-700">{employee.name}</td>
                  <td className="py-4 px-6 text-gray-700">{employee.designation}</td>
                  <td className="py-4 px-6 text-gray-700">{employee.department}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.email}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.phone}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.joining_date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Employee</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Designation" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Select Department</option>
                <option value="Production">Production</option>
                <option value="Quality">Quality</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Admin">Admin</option>
              </select>
              <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="tel" placeholder="Phone" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="date" placeholder="Joining Date" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
