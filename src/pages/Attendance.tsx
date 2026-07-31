import { useState } from "react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, Btn, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";
import { Download } from "lucide-react";

interface Rec { id: string; empId: string; name: string; dept: string; date: string; checkIn: string; checkOut: string; hours: string; status: "Present" | "Absent" | "Leave" | "Half Day"; }

const SEED: Rec[] = [
  { id: "1",  empId: "EMP-001", name: "Ramesh Kumar",  dept: "Production",  date: "30 Jul", checkIn: "08:55", checkOut: "18:05", hours: "9h 10m", status: "Present" },
  { id: "2",  empId: "EMP-002", name: "Priya Singh",   dept: "Quality",     date: "30 Jul", checkIn: "09:12", checkOut: "17:48", hours: "8h 36m", status: "Present" },
  { id: "3",  empId: "EMP-003", name: "Ajay Patel",    dept: "Production",  date: "30 Jul", checkIn: "—",     checkOut: "—",     hours: "—",      status: "Leave" },
  { id: "4",  empId: "EMP-004", name: "Suresh Babu",   dept: "Production",  date: "30 Jul", checkIn: "08:48", checkOut: "18:20", hours: "9h 32m", status: "Present" },
  { id: "5",  empId: "EMP-005", name: "Mahesh Naik",   dept: "Production",  date: "30 Jul", checkIn: "09:02", checkOut: "18:10", hours: "9h 08m", status: "Present" },
  { id: "6",  empId: "EMP-006", name: "Vijay Shetty",  dept: "Production",  date: "30 Jul", checkIn: "08:40", checkOut: "17:55", hours: "9h 15m", status: "Present" },
  { id: "7",  empId: "EMP-007", name: "Lakshmi Devi",  dept: "Accounts",    date: "30 Jul", checkIn: "09:30", checkOut: "14:00", hours: "4h 30m", status: "Half Day" },
  { id: "8",  empId: "EMP-008", name: "Anil Gowda",    dept: "Stores",      date: "30 Jul", checkIn: "08:58", checkOut: "18:02", hours: "9h 04m", status: "Present" },
  { id: "9",  empId: "EMP-009", name: "Manjunath R",   dept: "Dispatch",    date: "30 Jul", checkIn: "07:45", checkOut: "19:10", hours: "11h 25m",status: "Present" },
  { id: "10", empId: "EMP-010", name: "Kavitha Rao",   dept: "Admin",       date: "30 Jul", checkIn: "09:20", checkOut: "17:40", hours: "8h 20m", status: "Present" },
  { id: "11", empId: "EMP-011", name: "Farhan Sheikh", dept: "Production",  date: "30 Jul", checkIn: "—",     checkOut: "—",     hours: "—",      status: "Leave" },
  { id: "12", empId: "EMP-012", name: "Deepak Yadav",  dept: "Maintenance", date: "30 Jul", checkIn: "—",     checkOut: "—",     hours: "—",      status: "Absent" },
];

const SC: Record<Rec["status"], string> = { Present: T.green, Absent: T.red, Leave: T.amber, "Half Day": T.blue };

const FIELDS: readonly FieldSpec[] = [
  { key: "empId", label: "Employee ID", placeholder: "EMP-001", required: true, half: true },
  { key: "status", label: "Status", type: "select", options: ["Present", "Absent", "Leave", "Half Day"], half: true },
  { key: "name", label: "Employee name", required: true, half: true },
  { key: "dept", label: "Department", type: "select", options: ["Production", "Quality", "Stores", "Dispatch", "Accounts", "Admin", "Maintenance"], half: true },
  { key: "date", label: "Date", placeholder: "31 Jul", half: true },
  { key: "hours", label: "Total hours", placeholder: "9h 10m", half: true },
  { key: "checkIn", label: "Check in", placeholder: "09:00", half: true },
  { key: "checkOut", label: "Check out", placeholder: "18:00", half: true },
] as const;

const FILTER_OPTS = ["Present", "Absent", "Leave", "Half Day"] as const;

export default function Attendance() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Rec } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = v;
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Rec, ...p]);
    setModal(null);
  };
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const rowsF = status === "All" ? rows : rows.filter(r => r.status === status);
  const f = rowsF.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.dept.toLowerCase().includes(q.toLowerCase()));

  const exportCSV = () => {
    const csv = [["Emp ID", "Name", "Department", "Date", "Check In", "Check Out", "Hours", "Status"], ...f.map(r => [r.empId, r.name, r.dept, r.date, r.checkIn, r.checkOut, r.hours, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "attendance.csv"; a.click();
  };

  return (
    <PageShell title="Attendance" subtitle="Daily check-ins and shift hours" meta={[new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short" }), "Morning Shift"]}>
      <KPIStrip items={[
        { label: "Present", value: String(rows.filter(r => r.status === "Present").length), sub: `of ${rows.length} employees`, spark: [2, 3, 3, 2, 3, 2], color: T.green },
        { label: "On Leave", value: String(rows.filter(r => r.status === "Leave").length), sub: "approved", spark: [0, 0, 1, 1, 0, 1], color: T.amber },
        { label: "Avg Hours", value: "8h 47m", delta: "+12m", sub: "vs last week", spark: [8.4, 8.5, 8.6, 8.7, 8.8, 8.9], color: T.blue },
      ]} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search employees…"
            style={{ width: "100%", height: 38, background: T.card, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px", fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ flex: 1 }} />
        <select value={status} onChange={e => setStatus(e.target.value)}
          style={{ height: 38, background: status === "All" ? T.card : T.card2, border: `1px solid ${status === "All" ? T.line : T.accent}`, borderRadius: 8, padding: "0 12px", fontSize: 13, color: status === "All" ? T.sub : T.text, outline: "none", cursor: "pointer" }}>
          <option value="All">Status: All</option>
          {FILTER_OPTS.map(o => <option key={o} value={o}>Status: {o}</option>)}
        </select>
        <Btn icon={Download} onClick={exportCSV}>Export</Btn>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ height: 38, background: T.card, border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px", fontSize: 13, color: T.text, outline: "none", colorScheme: "dark" }} />
        <Btn variant="primary" onClick={() => setModal({ mode: "new" })}>Mark Attendance</Btn>
      </div>
      <DataTable
        cols={[
          { key: "name", label: "Employee" }, { key: "times", label: "Check In / Out" },
          { key: "hours", label: "Hours", align: "right" }, { key: "status", label: "Status", align: "center" },
        ]}
        rows={f.map(r => ({
          name: <Cell2 primary={r.name} secondary={`${r.empId} · ${r.dept}`} />,
          times: <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.checkIn} → {r.checkOut}</span>,
          hours: <span style={{ fontVariantNumeric: "tabular-nums", color: T.text, fontWeight: 500 }}>{r.hours}</span>,
          status: <Badge label={r.status} color={SC[r.status]} />,
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Attendance" : "Mark Attendance"}
          subtitle={modal.mode === "edit" ? "Update this record" : "Add a new record"}
          fields={FIELDS}
          initial={modal.row}
          submitLabel={modal.mode === "edit" ? "Save changes" : "Create"}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageShell>
  );
}
