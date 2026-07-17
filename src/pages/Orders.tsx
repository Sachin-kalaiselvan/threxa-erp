import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Order {
  id: string;
  order_no: string;
  customer: string;
  order_date: string;
  qty: number;
  amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      order_no: "ORD-001",
      customer: "Rajesh Enterprises",
      order_date: "2024-07-15",
      qty: 500,
      amount: 75000,
      status: "confirmed",
    },
    {
      id: "2",
      order_no: "ORD-002",
      customer: "Priya Packaging",
      order_date: "2024-07-16",
      qty: 1000,
      amount: 150000,
      status: "shipped",
    },
    {
      id: "3",
      order_no: "ORD-003",
      customer: "Kumar Industries",
      order_date: "2024-07-17",
      qty: 250,
      amount: 37500,
      status: "pending",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    order_no: "",
    customer: "",
    qty: 0,
    amount: 0,
  });

  const kpiCards = [
    {
      title: "Total Orders",
      value: orders.length,
      bgColor: "bg-blue-100",
      textColor: "text-blue-900",
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-900",
    },
    {
      title: "Total Revenue",
      value: "₹" + (orders.reduce((sum, o) => sum + o.amount, 0) / 100000).toFixed(1) + "L",
      bgColor: "bg-green-100",
      textColor: "text-green-900",
    },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    if (formData.order_no && formData.customer) {
      setOrders([
        ...orders,
        {
          id: Date.now().toString(),
          ...formData,
          order_date: new Date().toISOString().split("T")[0],
          status: "pending",
        },
      ]);
      setFormData({ order_no: "", customer: "", qty: 0, amount: 0 });
      setShowModal(false);
    }
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-500">Track and manage customer orders</p>
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
            placeholder="Search orders..."
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
          New Order
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Order No
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Qty</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Amount
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
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.order_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {order.qty}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{order.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-900 mr-3 inline-block">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Order</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  value={formData.order_no}
                  onChange={(e) =>
                    setFormData({ ...formData, order_no: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ORD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
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
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
