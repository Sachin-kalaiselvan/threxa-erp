import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit_price: number;
  stock: number;
  status: "active" | "inactive";
}

export default function Products() {
  const [products] = useState<Product[]>([
    {
      id: "1",
      code: "PRD-001",
      name: "Corrugated Box 500x300x200",
      category: "Corrugated",
      unit_price: 45,
      stock: 5000,
      status: "active",
    },
    {
      id: "2",
      code: "PRD-002",
      name: "Kraft Paper Box 300x200x100",
      category: "Kraft Paper",
      unit_price: 32,
      stock: 3000,
      status: "active",
    },
    {
      id: "3",
      code: "PRD-003",
      name: "Display Box 600x400x300",
      category: "Display",
      unit_price: 65,
      stock: 2000,
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout
      title="Products"
      subtitle="Manage product inventory and specifications"
      headerAction={
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg"
        >
          + Add Product
        </button>
      }
    >
      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CODE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PRODUCT NAME</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">CATEGORY</th>
                <th className="text-right py-4 px-6 text-white font-semibold text-sm">UNIT PRICE</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">STOCK</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{product.code}</td>
                  <td className="py-4 px-6 text-gray-700">{product.name}</td>
                  <td className="py-4 px-6 text-gray-700">{product.category}</td>
                  <td className="py-4 px-6 text-right text-gray-900">₹{product.unit_price}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{product.stock}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Product Code" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Product Name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Select Category</option>
                <option value="Corrugated">Corrugated</option>
                <option value="Kraft">Kraft Paper</option>
                <option value="Display">Display</option>
              </select>
              <input type="number" placeholder="Unit Price" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              <input type="number" placeholder="Stock" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
