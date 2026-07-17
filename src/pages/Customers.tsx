import { useState } from "react";
import PageLayout from "../components/PageLayout";

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
    <PageLayout
      title="Customers"
      subtitle="Manage your customer database"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + New Customer
        </button>
      }
    >
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
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-medium">{customer.name}</td>
                  <td className="py-4 px-6 text-gray-700">{customer.contact}</td>
                  <td className="py-4 px-6 text-gray-700">{customer.phone}</td>
                  <td className="py-4 px-6 text-gray-700">{customer.gstin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Customer</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Person"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="GSTIN"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
