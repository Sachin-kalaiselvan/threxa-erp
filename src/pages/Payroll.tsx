import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { supabase } from "../lib/supabase";

/* Payroll register: attendance x daily rate for a chosen month.
   Present = 1 day, Half day = 0.5, Absent = 0. Exports CSV in-browser. */

export default function Payroll() {
  const now = new Date();
  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["payroll", month],
    queryFn: async () => {
      const start = `${month}-01`;
      const [y, m] = month.split("-").map(Number);
      const end = new Date(y, m, 0).toISOString().slice(0, 10); // last day of month

      const [{ data: employees, error: e1 }, { data: att, error: e2 }] = await Promise.all([
        supabase.from("employees").select("id, name, designation, daily_wage").eq("is_active", true).order("name"),
        supabase.from("attendance").select("employee_id, status").gte("att_date", start).lte("att_date", end),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      return (employees ?? []).map((emp) => {
        const mine = (att ?? []).filter((a) => a.employee_id === emp.id);
        const present = mine.filter((a) => a.status === "present").length;
        const half = mine.filter((a) => a.status === "half_day").length;
        const absent = mine.filter((a) => a.status === "absent").length;
        const payableDays = present + half * 0.5;
        return {
          ...emp, present, half, absent, payableDays,
          wages: payableDays * Number(emp.daily_wage),
        };
      });
    },
  });

  const total = rows.reduce((s, r) => s + r.wages, 0);

  const exportCsv = () => {
    const header = "Employee,Designation,Daily Wage,Present,Half Days,Absent,Payable Days,Wages\n";
    const body = rows
      .map((r) =>
        [r.name, r.designation ?? "", r.daily_wage, r.present, r.half, r.absent, r.payableDays, r.wages.toFixed(2)]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `payroll-${month}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Payroll Register</h1>
        <div className="flex items-center gap-3">
          <input type="month" className="input w-[160px]" value={month}
            onChange={(e) => setMonth(e.target.value)} />
          <button className="btn flex items-center gap-1.5" onClick={exportCsv} disabled={rows.length === 0}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Rate/day</th>
              <th className="px-4 py-3 text-center">Present</th>
              <th className="px-4 py-3 text-center">Half</th>
              <th className="px-4 py-3 text-center">Absent</th>
              <th className="px-4 py-3 text-center">Payable days</th>
              <th className="px-4 py-3 text-right">Wages</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={7}>Calculating...</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={7}>No active employees.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/[.04]">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">₹{Number(r.daily_wage).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-center text-green-400">{r.present}</td>
                <td className="px-4 py-3 text-center text-yellow-400">{r.half}</td>
                <td className="px-4 py-3 text-center text-red-400">{r.absent}</td>
                <td className="px-4 py-3 text-center">{r.payableDays}</td>
                <td className="px-4 py-3 text-right font-medium">
                  ₹{r.wages.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className="border-t border-white/[.08]">
                <td className="px-4 py-3 font-semibold" colSpan={6}>Total</td>
                <td className="px-4 py-3 text-right font-semibold text-[#9D6CFF]">
                  ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
