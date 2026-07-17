// src/components/dashboard/layouts/AnalyticsLayout.tsx

import KPICard from "../cards/KPICard";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";
import BarChart from "../charts/BarChart";
import Table from "../tables/Table";
import type { DashboardData } from "../../types/dashboard";

interface AnalyticsLayoutProps {
  data: DashboardData;
}

export default function AnalyticsLayout({ data }: AnalyticsLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600 mt-1">Financial metrics and business intelligence</p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            label="Monthly Revenue"
            value="₹18,74,500"
            change={12.49}
            changeType="positive"
            bgColor="#DBEAFE"
            icon="💰"
          />
          <KPICard
            label="Monthly Profit"
            value="₹4,25,300"
            change={8.35}
            changeType="positive"
            bgColor="#DCFCE7"
            icon="📈"
          />
          <KPICard
            label="Total Orders"
            value="64"
            change={9.68}
            changeType="positive"
            bgColor="#FEF3C7"
            icon="📋"
          />
          <KPICard
            label="Avg Order Value"
            value="₹29,289"
            change={2.15}
            changeType="positive"
            bgColor="#F3E8FF"
            icon="💳"
          />
        </div>

        {/* Revenue Trend & Product Mix */}
        <div className="grid grid-cols-2 gap-6">
          <LineChart
            title="Revenue Trend (12 Months)"
            labels={["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            data={[1500000, 1650000, 1580000, 1750000, 1680000, 1850000, 1920000, 2000000, 2080000, 1920000, 2160000, 1874500]}
            lineColor="#3B82F6"
            areaColor="#DBEAFE"
          />

          <DonutChart
            title="Revenue by Product Type"
            segments={[
              { label: "3-Ply Boxes", value: 38.5, color: "#3B82F6" },
              { label: "5-Ply Boxes", value: 32.2, color: "#8B5CF6" },
              { label: "7-Ply Boxes", value: 18.7, color: "#10B981" },
              { label: "Other Products", value: 10.6, color: "#F59E0B" },
            ]}
            total={100}
            centerText="₹18.74L"
            centerSubtext="Total"
          />
        </div>

        {/* Top Customers & Receivables Aging */}
        <div className="grid grid-cols-2 gap-6">
          <Table
            title="Top Customers (By Revenue)"
            columns={[
              { key: "name", label: "Customer" },
              { key: "revenue", label: "Revenue", type: "number" },
              { key: "orders", label: "Orders", type: "number" },
            ]}
            rows={[
              { id: "1", name: "Ramesh Traders", revenue: 425600, orders: 12 },
              { id: "2", name: "Global Foods", revenue: 315750, orders: 8 },
              { id: "3", name: "FreshMart", revenue: 278900, orders: 6 },
              { id: "4", name: "Bright Retail", revenue: 210300, orders: 5 },
              { id: "5", name: "Super Pack", revenue: 185400, orders: 4 },
            ]}
            maxRows={5}
          />

          <DonutChart
            title="Outstanding Receivables (By Aging)"
            segments={[
              { label: "0-30 Days", value: 40, color: "#10B981" },
              { label: "31-60 Days", value: 31, color: "#F59E0B" },
              { label: "61-90 Days", value: 17, color: "#EF4444" },
              { label: ">90 Days", value: 12, color: "#DC2626" },
            ]}
            total={100}
            centerText="₹19.63L"
            centerSubtext="Total Due"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Dispatch Performance</p>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-green-600">On Time</span>
                <span className="text-xs font-semibold text-gray-900">92.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: "92.5%" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Payroll Cost</p>
            <p className="text-2xl font-bold text-gray-900 mt-3">₹6,85,430</p>
            <p className="text-xs text-gray-500 mt-1">+6.25% vs last month</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Cash Flow</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-green-600 font-semibold">Inflow</span>
                <span className="text-sm font-bold text-green-600">₹25.4L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-red-600 font-semibold">Outflow</span>
                <span className="text-sm font-bold text-red-600">₹18.55L</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Gross Profit Margin</p>
            <p className="text-2xl font-bold text-gray-900 mt-3">22.68%</p>
            <p className="text-xs text-green-600 mt-1">+1.35% vs last month</p>
          </div>
        </div>

        {/* Daily Sales & Trends */}
        <div className="grid grid-cols-2 gap-6">
          <BarChart
            title="Daily Sales (Last 7 Days)"
            categories={["09 Jul", "10 Jul", "11 Jul", "12 Jul", "13 Jul", "14 Jul", "15 Jul"]}
            data={[
              {
                name: "Sales",
                values: [2500, 3200, 2800, 3500, 4200, 3800, 3400],
                color: "#3B82F6",
              },
            ]}
          />

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Metrics Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Dispatches</span>
                <span className="text-lg font-bold text-gray-900">78</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Avg Dispatch Time</span>
                <span className="text-lg font-bold text-gray-900">4.2 hrs</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-lg font-bold text-gray-900">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On-Time Delivery</span>
                <span className="text-lg font-bold text-green-600">92.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Customer Analysis */}
        <Table
          title="Customer Revenue Analysis"
          columns={[
            { key: "customer", label: "Customer Name" },
            { key: "ytdRevenue", label: "YTD Revenue", type: "number" },
            { key: "orders", label: "Orders", type: "number" },
            { key: "avgOrder", label: "Avg Order", type: "number" },
            { key: "growth", label: "Growth %", type: "number" },
          ]}
          rows={[
            { id: "1", customer: "Ramesh Traders", ytdRevenue: 5107200, orders: 142, avgOrder: 35976, growth: 15.2 },
            { id: "2", customer: "Global Foods", ytdRevenue: 3789000, orders: 96, avgOrder: 39469, growth: 8.5 },
            { id: "3", customer: "FreshMart", ytdRevenue: 3346800, orders: 80, avgOrder: 41835, growth: 12.3 },
            { id: "4", customer: "Bright Retail", ytdRevenue: 2523600, orders: 60, avgOrder: 42060, growth: 5.8 },
            { id: "5", customer: "Super Pack", ytdRevenue: 2224800, orders: 48, avgOrder: 46350, growth: 3.2 },
            { id: "6", customer: "Premium Logistics", ytdRevenue: 1987200, orders: 42, avgOrder: 47314, growth: 9.1 },
            { id: "7", customer: "EcoBox Solutions", ytdRevenue: 1645600, orders: 35, avgOrder: 46988, growth: 22.5 },
            { id: "8", customer: "Quality Dist", ytdRevenue: 1456800, orders: 32, avgOrder: 45525, growth: 6.3 },
          ]}
          maxRows={8}
        />
      </div>
    </div>
  );
}
