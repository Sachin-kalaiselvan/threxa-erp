import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  code: string;
  name: string;
  gsm: number;
  burst_factor: number;
  weight: number;
  price: number;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      code: "PRD-001",
      name: "Corrugated Box A4",
      gsm: 150,
      burst_factor: 8.0,
      weight: 250,
      price: 15000,
      stock: 500,
    },
    {
      id: "2",
      code: "PRD-002",
      name: "Corrugated Box A3",
      gsm: 200,
      burst_factor: 10.0,
      weight: 350,
      price: 20000,
      stock: 300,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    gsm: 0,
    burst_factor: 0,
    weight: 0,
    price: 0,
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (formData.name && formData.code) {
      setProducts([
        ...products,
        {
          id: Date.now().toString(),
          ...formData,
          stock: 0,
        },
      ]);
      setFormData({ code: "", name: "", gsm: 0, burst_factor: 0, weight: 0, price: 0 });
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-500">Manage product catalog</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Products</p>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Stock</p>
          <p className="text-3xl font-bold mt-2">
            {products.reduce((sum, p) => sum + p.stock, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Inventory Value</p>
          <p className="text-3xl font-bold mt-2">
            ₹
            {(
              products.reduce((sum, p) => sum + p.price * p.stock, 0) / 100000
            ).toFixed(1)}
            L
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
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
          New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">GSM</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Burst Factor</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Weight (g)</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Stock</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.name}</td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {product.gsm}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {product.burst_factor}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {product.weight}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                  ₹{product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock > 100
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit2 size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
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
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Product</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="PRD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSM
                </label>
                <input
                  type="number"
                  value={formData.gsm}
                  onChange={(e) => setFormData({ ...formData, gsm: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Burst Factor
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.burst_factor}
                  onChange={(e) => setFormData({ ...formData, burst_factor: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="8.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (g)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="250"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
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
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
