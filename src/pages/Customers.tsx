import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import {
  T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2,
  FormModal, newId, parseCSV,
} from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";

interface Customer {
  id: string; name: string; since: string; email: string; phone: string;
  gst: string; orders: number; spent: number; lastOrder: string; active: boolean;
}

const SEED: Customer[] = [
  { id: "1",  name: "Rajesh Enterprises",     since: "2021", email: "rajesh@rajeshent.in",     phone: "+91 98450 11234", gst: "29AABCR9603R1Z5", orders: 68, spent: 1845000, lastOrder: "29 Jul", active: true },
  { id: "2",  name: "Priya Packaging",        since: "2022", email: "priya@priyapack.co.in",   phone: "+91 98450 11235", gst: "29AABCV9603R2Z5", orders: 52, spent: 1420000, lastOrder: "28 Jul", active: true },
  { id: "3",  name: "Kumar Industries",       since: "2020", email: "accounts@kumarind.in",    phone: "+91 98450 11236", gst: "29AABCW9603R3Z5", orders: 41, spent: 986000,  lastOrder: "12 Jun", active: false },
  { id: "4",  name: "Ramesh Traders",         since: "2019", email: "ramesh@rameshtraders.in", phone: "+91 98450 11237", gst: "29AACCR4521M1Z9", orders: 94, spent: 3120000, lastOrder: "30 Jul", active: true },
  { id: "5",  name: "Global Foods Pvt Ltd",   since: "2022", email: "purchase@globalfoods.in", phone: "+91 98450 11238", gst: "29AAGCG7712K1ZB", orders: 57, spent: 2245000, lastOrder: "30 Jul", active: true },
  { id: "6",  name: "FreshMart Retail",       since: "2023", email: "vendors@freshmart.in",    phone: "+91 98450 11239", gst: "29AAFCF3390L1ZP", orders: 33, spent: 1180000, lastOrder: "29 Jul", active: true },
  { id: "7",  name: "Bright Retail Chain",    since: "2023", email: "supply@brightretail.in",  phone: "+91 98450 11240", gst: "29AABCB8821N1ZQ", orders: 28, spent: 845000,  lastOrder: "27 Jul", active: true },
  { id: "8",  name: "Super Pack Industries",  since: "2021", email: "info@superpack.co.in",    phone: "+91 98450 11241", gst: "29AASCS1140P1ZR", orders: 46, spent: 1560000, lastOrder: "26 Jul", active: true },
  { id: "9",  name: "Vettiyil Packaging",     since: "2024", email: "anoop@vettiyil.in",       phone: "+91 98450 11242", gst: "32AAVCV2210Q1ZT", orders: 12, spent: 385000,  lastOrder: "24 Jul", active: true },
  { id: "10", name: "Marudhar Packaging",     since: "2024", email: "dinesh@marudhar.co.in",   phone: "+91 98450 11243", gst: "27AAMCM6650R1ZU", orders: 9,  spent: 268000,  lastOrder: "22 Jul", active: true },
  { id: "11", name: "Nandi Agro Exports",     since: "2020", email: "ops@nandiagro.in",        phone: "+91 98450 11244", gst: "29AANCN9930S1ZV", orders: 61, spent: 2680000, lastOrder: "29 Jul", active: true },
  { id: "12", name: "Zenith Pharma Labs",     since: "2022", email: "stores@zenithpharma.in",  phone: "+91 98450 11245", gst: "29AAZCZ4470T1ZW", orders: 37, spent: 1395000, lastOrder: "18 Jul", active: false },
];

const FIELDS: readonly FieldSpec[] = [
  { key: "name", label: "Company name", placeholder: "e.g. Rajesh Enterprises", required: true },
  { key: "since", label: "Customer since", placeholder: "2026", half: true },
  { key: "gst", label: "GSTIN", placeholder: "29AABCR9603R1Z5", half: true },
  { key: "email", label: "Email", placeholder: "name@company.in", required: true, half: true },
  { key: "phone", label: "Phone", placeholder: "+91 98450 00000", half: true },
  { key: "orders", label: "Total orders", type: "number", half: true },
  { key: "spent", label: "Lifetime value (₹)", type: "number", half: true },
  { key: "lastOrder", label: "Last order", placeholder: "29 Jul", half: true },
  { key: "active", label: "Status", type: "select", options: ["Active", "Inactive"], half: true },
] as const;

