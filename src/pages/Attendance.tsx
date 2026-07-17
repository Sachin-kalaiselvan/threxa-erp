import React, { useState } from "react";
import { Plus, CheckCircle, XCircle, Search } from "lucide-react";

interface AttendanceRecord {
  id: string;
  emp_id: string;
  name: string;
  date: string;
  status: "present" | "absent" | "leave" | "half_day";
  check_in: string;
  check_out: string;
}

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      emp_id: "EMP-001",
      name: "Rajesh Kumar",
      date: "2024-07-16",
      status: "present",
      check_in: "09:00",
      check_out: "18:00",
    },
    {
      id: "2",
      emp_id: "EMP-002",
      name: "Priya Singh",
      date: "2024-07-16",
      status: "present",
      check_in: "09:15",
      check_out: "17:45",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const statusColors = {
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    leave: "bg-yellow-100 text-yellow-800",
    half_day: "bg-blue-100 text-blue-800",
  };

  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayPresent = records.filter(
    (r) => r.date === selectedDate && r.status === "present"
  ).length;

  const todayAbsent = records.filter(
    (r) => r.date === selectedDate && r.status === "absent"
  ).length;

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance</h1>
        <p className="text-gray-500">Track employee attendance</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Selected Date</p>
          <p className="text-2xl font-bold mt-2">
            {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Present Today</p>
          <p className="text-3xl font-bold mt-2">{todayPresent}</p>
        </div>
        <div className="bg-red-100 text-red-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Absent Today</p>
          <p className="text-3xl font-bold mt-2">{todayAbsent}</p>
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
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Mark Attendance
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Emp ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Check In</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Check Out</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {record.emp_id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.check_in}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.check_out}</td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[record.status]
                    }`}
                  >
                    {record.status.replace("_", " ")}
                  </span>
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
              Mark Attendance
            </h2>
            <div className="space-y-4 mb-6">
              <p className="text-gray-600 text-sm">
                Select employees for {new Date(selectedDate).toLocaleDateString()}
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {["Rajesh Kumar", "Priya Singh", "Kumar Sharma", "Deepak Patel"].map(
                  (name) => (
                    <label key={name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{name}</span>
                    </label>
                  )
                )}
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
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
