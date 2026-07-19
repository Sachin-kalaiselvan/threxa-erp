import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Pay { id: string; empId: string; name: string; dept: string; base: number; allowance: number; deduction: number; net: number; status: "Draft" | "Approved" | "Paid"; }

const SEED: Pay[] = [
  { id: "1", empId: "EMP-001", name: "Ramesh Kumar", dept: "Production", base: 50000, allowance: 5000, deduction: 3000, net: 52000, status: "Paid" },
  { id: "2", empId: "EMP-002", name: "Priya Singh",  dept: "Quality",    base: 45000, allowance: 4500, deduction: 2500, net: 47000, status: "Approved" },
  { id: "3", empId: "EMP-003", name: "Ajay Patel",   dept: "Production", base: 28000, allowance: 2000, deduction: 1200, net: 28800, status: "Draft" },
];

const SC: Record<Pay["status"], string> = { Draft: T.muted, Approved: T.blue, Paid: T.green };

export default function Payroll() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()) || r.dept.toLowerCase().includes(q.toLowerCase()));
  const total = rows.reduce((s, r) => s + r.net, 0);
  const paid = rows.filter(r => r.status === "Paid").reduce((s, r) => s + r.net, 0);

  const exportCSV = () => {
    const csv = [["Emp ID", "Name", "Dept", "Base", "Allowance", "Deduction", "Net", "Status"], ...f.map(r => [r.empId, r.name, r.dept, r.base, r.allowance, r.deduction, r.net, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "payroll-jul-2026.csv"; a.click();
  };

  return (
    <PageShell title="Payroll" subtitle="July 2026 salary cycle" meta={[`${rows.length} employees`, `₹${(total / 100000).toFixed(2)}L total`, `${rows.filter(r => r.status === "Paid").length} paid`]}>
      <KPIStrip items={[
        { label: "Total Payroll", value: `₹${(total / 100000).toFixed(2)}L`, sub: "July 2026", spark: [1.2, 1.22, 1.25, 1.26, 1.27, 1.28], color: T.accent },
        { label: "Disbursed", value: `₹${(paid / 100000).toFixed(2)}L`, sub: `${Math.round(paid / total * 100)}% complete`, spark: [0, 0.2, 0.3, 0.4, 0.5, 0.52], color: T.green },
        { label: "Pending", value: `₹${((total - paid) / 100000).toFixed(2)}L`, sub: `${rows.filter(r => r.status !== "Paid").length} employees`, spark: [1.28, 1.1, 0.98, 0.9, 0.8, 0.76], color: T.amber },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search employees…" primaryLabel="Run Payroll" onExport={exportCSV} />
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
              <button title="Payslip" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Download size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
