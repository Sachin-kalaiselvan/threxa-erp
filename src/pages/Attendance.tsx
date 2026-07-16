import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

/* Daily attendance marking. One tap cycles present -> half day -> absent.
   Rows upsert on (employee_id, att_date). */

type Status = "present" | "half_day" | "absent";
const cycle: Record<Status, Status> = { present: "half_day", half_day: "absent", absent: "present" };
const styles: Record<Status, string> = {
  present: "bg-green-500/15 text-green-400 border-green-500/30",
  half_day: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  absent: "bg-red-500/15 text-red-400 border-red-500/30",
};
const labels: Record<Status, string> = { present: "Present", half_day: "Half Day", absent: "Absent" };

export default function Attendance() {
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees").select("id, name, designation, daily_wage")
        .eq("is_active", true).order("name");
      if (error) throw error;
      return data as { id: string; name: string; designation: string | null; daily_wage: number }[];
    },
  });

  const { data: marks = {} } = useQuery({
    queryKey: ["attendance", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance").select("employee_id, status").eq("att_date", date);
      if (error) throw error;
      return Object.fromEntries(data.map((r) => [r.employee_id, r.status])) as Record<string, Status>;
    },
  });

  const mark = useMutation({
    mutationFn: async ({ employeeId, status }: { employeeId: string; status: Status }) => {
      const { error } = await supabase
        .from("attendance")
        .upsert({ employee_id: employeeId, att_date: date, status }, { onConflict: "employee_id,att_date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance", date] }),
  });

  const markAll = useMutation({
    mutationFn: async () => {
      const rows = employees.map((e) => ({ employee_id: e.id, att_date: date, status: "present" as Status }));
      const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "employee_id,att_date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance", date] }),
  });

  const counts = employees.reduce(
    (acc, e) => {
      const s = marks[e.id];
      if (s) acc[s]++;
      else acc.unmarked++;
      return acc;
    },
    { present: 0, half_day: 0, absent: 0, unmarked: 0 }
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <div className="flex items-center gap-3">
          <input type="date" className="input w-[160px]" value={date} max={today}
            onChange={(e) => setDate(e.target.value)} />
          <button className="btn-ghost" onClick={() => markAll.mutate()}>Mark all present</button>
        </div>
      </div>

      <div className="mb-4 flex gap-3 text-[12px] text-[#B9BAC5]">
        <span>Present: <b className="text-green-400">{counts.present}</b></span>
        <span>Half day: <b className="text-yellow-400">{counts.half_day}</b></span>
        <span>Absent: <b className="text-red-400">{counts.absent}</b></span>
        <span>Unmarked: <b>{counts.unmarked}</b></span>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <tbody>
            {employees.length === 0 && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]">Add employees first (People → Employees).</td></tr>
            )}
            {employees.map((e) => {
              const s = marks[e.id];
              return (
                <tr key={e.id} className="border-b border-white/[.04]">
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-[#B9BAC5]">{e.designation || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className={`rounded-lg border px-4 py-1.5 text-[12px] ${
                        s ? styles[s] : "border-white/[.1] text-[#B9BAC5]"
                      }`}
                      onClick={() => mark.mutate({ employeeId: e.id, status: s ? cycle[s] : "present" })}
                    >
                      {s ? labels[s] : "Mark"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-[#B9BAC5]">Tap a status to cycle: Present → Half Day → Absent.</p>
    </div>
  );
}
