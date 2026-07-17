import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface BoxSpec {
  id: string;
  box_type: string;
  gsm: number;
  burst_factor: number;
  weight_kg: number;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  stock_units: number;
  reorder_level: number;
  price_per_unit: number;
}

export default function Inventory() {
  const [specs, setSpecs] = useState<BoxSpec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const res = await supabase
          .from("box_specs")
          .select("*")
          .order("box_type", { ascending: true });

        if (res.data) {
          setSpecs(res.data as BoxSpec[]);
        }
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecs();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Raw Material Inventory</h1>
            <p className="text-gray-600 mt-1">Box specifications and stock levels</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
            + Add Stock
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Total Box Types</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{specs.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Total Units in Stock</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{specs.reduce((sum, s) => sum + s.stock_units, 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Low Stock Items</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{specs.filter(s => s.stock_units < s.reorder_level).length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm">Inventory Value</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹{(specs.reduce((sum, s) => sum + s.price_per_unit * s.stock_units, 0) / 100000).toFixed(1)}L</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold">Box Type</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">GSM</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Burst Factor</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Weight (kg)</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Dimensions</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Stock Units</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Reorder Level</th>
                  <th className="text-right py-4 px-6 text-gray-600 font-semibold">Price / Unit</th>
                  <th className="text-center py-4 px-6 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-semibold text-gray-900">{spec.box_type}</td>
                    <td className="py-4 px-6 text-center text-gray-700">{spec.gsm}</td>
                    <td className="py-4 px-6 text-center text-gray-700">{spec.burst_factor}</td>
                    <td className="py-4 px-6 text-center text-gray-700">{spec.weight_kg.toFixed(2)}</td>
                    <td className="py-4 px-6 text-center text-gray-600 text-xs">
                      {spec.length_mm} × {spec.width_mm} × {spec.height_mm} mm
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-semibold ${spec.stock_units < spec.reorder_level ? "text-red-600" : "text-green-600"}`}>
                        {spec.stock_units.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">{spec.reorder_level.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">₹{spec.price_per_unit.toFixed(2)}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          spec.stock_units < spec.reorder_level
                            ? "bg-red-100 text-red-800"
                            : spec.stock_units < spec.reorder_level * 1.5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {spec.stock_units < spec.reorder_level
                          ? "Low Stock"
                          : spec.stock_units < spec.reorder_level * 1.5
                          ? "Running Low"
                          : "In Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
