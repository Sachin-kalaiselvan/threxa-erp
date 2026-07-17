import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface ProductionJob {
  id: string;
  job_no: string;
  product: string;
  qty: number;
  start_date: string;
  status: "pending" | "in_progress" | "completed" | "on_hold";
}

export default function Production() {
  const [jobs, setJobs] = useState<ProductionJob[]>([
    {
      id: "1",
      job_no: "PRD-001",
      product: "Corrugated Box A4",
      qty: 5000,
      start_date: "2024-07-15",
      status: "in_progress",
    },
    {
      id: "2",
      job_no: "PRD-002",
      product: "Corrugated Box A3",
      qty: 3000,
      start_date: "2024-07-16",
      status: "pending",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    job_no: "",
    product: "",
    qty: 0,
  });

  const kpiCards = [
    {
      title: "Total Jobs",
      value: jobs.length,
      bgColor: "bg-blue-100",
      textColor: "text-blue-900",
    },
    {
      title: "In Progress",
      value: jobs.filter((j) => j.status === "in_progress").length,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-900",
    },
    {
      title: "Completed",
      value: jobs.filter((j) => j.status === "completed").length,
      bgColor: "bg-green-100",
      textColor: "text-green-900",
    },
  ];

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    on_hold: "bg-red-100 text-red-800",
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.job_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJob = () => {
    if (formData.job_no && formData.product) {
      setJobs([
        ...jobs,
        {
          id: Date.now().toString(),
          ...formData,
          start_date: new Date().toISOString().split("T")[0],
          status: "pending",
        },
      ]);
      setFormData({ job_no: "", product: "", qty: 0 });
      setShowModal(false);
    }
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Production</h1>
        <p className="text-gray-500">Monitor production jobs</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.bgColor} ${card.textColor} rounded-lg p-6`}
          >
            <p className="text-sm font-medium opacity-75">{card.title}</p>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search jobs..."
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
          New Job
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Job No
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Product
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Qty</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {job.job_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {job.product}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {job.qty}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(job.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[job.status]
                    }`}
                  >
                    {job.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-900"
                  >
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
              New Production Job
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <input
                  type="text"
                  value={formData.job_no}
                  onChange={(e) =>
                    setFormData({ ...formData, job_no: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="PRD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) =>
                    setFormData({ ...formData, product: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.qty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qty: parseInt(e.target.value) || 0,
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
                onClick={handleAddJob}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
