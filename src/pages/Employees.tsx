import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";

interface Emp { id: string; empId: string; name: string; position: string; dept: string; phone: string; email: string; joined: string; status: "Active" | "On Leave" | "Inactive"; }

const SEED: Emp[] = [
  { id: "1",  empId: "EMP-001", name: "Ramesh Kumar",   position: "Production Manager",    dept: "Production",  phone: "+91 98765 43210", email: "ramesh@sps.in",  joined: "Mar 2021", status: "Active" },
  { id: "2",  empId: "EMP-002", name: "Priya Singh",    position: "Quality Lead",          dept: "Quality",     phone: "+91 98765 43211", email: "priya@sps.in",   joined: "Aug 2022", status: "Active" },
  { id: "3",  empId: "EMP-003", name: "Ajay Patel",     position: "Flexo Operator",        dept: "Production",  phone: "+91 98765 43212", email: "ajay@sps.in",    joined: "Jan 2023", status: "On Leave" },
  { id: "4",  empId: "EMP-004", name: "Suresh Babu",    position: "Die Cutting Operator",  dept: "Production",  phone: "+91 98765 43213", email: "suresh@sps.in",  joined: "Jun 2021", status: "Active" },
  { id: "5",  empId: "EMP-005", name: "Mahesh Naik",    position: "Stitching Operator",    dept: "Production",  phone: "+91 98765 43214", email: "mahesh@sps.in",  joined: "Feb 2022", status: "Active" },
  { id: "6",  empId: "EMP-006", name: "Vijay Shetty",   position: "Corrugator Operator",   dept: "Production",  phone: "+91 98765 43215", email: "vijay@sps.in",   joined: "Sep 2020", status: "Active" },
  { id: "7",  empId: "EMP-007", name: "Lakshmi Devi",   position: "Accounts Executive",    dept: "Accounts",    phone: "+91 98765 43216", email: "lakshmi@sps.in", joined: "Nov 2022", status: "Active" },
  { id: "8",  empId: "EMP-008", name: "Anil Gowda",     position: "Store Keeper",          dept: "Stores",      phone: "+91 98765 43217", email: "anil@sps.in",    joined: "Apr 2023", status: "Active" },
  { id: "9",  empId: "EMP-009", name: "Manjunath R",    position: "Dispatch Supervisor",   dept: "Dispatch",    phone: "+91 98765 43218", email: "manju@sps.in",   joined: "Jul 2021", status: "Active" },
  { id: "10", empId: "EMP-010", name: "Kavitha Rao",    position: "HR & Admin",            dept: "Admin",       phone: "+91 98765 43219", email: "kavitha@sps.in", joined: "Jan 2024", status: "Active" },
  { id: "11", empId: "EMP-011", name: "Farhan Sheikh",  position: "Helper",                dept: "Production",  phone: "+91 98765 43220", email: "farhan@sps.in",  joined: "May 2024", status: "On Leave" },
  { id: "12", empId: "EMP-012", name: "Deepak Yadav",   position: "Maintenance Technician",dept: "Maintenance", phone: "+91 98765 43221", email: "deepak@sps.in",  joined: "Oct 2023", status: "Inactive" },
];

const SC: Record<Emp["status"], string> = { Active: T.green, "On Leave": T.amber, Inactive: T.muted };

const FIELDS: readonly FieldSpec[] = [
  { key: "empId", label: "Employee ID", placeholder: "EMP-013", required: true, half: true },
  { key: "status", label: "Status", type: "select", options: ["Active", "On Leave", "Inactive"], half: true },
  { key: "name", label: "Full name", required: true },
  { key: "position", label: "Designation", placeholder: "Machine Operator", half: true },
  { key: "dept", label: "Department", type: "select", options: ["Production", "Quality", "Stores", "Dispatch", "Accounts", "Admin", "Maintenance"], half: true },
  { key: "phone", label: "Phone", placeholder: "+91 98765 43222", half: true },
  { key: "email", label: "Email", placeholder: "name@sps.in", half: true },
  { key: "joined", label: "Joined", placeholder: "Jul 2026", half: true },
] as const;

const FILTER_OPTS = ["Active", "On Leave", "Inactive"] as const;

export default function Employees() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Emp } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = v;
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Emp, ...p]);
    setModal(null);
  };
  const rowsF = status === "All" ? rows : rows.filter(r => r.status === status);
  const f = rowsF.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.empId.toLowerCase().includes(q.toLowerCase()) || r.dept.toLowerCase().includes(q.toLowerCase()));

  const exportCSV = () => {
    const csv = [["Emp ID", "Name", "Designation", "Department", "Phone", "Email", "Joined", "Status"], ...f.map(r => [r.empId, r.name, r.position, r.dept, r.phone, r.email, r.joined, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "employees.csv"; a.click();
  };

  return (
    <PageShell title="Employees" subtitle="Team directory and roles" meta={[`${rows.length} employees`, `${new Set(rows.map(r => r.dept)).size} departments`]}>
      <KPIStrip items={[
        { label: "Headcount", value: String(rows.length), sub: "on payroll", spark: [2, 2, 3, 3, 3, 3], color: T.accent },
        { label: "Active Today", value: String(rows.filter(r => r.status === "Active").length), sub: `${rows.filter(r => r.status === "On Leave").length} on leave`, spark: [3, 3, 2, 2, 2, 2], color: T.green },
        { label: "Departments", value: String(new Set(rows.map(r => r.dept)).size), sub: [...new Set(rows.map(r => r.dept))].slice(0, 3).join(" · "), spark: [2, 2, 2, 2, 2, 2], color: T.blue },
      ]} />
      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search employees…"
        primaryLabel="New Employee"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Status" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
      />
      <DataTable
        cols={[
          { key: "name", label: "Employee" }, { key: "role", label: "Role" },
          { key: "contact", label: "Contact" }, { key: "joined", label: "Joined" },
          { key: "status", label: "Status", align: "center" }, { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          name: <Cell2 primary={r.name} secondary={r.empId} />,
          role: <Cell2 primary={r.position} secondary={r.dept} />,
          contact: <Cell2 primary={r.email} secondary={r.phone} />,
          joined: <span style={{ color: T.muted, fontSize: 12.5 }}>{r.joined}</span>,
          status: <Badge label={r.status} color={SC[r.status]} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Employee" : "New Employee"}
          subtitle={modal.mode === "edit" ? "Update this employee" : "Add a new employee"}
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
