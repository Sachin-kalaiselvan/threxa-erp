export interface DashboardKPI {
  title: string;
  value: string | number;
  change: number;
  icon?: string;
  bgColor?: string;
}

export interface DashboardData {
  kpis: DashboardKPI[];
  chartData: any[];
  tableData: any[];
}
