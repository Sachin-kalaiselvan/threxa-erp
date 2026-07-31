import { useState } from "react";
import { Edit2, Download, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";

interface Pay { id: string; empId: string; name: string; dept: string; base: number; allowance: number; deduction: number; net: number; status: "Draft" | "Approved" | "Paid"; }

const SEED: Pay[] = [
  { id: "1",  empId: "EMP-001", name: "Ramesh Kumar",  dept: "Production",  base: 50000, allowance: 5000, deduction: 3000, net: 52000, status: "Paid" },
  { id: "2",  empId: "EMP-002", name: "Priya Singh",   dept: "Quality",     base: 45000, allowance: 4500, deduction: 2500, net: 47000, status: "Paid" },
  { id: "3",  empId: "EMP-003", name: "Ajay Patel",    dept: "Production",  base: 28000, allowance: 2000, deduction: 1200, net: 28800, status: "Draft" },
  { id: "4",  empId: "EMP-004", name: "Suresh Babu",   dept: "Production",  base: 30000, allowance: 2500, deduction: 1400, net: 31100, status: "Paid" },
  { id: "5",  empId: "EMP-005", name: "Mahesh Naik",   dept: "Production",  base: 29000, allowance: 2200, deduction: 1300, net: 29900, status: "Paid" },
  { id: "6",  empId: "EMP-006", name: "Vijay Shetty",  dept: "Production",  base: 32000, allowance: 2800, deduction: 1500, net: 33300, status: "Approved" },
  { id: "7",  empId: "EMP-007", name: "Lakshmi Devi",  dept: "Accounts",    base: 38000, allowance: 3500, deduction: 2100, net: 39400, status: "Approved" },
  { id: "8",  empId: "EMP-008", name: "Anil Gowda",    dept: "Stores",      base: 26000, allowance: 1800, deduction: 1100, net: 26700, status: "Paid" },
  { id: "9",  empId: "EMP-009", name: "Manjunath R",   dept: "Dispatch",    base: 34000, allowance: 4200, deduction: 1700, net: 36500, status: "Paid" },
  { id: "10", empId: "EMP-010", name: "Kavitha Rao",   dept: "Admin",       base: 36000, allowance: 3000, deduction: 1900, net: 37100, status: "Approved" },
  { id: "11", empId: "EMP-011", name: "Farhan Sheikh", dept: "Production",  base: 18000, allowance: 1200, deduction: 700,  net: 18500, status: "Draft" },
  { id: "12", empId: "EMP-012", name: "Deepak Yadav",  dept: "Maintenance", base: 31000, allowance: 2600, deduction: 1500, net: 32100, status: "Draft" },
];

const SC: Record<Pay["status"], string> = { Draft: T.muted, Approved: T.blue, Paid: T.green };

const FIELDS: readonly FieldSpec[] = [
  { key: "empId", label: "Employee ID", placeholder: "EMP-013", required: true, half: true },
  { key: "status", label: "Status", type: "select", options: ["Draft", "Approved", "Paid"], half: true },
  { key: "name", label: "Employee name", required: true, half: true },
  { key: "dept", label: "Department", type: "select", options: ["Production", "Quality", "Stores", "Dispatch", "Accounts", "Admin", "Maintenance"], half: true },
  { key: "base", label: "Base salary (₹)", type: "number", half: true },
  { key: "allowance", label: "Allowance (₹)", type: "number", half: true },
  { key: "deduction", label: "Deduction (₹)", type: "number", half: true },
] as const;

const FILTER_OPTS = ["Draft", "Approved", "Paid"] as const;

export default function Payroll() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Pay } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = { ...v, net: Number(v.base) + Number(v.allowance) - Number(v.deduction) };
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Pay, ...p]);
    setModal(null);
  };
  const rowsF = status === "All" ? rows : rows.filter(r => r.status === status);
  const f = rowsF.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.dept.toLowerCase().includes(q.toLowerCase()));
  const total = rows.reduce((s, r) => s + r.net, 0);
  const paid = rows.filter(r => r.status === "Paid").reduce((s, r) => s + r.net, 0);

  const exportCSV = () => {
    const csv = [["Emp ID", "Name", "Dept", "Base", "Allowance", "Deduction", "Net", "Status"], ...f.map(r => [r.empId, r.name, r.dept, r.base, r.allowance, r.deduction, r.net, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "payroll-jul-2026.csv"; a.click();
  };

  const payslip = (r: Pay) => {
    const csv = [
      ["Payslip", "July 2026"], ["Employee", r.name], ["Employee ID", r.empId], ["Department", r.dept],
      ["Base", r.base], ["Allowance", r.allowance], ["Deduction", r.deduction], ["Net Pay", r.net], ["Status", r.status],
    ].map(x => x.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = `payslip-${r.empId}.csv`; a.click();
  };

  return (
    <PageShell title="Payroll" subtitle="July 2026 salary cycle" meta={[`${rows.length} employees`, `₹${(total / 100000).toFixed(2)}L total`, `${rows.filter(r => r.status === "Paid").length} paid`]}>
      <KPIStrip items={[
        { label: "Total Payroll", value: `₹${(total / 100000).toFixed(2)}L`, sub: "July 2026", spark: [1.2, 1.22, 1.25, 1.26, 1.27, 1.28], color: T.accent },
        { label: "Disbursed", value: `₹${(paid / 100000).toFixed(2)}L`, sub: `${Math.round(paid / total * 100)}% complete`, spark: [0, 0.2, 0.3, 0.4, 0.5, 0.52], color: T.green },
        { label: "Pending", value: `₹${((total - paid) / 100000).toFixed(2)}L`, sub: `${rows.filter(r => r.status !== "Paid").length} employees`, spark: [1.28, 1.1, 0.98, 0.9, 0.8, 0.76], color: T.amber },
      ]} />
      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search employees…"
        primaryLabel="Run Payroll"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Status" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
      />
      <DataTable
        cols={[
          { key: "name", label: "Employee" }, { key: "base", label: "Base", align: "right" },
          { key: "allowance", label: "Allowance", align: "right" }, { key: "deduction", label: "Deduction", align: "right" },
          { key: "net", label: "Net Pay", align: "right" }, { key: "status", label: "Status", align: "center" },
          { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          name: <Cell2 primary={r.name} secondary={`${r.empId} · ${r.dept}`} />,
          base: <span style={{ fontVariantNumeric: "tabular-nums" }}>₹{r.base.toLocaleString("en-IN")}</span>,
          allowance: <span style={{ fontVariantNumeric: "tabular-nums", color: T.green }}>+₹{r.allowance.toLocaleString("en-IN")}</span>,
          deduction: <span style={{ fontVariantNumeric: "tabular-nums", color: T.red }}>−₹{r.deduction.toLocaleString("en-IN")}</span>,
          net: <span style={{ fontVariantNumeric: "tabular-nums", color: T.text, fontWeight: 700 }}>₹{r.net.toLocaleString("en-IN")}</span>,
          status: <Badge label={r.status} color={SC[r.status]} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button title="Download payslip" onClick={() => payslip(r)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Download size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Payslip" : "Run Payroll"}
          subtitle={modal.mode === "edit" ? "Update this payslip" : "Add a new payslip"}
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
