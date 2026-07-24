import { useEffect, useState, useCallback } from "react";
import { Search, Truck, FileText, CheckCircle2 } from "lucide-react";
import { T, Card, Badge, Progress, Cell2 } from "../ui/system";

/* ────────────────────────────────────────────────────────────
   Demo route — a scripted walkthrough of a single order lookup.
   Runs on load. Press R to replay, H to hide the replay control.
   Change the sample data below before recording.
   ──────────────────────────────────────────────────────────── */

const QUERY = "WO-1258";

interface Stage {
  name: string;
  machine: string;
  operator: string;
  at: string;
  qty: string;
}

const STAGES: Stage[] = [
  { name: "Corrugation", machine: "Corrugation L1", operator: "Ramesh", at: "09:12", qty: "7,600 Sq.Ft." },
  { name: "Printing",    machine: "Flexo Printer",  operator: "Ajay",   at: "11:40", qty: "7,600 Sq.Ft." },
  { name: "Punching",    machine: "Die Punch 2",    operator: "Ramesh", at: "13:05", qty: "7,600 Sq.Ft." },
  { name: "Pasting",     machine: "Stitching M/C",  operator: "Mahesh", at: "Running", qty: "4,560 of 7,600" },
  { name: "Dispatch",    machine: "—",              operator: "—",      at: "Pending", qty: "—" },
];

const ORDER = {
  wo: QUERY,
  customer: "Ramesh Traders",
  product: "5 Ply Corrugated Box",
  spec: "200 GSM · BF 40 · 18×12×10",
  qty: "7,600 Sq.Ft.",
  invoice: "INV-4471",
  vehicle: "KA 05 8823",
  ready: "Tomorrow, 11:00",
};

/* timeline in milliseconds */
const CUE = {
  askOut: 2600,
  page: 3000,
  typeStart: 3400,
  typeStep: 110,
  filter: 4500,
  detail: 5200,
  stage: [5800, 6800, 7800, 8800] as number[],
  dispatch: 10000,
  endCard: 12400,
};

