import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

/* Phase 0: live counts so the dashboard is real from day one.
   Phase 5 replaces this with revenue charts (Recharts), order funnel,
   production load, and outstanding payments. */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <div className="mb-1.5 text-[11px] text-[#B9BAC5]">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: async () => {
      const [customers, orders, active] = await Promise.all([
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true })
          .in("status", ["confirmed", "in_production", "ready"]),
      ]);
      return {
        customers: customers.count ?? 0,
        orders: orders.count ?? 0,
        active: active.count ?? 0,
      };
    },
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div>
      <h1 className="text-lg font-semibold">{greeting} 👋</h1>
      <p className="mb-6 text-[13px] text-[#B9BAC5]">Here's what's happening today.</p>
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Customers" value={data?.customers ?? "—"} />
        <Stat label="Total Orders" value={data?.orders ?? "—"} />
        <Stat label="Active Orders" value={data?.active ?? "—"} />
        <Stat label="Pending Invoices" value="—" />
      </div>
      <div className="card mt-4 p-5 text-[13px] text-[#B9BAC5]">
        Revenue trends, production load, and outstanding payments arrive in Phase 5.
      </div>
    </div>
  );
}
