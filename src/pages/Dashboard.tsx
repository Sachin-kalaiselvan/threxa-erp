import React, { useState } from "react";
import { BarChart3, Factory, Package, TrendingUp } from "lucide-react";

// ==================== CHART COMPONENTS ====================

function LineChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <p className="text-gray-600 font-semibold">{title}</p>
        <p className="text-gray-400 text-sm mt-4">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">{title}</h3>
      <svg viewBox="0 0 600 200" className="w-full">
        {/* Grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1="40"
            y1={40 + (i * 120) / 4}
            x2="580"
            y2={40 + (i * 120) / 4}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line x1="40" y1="160" x2="580" y2="160" stroke="#d1d5db" strokeWidth="1.5" />
        <line x1="40" y1="40" x2="40" y2="160" stroke="#d1d5db" strokeWidth="1.5" />

        {/* Line path */}
        <polyline
          points={data
            .map((point, idx) => {
              const x = 40 + (idx * 540) / (data.length - 1 || 1);
              const y = 160 - ((point.value - minValue) / range) * 120;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {data.map((point, idx) => {
          const x = 40 + (idx * 540) / (data.length - 1 || 1);
          const y = 160 - ((point.value - minValue) / range) * 120;
          return (
            <circle
              key={`point-${idx}`}
              cx={x}
              cy={y}
              r="3"
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}

        {/* Labels */}
        {data.map((point, idx) => {
          const x = 40 + (idx * 540) / (data.length - 1 || 1);
          return (
            <text
              key={`label-${idx}`}
              x={x}
              y="180"
              textAnchor="middle"
              fontSize="12"
              fill="#9ca3af"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function BarChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <p className="text-gray-600 font-semibold">{title}</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">{title}</h3>
      <svg viewBox="0 0 600 200" className="w-full">
        {/* Grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1="40"
            y1={40 + (i * 120) / 4}
            x2="580"
            y2={40 + (i * 120) / 4}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line x1="40" y1="160" x2="580" y2="160" stroke="#d1d5db" strokeWidth="1.5" />
        <line x1="40" y1="40" x2="40" y2="160" stroke="#d1d5db" strokeWidth="1.5" />

        {/* Bars */}
        {data.map((bar, idx) => {
          const barWidth = 520 / data.length;
          const barX = 50 + idx * barWidth;
          const barHeight = (bar.value / maxValue) * 120;
          const barY = 160 - barHeight;
          const color = bar.color || "#3b82f6";

          return (
            <g key={`bar-${idx}`}>
              <rect
                x={barX}
                y={barY}
                width={barWidth - 16}
                height={barHeight}
                fill={color}
                rx="6"
                opacity="0.9"
              />
              <text
                x={barX + (barWidth - 16) / 2}
                y="180"
                textAnchor="middle"
                fontSize="12"
                fill="#9ca3af"
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

function DonutChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number; color: string }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-80 flex items-center justify-center">
        <p className="text-gray-400">No data</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="flex items-center justify-between">
        <svg viewBox="0 0 160 160" className="w-32 h-32">
          {data.map((item, idx) => {
            let currentAngle = data
              .slice(0, idx)
              .reduce((sum, d) => sum + (d.value / total) * 360, 0);
            const sliceAngle = (item.value / total) * 360;
            const startRad = (currentAngle * Math.PI) / 180;
            const endRad = ((currentAngle + sliceAngle) * Math.PI) / 180;

            const x1 = 80 + 55 * Math.cos(startRad);
            const y1 = 80 + 55 * Math.sin(startRad);
            const x2 = 80 + 55 * Math.cos(endRad);
            const y2 = 80 + 55 * Math.sin(endRad);

            const largeArc = sliceAngle > 180 ? 1 : 0;
            const path = `M 80 80 L ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} Z`;

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
          <circle cx="80" cy="80" r="30" fill="white" />
          <text
            x="80"
            y="85"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            {total}
          </text>
        </svg>

        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={`legend-${idx}`} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
              <span className="text-xs font-semibold text-gray-900 ml-auto">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GanttChart({
  title,
  tasks,
}: {
  title: string;
  tasks: Array<{ id: string; name: string; start: number; duration: number; color?: string }>;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4">
            <div className="w-40 text-xs text-gray-700 font-medium truncate">
              {task.name}
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full relative overflow-hidden">
              <div
                className="h-full rounded-full shadow-sm"
                style={{
                  marginLeft: `${task.start}%`,
                  width: `${task.duration}%`,
                  backgroundColor: task.color || "#3b82f6",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-xs font-semibold text-gray-700 text-left"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
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
    <div className={`${bgColor} rounded-xl p-5 border border-gray-100 shadow-sm`}>
      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <div className="flex items-center gap-1.5 mt-3">
        <span
          className={`text-xs font-semibold ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
        </span>
        <span className="text-xs text-gray-500">vs Yesterday</span>
      </div>
    </div>
  );
}

// ==================== MAIN DASHBOARD ====================

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "command" | "production" | "inventory" | "analytics"
  >("command");

  const tabs = [
    { id: "command", label: "Command Centre", icon: BarChart3 },
    { id: "production", label: "Production Control", icon: Factory },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  // ==================== COMMAND CENTRE TAB ====================
  const commandContent = (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard
          title="Today's Revenue"
          value="₹8,74,500"
          change={10.5}
          bgColor="bg-emerald-50"
        />
        <KPICard title="Total Orders" value="24" change={9.08} bgColor="bg-blue-50" />
        <KPICard
          title="Production Status"
          value="18"
          change={0}
          bgColor="bg-amber-50"
        />
        <KPICard title="Dispatched Today" value="12" change={5} bgColor="bg-sky-50" />
        <KPICard
          title="Outstanding Payments"
          value="₹19,63,250"
          change={13.38}
          bgColor="bg-rose-50"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        <LineChart
          title="Production Timeline (Live)"
          data={[
            { label: "09:00", value: 4500 },
            { label: "11:00", value: 5200 },
            { label: "13:00", value: 4800 },
            { label: "15:00", value: 6100 },
            { label: "17:00", value: 5900 },
          ]}
        />
        <BarChart
          title="Today's Dispatch Schedule"
          data={[
            { label: "09:00", value: 2, color: "#3b82f6" },
            { label: "11:30", value: 3, color: "#06b6d4" },
            { label: "14:00", value: 4, color: "#f59e0b" },
            { label: "17:00", value: 3, color: "#ef4444" },
          ]}
        />
      </div>

      {/* Revenue & Order Status */}
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

      {/* Gantt Timeline */}
      <GanttChart
        title="Production Timeline (Live)"
        tasks={[
          { id: "1", name: "Corrugation Line 1", start: 0, duration: 85, color: "#10b981" },
          { id: "2", name: "Die Cut Machine 1", start: 5, duration: 75, color: "#3b82f6" },
          { id: "3", name: "Printing Machine", start: 15, duration: 60, color: "#f59e0b" },
          { id: "4", name: "Stitching Machine", start: 25, duration: 50, color: "#ef4444" },
        ]}
      />

      {/* Top Customers Table */}
      <DataTable
        title="Top Customers (This Month)"
        columns={[
          { key: "customer", label: "Customer" },
          { key: "orders", label: "Orders" },
          { key: "revenue", label: "Revenue" },
          { key: "status", label: "Status" },
        ]}
        rows={[
          { customer: "Rajesh Enterprises", orders: 8, revenue: "₹2,40,000", status: "Active" },
          { customer: "Priya Packaging", orders: 6, revenue: "₹1,80,000", status: "Active" },
          { customer: "Kumar Industries", orders: 4, revenue: "₹1,20,000", status: "Pending" },
          { customer: "Global Foods", orders: 5, revenue: "₹1,50,000", status: "Active" },
          { customer: "FastMart Ltd", orders: 3, revenue: "₹90,000", status: "Active" },
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
        <KPICard title="Capacity Util." value="73%" change={3} bgColor="bg-green-50" />
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
            { label: "Corrugation L1", value: 95, color: "#10b981" },
            { label: "Die Cut M1", value: 78, color: "#3b82f6" },
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
        <KPICard title="Raw Materials" value="45,620" change={5} bgColor="bg-blue-50" />
        <KPICard title="Paper Used" value="32 Kg" change={8} bgColor="bg-yellow-50" />
        <KPICard title="SKU Boards" value="26,500" change={2} bgColor="bg-green-50" />
        <KPICard title="Supplier Credit" value="₹12.75L" change={-5} bgColor="bg-purple-50" />
        <KPICard title="POs in Transit" value="6" change={1} bgColor="bg-cyan-50" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BarChart
          title="Supplier Payments Due (30 Days)"
          data={[
            { label: "Shrivee Mills", value: 250, color: "#3b82f6" },
            { label: "Baba Paper Co", value: 180, color: "#f59e0b" },
            { label: "Gulf Packaging", value: 165, color: "#10b981" },
            { label: "Kumar Supp", value: 120, color: "#ef4444" },
          ]}
        />
        <DataTable
          title="Low Stock Alerts"
          columns={[
            { key: "item", label: "Item" },
            { key: "qty", label: "Qty" },
            { key: "alert", label: "Alert" },
          ]}
          rows={[
            { item: "Text Liner", qty: "140", alert: "🔴 Critical" },
            { item: "Corrugating Medium", qty: "120", alert: "🟡 Warning" },
            { item: "Kraft Paper", qty: "155", alert: "🟢 Normal" },
          ]}
        />
      </div>
    </div>
  );

  // ==================== ANALYTICS TAB ====================
  const analyticsContent = (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <KPICard title="Monthly Revenue" value="₹18.74L" change={12.45} bgColor="bg-green-50" />
        <KPICard title="Monthly Profit" value="₹4.25L" change={8.35} bgColor="bg-blue-50" />
        <KPICard title="Total Orders" value="64" change={9.88} bgColor="bg-purple-50" />
        <KPICard title="Avg Order Value" value="₹29,289" change={3.15} bgColor="bg-yellow-50" />
        <KPICard title="Receivables" value="₹19.63L" change={-5.2} bgColor="bg-red-50" />
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
            { label: "Custom Pkg", value: 15, color: "#10b981" },
            { label: "Other", value: 5, color: "#ef4444" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BarChart
          title="Revenue by Product Line"
          data={[
            { label: "5 Ply", value: 450000, color: "#3b82f6" },
            { label: "3 Ply", value: 350000, color: "#f59e0b" },
            { label: "Custom", value: 150000, color: "#10b981" },
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
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation - Layout.tsx already provides the header/logo, this page only owns its tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition font-medium whitespace-nowrap text-sm ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[calc(100vh-130px)]">
        {activeTab === "command" && commandContent}
        {activeTab === "production" && productionContent}
        {activeTab === "inventory" && inventoryContent}
        {activeTab === "analytics" && analyticsContent}
      </div>
    </div>
  );
}
