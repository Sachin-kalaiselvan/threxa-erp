import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Emp { id: string; empId: string; name: string; position: string; dept: string; phone: string; email: string; joined: string; status: "Active" | "On Leave" | "Inactive"; }

const SEED: Emp[] = [
  { id: "1", empId: "EMP-001", name: "Ramesh Kumar", position: "Production Manager", dept: "Production", phone: "+91 98765 43210", email: "ramesh@sps.in", joined: "Mar 2021", status: "Active" },
  { id: "2", empId: "EMP-002", name: "Priya Singh",  position: "Quality Lead",       dept: "Quality",    phone: "+91 98765 43211", email: "priya@sps.in",  joined: "Aug 2022", status: "Active" },
  { id: "3", empId: "EMP-003", name: "Ajay Patel",   position: "Machine Operator",   dept: "Production", phone: "+91 98765 43212", email: "ajay@sps.in",   joined: "Jan 2023", status: "On Leave" },
];

const SC: Record<Emp["status"], string> = { Active: T.green, "On Leave": T.amber, Inactive: T.muted };

export default function Employees() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.empId.toLowerCase().includes(q.toLowerCase()) || r.dept.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageShell title="Employees" subtitle="Team directory and roles" meta={[`${rows.length} employees`, `${new Set(rows.map(r => r.dept)).size} departments`]}>
      <KPIStrip items={[
        { label: "Headcount", value: String(rows.length), sub: "on payroll", spark: [2, 2, 3, 3, 3, 3], color: T.accent },
        { label: "Active Today", value: String(rows.filter(r => r.status === "Active").length), sub: `${rows.filter(r => r.status === "On Leave").length} on leave`, spark: [3, 3, 2, 2, 2, 2], color: T.green },
        { label: "Departments", value: String(new Set(rows.map(r => r.dept)).size), sub: "Production · Quality", spark: [2, 2, 2, 2, 2, 2], color: T.blue },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search employees…" primaryLabel="New Employee" />
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
              <button style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