const FILTER_OPTS = ["Active", "Inactive"] as const;

export default function Customers() {
  const [rows, setRows] = useState<Customer[]>(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Customer } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = { ...v, active: v.active === "Active" };
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Customer, ...p]);
    setModal(null);
  };

  const rowsF = status === "All" ? rows : rows.filter(r => r.active === (status === "Active"));
  const filtered = rowsF.filter(r =>
    r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.email.toLowerCase().includes(q.toLowerCase())
  );

  const totalRevenue = rows.reduce((s, r) => s + r.spent, 0);

  const exportCSV = () => {
    const csv = [
      ["Name", "Email", "Phone", "GST", "Orders", "Total Spent", "Status"],
      ...filtered.map(r => [r.name, r.email, r.phone, r.gst, r.orders, r.spent, r.active ? "Active" : "Inactive"]),
    ].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "customers.csv"; a.click();
  };

  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCSV(String(reader.result));
      if (!parsed.length) { alert("No rows found in that CSV."); return; }
      setRows(p => [
        ...parsed.map(x => ({
          id: newId(),
          name: x["Name"] ?? "",
          since: String(new Date().getFullYear()),
          email: x["Email"] ?? "",
          phone: x["Phone"] ?? "",
          gst: x["GST"] ?? "",
          orders: Number(x["Orders"]) || 0,
          spent: Number(x["Total Spent"]) || 0,
          lastOrder: "\u2014",
          active: (x["Status"] ?? "Active") !== "Inactive",
        })),
        ...p,
      ]);
    };
    reader.readAsText(file);
  };

  return (
    <PageShell
      title="Customers"
      subtitle="Manage your customer database"
      meta={[`${rows.length} customers`, `${rows.filter(r => r.active).length} active`, "Updated just now"]}
    >
      <KPIStrip items={[
        { label: "Total Customers", value: String(rows.length), delta: "+1", sub: "this month", spark: [1, 1, 2, 2, 3, 3], color: T.accent },
        { label: "Active", value: String(rows.filter(r => r.active).length), sub: `${Math.round(rows.filter(r => r.active).length / rows.length * 100)}% of base`, spark: [1, 2, 2, 2, 2, 2], color: T.green },
        { label: "Lifetime Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, delta: "+12%", sub: "vs last quarter", spark: [6, 7, 7.5, 8, 9, 9.5], color: T.blue },
      ]} />

      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search customers…"
        primaryLabel="New Customer"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Status" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
        showImport onImport={importCSV}
      />

      <DataTable
        cols={[
          { key: "name",   label: "Customer" },
          { key: "contact",label: "Contact" },
          { key: "gst",    label: "GST IN" },
          { key: "orders", label: "Orders", align: "center" },
          { key: "spent",  label: "Total Spent", align: "right" },
          { key: "status", label: "Status", align: "center" },
          { key: "act",    label: "", align: "right", width: 80 },
        ]}
        rows={filtered.map(r => ({
          name:   <Cell2 primary={r.name} secondary={`Customer since ${r.since}`} />,
          contact:<Cell2 primary={r.email} secondary={r.phone} />,
          gst:    <span style={{ fontFamily: "monospace", fontSize: 12 }}>{r.gst}</span>,
          orders: <span style={{ color: T.text, fontWeight: 600 }}>{r.orders}</span>,
          spent:  <Cell2 primary={<span style={{ fontVariantNumeric: "tabular-nums" }}>₹{r.spent.toLocaleString("en-IN")}</span>} secondary={`Last order: ${r.lastOrder}`} />,
          status: <Badge label={r.active ? "Active" : "Inactive"} color={r.active ? T.green : T.muted} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5, borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.blue)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                <Edit2 size={14} />
              </button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5, borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = T.red)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                <Trash2 size={14} />
              </button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Customer" : "New Customer"}
          subtitle={modal.mode === "edit" ? "Update this customer" : "Add a new customer"}
          fields={FIELDS}
          initial={modal.row ? { ...modal.row, active: modal.row.active ? "Active" : "Inactive" } : undefined}
          submitLabel={modal.mode === "edit" ? "Save changes" : "Create"}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </PageShell>
  );
}
