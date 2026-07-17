import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  gstin: string;
}

export default function Customers() {
  const [customers] = useState<Customer[]>([
    { id: "1", name: "ABC Packaging Ltd", contact: "Rajesh Kumar", phone: "98765-43210", gstin: "27AABCU1234H1Z0" },
    { id: "2", name: "Global Exports Inc", contact: "Priya Sharma", phone: "98765-43211", gstin: "27AABCU1234H1Z1" },
    { id: "3", name: "XYZ Retail Solutions", contact: "Amit Patel", phone: "98765-43212", gstin: "27AABCU1234H1Z2" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "", phone: "", gstin: "" });

  const handleAddCustomer = () => {
    if (formData.name) {
      setShowModal(false);
      setFormData({ name: "", contact: "", phone: "", gstin: "" });
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: "#e8e8e8" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">Manage your customer database</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
          >
            + New Customer
          </button>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: "#1a1a1a" }}>
                <tr>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">NAME</th>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">CONTACT</th>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">PHONE</th>
                  <th className="text-left py-4 px-6 text-white font-semibold text-sm">GSTIN</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 px-6 text-center text-gray-500">
                      No customers yet. Add your first one.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-semibold text-gray-900">{customer.name}</td>
                      <td className="py-4 px-6 text-gray-700">{customer.contact}</td>
                      <td className="py-4 px-6 text-gray-600">{customer.phone}</td>
                      <td className="py-4 px-6 text-gray-600">{customer.gstin}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Customer</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g., ABC Packaging Ltd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                <input
                  type="text"
                  placeholder="15-digit GSTIN"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleAddCustomer}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Create Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
