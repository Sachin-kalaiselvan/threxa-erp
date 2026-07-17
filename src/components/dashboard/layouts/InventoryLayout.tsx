// src/components/dashboard/layouts/InventoryLayout.tsx

import KPICard from "../cards/KPICard";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import Table from "../tables/Table";
import Heatmap from "../widgets/Heatmap";
import type { DashboardData } from "../../types/dashboard";

interface InventoryLayoutProps {
  data: DashboardData;
}

export default function InventoryLayout({ data }: InventoryLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory & Procurement</h1>
          <p className="text-gray-600 mt-1">Stock levels and supplier management</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4">
          <KPICard
            label="Total Reel Stock"
            value="45,620 Kgs"
            bgColor="#DCFCE7"
            icon="📦"
          />
          <KPICard
            label="Paper Used (Month)"
            value="32,450 Kgs"
            bgColor="#DBEAFE"
            icon="📄"
          />
          <KPICard
            label="BF Boards in Stock"
            value="26,500 Sq.Ft."
            bgColor="#FEF3C7"
            icon="📋"
          />
          <KPICard
            label="Supplier Credit (30d)"
            value="₹12,75,300"
            bgColor="#F3E8FF"
            icon="💳"
          />
          <KPICard
            label="POs in Transit"
            value="6"
            bgColor="#FEE2E2"
            icon="🚚"
          />
        </div>

        {/* Inventory Heatmap */}
        <Heatmap
          title="Inventory Heatmap by Ply (Kgs)"
          rows={["Test Liner", "Corrugating Medium", "Kraft Paper", "Duplex Board", "White Top Liner"]}
          columns={["3-Ply", "5-Ply", "7-Ply"]}
          data={[
            [
              { value: 1240, min: 2000, max: 5000 },
              { value: 2100, min: 2000, max: 5000 },
              { value: 3500, min: 2000, max: 5000 },
            ],
            [
              { value: 980, min: 1500, max: 4000 },
              { value: 1800, min: 1500, max: 4000 },
              { value: 2900, min: 1500, max: 4000 },
            ],
            [
              { value: 1100, min: 1500, max: 3500 },
              { value: 1900, min: 1500, max: 3500 },
              { value: 2600, min: 1500, max: 3500 },
            ],
            [
              { value: 2300, min: 2000, max: 5000 },
              { value: 3100, min: 2000, max: 5000 },
              { value: 4200, min: 2000, max: 5000 },
            ],
            [
              { value: 1500, min: 2000, max: 5000 },
              { value: 2500, min: 2000, max: 5000 },
              { value: 3800, min: 2000, max: 5000 },
            ],
          ]}
          unit=" Kgs"
        />

        {/* Supplier Payments & Purchase Trend */}
        <div className="grid grid-cols-2 gap-6">
          <Table
            title="Supplier Payments Due (30 Days)"
            columns={[
              { key: "supplier", label: "Supplier" },
              { key: "dueDate", label: "Due Date" },
              { key: "amount", label: "Amount", type: "number" },
            ]}
            rows={[
              { id: "1", supplier: "Shree Paper Mills", dueDate: "20 Jul", amount: 325000 },
              { id: "2", supplier: "Krishna Paper Co", dueDate: "22 Jul", amount: 285600 },
              { id: "3", supplier: "Sai Packaging Ltd", dueDate: "25 Jul", amount: 210300 },
              { id: "4", supplier: "Star Paper Mills", dueDate: "28 Jul", amount: 205400 },
              { id: "5", supplier: "Bharat Pulp Ind", dueDate: "30 Jul", amount: 249000 },
            ]}
            maxRows={5}
          />

          <LineChart
            title="Purchase Trend (6 Months)"
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[850000, 920000, 880000, 950000, 1100000, 1250000]}
            lineColor="#10B981"
            areaColor="#DCFCE7"
          />
        </div>

        {/* Material Consumption */}
        <BarChart
          title="Material Consumption Trend"
          categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          data={[
            {
              name: "Test Liner",
              values: [15000, 16000, 14000, 18000, 19000, 20000],
              color: "#3B82F6",
            },
            {
              name: "Corrugating Medium",
              values: [12000, 13000, 12000, 14000, 15000, 16000],
              color: "#8B5CF6",
            },
            {
              name: "Kraft Paper",
              values: [10000, 11000, 10000, 12000, 13000, 14000],
              color: "#10B981",
            },
          ]}
        />

        {/* Inventory Details */}
        <Table
          title="Inventory Details"
          columns={[
            { key: "item", label: "Item" },
            { key: "gsm", label: "GSM" },
            { key: "ply", label: "Ply", type: "text" },
            { key: "unit", label: "Unit" },
            { key: "stock", label: "Stock", type: "number" },
            { key: "min", label: "Min", type: "number" },
            { key: "max", label: "Max", type: "number" },
            { key: "location", label: "Location" },
          ]}
          rows={[
            { id: "1", item: "Test Liner", gsm: "150", ply: "3", unit: "Kgs", stock: 4840, min: 2000, max: 5000, location: "A-01" },
            { id: "2", item: "Corrugating Medium", gsm: "120", ply: "Single", unit: "Kgs", stock: 5680, min: 1500, max: 4000, location: "B-02" },
            { id: "3", item: "Kraft Paper", gsm: "100", ply: "Single", unit: "Kgs", stock: 5600, min: 1500, max: 3500, location: "C-01" },
            { id: "4", item: "Duplex Board", gsm: "250", ply: "2", unit: "Kgs", stock: 9600, min: 2000, max: 5000, location: "D-03" },
            { id: "5", item: "White Top Liner", gsm: "180", ply: "3", unit: "Kgs", stock: 7800, min: 2000, max: 5000, location: "E-02" },
            { id: "6", item: "Fluting Medium", gsm: "120", ply: "Single", unit: "Kgs", stock: 6500, min: 2000, max: 4500, location: "A-04" },
            { id: "7", item: "Natural Kraft", gsm: "80", ply: "Single", unit: "Kgs", stock: 5200, min: 1500, max: 3500, location: "B-05" },
            { id: "8", item: "Coated Paper", gsm: "200", ply: "2", unit: "Kgs", stock: 4100, min: 2000, max: 5000, location: "C-03" },
            { id: "9", item: "Bleached Kraft", gsm: "90", ply: "Single", unit: "Kgs", stock: 3800, min: 1500, max: 3500, location: "D-04" },
            { id: "10", item: "Printed Board", gsm: "350", ply: "3", unit: "Kgs", stock: 2900, min: 2000, max: 5000, location: "E-01" },
          ]}
          maxRows={10}
        />
      </div>
    </div>
  );
}
