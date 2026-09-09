import { useState } from "react";
import { T, PageShell, KPIStrip, Card, CardTitle, Badge, ActionBar, DataTable, Cell2, FormModal, newId } from "../ui/system";
import type { FieldSpec } from "../ui/system";

/* ═══════════════════════════════════════════════════════════
   Quality — Rejection Tracking + Box Test Log
   The production_stages table already has a qty_rejected column
   with nowhere to see it. This surfaces it by shift/operator, and
   adds a simple compression / ECT / burst test log so a factory
   can show test data to its own customers instead of a verbal
   claim.
   ═══════════════════════════════════════════════════════════ */

interface Rejection {
  id: string;
  jobNo: string;
  stage: string;
  machine: string;
  operator: string;
  shift: "Day" | "Night";
  qtyProduced: number;
  qtyRejected: number;
  reason: string;
  date: string;
}

const REJECTIONS: Rejection[] = [
  { id: "1", jobNo: "JC-3301", stage: "Corrugation", machine: "Corrugation L1", operator: "Ramesh",  shift: "Day",   qtyProduced: 6000, qtyRejected: 84,  reason: "Warping — glue drying time", date: "07 Sep" },
  { id: "2", jobNo: "JC-3298", stage: "Printing",     machine: "Flexo Printer",  operator: "Ajay",     shift: "Day",   qtyProduced: 4200, qtyRejected: 36,  reason: "Print misalignment",         date: "07 Sep" },
  { id: "3", jobNo: "JC-3290", stage: "Die Cutting",  machine: "Die Punch 2",    operator: "Suresh",   shift: "Night", qtyProduced: 3000, qtyRejected: 145, reason: "Crease cracking",             date: "06 Sep" },
  { id: "4", jobNo: "JC-3285", stage: "Pasting",      machine: "Stitching M/C",  operator: "Mahesh",   shift: "Day",   qtyProduced: 8000, qtyRejected: 52,  reason: "Delamination at flap",        date: "06 Sep" },
  { id: "5", jobNo: "JC-3281", stage: "Corrugation",  machine: "Corrugation L1", operator: "Ramesh",   shift: "Night", qtyProduced: 5200, qtyRejected: 210, reason: "Poor kraft quality — batch",  date: "05 Sep" },
];

interface Test {
  id: string;
  jobNo: string;
  customer: string;
  boxSize: string;
  ect: number;      // edge crush test, kN/m
  bct: number;       // box compression test, kgf
  burst: number;     // bursting strength, kg/cm2
  result: "Pass" | "Fail";
  date: string;
}

const TESTS: Test[] = [
  { id: "1", jobNo: "JC-3301", customer: "Ramesh Traders",        boxSize: "18×12×10", ect: 6.2, bct: 420, burst: 11, result: "Pass", date: "07 Sep" },
  { id: "2", jobNo: "JC-3298", customer: "FreshMart Retail",      boxSize: "16×10×8",  ect: 5.4, bct: 340, burst: 9,  result: "Pass", date: "07 Sep" },
  { id: "3", jobNo: "JC-3290", customer: "Super Pack Industries", boxSize: "24×18×14", ect: 4.1, bct: 260, burst: 7,  result: "Fail", date: "06 Sep" },
  { id: "4", jobNo: "JC-3285", customer: "Om Sai Distributors",   boxSize: "18×12×10", ect: 6.5, bct: 445, burst: 12, result: "Pass", date: "06 Sep" },
];

const TEST_FIELDS: readonly FieldSpec[] = [
  { key: "jobNo", label: "Job No.", placeholder: "JC-3310", required: true, half: true },
  { key: "customer", label: "Customer", placeholder: "Company name", required: true, half: true },
  { key: "boxSize", label: "Box size", placeholder: "18×12×10", half: true },
  { key: "ect", label: "Edge crush (kN/m)", type: "number", half: true },
  { key: "bct", label: "Box compression (kgf)", type: "number", half: true },
  { key: "burst", label: "Bursting strength (kg/cm²)", type: "number", half: true },
] as const;

