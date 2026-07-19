import { useState } from "react";
import { Truck, Trash2 } from "lucide-react";
import { T, PageShell, KPIStrip, ActionBar, DataTable, Badge, Cell2 } from "../ui/system";

interface Dispatch { id: string; challan: string; order: string; customer: string; qty: string; vehicle: string; driver: string; time: string; status: "Pending" | "In Transit" | "Dispatched" | "Delivered"; }

const SEED: Dispatch[] = [
  { id: "1", challan: "CH-4807", order: "ORD-001", customer: "Ramesh Traders", qty: "5,000 boxes", vehicle: "KA01AB1234", driver: "Ravi", time: "09:30", status: "Dispatched" },
  { id: "2", challan: "CH-4808", order: "ORD-002", customer: "Global Foods",   qty: "3,200 boxes", vehicle: "KA05KJ5678", driver: "Manju", time: "11:00", status: "In Transit" },
  { id: "3", challan: "CH-4809", order: "ORD-003", customer: "FreshMart",      qty: "1,800 boxes", vehicle: "KA03LM9012", driver: "Suresh", time: "13:30", status: "Pending" },
];

const SC: Record<Dispatch["status"], string> = { Pending: T.amber, "In Transit": T.blue, Dispatched: T.green, Delivered: T.green };

export default function DispatchPage() {
  const [rows, setRows] = useState(SEED);
  const [q, setQ] = useState("");
  const f = rows.filter(r => r.challan.toLowerCase().includes(q.toLowerCase()) || r.customer.toLowerCase().includes(q.toLowerCase()) || r.vehicle.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageShell title="Dispatch" subtitle="Shipments, vehicles and deliveries" meta={[`${rows.length} scheduled today`, `${rows.filter(r => r.status === "Pending").length} pending`, "2 vehicles on road"]}>
      <KPIStrip items={[
        { label: "Dispatched Today", value: String(rows.filter(r => r.status === "Dispatched" || r.status === "Delivered").length), delta: "+1", sub: "of 3 scheduled", spark: [0, 0, 1, 1, 1, 1], color: T.green },
        { label: "In Transit", value: String(rows.filter(r => r.status === "In Transit").length), sub: "live tracking", spark: [0, 1, 1, 1, 1, 1], color: T.blue },
        { label: "Pending", value: String(rows.filter(r => r.status === "Pending").length), sub: "next: 13:30", spark: [3, 2, 2, 1, 1, 1], color: T.amber },
      ]} />
      <ActionBar search={q} onSearch={setQ} placeholder="Search challan, customer, vehicle…" primaryLabel="New Dispatch" />
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
              <button title="Track" style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Truck size={14} /></button>
              <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 5 }}><Trash2 size={14} /></button>
            </div>
          ),
        }))}
      />
    </PageShell>
  );
}
