import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { supabase } from "../lib/supabase";

/* Quotation Calculator — GSM x BF bursting-strength logic for 3/5/7-ply.
   Industry approximations used (all editable inputs, results are estimates):
   - Sheet length = 2 x (L + W) + glue flap
   - Sheet width (deckle) = W + H
   - Fluted layers consume extra paper: take-up factor (default 1.45)
   - Weight/box (kg) = sheet area (m2) x total GSM / 1000
   - Bursting strength (kg/cm2) ~= SUM(BF x GSM of every layer) / 1000
   - Cost = paper cost + conversion %, quote = cost + margin % */

type Layer = { kind: "liner" | "flute"; gsm: number; bf: number };

const plyLayers = (ply: number): Layer[] => {
  const L: Layer = { kind: "liner", gsm: 150, bf: 18 };
  const F: Layer = { kind: "flute", gsm: 120, bf: 16 };
  if (ply === 3) return [ {...L}, {...F}, {...L} ];
  if (ply === 5) return [ {...L}, {...F}, {...L}, {...F}, {...L} ];
  return [ {...L}, {...F}, {...L}, {...F}, {...L}, {...F}, {...L} ];
};

export default function Quotations() {
  const qc = useQueryClient();
  const [ply, setPly] = useState(3);
  const [layers, setLayers] = useState<Layer[]>(plyLayers(3));
  const [dims, setDims] = useState({ length_mm: 450, width_mm: 300, height_mm: 300 });
  const [glueFlap, setGlueFlap] = useState(40);
  const [takeup, setTakeup] = useState(1.45);
  const [paperRate, setPaperRate] = useState(42);      // INR per kg
  const [conversionPct, setConversionPct] = useState(20);
  const [marginPct, setMarginPct] = useState(15);
  const [boxName, setBoxName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [quantity, setQuantity] = useState(1000);

  const changePly = (p: number) => { setPly(p); setLayers(plyLayers(p)); };
  const setLayer = (i: number, field: "gsm" | "bf", v: number) => {
    setLayers(layers.map((l, idx) => (idx === i ? { ...l, [field]: v } : l)));
  };

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("id,name").order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });

  const calc = useMemo(() => {
    const sheetL = 2 * (dims.length_mm + dims.width_mm) + glueFlap;
    const sheetW = dims.width_mm + dims.height_mm;
    const areaM2 = (sheetL * sheetW) / 1_000_000;
    const totalGsm = layers.reduce(
      (sum, l) => sum + l.gsm * (l.kind === "flute" ? takeup : 1), 0
    );
    const weightKg = (areaM2 * totalGsm) / 1000;
    const bs = layers.reduce((sum, l) => sum + l.bf * l.gsm, 0) / 1000;
    const paperCost = weightKg * paperRate;
    const conversion = paperCost * (conversionPct / 100);
    const cost = paperCost + conversion;
    const rate = cost * (1 + marginPct / 100);
    return {
      sheetL, sheetW, areaM2, totalGsm,
      weightKg, bs, bsPsi: bs * 14.22,
      paperCost, conversion, cost, rate,
      orderValue: rate * quantity,
    };
  }, [dims, glueFlap, layers, takeup, paperRate, conversionPct, marginPct, quantity]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: qno, error: e1 } = await supabase.rpc("next_doc_number", { seq_key: "quotation" });
      if (e1) throw e1;
      const { error } = await supabase.from("quotations").insert({
        quote_no: qno,
        customer_id: customerId || null,
        box_name: boxName || `${ply}-Ply ${dims.length_mm}x${dims.width_mm}x${dims.height_mm}`,
        ply, ...dims,
        layers, flute_takeup: takeup,
        paper_rate_per_kg: paperRate,
        conversion_pct: conversionPct, margin_pct: marginPct,
        sheet_length_mm: calc.sheetL, sheet_width_mm: calc.sheetW,
        weight_kg: calc.weightKg, bursting_strength: calc.bs,
        cost_per_box: calc.cost, quoted_rate: calc.rate, quantity,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotations"] }),
  });

  const { data: saved = [] } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select("id, quote_no, box_name, ply, quoted_rate, quantity, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as any[];
    },
  });

  const num = (v: number, d = 2) => v.toLocaleString("en-IN", { maximumFractionDigits: d });

  return (
    <div>
      <h1 className="mb-5 text-lg font-semibold">Quotation Calculator</h1>
      <div className="grid grid-cols-[1fr_360px] gap-4">
        {/* inputs */}
        <div className="card p-5">
          <div className="mb-4 flex gap-2">
            {[3, 5, 7].map((p) => (
              <button
                key={p}
                className={p === ply ? "btn" : "btn-ghost"}
                onClick={() => changePly(p)}
              >
                {p}-Ply
              </button>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-4 gap-3">
            {(["length_mm", "width_mm", "height_mm"] as const).map((k) => (
              <div key={k}>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">
                  {k.replace("_mm", "").toUpperCase()} (mm)
                </label>
                <input type="number" className="input"
                  value={dims[k]}
                  onChange={(e) => setDims({ ...dims, [k]: +e.target.value })} />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-[11px] text-[#B9BAC5]">Glue flap (mm)</label>
              <input type="number" className="input" value={glueFlap}
                onChange={(e) => setGlueFlap(+e.target.value)} />
            </div>
          </div>

          <div className="mb-1 text-[11px] uppercase tracking-wide text-[#B9BAC5]">Board construction</div>
          <div className="mb-4 space-y-2">
            {layers.map((l, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr_1fr] items-center gap-3">
                <span className={`text-[12px] ${l.kind === "flute" ? "text-[#9D6CFF]" : "text-[#B9BAC5]"}`}>
                  {l.kind === "flute" ? "Flute" : "Liner"} {i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#B9BAC5]">GSM</span>
                  <input type="number" className="input" value={l.gsm}
                    onChange={(e) => setLayer(i, "gsm", +e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#B9BAC5]">BF</span>
                  <input type="number" className="input" value={l.bf}
                    onChange={(e) => setLayer(i, "bf", +e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {([
              ["Flute take-up", takeup, setTakeup, 0.01],
              ["Paper ₹/kg", paperRate, setPaperRate, 1],
              ["Conversion %", conversionPct, setConversionPct, 1],
              ["Margin %", marginPct, setMarginPct, 1],
            ] as [string, number, (v: number) => void, number][]).map(([label, val, set, step]) => (
              <div key={label}>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">{label}</label>
                <input type="number" step={step} className="input" value={val}
                  onChange={(e) => set(+e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* results */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="mb-3 text-[11px] uppercase tracking-wide text-[#B9BAC5]">Results</div>
            <div className="space-y-2 text-[13px]">
              <Row k="Sheet size" v={`${num(calc.sheetL, 0)} x ${num(calc.sheetW, 0)} mm`} />
              <Row k="Board GSM (with take-up)" v={num(calc.totalGsm, 0)} />
              <Row k="Weight / box" v={`${num(calc.weightKg, 3)} kg`} />
              <Row k="Bursting strength" v={`${num(calc.bs, 1)} kg/cm² (${num(calc.bsPsi, 0)} psi)`} highlight />
              <div className="my-2 border-t border-white/[.06]" />
              <Row k="Paper cost" v={`₹${num(calc.paperCost)}`} />
              <Row k={`Conversion (${conversionPct}%)`} v={`₹${num(calc.conversion)}`} />
              <Row k="Cost / box" v={`₹${num(calc.cost)}`} />
              <Row k={`Quoted rate (+${marginPct}%)`} v={`₹${num(calc.rate)}`} highlight />
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 text-[11px] uppercase tracking-wide text-[#B9BAC5]">Save quotation</div>
            <div className="space-y-3">
              <input className="input" placeholder="Box name (optional)"
                value={boxName} onChange={(e) => setBoxName(e.target.value)} />
              <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">— No customer —</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex items-center gap-3">
                <input type="number" className="input" value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)} />
                <span className="whitespace-nowrap text-[12px] text-[#B9BAC5]">
                  = ₹{num(calc.orderValue, 0)}
                </span>
              </div>
              {save.isError && <p className="text-xs text-red-400">{(save.error as Error).message}</p>}
              <button className="btn flex w-full items-center justify-center gap-1.5"
                onClick={() => save.mutate()} disabled={save.isPending}>
                <Save size={14} /> {save.isPending ? "Saving..." : "Save quotation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="card mt-4 overflow-hidden">
          <div className="border-b border-white/[.06] px-4 py-3 text-[11px] uppercase tracking-wide text-[#B9BAC5]">
            Recent quotations
          </div>
          <table className="w-full text-[13px]">
            <tbody>
              {saved.map((q) => (
                <tr key={q.id} className="border-b border-white/[.04]">
                  <td className="px-4 py-2.5 font-medium">{q.quote_no}</td>
                  <td className="px-4 py-2.5 text-[#B9BAC5]">{q.box_name}</td>
                  <td className="px-4 py-2.5 text-[#B9BAC5]">{q.ply}-ply</td>
                  <td className="px-4 py-2.5">₹{Number(q.quoted_rate).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-[#B9BAC5]">x {q.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#B9BAC5]">{k}</span>
      <span className={highlight ? "font-semibold text-[#9D6CFF]" : ""}>{v}</span>
    </div>
  );
}