export default function Quality() {
  const [tab, setTab] = useState<"rejections" | "tests">("rejections");
  const [rej] = useState(REJECTIONS);
  const [tests, setTests] = useState(TESTS);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);

  const totalProduced = rej.reduce((s, r) => s + r.qtyProduced, 0);
  const totalRejected = rej.reduce((s, r) => s + r.qtyRejected, 0);
  const rejectRate = totalProduced ? (totalRejected / totalProduced) * 100 : 0;
  const byOperator = Array.from(new Set(rej.map(r => r.operator))).map(op => {
    const rows = rej.filter(r => r.operator === op);
    const produced = rows.reduce((s, r) => s + r.qtyProduced, 0);
    const rejected = rows.reduce((s, r) => s + r.qtyRejected, 0);
    return { op, rate: produced ? (rejected / produced) * 100 : 0 };
  }).sort((a, b) => b.rate - a.rate);

  const passRate = tests.length ? (tests.filter(t => t.result === "Pass").length / tests.length) * 100 : 0;

  const saveTest = (v: Record<string, any>) => {
    const result: Test["result"] = Number(v.ect) >= 5 && Number(v.bct) >= 300 ? "Pass" : "Fail";
    setTests(p => [{ id: newId(), date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), result, ...v } as Test, ...p]);
    setModal(false);
  };

  const rejF = rej.filter(r => r.jobNo.toLowerCase().includes(q.toLowerCase()) || r.operator.toLowerCase().includes(q.toLowerCase()) || r.reason.toLowerCase().includes(q.toLowerCase()));
  const testF = tests.filter(t => t.jobNo.toLowerCase().includes(q.toLowerCase()) || t.customer.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageShell title="Quality" subtitle="Rejection rates by shift and operator, plus box test results" meta={[`${rejectRate.toFixed(1)}% overall rejection rate`, `${passRate.toFixed(0)}% tests passing`]}>
      <KPIStrip items={[
        { label: "Rejection Rate", value: `${rejectRate.toFixed(1)}%`, sub: `${totalRejected.toLocaleString("en-IN")} of ${totalProduced.toLocaleString("en-IN")}`, color: rejectRate <= 2 ? T.green : T.red, up: rejectRate <= 2 },
        { label: "Worst Shift", value: rej.filter(r => r.shift === "Night").length >= rej.filter(r => r.shift === "Day").length ? "Night" : "Day", sub: "more rejections logged", color: T.amber },
        { label: "Top Rejection Reason", value: "Warping/Crease", sub: "glue & board related", color: T.blue },
        { label: "Test Pass Rate", value: `${passRate.toFixed(0)}%`, sub: `${tests.length} tests logged`, color: passRate >= 80 ? T.green : T.amber },
      ]} />

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabBtn active={tab === "rejections"} onClick={() => setTab("rejections")}>Rejection tracking</TabBtn>
        <TabBtn active={tab === "tests"} onClick={() => setTab("tests")}>Box test log</TabBtn>
      </div>

      {tab === "rejections" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14 }}>
          <div>
            <ActionBar search={q} onSearch={setQ} placeholder="Search job, operator, reason…" showExport onExport={() => {}} />
            <DataTable
              cols={[
                { key: "job", label: "Job" }, { key: "stage", label: "Stage" },
                { key: "shift", label: "Shift", align: "center" }, { key: "qty", label: "Rejected / Produced", align: "right" },
                { key: "rate", label: "Rate", align: "right" }, { key: "reason", label: "Reason" },
              ]}
              rows={rejF.map(r => {
                const rate = (r.qtyRejected / r.qtyProduced) * 100;
                return {
                  job: <Cell2 primary={r.jobNo} secondary={`${r.operator} · ${r.machine} · ${r.date}`} />,
                  stage: <span style={{ fontSize: 12.5 }}>{r.stage}</span>,
                  shift: <Badge label={r.shift} color={r.shift === "Night" ? T.blue : T.amber} />,
                  qty: <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.qtyRejected} / {r.qtyProduced.toLocaleString("en-IN")}</span>,
                  rate: <span style={{ fontWeight: 600, color: rate > 3 ? T.red : T.sub }}>{rate.toFixed(1)}%</span>,
                  reason: <span style={{ fontSize: 12.5, color: T.muted }}>{r.reason}</span>,
                };
              })}
            />
          </div>
          <Card pad={0}>
            <CardTitle>By operator</CardTitle>
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {byOperator.map(o => (
                <div key={o.op} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: T.text }}>{o.op}</span>
                  <Badge label={`${o.rate.toFixed(1)}%`} color={o.rate > 3 ? T.red : o.rate > 1.5 ? T.amber : T.green} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <>
          <ActionBar search={q} onSearch={setQ} placeholder="Search job, customer…" primaryLabel="Log test" onPrimary={() => setModal(true)} showExport={false} />
          <DataTable
            cols={[
              { key: "job", label: "Job" }, { key: "size", label: "Box size" },
              { key: "ect", label: "ECT (kN/m)", align: "right" }, { key: "bct", label: "BCT (kgf)", align: "right" },
              { key: "burst", label: "Burst (kg/cm²)", align: "right" }, { key: "result", label: "Result", align: "center" },
            ]}
            rows={testF.map(t => ({
              job: <Cell2 primary={t.jobNo} secondary={`${t.customer} · ${t.date}`} />,
              size: <span style={{ fontSize: 12.5 }}>{t.boxSize}</span>,
              ect: <span style={{ fontVariantNumeric: "tabular-nums" }}>{t.ect}</span>,
              bct: <span style={{ fontVariantNumeric: "tabular-nums" }}>{t.bct}</span>,
              burst: <span style={{ fontVariantNumeric: "tabular-nums" }}>{t.burst}</span>,
              result: <Badge label={t.result} color={t.result === "Pass" ? T.green : T.red} />,
            }))}
          />
        </>
      )}

      {modal && (
        <FormModal
          title="Log a box test"
          subtitle="Pass/fail is auto-graded — ECT ≥5 kN/m and BCT ≥300 kgf"
          fields={TEST_FIELDS}
          submitLabel="Save test"
          onClose={() => setModal(false)}
          onSave={saveTest}
        />
      )}
    </PageShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
      background: active ? T.accent : T.card, color: active ? "#fff" : T.sub,
      border: `1px solid ${active ? T.accent : T.line}`,
    }}>{children}</button>
  );
}
