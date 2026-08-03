/* ═══════════════════════════════════════════════════════════
   THREXA MOBILE · SUPERVISOR
   Update job cards from the shop floor. Big tap targets,
   no typing except quantity. Works one-handed with gloves on.
   ═══════════════════════════════════════════════════════════ */
import { useState } from "react";
import { M, MCard, MBadge, MBtn, SectionTitle } from "./MobileShell";
import { useLang } from "../i18n";
import type { TKey } from "../i18n";
import { Play, Pause, Check } from "lucide-react";

type JobStatus = "Not started" | "Running" | "Paused" | "Completed";

interface Job {
  id: string;
  wo: string;
  customer: string;
  product: string;
  machine: string;
  target: number;
  produced: number;
  status: JobStatus;
}

const SEED: Job[] = [
  { id: "1", wo: "WO-1258", customer: "Zenith Pharma Labs", product: "5-ply RSC 400×300×250", machine: "Corrugation Line 1", target: 5500, produced: 3960, status: "Running" },
  { id: "2", wo: "WO-1259", customer: "Nandi Agro Exports", product: "3-ply RSC 300×200×150", machine: "Flexo Printer", target: 6000, produced: 2460, status: "Running" },
  { id: "3", wo: "WO-1260", customer: "Super Pack Industries", product: "5-ply FEFCO 0201", machine: "Die Cutter", target: 2400, produced: 0, status: "Not started" },
  { id: "4", wo: "WO-1257", customer: "Ramesh Traders", product: "3-ply RSC 250×250×200", machine: "Pasting Machine", target: 5000, produced: 3100, status: "Paused" },
  { id: "5", wo: "WO-1256", customer: "Priya Packaging", product: "5-ply RSC 450×350×300", machine: "Corrugation Line 1", target: 1000, produced: 1000, status: "Completed" },
];

const SC: Record<JobStatus, string> = {
  "Not started": M.muted,
  Running: M.green,
  Paused: M.amber,
  Completed: M.blue,
};

export default function SupervisorHome() {
  const { t } = useLang();
  const [jobs, setJobs] = useState<Job[]>(SEED);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  };

  const setStatus = (id: string, status: JobStatus) => {
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, status } : j)));
    flash(t("saved"));
    /* TODO: supabase.from("work_orders").update({ status }).eq("id", id) */
  };

  const bumpQty = (id: string, produced: number) => {
    setJobs((p) => p.map((j) => (j.id === id ? { ...j, produced } : j)));
    /* TODO: supabase.from("work_orders").update({ produced }).eq("id", id) */
  };

  const active = jobs.filter((j) => j.status !== "Completed");
  const done = jobs.filter((j) => j.status === "Completed");

  return (
    <>
      <SectionTitle>{t("jobCards")}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {active.map((j) => (
          <JobCardRow key={j.id} job={j} onStatus={setStatus} onQty={bumpQty} />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <SectionTitle>{t("Completed")}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {done.map((j) => (
              <JobCardRow key={j.id} job={j} onStatus={setStatus} onQty={bumpQty} />
            ))}
          </div>
        </>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: M.green,
            color: "#08210F",
            fontSize: 13,
            fontWeight: 700,
            padding: "10px 20px",
            borderRadius: 99,
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}

function JobCardRow({
  job,
  onStatus,
  onQty,
}: {
  job: Job;
  onStatus: (id: string, s: JobStatus) => void;
  onQty: (id: string, q: number) => void;
}) {
  const { t } = useLang();
  const pct = job.target > 0 ? Math.round((job.produced / job.target) * 100) : 0;

  return (
    <MCard pad={14}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: M.text }}>{job.wo}</div>
          <div style={{ fontSize: 12, color: M.sub, marginTop: 3 }}>{job.customer}</div>
          <div style={{ fontSize: 11, color: M.muted, marginTop: 2 }}>{job.product}</div>
        </div>
        <MBadge label={t(job.status as TKey)} color={SC[job.status]} />
      </div>

      <div style={{ fontSize: 11, color: M.muted, margin: "11px 0 5px" }}>
        {t("machine")}: {job.machine}
      </div>

      {/* progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: M.sub,
          marginBottom: 5,
        }}
      >
        <span>
          {t("produced")} {job.produced.toLocaleString("en-IN")}
        </span>
        <span>
          {t("target")} {job.target.toLocaleString("en-IN")}
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 99,
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
          marginBottom: 13,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            borderRadius: 99,
            background: pct >= 100 ? M.blue : M.accent,
          }}
        />
      </div>

      {job.status !== "Completed" && (
        <>
          {/* quantity stepper */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
            <span style={{ fontSize: 12, color: M.muted, flex: 1 }}>{t("qtyDone")}</span>
            <StepBtn label="−100" onClick={() => onQty(job.id, Math.max(0, job.produced - 100))} />
            <input
              type="number"
              inputMode="numeric"
              value={job.produced}
              onChange={(e) => onQty(job.id, Math.max(0, Number(e.target.value) || 0))}
              style={{
                width: 82,
                textAlign: "center",
                background: M.card2,
                border: `1px solid ${M.line}`,
                borderRadius: 8,
                color: M.text,
                fontSize: 14,
                fontWeight: 600,
                padding: "9px 6px",
              }}
            />
            <StepBtn label="+100" onClick={() => onQty(job.id, job.produced + 100)} />
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8 }}>
            {job.status !== "Running" && (
              <MBtn full variant="success" onClick={() => onStatus(job.id, "Running")}>
                <Play size={14} /> {t("start")}
              </MBtn>
            )}
            {job.status === "Running" && (
              <MBtn full onClick={() => onStatus(job.id, "Paused")}>
                <Pause size={14} /> {t("pause")}
              </MBtn>
            )}
            <MBtn full variant="primary" onClick={() => onStatus(job.id, "Completed")}>
              <Check size={14} /> {t("complete")}
            </MBtn>
          </div>
        </>
      )}
    </MCard>
  );
}

function StepBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: 52,
        minHeight: 40,
        background: M.card2,
        border: `1px solid ${M.line}`,
        borderRadius: 8,
        color: M.sub,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
