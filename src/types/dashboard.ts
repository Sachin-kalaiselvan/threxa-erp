// src/types/dashboard.ts

export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  sparkline?: number[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  data: number[];
  lineColor?: string;
  areaColor?: string;
}

export interface DonutChartData {
  segments: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  total: number;
}

export interface BarChartData {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color: string;
  }>;
}

export interface GanttItem {
  id: string;
  label: string;
  start: number;
  duration: number;
  status: "completed" | "in-progress" | "pending";
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface DashboardData {
  kpis: KPIData[];
  charts: {
    revenue?: LineChartData;
    orders?: DonutChartData;
    topCustomers?: ChartDataPoint[];
    productionProgress?: LineChartData;
    machineLoad?: BarChartData;
    receivablesAging?: DonutChartData;
  };
  tables: {
    orders?: TableRow[];
    customers?: TableRow[];
    inventory?: TableRow[];
    machines?: TableRow[];
    activities?: TableRow[];
  };
  widgets: {
    timeline?: GanttItem[];
    dispatch?: TableRow[];
    stockAlerts?: TableRow[];
    supplierPayments?: TableRow[];
  };
}

export interface DashboardViewState {
  selectedView: "executive" | "production" | "inventory" | "analytics";
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: {
    [key: string]: any;
  };
}
