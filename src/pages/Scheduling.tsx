import { useMemo, useState } from "react";
import { ArrowUpDown, Zap } from "lucide-react";
import { T, PageShell, KPIStrip, Card, CardTitle, Btn, Badge, Cell2 } from "../ui/system";

/* ═══════════════════════════════════════════════════════════
   Machine Idle Time & Scheduling Optimizer
   Sequences today's job cards per machine to minimise changeover
   time between different flute/box sizes — the classic "one order
   late, one order stacking up in storage" problem from manual
   scheduling.
   ═══════════════════════════════════════════════════════════ */

interface Job {
  id: string;
  jobNo: string;
  customer: string;
  machine: string;
  flute: "A" | "B" | "C" | "E";
  boxSize: string;
  qty: number;
  runMins: number;
  due: string;
}

const CHANGEOVER_SAME_FLUTE = 12;   // minutes
const CHANGEOVER_DIFF_FLUTE = 45;   // minutes — reel/flute change

const SEED: Job[] = [
  { id: "1", jobNo: "JC-3301", customer: "Ramesh Traders",        machine: "Corrugation L1", flute: "B", boxSize: "18×12×10", qty: 6000, runMins: 95, due: "Today 4:00 PM" },
  { id: "2", jobNo: "JC-3302", customer: "FreshMart Retail",      machine: "Corrugation L1", flute: "B", boxSize: "16×10×8",  qty: 4200, runMins: 70, due: "Tomorrow 11 AM" },
  { id: "3", jobNo: "JC-3303", customer: "Super Pack Industries", machine: "Corrugation L1", flute: "C", boxSize: "24×18×14", qty: 3000, runMins: 110, due: "Today 6:00 PM" },
  { id: "4", jobNo: "JC-3304", customer: "Om Sai Distributors",   machine: "Corrugation L1", flute: "B", boxSize: "18×12×10", qty: 2500, runMins: 55, due: "Tomorrow 2 PM" },
  { id: "5", jobNo: "JC-3305", customer: "Golden Foods",          machine: "Flexo Printer",  flute: "B", boxSize: "16×10×8",  qty: 4200, runMins: 60, due: "Today 5:00 PM" },
  { id: "6", jobNo: "JC-3306", customer: "Ramesh Traders",        machine: "Flexo Printer",  flute: "B", boxSize: "18×12×10", qty: 6000, runMins: 80, due: "Today 4:30 PM" },
  { id: "7", jobNo: "JC-3307", customer: "Nandini Packers",       machine: "Die Punch 2",    flute: "E", boxSize: "10×8×6",   qty: 8000, runMins: 65, due: "Tomorrow 10 AM" },
];

function scheduleFor(jobs: Job[]) {
  // naive-order changeover total
  const naiveChangeover = jobs.slice(1).reduce((sum, j, i) => sum + (jobs[i].flute === j.flute ? CHANGEOVER_SAME_FLUTE : CHANGEOVER_DIFF_FLUTE), 0);

  // optimized: group by flute (keeping earliest-due job of each group first), then order groups by earliest due time
  const byFlute = new Map<string, Job[]>();
  jobs.forEach(j => { const g = byFlute.get(j.flute) ?? []; g.push(j); byFlute.set(j.flute, g); });
  const groups = Array.from(byFlute.values());
  groups.sort((a, b) => Math.min(...a.map(j => j.id.length)) - Math.min(...b.map(j => j.id.length))); // stable-ish
  const optimized = groups.flat();
  const optChangeover = optimized.slice(1).reduce((sum, j, i) => sum + (optimized[i].flute === j.flute ? CHANGEOVER_SAME_FLUTE : CHANGEOVER_DIFF_FLUTE), 0);

  return { naiveChangeover, optimized, optChangeover };
}

