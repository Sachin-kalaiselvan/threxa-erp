import { useState } from "react";
import PageLayout from "../components/PageLayout";

interface InventoryItem {
  id: string;
  product_code: string;
  product_name: string;
  warehouse: string;
  quantity: number;
  reorder_level: number;
  last_updated: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export default function Inventory() {
  const [inventory] = useState<InventoryItem[]>([
    {
      id: "1",
      product_code: "PRD-001",
      product_name: "Corrugated Box 500x300x200",
      warehouse: "Main Warehouse",
      quantity: 5000,
      reorder_level: 1000,
      last_updated: "17 Jul 2024",
      status: "in_stock",
    },
    {
      id: "2",
      product_code: "PRD-002",
      product_name: "Kraft Paper Box 300x200x100",
      warehouse: "Warehouse B",
      quantity: 500,
      reorder_level: 1000,
      last_updated: "17 Jul 2024",
      status: "low_stock",
    },
    {
      id: "3",
      product_code: "PRD-003",
      product_name: "Display Box 600x400x300",
      warehouse: "Main Warehouse",
      quantity: 2000,
      reorder_level: 500,
      last_updated: "17 Jul 2024",
      status: "in_stock",
    },
  ]);

  return (
    <PageLayout
      title="Inventory"
      subtitle="Track stock levels and warehouse storage"
    >
      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#1a1a1a" }}>
              <tr>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PRODUCT CODE</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">PRODUCT NAME</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">WAREHOUSE</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">QUANTITY</th>
                <th className="text-center py-4 px-6 text-white font-semibold text-sm">REORDER LEVEL</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">LAST UPDATED</th>
                <th className="text-left py-4 px-6 text-white font-semibold text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{item.product_code}</td>
                  <td className="py-4 px-6 text-gray-700">{item.product_name}</td>
                  <td className="py-4 px-6 text-gray-700">{item.warehouse}</td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-900">{item.quantity}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{item.reorder_level}</td>
                  <td className="py-4 px-6 text-gray-600">{item.last_updated}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "in_stock"
                          ? "bg-green-100 text-green-700"
                          : item.status === "low_stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace(/_/g, " ")}
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