export default function Demo() {
  const [t, setT] = useState(0);
  const [typed, setTyped] = useState("");
  const [showReplay, setShowReplay] = useState(true);
  const [runId, setRunId] = useState(0);

  const replay = useCallback(() => {
    setT(0);
    setTyped("");
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    const mark = (ms: number) => timers.push(window.setTimeout(() => setT(ms), ms));

    [CUE.askOut, CUE.page, CUE.filter, CUE.detail, CUE.dispatch, CUE.endCard].forEach(mark);
    CUE.stage.forEach(mark);

    QUERY.split("").forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setTyped(QUERY.slice(0, i + 1)), CUE.typeStart + i * CUE.typeStep)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [runId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "r") replay();
      if (k === "h") setShowReplay((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replay]);

  const stageState = (i: number): "done" | "live" | "idle" => {
    if (t < CUE.stage[Math.min(i, CUE.stage.length - 1)]) return "idle";
    if (i === 3) return "live";
    if (i === 4) return "idle";
    return "done";
  };

  const ease = "cubic-bezier(.22,1,.36,1)";
  const fadeIn = (on: boolean, y = 14): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? "none" : `translateY(${y}px)`,
    transition: `opacity .55s ${ease}, transform .55s ${ease}`,
  });

  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      {/* ── page ─────────────────────────────────────────── */}
      <div style={{ ...fadeIn(t >= CUE.page), padding: "4px 0 40px" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: T.text, margin: 0 }}>Production</h1>
          <p style={{ fontSize: 13, color: T.sub, margin: "6px 0 0" }}>
            Work orders and shop-floor progress
          </p>
        </div>

        {/* search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: T.card,
            border: `1px solid ${t >= CUE.typeStart && t < CUE.filter ? T.accent : T.line}`,
            borderRadius: T.radius,
            padding: "12px 14px",
            maxWidth: 460,
            transition: `border-color .3s ${ease}`,
          }}
        >
          <Search size={15} color={T.muted} />
          <span
            style={{
              fontSize: 13.5,
              color: T.text,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: ".04em",
            }}
          >
            {typed}
            {typed.length > 0 && typed.length < QUERY.length && (
              <span style={{ color: T.accent }}>|</span>
            )}
          </span>
        </div>

        {/* matched row */}
        <div style={{ ...fadeIn(t >= CUE.filter), marginTop: 18 }}>
          <Card
            pad={16}
            style={{
              borderColor: t >= CUE.filter ? T.accent : T.line,
              boxShadow: t >= CUE.filter ? `0 0 0 1px ${T.accent}22, 0 18px 50px -22px ${T.accent}66` : "none",
              transition: `box-shadow .6s ${ease}, border-color .6s ${ease}`,
              display: "flex",
              alignItems: "center",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <Cell2 primary={ORDER.wo} secondary={ORDER.qty} />
            <Cell2 primary={ORDER.product} secondary={ORDER.spec} />
            <Cell2 primary={ORDER.customer} secondary="Customer" />
            <div style={{ marginLeft: "auto" }}>
              <Badge label="In Progress" color={T.blue} />
            </div>
          </Card>
        </div>

        {/* stage rail */}
        <div style={{ ...fadeIn(t >= CUE.detail), marginTop: 16 }}>
          <Card pad={20}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: T.muted,
                marginBottom: 18,
              }}
            >
              Shop-floor trace
            </div>

            <div style={{ position: "relative", paddingLeft: 26 }}>
              {/* rail */}
              <div
                style={{
                  position: "absolute",
                  left: 5,
                  top: 8,
                  bottom: 14,
                  width: 1,
                  background: T.line,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 5,
                  top: 8,
                  width: 1,
                  height: t >= CUE.stage[3] ? "76%" : t >= CUE.detail ? "0%" : "0%",
                  background: `linear-gradient(180deg, ${T.accent}, ${T.green})`,
                  boxShadow: `0 0 10px ${T.accent}`,
                  transition: `height 4.6s ${ease}`,
                }}
              />

              {STAGES.map((s, i) => {
                const st = stageState(i);
                const on = st !== "idle";
                return (
                  <div
                    key={s.name}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "11px 0",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: -26 + 1,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: st === "done" ? T.green : st === "live" ? T.accent : T.bg,
                        border: `1.5px solid ${st === "done" ? T.green : st === "live" ? T.accent : T.line}`,
                        boxShadow: st === "done" ? `0 0 10px ${T.green}88` : st === "live" ? `0 0 12px ${T.accent}` : "none",
                        transition: `all .45s ${ease}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14.5,
                        fontWeight: 500,
                        color: on ? T.text : T.muted,
                        minWidth: 110,
                        transition: `color .45s ${ease}`,
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: on ? T.sub : "transparent",
                        transition: `color .45s ${ease}`,
                      }}
                    >
                      {s.machine} · {s.operator}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12,
                        color: on ? (st === "live" ? T.accent : T.sub) : "transparent",
                        transition: `color .45s ${ease}`,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {s.qty}
                      <span style={{ color: T.muted }}>{s.at}</span>
                      {st === "done" && <CheckCircle2 size={14} color={T.green} />}
                    </span>
                    {st === "live" && (
                      <div style={{ width: "100%", paddingTop: 8 }}>
                        <Progress value={60} color={T.accent} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* dispatch */}
        <div style={{ ...fadeIn(t >= CUE.dispatch), marginTop: 16 }}>
          <Card pad={18} style={{ borderColor: `${T.accent}55` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Truck size={15} color={T.accent} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: T.accent,
                }}
              >
                Dispatch
              </span>
            </div>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <FileText size={14} color={T.muted} />
                <Cell2 primary={ORDER.invoice} secondary="Invoice" />
              </div>
              <Cell2 primary={ORDER.vehicle} secondary="Vehicle" />
              <Cell2 primary={ORDER.ready} secondary="Ready by" />
            </div>
          </Card>
        </div>
      </div>

      {/* ── opening question ─────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 8vw",
          zIndex: 90,
          opacity: t < CUE.askOut ? 1 : 0,
          pointerEvents: "none",
          transition: `opacity .6s ${ease}`,
        }}
      >
        <div style={{ fontSize: "clamp(26px,3.6vw,52px)", lineHeight: 1.15, color: T.text, fontWeight: 500, letterSpacing: "-0.02em" }}>
          A customer calls.
          <br />
          Where has his order <span style={{ color: T.accent }}>reached?</span>
        </div>
      </div>

      {/* ── closing card ─────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: T.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          zIndex: 95,
          opacity: t >= CUE.endCard ? 1 : 0,
          pointerEvents: "none",
          transition: `opacity .7s ${ease}`,
        }}
      >
        <div style={{ fontSize: "clamp(34px,5vw,72px)", color: T.text, fontWeight: 500, letterSpacing: "-0.03em" }}>
          Four <span style={{ color: T.accent }}>seconds.</span>
        </div>
        <div style={{ marginTop: 26, fontSize: 17, letterSpacing: ".42em", color: T.text, fontWeight: 600 }}>
          THREXA
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: T.sub,
          }}
        >
          Operations systems for manufacturers
        </div>
      </div>

      {showReplay && (
        <button
          onClick={replay}
          style={{
            position: "fixed",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            background: "transparent",
            border: `1px solid ${T.line}`,
            color: T.muted,
            fontSize: 10,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            padding: "8px 16px",
            borderRadius: 999,
            cursor: "pointer",
            zIndex: 99,
          }}
        >
          Replay · R &nbsp;·&nbsp; H hides this
        </button>
      )}
    </div>
  );
}
