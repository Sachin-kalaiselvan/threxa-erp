import { useMemo, useState } from "react";
import { Calculator, Copy, Send } from "lucide-react";
import { T, fmtINR, PageShell, Card, CardTitle, Btn } from "../ui/system";

type Flute = "A" | "B" | "C" | "E";
type PlyOpt = "3-ply" | "5-ply" | "7-ply";

const FLUTES: Flute[] = ["A", "B", "C", "E"];
const PLIES: PlyOpt[] = ["3-ply", "5-ply", "7-ply"];

const PLY_GSM: Record<PlyOpt, number> = { "3-ply": 460, "5-ply": 650, "7-ply": 900 };
const FLUTE_TAKEUP: Record<Flute, number> = { A: 1.55, B: 1.35, C: 1.45, E: 1.25 };
const GLUE_FLAP_MM = 40;
const TRIM_ALLOWANCE_MM = 20;

function calcQuote(opts: {
  lengthCm: number; widthCm: number; heightCm: number; qty: number;
  ply: PlyOpt; flute: Flute; ratePerKg: number; wastagePct: number;
  conversionPerBox: number; marginPct: number;
}) {
  const L = opts.lengthCm * 10, W = opts.widthCm * 10, H = opts.heightCm * 10;
  const sheetLengthMM = 2 * (L + W) + GLUE_FLAP_MM;
  const sheetWidthMM = H + W + TRIM_ALLOWANCE_MM;
  const areaM2 = (sheetLengthMM * sheetWidthMM) / 1_000_000;

  const boardGSM = PLY_GSM[opts.ply] * FLUTE_TAKEUP[opts.flute] / FLUTE_TAKEUP.B;
  const weightPerBoxKg = (areaM2 * boardGSM) / 1000;

  const totalWeightKg = weightPerBoxKg * opts.qty * (1 + opts.wastagePct / 100);
  const materialCost = totalWeightKg * opts.ratePerKg;
  const conversionCost = opts.qty * opts.conversionPerBox;
  const baseCost = materialCost + conversionCost;
  const totalWithMargin = baseCost * (1 + opts.marginPct / 100);
  const pricePerBox = opts.qty > 0 ? totalWithMargin / opts.qty : 0;

  return { areaM2, weightPerBoxKg, totalWeightKg, materialCost, conversionCost, baseCost, totalWithMargin, pricePerBox };
}

function NumField({ label, value, onChange, suffix, step = 1 }:
  { label: string; value: number; onChange: (v: number) => void; suffix?: string; step?: number }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11.5, color: T.sub, marginBottom: 5, fontWeight: 500 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="number" value={Number.isFinite(value) ? value : 0} step={step}
          onChange={e => onChange(Number(e.target.value))}
          style={{ width: "100%", height: 38, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 8, padding: suffix ? "0 44px 0 11px" : "0 11px", fontSize: 13, color: T.text, outline: "none", boxSizing: "border-box" }}
        />
        {suffix && <span style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", fontSize: 11.5, color: T.muted }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SegPicker<T extends string>({ label, options, value, onChange }:
  { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11.5, color: T.sub, marginBottom: 5, fontWeight: 500 }}>{label}</label>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            flex: 1, height: 38, borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            background: value === o ? T.accent : T.bg, color: value === o ? "#fff" : T.sub,
            border: `1px solid ${value === o ? T.accent : T.line}`,
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <span style={{ fontSize: 12.5, color: T.sub }}>{label}</span>
      <span style={{ fontSize: strong ? 15 : 13, fontWeight: strong ? 700 : 500, color: T.text, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

export default function QuoteCalculator() {
  const [lengthCm, setLengthCm] = useState(30);
  const [widthCm, setWidthCm] = useState(20);
  const [heightCm, setHeightCm] = useState(20);
  const [qty, setQty] = useState(1000);
  const [ply, setPly] = useState<PlyOpt>("3-ply");
  const [flute, setFlute] = useState<Flute>("B");
  const [ratePerKg, setRatePerKg] = useState(42);
  const [wastagePct, setWastagePct] = useState(12);
  const [conversionPerBox, setConversionPerBox] = useState(1.5);
  const [marginPct, setMarginPct] = useState(18);
  const [copied, setCopied] = useState(false);

  const q = useMemo(() => calcQuote({ lengthCm, widthCm, heightCm, qty, ply, flute, ratePerKg, wastagePct, conversionPerBox, marginPct }),
    [lengthCm, widthCm, heightCm, qty, ply, flute, ratePerKg, wastagePct, conversionPerBox, marginPct]);

  const summary = `Box ${lengthCm}×${widthCm}×${heightCm} cm · ${ply} · ${flute}-flute\nQty: ${qty.toLocaleString("en-IN")}\nPrice: ${fmtINR(Math.round(q.pricePerBox))}/box\nTotal: ${fmtINR(Math.round(q.totalWithMargin))}`;

  const copySummary = () => {
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <PageShell
      title="Quote Calculator"
      subtitle="Box size + flute + quantity, priced instantly — read it out on a call or copy it into a quotation"
      meta={["Estimate only", "Uses logged material rate and margin"]}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 14 }}>
        <Card style={{ padding: 18 }}>
          <CardTitle>Box specification</CardTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
            <NumField label="Length" value={lengthCm} onChange={setLengthCm} suffix="cm" />
            <NumField label="Width" value={widthCm} onChange={setWidthCm} suffix="cm" />
            <NumField label="Height" value={heightCm} onChange={setHeightCm} suffix="cm" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <SegPicker label="Ply" options={PLIES} value={ply} onChange={setPly} />
            <SegPicker label="Flute" options={FLUTES} value={flute} onChange={setFlute} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <NumField label="Quantity" value={qty} onChange={setQty} suffix="boxes" step={100} />
            <NumField label="Board rate" value={ratePerKg} onChange={setRatePerKg} suffix="₹/kg" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <NumField label="Wastage allowance" value={wastagePct} onChange={setWastagePct} suffix="%" />
            <NumField label="Conversion cost" value={conversionPerBox} onChange={setConversionPerBox} suffix="₹/box" step={0.5} />
          </div>
          <div style={{ marginTop: 12 }}>
            <NumField label="Margin" value={marginPct} onChange={setMarginPct} suffix="%" />
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <CardTitle action={<Calculator size={15} style={{ color: T.accent }} />}>Quote breakdown</CardTitle>
          <div style={{ marginTop: 10 }}>
            <Row label="Sheet area / box" value={`${q.areaM2.toFixed(3)} m²`} />
            <Row label="Board weight / box" value={`${q.weightPerBoxKg.toFixed(3)} kg`} />
            <Row label="Total board (incl. wastage)" value={`${q.totalWeightKg.toFixed(0)} kg`} />
            <Row label="Material cost" value={fmtINR(Math.round(q.materialCost))} />
            <Row label="Conversion cost" value={fmtINR(Math.round(q.conversionCost))} />
            <Row label="Cost before margin" value={fmtINR(Math.round(q.baseCost))} />
          </div>

          <div style={{ background: "rgba(123,104,255,0.08)", border: `1px solid rgba(123,104,255,0.25)`, borderRadius: 10, padding: "12px 14px", marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 12, color: T.sub }}>Price per box</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: T.accent }}>{fmtINR(Math.round(q.pricePerBox))}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: T.sub }}>Total for {qty.toLocaleString("en-IN")} boxes</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{fmtINR(Math.round(q.totalWithMargin))}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn icon={Copy} onClick={copySummary}>{copied ? "Copied!" : "Copy summary"}</Btn>
            <Btn variant="primary" icon={Send}>Send to Quotations</Btn>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
