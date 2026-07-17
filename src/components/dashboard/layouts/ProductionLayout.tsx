// src/components/dashboard/layouts/ProductionLayout.tsx

import KPICard from "../cards/KPICard";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import Table from "../tables/Table";
import GanttChart from "../widgets/GanttChart";
import type { DashboardData } from "../../types/dashboard";

interface ProductionLayoutProps {
  data: DashboardData;
}

export default function ProductionLayout({ data }: ProductionLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Production Control Room</h1>
          <p className="text-gray-600 mt-1">Real-time production operations</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4">
          <KPICard
            label="Machines Running"
            value="5/8"
            bgColor="#DBEAFE"
            icon="⚙️"
          />
          <KPICard
            label="Work Orders"
            value="18"
            bgColor="#E0E7FF"
            icon="📋"
          />
          <KPICard
            label="Capacity Utilization"
            value="73%"
            change={5.2}
            changeType="positive"
            bgColor="#DCFCE7"
            icon="📊"
          />
          <KPICard
            label="Today's Output"
            value="24,560 Sq.Ft."
            bgColor="#FEF3C7"
            icon="📦"
          />
          <KPICard
            label="Rejection Rate"
            value="2.35%"
            change={-0.45}
            changeType="positive"
            bgColor="#F3E8FF"
            icon="⚠️"
          />
        </div>

        {/* Production Queue (Kanban) */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Production Queue (Kanban)</h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Pending */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Pending (3)</h4>
              <div className="space-y-3">
                {["WO-1261", "WO-1262", "WO-1263"].map((wo) => (
                  <div
                    key={wo}
                    className="bg-gray-50 p-4 rounded border border-gray-200"
                  >
                    <p className="font-semibold text-gray-900">{wo}</p>
                    <p className="text-xs text-gray-600 mt-1">Awaiting Start</p>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">In Progress (3)</h4>
              <div className="space-y-3">
                {[
                  { wo: "WO-1258", progress: 45 },
                  { wo: "WO-1259", progress: 70 },
                  { wo: "WO-1260", progress: 90 },
                ].map((item) => (
                  <div
                    key={item.wo}
                    className="bg-blue-50 p-4 rounded border border-blue-200"
                  >
                    <p className="font-semibold text-gray-900">{item.wo}</p>
                    <div className="mt-2 bg-blue-100 rounded h-2">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.progress}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Completed (3)</h4>
              <div className="space-y-3">
                {["WO-1255", "WO-1256", "WO-1257"].map((wo) => (
                  <div
                    key={wo}
                    className="bg-green-50 p-4 rounded border border-green-200"
                  >
                    <p className="font-semibold text-gray-900">{wo}</p>
                    <p className="text-xs text-gray-600 mt-1">✅ 100%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Machine Load & Production Progress */}
        <div className="grid grid-cols-2 gap-6">
          {data.charts.machineLoad && (
            <BarChart
              title="Machine Load"
              categories={data.charts.machineLoad.categories}
              data={data.charts.machineLoad.series}
              horizontal={true}
            />
          )}

          {data.charts.revenue && (
            <LineChart
              title="Production Progress (Today)"
              labels={["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]}
              data={[2500, 5000, 7500, 10000, 15000, 24560]}
              lineColor="#8B5CF6"
              areaColor="#EDE9FE"
            />
          )}
        </div>

        {/* Production Timeline */}
        {data.widgets.timeline && (
          <GanttChart
            title="Live Production Schedule"
            items={data.widgets.timeline}
            maxTime={18}
          />
        )}

        {/* Pending QC & Completed Orders */}
        <div className="grid grid-cols-2 gap-6">
          <Table
            title="Pending QC Inspection"
            columns={[
              { key: "id", label: "WO No" },
              { key: "items", label: "Items", type: "text" },
              { key: "qty", label: "Qty", type: "number" },
            ]}
            rows={[
              { id: "WO-1258", items: "Boxes (5-Ply)", qty: 5000 },
              { id: "WO-1259", items: "Trays (3-Ply)", qty: 3000 },
              { id: "WO-1260", items: "Boxes (7-Ply)", qty: 2000 },
              { id: "WO-1261", items: "Boards (BF)", qty: 1500 },
            ]}
            maxRows={4}
          />

          <Table
            title="Completed Orders Today"
            columns={[
              { key: "wo", label: "WO No" },
              { key: "customer", label: "Customer" },
              { key: "qty", label: "Qty", type: "number" },
              { key: "time", label: "Time" },
            ]}
            rows={[
              { id: "1", wo: "WO-1255", customer: "Ramesh", qty: 5000, time: "14:30" },
              { id: "2", wo: "WO-1256", customer: "Global", qty: 3000, time: "15:45" },
              { id: "3", wo: "WO-1257", customer: "Fresh", qty: 2000, time: "17:00" },
              { id: "4", wo: "WO-1254", customer: "Bright", qty: 1500, time: "12:15" },
            ]}
            maxRows={4}
          />
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Planned Output</p>
            <p className="text-2xl font-bold text-gray-900">32,000 Sq.Ft.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Actual Output</p>
            <p className="text-2xl font-bold text-green-600">24,560 Sq.Ft.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Pending Output</p>
            <p className="text-2xl font-bold text-amber-600">7,440 Sq.Ft.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Avg/Hour</p>
            <p className="text-2xl font-bold text-blue-600">2,730 Sq.Ft.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
