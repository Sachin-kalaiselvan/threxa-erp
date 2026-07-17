import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gst_in: string;
  total_orders: number;
  total_spent: number;
  status: "active" | "inactive";
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Rajesh Enterprises",
      email: "rajesh@example.com",
      phone: "+91-9876543210",
      gst_in: "27AABCU9603R1Z5",
      total_orders: 45,
      total_spent: 450000,
      status: "active",
    },
    {
      id: "2",
      name: "Priya Packaging",
      email: "priya@example.com",
      phone: "+91-9876543211",
      gst_in: "27AABCV9603R2Z5",
      total_orders: 32,
      total_spent: 320000,
      status: "active",
    },
    {
      id: "3",
      name: "Kumar Industries",
      email: "kumar@example.com",
      phone: "+91-9876543212",
      gst_in: "27AABCW9603R3Z5",
      total_orders: 18,
      total_spent: 180000,
      status: "inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gst_in: "",
  });

  const kpiCards = [
    {
      title: "Total Customers",
      value: customers.length,
      bgColor: "bg-blue-100",
      textColor: "text-blue-900",
    },
    {
      title: "Active Customers",
      value: customers.filter((c) => c.status === "active").length,
      bgColor: "bg-green-100",
      textColor: "text-green-900",
    },
    {
      title: "Total Revenue",
      value: "₹" + customers.reduce((sum, c) => sum + c.total_spent, 0) / 100000 + "L",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-900",
    },
  ];

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (formData.name) {
      setCustomers([
        ...customers,
        {
          id: Date.now().toString(),
          ...formData,
          total_orders: 0,
          total_spent: 0,
          status: "active",
        },
      ]);
      setFormData({ name: "", email: "", phone: "", gst_in: "" });
      setShowModal(false);
    }
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-500">Manage your customer database</p>
      </div>

      {/* KPI Cards */}
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

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Customer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                GST IN
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Orders
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Total Spent
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
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {customer.gst_in}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-900 font-medium">
                  {customer.total_orders}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{customer.total_spent.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-900 mr-3 inline-block">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900 inline-block"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              New Customer
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST IN
                </label>
                <input
                  type="text"
                  value={formData.gst_in}
                  onChange={(e) =>
                    setFormData({ ...formData, gst_in: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter GST IN"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
