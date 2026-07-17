import React, { useState } from "react";
import { Plus, Download, Trash2, Search } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  gsm: number;
  burst_factor: number;
  weight: number;
  qty_units: number;
  qty_reams: number;
  location: string;
  last_updated: string;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Corrugated Box A4",
      gsm: 150,
      burst_factor: 8.0,
      weight: 250,
      qty_units: 5000,
      qty_reams: 25,
      location: "Rack A-01",
      last_updated: "2024-07-16",
    },
    {
      id: "2",
      name: "Corrugated Box A3",
      gsm: 200,
      burst_factor: 10.0,
      weight: 350,
      qty_units: 3000,
      qty_reams: 15,
      location: "Rack A-02",
      last_updated: "2024-07-16",
    },
    {
      id: "3",
      name: "Kraft Paper Roll",
      gsm: 100,
      burst_factor: 6.5,
      weight: 180,
      qty_units: 8000,
      qty_reams: 40,
      location: "Rack B-01",
      last_updated: "2024-07-15",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    qty_units: 0,
    location: "",
  });

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = items.reduce((sum, item) => sum + item.weight * item.qty_units, 0);

  const handleAddItem = () => {
    if (formData.name && formData.location) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          ...formData,
          gsm: 0,
          burst_factor: 0,
          weight: 0,
          qty_reams: Math.floor(formData.qty_units / 200),
          last_updated: new Date().toISOString().split("T")[0],
        },
      ]);
      setFormData({ name: "", qty_units: 0, location: "" });
      setShowModal(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "GSM", "Burst Factor", "Weight", "Units", "Reams", "Location", "Last Updated"],
      ...items.map((item) => [
        item.name,
        item.gsm,
        item.burst_factor,
        item.weight,
        item.qty_units,
        item.qty_reams,
        item.location,
        item.last_updated,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory</h1>
        <p className="text-gray-500">Raw material and stock management</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Items</p>
          <p className="text-3xl font-bold mt-2">{items.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Total Units</p>
          <p className="text-3xl font-bold mt-2">
            {items.reduce((sum, i) => sum + i.qty_units, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-6">
          <p className="text-sm font-medium opacity-75">Inventory Weight</p>
          <p className="text-3xl font-bold mt-2">
            {(totalValue / 1000).toFixed(0)} kg
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Download size={20} />
          Export
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Item Name</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">GSM</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Burst</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Weight</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Units</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Reams</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Updated</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-600">
                  {item.gsm}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-600">
                  {item.burst_factor}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-600">
                  {item.weight}g
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {item.qty_units.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                  {item.qty_reams}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.last_updated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
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
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Inventory Item</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Units)
                </label>
                <input
                  type="number"
                  value={formData.qty_units}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qty_units: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Rack A-01"
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
                onClick={handleAddItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
