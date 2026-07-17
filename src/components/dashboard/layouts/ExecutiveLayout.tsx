// src/components/dashboard/layouts/ExecutiveLayout.tsx

import KPICard from "../cards/KPICard";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";
import BarChart from "../charts/BarChart";
import Table from "../tables/Table";
import GanttChart from "../widgets/GanttChart";
import type { DashboardData } from "../../types/dashboard";

interface ExecutiveLayoutProps {
  data: DashboardData;
}

export default function ExecutiveLayout({ data }: ExecutiveLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Command Center</h1>
          <p className="text-gray-600 mt-1">Real-time business overview</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-5 gap-4">
          {data.kpis.map((kpi, i) => (
            <KPICard
              key={i}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              changeType={kpi.changeType}
              bgColor={["#FEF3C7", "#DBEAFE", "#DCFCE7", "#FEE2E2", "#F3E8FF"][i]}
              textColor="#1A202C"
              icon={["💰", "📋", "⚙️", "🚚", "💳"][i]}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Trend */}
          {data.charts.revenue && (
            <LineChart
              title="Revenue Trend (12 Months)"
              labels={data.charts.revenue.labels}
              data={data.charts.revenue.data}
              lineColor="#3B82F6"
              areaColor="#DBEAFE"
            />
          )}

          {/* Orders Donut */}
          {data.charts.orders && (
            <DonutChart
              title="Order Status"
              segments={data.charts.orders.segments}
              total={data.charts.orders.total}
              centerText={`${data.charts.orders.total}`}
              centerSubtext="Total Orders"
            />
          )}

          {/* Dispatch Schedule Quick View */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Today's Dispatch</h3>
            <div className="space-y-2">
              {data.widgets.dispatch?.slice(0, 3).map((dispatch) => (
                <div
                  key={dispatch.id}
                  className="flex items-center justify-between pb-2 border-b border-gray-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{dispatch.challan}</p>
                    <p className="text-xs text-gray-600">{dispatch.customer}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded text-white font-semibold"
                    style={{
                      background:
                        dispatch.status === "Dispatched"
                          ? "#10B981"
                          : dispatch.status === "In Transit"
                          ? "#F59E0B"
                          : "#6B7280",
                    }}
                  >
                    {dispatch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production Timeline & Top Customers */}
        <div className="grid grid-cols-2 gap-6">
          {data.widgets.timeline && (
            <GanttChart
              title="Production Timeline (Live)"
              items={data.widgets.timeline}
              maxTime={18}
            />
          )}

          {data.charts.topCustomers && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Customers</h3>
              <div className="space-y-3">
                {data.charts.topCustomers.map((customer, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{(customer.value / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          background: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"][i],
                          width: `${(customer.value / 500000) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inventory & Cash Flow */}
        <div className="grid grid-cols-2 gap-6">
          {data.tables.inventory && (
            <Table
              title="Low Stock Alerts"
              columns={[
                { key: "item", label: "Item" },
                { key: "stock", label: "Stock (Kgs)" },
                { key: "min", label: "Min" },
                { key: "location", label: "Location" },
              ]}
              rows={data.tables.inventory.filter((row) => row.stock < row.min)}
              maxRows={4}
            />
          )}

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Cash Book Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Bank Balance</p>
                <p className="text-2xl font-bold text-gray-900">₹32,45,670</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cash in Hand</p>
                <p className="text-2xl font-bold text-gray-900">₹1,25,430</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Today's Receipts</p>
                  <p className="text-lg font-bold text-green-600">₹9,25,000</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Today's Payments</p>
                  <p className="text-lg font-bold text-red-600">₹4,51,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h3>
          <div className="space-y-3">
            {[
              "Order CH-4810 confirmed by Ramesh Traders",
              "Production batch WO-1260 completed",
              "Payment received from Global Foods (₹3,15,750)",
              "New customer registered: Bright Retail",
              "Inventory alert: Test Liner stock below minimum",
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-3 border-b border-gray-100"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity}</p>
                  <p className="text-xs text-gray-500 mt-1">{5 - i} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
