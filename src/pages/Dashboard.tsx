import React, { useState } from "react";
import { BarChart3, Factory, Package, TrendingUp } from "lucide-react";

// KPI Card Component
function KPICard({
  title,
  value,
  change,
  bgColor = "bg-blue-50",
}: {
  title: string;
  value: string | number;
  change: number;
  bgColor?: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <div className="flex items-center gap-1 mt-2">
        <span
          className={`text-sm font-medium ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? "+" : ""}{change}%
        </span>
        <span className="text-sm text-gray-500">vs Yesterday</span>
      </div>
    </div>
  );
}

// Simple Line Chart
function LineChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600">{title}</p>
        <p className="text-gray-400 text-sm mt-4">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <svg viewBox="0 0 800 300" className="w-full h-64">
        <line x1="60" y1="260" x2="780" y2="260" stroke="#d1d5db" strokeWidth="2" />
        <line x1="60" y1="60" x2="60" y2="260" stroke="#d1d5db" strokeWidth="2" />

        <polyline
          points={data
            .map((point, idx) => {
              const x = 60 + (idx * 720) / (data.length - 1 || 1);
              const y = 260 - ((point.value / maxValue) * 200);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {data.map((point, idx) => {
          const x = 60 + (idx * 720) / (data.length - 1 || 1);
          const y = 260 - ((point.value / maxValue) * 200);
          return (
            <g key={`point-${idx}`}>
              <circle cx={x} cy={y} r="4" fill="#3b82f6" />
              <text
                x={x}
                y="285"
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Simple Bar Chart
function BarChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600">{title}</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <svg viewBox="0 0 800 300" className="w-full h-64">
        <line x1="60" y1="260" x2="780" y2="260" stroke="#d1d5db" strokeWidth="2" />
        <line x1="60" y1="60" x2="60" y2="260" stroke="#d1d5db" strokeWidth="2" />

        {data.map((bar, idx) => {
          const barWidth = 700 / data.length;
          const barX = 70 + idx * barWidth;
          const barHeight = (bar.value / maxValue) * 200;
          const barY = 260 - barHeight;
          const color = bar.color || "#3b82f6";

          return (
            <g key={`bar-${idx}`}>
              <rect
                x={barX}
                y={barY}
                width={barWidth - 10}
                height={barHeight}
                fill={color}
                rx="4"
              />
              <text
                x={barX + (barWidth - 10) / 2}
                y="285"
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Donut Chart
function DonutChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number; color: string }>;
}) {
  if (!data || data.length === 0) {
    return <div className="bg-white rounded-lg p-6 border border-gray-200 h-80 flex items-center justify-center"><p className="text-gray-400">No data</p></div>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          {data.map((item, idx) => {
            const total = data.reduce((sum, d) => sum + d.value, 0);
            let currentAngle = data
              .slice(0, idx)
              .reduce((sum, d) => sum + (d.value / total) * 360, 0);
            const sliceAngle = (item.value / total) * 360;
            const startRad = (currentAngle * Math.PI) / 180;
            const endRad = ((currentAngle + sliceAngle) * Math.PI) / 180;

            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 + 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 + 80 * Math.sin(endRad);

            const largeArc = sliceAngle > 180 ? 1 : 0;
            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <path
                key={`slice-${idx}`}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          <circle cx="100" cy="100" r="40" fill="white" />
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill="#1f2937"
          >
            {total}
          </text>
        </svg>

        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={`legend-${idx}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Gantt Chart
function GanttChart({
  title,
  tasks,
}: {
  title: string;
  tasks: Array<{ id: string; name: string; start: number; duration: number; color?: string }>;
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-700 font-medium truncate">
              {task.name}
            </div>
            <div className="flex-1 h-8 bg-gray-100 rounded-lg relative overflow-hidden">
              <div
                className="h-full rounded-lg"
                style={{
                  marginLeft: `${task.start}%`,
                  width: `${task.duration}%`,
                  backgroundColor: task.color || "#3b82f6",
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Table
function DataTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, any>>;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-sm font-semibold text-left">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td key={`${idx}-${col.key}`} className="px-6 py-4 text-sm text-gray-700">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Heatmap
function Heatmap({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    name: string;
    cells: Array<{ label: string; value: number; max: number }>;
  }>;
}) {
  const getColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 20) return "#fecaca";
    if (percentage < 40) return "#fca5a5";
    if (percentage < 60) return "#fb923c";
    if (percentage < 80) return "#84cc16";
    return "#22c55e";
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="pr-4 py-2 text-sm font-medium text-gray-700 w-32">
                  {row.name}
                </td>
                <td>
                  <div className="flex gap-2">
                    {row.cells.map((cell, cellIdx) => {
                      const color = getColor(cell.value, cell.max);
                      return (
                        <div key={cellIdx} className="flex flex-col items-center">
                          <div
                            className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-700"
                            style={{ backgroundColor: color }}
                            title={`${cell.label}: ${cell.value}/${cell.max}`}
                          >
                            {cell.value}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {cell.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "owner" | "production" | "inventory" | "analytics"
  >("owner");

  const tabs = [
    { id: "owner", label: "Owner Command Center", icon: BarChart3 },
    { id: "production", label: "Production Control Room", icon: Factory },
    { id: "inventory", label: "Inventory & Procurement", icon: Package },
    { id: "analytics", label: "Business Analytics", icon: TrendingUp },
  ];

  // ==================== OWNER TAB ====================
  const ownerContent = (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard
          title="Today's Revenue"
          value="₹8,74,500"
          change={10.5}
          bgColor="bg-yellow-50"
        />
        <KPICard title="Total Orders" value="24" change={9.08} bgColor="bg-purple-50" />
        <KPICard
          title="Production Status"
          value="18"
          change={0}
          bgColor="bg-orange-50"
        />
        <KPICard
          title="Dispatched Today"
          value="12"
          change={5}
          bgColor="bg-blue-50"
        />
        <KPICard
          title="Outstanding Payments"
          value="₹19,63,250"
          change={13.38}
          bgColor="bg-red-50"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        <LineChart
          title="Production Timeline (Live)"
          data={[
            { label: "Week 1", value: 4500 },
            { label: "Week 2", value: 5200 },
            { label: "Week 3", value: 4800 },
            { label: "Week 4", value: 6100 },
          ]}
        />
        <BarChart
          title="Today's Dispatch Schedule"
          data={[
            { label: "09:00", value: 2, color: "#3b82f6" },
            { label: "11:30", value: 3, color: "#3b82f6" },
            { label: "14:00", value: 4, color: "#f59e0b" },
            { label: "17:00", value: 3, color: "#ef4444" },
          ]}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        <LineChart
          title="Revenue vs Target (This Month)"
          data={[
            { label: "Week 1", value: 200000 },
            { label: "Week 2", value: 320000 },
            { label: "Week 3", value: 380000 },
            { label: "Week 4", value: 420000 },
          ]}
        />
        <DonutChart
          title="Order Status"
          data={[
            { label: "Confirmed", value: 34, color: "#3b82f6" },
            { label: "In Production", value: 16, color: "#f59e0b" },
            { label: "Completed", value: 14, color: "#10b981" },
            { label: "Pending", value: 8, color: "#ef4444" },
          ]}
        />
      </div>

      {/* Table */}
      <DataTable
        title="Top Customers (This Month)"
        columns={[
          { key: "customer", label: "Customer" },
          { key: "orders", label: "Orders" },
          { key: "revenue", label: "Revenue" },
        ]}
        rows={[
          { customer: "Rajesh Enterprises", orders: 8, revenue: "₹2,40,000" },
          { customer: "Priya Packaging", orders: 6, revenue: "₹1,80,000" },
          { customer: "Kumar Industries", orders: 4, revenue: "₹1,20,000" },
        ]}
      />
    </div>
  );

  // ==================== PRODUCTION TAB ====================
  const productionContent = (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <KPICard title="Machines Running" value="5 / 8" change={0} bgColor="bg-blue-50" />
        <KPICard title="Work Orders" value="18" change={5} bgColor="bg-purple-50" />
        <KPICard title="Capacity Utilization" value="73%" change={3} bgColor="bg-green-50" />
        <KPICard title="Today's Output" value="24,560" change={8} bgColor="bg-yellow-50" />
        <KPICard title="Rejection Rate" value="2.35%" change={-0.5} bgColor="bg-red-50" />
      </div>

      <GanttChart
        title="Production Timeline (Live)"
        tasks={[
          { id: "1", name: "Corrugation Line 1", start: 0, duration: 85, color: "#10b981" },
          { id: "2", name: "Die Cut Machine 1", start: 5, duration: 75, color: "#3b82f6" },
          { id: "3", name: "Printing Machine", start: 15, duration: 60, color: "#f59e0b" },
          { id: "4", name: "Stitching Machine", start: 25, duration: 50, color: "#ef4444" },
        ]}
      />

      <div className="grid grid-cols-2 gap-6">
        <DataTable
          title="Production Queue (Kanban)"
          columns={[
            { key: "code", label: "Work Order" },
            { key: "status", label: "Status" },
            { key: "progress", label: "Progress" },
          ]}
          rows={[
            { code: "WO-1001", status: "In Progress", progress: "65%" },
            { code: "WO-1002", status: "In Progress", progress: "45%" },
            { code: "WO-1003", status: "Queued", progress: "0%" },
          ]}
        />
        <BarChart
          title="Machine Load"
          data={[
            { label: "Corrugation Line 1", value: 95, color: "#10b981" },
            { label: "Die Cut Machine 1", value: 78, color: "#3b82f6" },
            { label: "Printing", value: 65, color: "#f59e0b" },
            { label: "Stitching", value: 52, color: "#ef4444" },
          ]}
        />
      </div>
    </div>
  );

  // ==================== INVENTORY TAB ====================
  const inventoryContent = (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <KPICard title="Total Raw Materials" value="45,620" change={5} bgColor="bg-blue-50" />
        <KPICard title="Paper Used (This Month)" value="32 Kg" change={8} bgColor="bg-yellow-50" />
        <KPICard title="SKU Boards in Stock" value="26,500" change={2} bgColor="bg-green-50" />
        <KPICard title="Supplier Credit (30 Days)" value="₹12,75,300" change={-5} bgColor="bg-purple-50" />
        <KPICard title="POs in Transit" value="6" change={1} bgColor="bg-cyan-50" />
      </div>

      <Heatmap
        title="Inventory Headmap (Raw Stock)"
        rows={[
          {
            name: "Text Liner",
            cells: [
              { label: "1 Ply", value: 140, max: 1000 },
              { label: "2 Ply", value: 32, max: 1000 },
              { label: "3 Ply", value: 3.1, max: 100 },
            ],
          },
          {
            name: "Corrugating Medium",
            cells: [
              { label: "1 Ply", value: 120, max: 1000 },
              { label: "2 Ply", value: 28, max: 1000 },
              { label: "3 Ply", value: 2.8, max: 100 },
            ],
          },
          {
            name: "Kraft Paper",
            cells: [
              { label: "1 Ply", value: 155, max: 1000 },
              { label: "2 Ply", value: 45, max: 1000 },
              { label: "3 Ply", value: 4.2, max: 100 },
            ],
          },
        ]}
      />

      <div className="grid grid-cols-2 gap-6">
        <BarChart
          title="Supplier Payments Due (Next 30 Days)"
          data={[
            { label: "Shrivee Paper Mills", value: 250, color: "#3b82f6" },
            { label: "Baba Paper Co.", value: 180, color: "#f59e0b" },
            { label: "Gulf Packaging", value: 165, color: "#10b981" },
            { label: "Kumar Suppliers", value: 120, color: "#ef4444" },
          ]}
        />
        <DataTable
          title="Low Stock Alerts"
          columns={[
            { key: "item", label: "Item" },
            { key: "qty", label: "Current Qty" },
            { key: "alert", label: "Alert" },
          ]}
          rows={[
            { item: "Text Liner", qty: "140 Units", alert: "Critical" },
            { item: "Corrugating Medium", qty: "120 Units", alert: "Warning" },
            { item: "Kraft Paper", qty: "155 Units", alert: "Normal" },
          ]}
        />
      </div>
    </div>
  );

  // ==================== ANALYTICS TAB ====================
  const analyticsContent = (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <KPICard title="Monthly Revenue" value="₹18,74,500" change={12.45} bgColor="bg-green-50" />
        <KPICard title="Monthly Profit" value="₹4,25,300" change={8.35} bgColor="bg-blue-50" />
        <KPICard title="Total Orders" value="64" change={9.88} bgColor="bg-purple-50" />
        <KPICard title="Avg Order Value" value="₹29,289" change={3.15} bgColor="bg-yellow-50" />
        <KPICard title="Outstanding Receivables" value="₹19,63,250" change={-5.2} bgColor="bg-red-50" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <LineChart
          title="Monthly Revenue Trend (Last 6 Months)"
          data={[
            { label: "Aug", value: 180000 },
            { label: "Sep", value: 200000 },
            { label: "Oct", value: 220000 },
            { label: "Nov", value: 240000 },
            { label: "Dec", value: 260000 },
            { label: "Jan", value: 280000 },
          ]}
        />
        <DonutChart
          title="Product Mix (By Revenue)"
          data={[
            { label: "5 Ply Boxes", value: 45, color: "#3b82f6" },
            { label: "3 Ply Boxes", value: 35, color: "#f59e0b" },
            { label: "Custom Packaging", value: 15, color: "#10b981" },
            { label: "Other Products", value: 5, color: "#ef4444" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BarChart
          title="Revenue by Product Line"
          data={[
            { label: "5 Ply Boxes", value: 450000, color: "#3b82f6" },
            { label: "3 Ply Boxes", value: 350000, color: "#f59e0b" },
            { label: "Custom Boxes", value: 150000, color: "#10b981" },
            { label: "Other", value: 50000, color: "#ef4444" },
          ]}
        />
        <DataTable
          title="Top Customers (By Revenue)"
          columns={[
            { key: "customer", label: "Customer" },
            { key: "revenue", label: "Revenue" },
            { key: "orders", label: "Orders" },
          ]}
          rows={[
            { customer: "Rajesh Enterprises", revenue: "₹2,40,000", orders: "8" },
            { customer: "Global Foods", revenue: "₹1,75,750", orders: "10" },
            { customer: "FastMart Ltd", revenue: "₹1,50,300", orders: "7" },
            { customer: "Bright Retail", revenue: "₹1,15,300", orders: "5" },
            { customer: "Super Pack", revenue: "₹95,150", orders: "3" },
          ]}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e8e8e8]">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "owner" && ownerContent}
        {activeTab === "production" && productionContent}
        {activeTab === "inventory" && inventoryContent}
        {activeTab === "analytics" && analyticsContent}
      </div>
    </div>
  );
}
