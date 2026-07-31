import { useState } from "react";
import { Edit2, Truck, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";
import { useLocation } from "react-router-dom";
import { generateChallanPDF } from "../utils/pdf";

interface Dispatch { id: string; challan: string; order: string; customer: string; qty: string; vehicle: string; driver: string; time: string; status: "Pending" | "In Transit" | "Dispatched" | "Delivered"; }

const SEED: Dispatch[] = [
  { id: "1",  challan: "CH-4807", order: "ORD-004", customer: "Ramesh Traders",        qty: "5,000 boxes", vehicle: "KA01AB1234", driver: "Ravi",      time: "09:30", status: "Dispatched" },
  { id: "2",  challan: "CH-4808", order: "ORD-005", customer: "Global Foods Pvt Ltd",  qty: "3,200 boxes", vehicle: "KA05KJ5678", driver: "Manju",     time: "11:00", status: "In Transit" },
  { id: "3",  challan: "CH-4809", order: "ORD-006", customer: "FreshMart Retail",      qty: "1,800 boxes", vehicle: "KA03LM9012", driver: "Suresh",    time: "13:30", status: "Pending" },
  { id: "4",  challan: "CH-4810", order: "ORD-007", customer: "Bright Retail Chain",   qty: "2,400 boxes", vehicle: "KA02PQ3456", driver: "Imran",     time: "15:00", status: "Pending" },
  { id: "5",  challan: "CH-4811", order: "ORD-008", customer: "Super Pack Industries", qty: "1,500 boxes", vehicle: "KA04RS7890", driver: "Nagaraj",   time: "17:00", status: "Pending" },
  { id: "6",  challan: "CH-4806", order: "ORD-011", customer: "Nandi Agro Exports",    qty: "6,000 boxes", vehicle: "KA51TU2244", driver: "Basavaraj", time: "07:45", status: "Delivered" },
  { id: "7",  challan: "CH-4805", order: "ORD-002", customer: "Priya Packaging",       qty: "1,000 boxes", vehicle: "KA01AB1234", driver: "Ravi",      time: "08:15", status: "Delivered" },
  { id: "8",  challan: "CH-4812", order: "ORD-009", customer: "Vettiyil Packaging",    qty: "1,200 boxes", vehicle: "KA05KJ5678", driver: "Manju",     time: "18:30", status: "Pending" },
  { id: "9",  challan: "CH-4804", order: "ORD-001", customer: "Rajesh Enterprises",    qty: "500 boxes",   vehicle: "KA03LM9012", driver: "Suresh",    time: "10:20", status: "Delivered" },
  { id: "10", challan: "CH-4813", order: "ORD-012", customer: "Zenith Pharma Labs",    qty: "2,200 boxes", vehicle: "KA02PQ3456", driver: "Imran",     time: "19:00", status: "Pending" },
];

const SC: Record<Dispatch["status"], string> = { Pending: T.amber, "In Transit": T.blue, Dispatched: T.green, Delivered: T.green };

const FIELDS: readonly FieldSpec[] = [
  { key: "challan", label: "Challan no.", placeholder: "CH-4814", required: true, half: true },
  { key: "status", label: "Status", type: "select", options: ["Pending", "In Transit", "Dispatched", "Delivered"], half: true },
  { key: "order", label: "Against order", placeholder: "ORD-013", half: true },
  { key: "customer", label: "Customer", required: true, half: true },
  { key: "qty", label: "Quantity", placeholder: "2,400 boxes", half: true },
  { key: "time", label: "Scheduled time", placeholder: "14:30", half: true },
  { key: "vehicle", label: "Vehicle no.", placeholder: "KA01AB1234", half: true },
  { key: "driver", label: "Driver", placeholder: "Ravi", half: true },
] as const;

const FILTER_OPTS = ["Pending", "In Transit", "Dispatched", "Delivered"] as const;

export default function DispatchPage() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const loc = useLocation();
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState<{ mode: "new" | "edit"; row?: Dispatch } | null>(
    (loc.state as { create?: boolean } | null)?.create ? { mode: "new" } : null
  );

  const save = (v: Record<string, any>) => {
    const patch = v;
    setRows(p => modal?.mode === "edit" && modal.row
      ? p.map(r => (r.id === modal.row!.id ? { ...r, ...patch } : r))
      : [{ id: newId(), ...patch } as Dispatch, ...p]);
    setModal(null);
  };
  const rowsF = status === "All" ? rows : rows.filter(r => r.status === status);
  const f = rowsF.filter(r => r.challan.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()) || r.vehicle.toLowerCase().includes(q.toLowerCase()));

  const exportCSV = () => {
    const csv = [["Challan", "Order", "Customer", "Quantity", "Vehicle", "Driver", "Time", "Status"], ...f.map(r => [r.challan, r.order, r.customer, r.qty, r.vehicle, r.driver, r.time, r.status])].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "dispatch.csv"; a.click();
  };

  const challan = (r: Dispatch) => {
    const data = generateChallanPDF({
      challan_no: r.challan, dispatch_date: r.time, order_no: r.order,
      customer_name: r.customer, customer_address: "\u2014",
      vehicle_no: r.vehicle, driver_name: r.driver,
      items: [{ description: "Corrugated Boxes", qty: Number(r.qty.replace(/[^0-9]/g, "")) || 0 }],
    });
    const a = document.createElement("a"); a.href = data; a.download = `${r.challan}.pdf`; a.click();
  };

  return (
    <PageShell title="Dispatch" subtitle="Shipments, vehicles and deliveries" meta={[`${rows.length} scheduled today`, `${rows.filter(r => r.status === "Pending").length} pending`, `${new Set(rows.map(r => r.vehicle)).size} vehicles in rotation`]}>
      <KPIStrip items={[
        { label: "Dispatched Today", value: String(rows.filter(r => r.status === "Dispatched" || r.status === "Delivered").length), delta: "+1", sub: `of ${rows.length} scheduled`, spark: [0, 0, 1, 1, 1, 1], color: T.green },
        { label: "In Transit", value: String(rows.filter(r => r.status === "In Transit").length), sub: "live tracking", spark: [0, 1, 1, 1, 1, 1], color: T.blue },
        { label: "Pending", value: String(rows.filter(r => r.status === "Pending").length), sub: "next: 13:30", spark: [3, 2, 2, 1, 1, 1], color: T.amber },
      ]} />
      <ActionBar
        search={q} onSearch={setQ}
        placeholder="Search challan, customer, vehicle…"
        primaryLabel="New Dispatch"
        onPrimary={() => setModal({ mode: "new" })}
        filterLabel="Status" filterValue={status} onFilter={setStatus} filterOptions={FILTER_OPTS}
        onExport={exportCSV}
      />
      <DataTable
        cols={[
          { key: "challan", label: "Challan" }, { key: "customer", label: "Customer" },
          { key: "qty", label: "Quantity", align: "right" }, { key: "vehicle", label: "Vehicle" },
          { key: "time", label: "Time" }, { key: "status", label: "Status", align: "center" },
          { key: "act", label: "", align: "right", width: 80 },
        ]}
        rows={f.map(r => ({
          challan: <Cell2 primary={r.challan} secondary={r.order} />,
          customer: <span>{r.customer}</span>,
          qty: <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.qty}</span>,
          vehicle: <Cell2 primary={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{r.vehicle}</span>} secondary={`Driver: ${r.driver}`} />,
          time: <span style={{ fontVariantNumeric: "tabular-nums", color: T.muted }}>{r.time}</span>,
          status: <Badge label={r.status} color={SC[r.status]} />,
          act: (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button onClick={() => setModal({ mode: "edit", row: r })} title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Edit2 size={14} /></button>
              <button title="Download challan" onClick={() => challan(r)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Truck size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
      {modal && (
        <FormModal
          title={modal.mode === "edit" ? "Edit Dispatch" : "New Dispatch"}
          subtitle={modal.mode === "edit" ? "Update this dispatch" : "Add a new dispatch"}
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