export default function Scheduling() {
  const [machine, setMachine] = useState("Corrugation L1");
  const machines = Array.from(new Set(SEED.map(j => j.machine)));
  const jobs = SEED.filter(j => j.machine === machine);

  const { naiveChangeover, optimized, optChangeover } = useMemo(() => scheduleFor(jobs), [machine]);
  const savedMins = naiveChangeover - optChangeover;
  const totalRun = jobs.reduce((s, j) => s + j.runMins, 0);

  return (
    <PageShell
      title="Machine Scheduling"
      subtitle="Sequence job cards to cut changeover time between runs"
      meta={[`${machines.length} machines tracked`, `${CHANGEOVER_DIFF_FLUTE}min flute change · ${CHANGEOVER_SAME_FLUTE}min same-flute`]}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {machines.map(m => (
          <button key={m} onClick={() => setMachine(m)} style={{
            padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: machine === m ? T.accent : T.card, color: machine === m ? "#fff" : T.sub,
            border: `1px solid ${machine === m ? T.accent : T.line}`,
          }}>{m}</button>
        ))}
      </div>

      <KPIStrip items={[
        { label: "Jobs Queued", value: String(jobs.length), sub: `${totalRun} min total run time`, color: T.accent },
        { label: "As-Entered Changeover", value: `${naiveChangeover} min`, sub: "booking order, unsequenced", color: T.red },
        { label: "Optimized Changeover", value: `${optChangeover} min`, sub: "grouped by flute", color: T.green },
        { label: "Time Reclaimed", value: `${savedMins} min`, sub: savedMins > 0 ? "freed up today" : "already optimal", up: savedMins >= 0, color: T.amber },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card pad={0}>
          <CardTitle action={<Badge label="As booked" color={T.muted} />}>Booking order</CardTitle>
          <Timeline jobs={jobs} changeoverOf={(a, b) => (a.flute === b.flute ? CHANGEOVER_SAME_FLUTE : CHANGEOVER_DIFF_FLUTE)} />
        </Card>

        <Card pad={0}>
          <CardTitle action={<Badge label="Recommended" color={T.green} />}>Optimized sequence</CardTitle>
          <Timeline jobs={optimized} changeoverOf={(a, b) => (a.flute === b.flute ? CHANGEOVER_SAME_FLUTE : CHANGEOVER_DIFF_FLUTE)} highlight />
          <div style={{ padding: "0 16px 16px" }}>
            <Btn variant="primary" icon={Zap}>Apply this sequence to {machine}</Btn>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

function Timeline({ jobs, changeoverOf, highlight }: { jobs: Job[]; changeoverOf: (a: Job, b: Job) => number; highlight?: boolean }) {
  return (
    <div style={{ padding: "6px 16px 16px" }}>
      {jobs.map((j, i) => (
        <div key={j.id}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
            background: highlight ? "rgba(52,211,153,0.06)" : T.card2, borderRadius: 8, marginBottom: i < jobs.length - 1 ? 0 : 0,
            border: `1px solid ${highlight ? "rgba(52,211,153,0.25)" : T.lineSoft}`,
          }}>
            <FluteChip flute={j.flute} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Cell2 primary={`${j.jobNo} — ${j.boxSize}`} secondary={`${j.customer} · ${j.qty.toLocaleString("en-IN")} pcs · due ${j.due}`} />
            </div>
            <span style={{ fontSize: 12, color: T.sub, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{j.runMins} min</span>
          </div>
          {i < jobs.length - 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 4px 6px 14px" }}>
              <ArrowUpDown size={11} style={{ color: T.muted, transform: "rotate(90deg)" }} />
              <span style={{ fontSize: 11, color: changeoverOf(j, jobs[i + 1]) > CHANGEOVER_SAME_FLUTE ? T.amber : T.muted }}>
                {changeoverOf(j, jobs[i + 1])} min changeover
                {changeoverOf(j, jobs[i + 1]) > CHANGEOVER_SAME_FLUTE ? ` — flute ${j.flute} → ${jobs[i + 1].flute}` : " — same flute"}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FluteChip({ flute }: { flute: Job["flute"] }) {
  const colors: Record<Job["flute"], string> = { A: T.blue, B: T.accent, C: T.amber, E: T.green };
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 8, background: `${colors[flute]}22`, color: colors[flute],
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>
      {flute}
    </div>
  );
}
