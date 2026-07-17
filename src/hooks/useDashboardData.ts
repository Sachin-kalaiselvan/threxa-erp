// src/hooks/useDashboardData.ts

import { useEffect, useState } from "react";
import type { DashboardData } from "../types/dashboard";

export function useDashboardData(view: "executive" | "production" | "inventory" | "analytics") {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Replace with actual API call
        // const response = await fetch(`/api/dashboard/${view}`);
        // const data = await response.json();
        // setData(data);

        // For now, return demo data structure
        const demoData: DashboardData = {
          kpis: [
            { label: "Total Revenue", value: "₹8,74,500", change: 12.5, changeType: "positive" },
            { label: "Total Orders", value: "24", change: 9.09, changeType: "positive" },
            { label: "Production", value: "18", change: 0, changeType: "neutral" },
            { label: "Dispatched", value: "12", change: 15.38, changeType: "positive" },
            { label: "Outstanding Payments", value: "₹19,63,250", change: -5.2, changeType: "negative" },
          ],
          charts: {
            revenue: {
              labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
              data: [180000, 200000, 190000, 220000, 210000, 230000, 240000, 250000, 260000, 240000, 270000, 280000],
            },
            orders: {
              segments: [
                { label: "Confirmed", value: 24, color: "#3B82F6" },
                { label: "In Production", value: 18, color: "#F59E0B" },
                { label: "Completed", value: 14, color: "#10B981" },
                { label: "Pending", value: 8, color: "#6B7280" },
              ],
              total: 64,
            },
            topCustomers: [
              { name: "Ramesh Traders", value: 425600 },
              { name: "Global Foods", value: 315750 },
              { name: "FreshMart", value: 278900 },
              { name: "Bright Retail", value: 210300 },
              { name: "Super Pack", value: 185400 },
            ],
            machineLoad: {
              categories: [
                "Corrugation Line 1",
                "Corrugation Line 2",
                "Die Cut Machine",
                "Flexo Printer",
                "Stitching Machine",
                "Slotting Machine",
                "Pasting Machine",
                "Tube Cutting",
              ],
              series: [
                {
                  name: "Utilization",
                  data: [78, 65, 82, 60, 45, 50, 30, 20],
                  color: "#7C3AED",
                },
              ],
            },
            receivablesAging: {
              segments: [
                { label: "0-30 Days", value: 40, color: "#10B981" },
                { label: "31-60 Days", value: 31, color: "#F59E0B" },
                { label: "61-90 Days", value: 17, color: "#EF4444" },
                { label: ">90 Days", value: 12, color: "#DC2626" },
              ],
              total: 100,
            },
          },
          tables: {
            orders: [
              { id: "1", orderNo: "CH-4807", customer: "Ramesh Traders", items: "Boxes", qty: 1000, status: "Dispatched" },
              { id: "2", orderNo: "CH-4808", customer: "Global Foods", items: "Trays", qty: 500, status: "In Transit" },
              { id: "3", orderNo: "CH-4809", customer: "FreshMart", items: "Boxes", qty: 750, status: "Pending" },
            ],
            customers: [
              { id: "1", name: "Ramesh Traders", revenue: 425600, orders: 12 },
              { id: "2", name: "Global Foods", revenue: 315750, orders: 8 },
              { id: "3", name: "FreshMart", revenue: 278900, orders: 6 },
            ],
            inventory: [
              { id: "1", item: "Test Liner", stock: 1240, min: 2000, max: 5000, location: "A1" },
              { id: "2", item: "Corrugating Medium", stock: 980, min: 1500, max: 4000, location: "B2" },
              { id: "3", item: "Kraft Paper", stock: 1100, min: 1500, max: 3500, location: "C1" },
            ],
          },
          widgets: {
            timeline: [
              { id: "1", label: "Corrugation Line 1", start: 8, duration: 4, status: "completed" },
              { id: "2", label: "Corrugation Line 2", start: 8, duration: 3, status: "in-progress" },
              { id: "3", label: "Die Cut Machine", start: 10, duration: 2, status: "pending" },
            ],
            dispatch: [
              { id: "1", challan: "CH-4807", customer: "Ramesh Traders", items: "Boxes", status: "Dispatched" },
              { id: "2", challan: "CH-4808", customer: "Global Foods", items: "Trays", status: "In Transit" },
              { id: "3", challan: "CH-4809", customer: "FreshMart", items: "Boxes", status: "Pending" },
            ],
          },
        };

        setData(demoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  return { data, loading, error };
}
