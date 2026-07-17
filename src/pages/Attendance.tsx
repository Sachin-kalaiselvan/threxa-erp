import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string;
  check_out: string;
  status: "present" | "absent" | "leave" | "half_day";
  hours_worked: string;
}

export default function Attendance() {
  const [attendance] = useState<AttendanceRecord[]>([
    {
      id: "1",
      employee_id: "EMP-001",
      employee_name: "Rajesh Kumar",
      date: "17 Jul 2024",
      check_in: "09:00 AM",
      check_out: "06:00 PM",
      status: "present",
      hours_worked: "9.0",
    },
    {
      id: "2",
      employee_id: "EMP-002",
      employee_name: "Priya Sharma",
      date: "17 Jul 2024",
      check_in: "09:15 AM",
      check_out: "05:45 PM",
      status: "present",
      hours_worked: "8.5",
    },
    {
      id: "3",
      employee_id: "EMP-003",
      employee_name: "Amit Patel",
      date: "17 Jul 2024",
      check_in: "-",
      check_out: "-",
      status: "leave",
      hours_worked: "0",
    },
  ]);

  return (
    <PageLayout
      title="Attendance"
      subtitle="Track employee attendance and leaves"
    >
      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">EMPLOYEE ID</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">EMPLOYEE NAME</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">DATE</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">CHECK IN</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">CHECK OUT</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">HOURS WORKED</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{record.employee_id}</td>
                  <td className="py-4 px-6 text-gray-700">{record.employee_name}</td>
                  <td className="py-4 px-6 text-gray-700">{record.date}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{record.check_in}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{record.check_out}</td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-900">{record.hours_worked}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "present"
                          ? "bg-green-100 text-green-700"
                          : record.status === "absent"
                          ? "bg-red-100 text-red-700"
                          : record.status === "leave"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace(/_/g, " ")}
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
