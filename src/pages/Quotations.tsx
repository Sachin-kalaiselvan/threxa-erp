import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Customer, BoxSpec } from "../types/db";

interface Quotation {
  id: string;
  quote_no: string;
  customer_id: string;
  box_name: string;
  ply: number;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  layers: any[];
  flute_takeup: number;
  paper_rate_per_kg: number;
  conversion_pct: number;
  margin_pct: number;
  sheet_length_mm: number | null;
  sheet_width_mm: number | null;
  weight_kg: number | null;
  bursting_strength: number | null;
  cost_per_box: number | null;
  quoted_rate: number | null;
  quantity: number | null;
  notes: string | null;
  created_at: string;
  customers?: { name: string };
}

const emptyQuote = {
  customer_id: "",
  box_name: "",
  ply: 3,
  length_mm: 0,
  width_mm: 0,
  height_mm: 0,
  paper_rate_per_kg: 80,
  conversion_pct: 20,
  margin_pct: 15,
  quantity: 1000,
  flute_takeup: 1.45,
};

export default function Quotations() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Quotation | null>(null);
  const [form, setForm] = useState(emptyQuote);
  const [calculated, setCalculated] = useState<any>(null);
  const [search, setSearch] = useState("");

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select("*, customers(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Quotation[];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").eq("is_active", true);
      if (error) throw error;
      return data as Customer[];
    },
  });

  // GSM x BF Calculator
  const calculateQuote = (formData: typeof form) => {
    const { length_mm, width_mm, height_mm, ply, paper_rate_per_kg, conversion_pct, margin_pct, quantity, flute_takeup } = formData;

    // Sheet dimensions
    const sheet_length_mm = (length_mm + width_mm) * 2 + 20; // perimeter + flap
    const sheet_width_mm = height_mm + 20; // height + overlap

    // GSM layers (simplified: liner 150, flute 125, medium 100)
    const layers = [
      { kind: "liner", gsm: 150, bf: 8 },
      { kind: "flute", gsm: 125, bf: 5.5 },
      { kind: "medium", gsm: 100, bf: 6 },
    ];
    
    const total_gsm = layers.reduce((sum: number, l: any) => sum + l.gsm, 0);
    const avg_bf = layers.reduce((sum: number, l: any) => sum + l.bf, 0) / layers.length;

    // Weight calculation
    const sheet_area_m2 = (sheet_length_mm * sheet_width_mm) / 1000000;
    const flute_layer = layers.find((l) => l.kind === "flute");
    const gsm_with_takeup = total_gsm + (flute_takeup - 1) * (flute_layer?.gsm || 0);
    const weight_per_box_kg = (gsm_with_takeup * sheet_area_m2) / 1000;
    const total_weight_kg = weight_per_box_kg * (quantity || 1);
    const cost_per_box = weight_per_box_kg * paper_rate_per_kg;

    // Margin
    const conversion_cost = (cost_per_box * conversion_pct) / 100;
    const total_cost = cost_per_box + conversion_cost;
    const margin_amount = (total_cost * margin_pct) / 100;
    const quoted_rate = total_cost + margin_amount;

    const bursting_strength = avg_bf; // Simplified

    setCalculated({
      sheet_length_mm: Math.round(sheet_length_mm),
      sheet_width_mm: Math.round(sheet_width_mm),
      weight_kg: weight_per_box_kg,
      bursting_strength,
      cost_per_box,
      quoted_rate,
      total_weight_kg,
    });
  };

  const saveQuote = useMutation({
    mutationFn: async () => {
      if (!form.customer_id || !form.box_name || !calculated) throw new Error("Fill all fields & calculate");

      const quoteNo = await generateQuoteNumber();
      if (editing) {
        const { error } = await supabase
          .from("quotations")
          .update({
            customer_id: form.customer_id,
            box_name: form.box_name,
            ply: form.ply,
            length_mm: form.length_mm,
            width_mm: form.width_mm,
            height_mm: form.height_mm,
            paper_rate_per_kg: form.paper_rate_per_kg,
            conversion_pct: form.conversion_pct,
            margin_pct: form.margin_pct,
            quantity: form.quantity,
            flute_takeup: form.flute_takeup,
            quote_no: editing.quote_no,
            layers: [],
            sheet_length_mm: calculated.sheet_length_mm,
            sheet_width_mm: calculated.sheet_width_mm,
            weight_kg: calculated.weight_kg,
            bursting_strength: calculated.bursting_strength,
            cost_per_box: calculated.cost_per_box,
            quoted_rate: calculated.quoted_rate,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("quotations").insert({
          quote_no: quoteNo,
          customer_id: form.customer_id,
          box_name: form.box_name,
          ply: form.ply,
          length_mm: form.length_mm,
          width_mm: form.width_mm,
          height_mm: form.height_mm,
          paper_rate_per_kg: form.paper_rate_per_kg,
          conversion_pct: form.conversion_pct,
          margin_pct: form.margin_pct,
          quantity: form.quantity,
          flute_takeup: form.flute_takeup,
          layers: [],
          sheet_length_mm: calculated.sheet_length_mm,
          sheet_width_mm: calculated.sheet_width_mm,
          weight_kg: calculated.weight_kg,
          bursting_strength: calculated.bursting_strength,
          cost_per_box: calculated.cost_per_box,
          quoted_rate: calculated.quoted_rate,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quotations"] });
      closeForm();
    },
  });

  const generateQuoteNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("next_doc_number", { seq_key: "quotation" });
    if (error) throw error;
    return data;
  };

  const convertToOrder = async (quote: Quotation) => {
    if (!quote.customers) return;
    try {
      // Create order
      const orderNo = await (async () => {
        const { data, error } = await supabase.rpc("next_doc_number", { seq_key: "order" });
        if (error) throw error;
        return data;
      })();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_no: orderNo,
          customer_id: quote.customer_id,
          order_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create dummy box spec & order item (simplified)
      alert(`Order ${orderNo} created! Manually add items in Orders page.`);
      qc.invalidateQueries({ queryKey: ["orders"] });
    } catch (err) {
      alert("Error: " + (err as Error).message);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyQuote);
    setCalculated(null);
    setShowForm(true);
  };

  const openEdit = (q: Quotation) => {
    setEditing(q);
    setForm({
      customer_id: q.customer_id,
      box_name: q.box_name,
      ply: q.ply,
      length_mm: q.length_mm,
      width_mm: q.width_mm,
      height_mm: q.height_mm,
      paper_rate_per_kg: q.paper_rate_per_kg,
      conversion_pct: q.conversion_pct,
      margin_pct: q.margin_pct,
      quantity: q.quantity || 1000,
      flute_takeup: q.flute_takeup,
    });
    setCalculated({
      sheet_length_mm: q.sheet_length_mm,
      sheet_width_mm: q.sheet_width_mm,
      weight_kg: q.weight_kg,
      bursting_strength: q.bursting_strength,
      cost_per_box: q.cost_per_box,
      quoted_rate: q.quoted_rate,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyQuote);
    setCalculated(null);
  };

  const filtered = quotations.filter((q) =>
    q.quote_no.toLowerCase().includes(search.toLowerCase()) ||
    (q.customers?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Quotations</h1>
        <div className="flex gap-3">
          <input
            className="input w-[220px]"
            placeholder="Search quote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn flex items-center gap-1.5" onClick={openCreate}>
            <Plus size={14} /> New Quote
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Quote No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Box Spec</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3 w-[90px]"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-[#B9BAC5]" colSpan={6}>
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-[#B9BAC5]" colSpan={6}>
                  No quotations yet.
                </td>
              </tr>
            )}
            {filtered.map((q) => (
              <tr key={q.id} className="border-b border-white/[.04] hover:bg-white/[.02]">
                <td className="px-4 py-3 font-mono font-medium">{q.quote_no}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{q.customers?.name || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{q.box_name} ({q.ply}-ply)</td>
                <td className="px-4 py-3">{q.quantity || "—"}</td>
                <td className="px-4 py-3 font-medium">₹{q.quoted_rate?.toFixed(2) || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-400"
                      title="Convert to order"
                      onClick={() => convertToOrder(q)}
                    >
                      <ArrowRight size={14} />
                    </button>
                    <button className="text-[#B9BAC5] hover:text-white" onClick={() => openEdit(q)}>
                      <X size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={closeForm}>
          <div
            className="h-full w-[500px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editing ? "Edit Quote" : "New Quote"}</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={closeForm}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 pb-6">
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Customer *</label>
                <select
                  className="input"
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                >
                  <option value="">Select...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Box Name</label>
                <input
                  className="input"
                  value={form.box_name}
                  onChange={(e) => setForm({ ...form, box_name: e.target.value })}
                  placeholder="e.g., Standard Carton"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Ply</label>
                  <select
                    className="input"
                    value={form.ply}
                    onChange={(e) => setForm({ ...form, ply: parseInt(e.target.value) })}
                  >
                    <option value={3}>3-Ply</option>
                    <option value={5}>5-Ply</option>
                    <option value={7}>7-Ply</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Quantity</label>
                  <input
                    type="number"
                    className="input"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1000 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Length (mm)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.length_mm}
                    onChange={(e) => setForm({ ...form, length_mm: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Width (mm)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.width_mm}
                    onChange={(e) => setForm({ ...form, width_mm: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Height (mm)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.height_mm}
                    onChange={(e) => setForm({ ...form, height_mm: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Paper Rate (₹/kg)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.paper_rate_per_kg}
                    onChange={(e) => setForm({ ...form, paper_rate_per_kg: parseFloat(e.target.value) || 80 })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Conversion (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.conversion_pct}
                    onChange={(e) => setForm({ ...form, conversion_pct: parseFloat(e.target.value) || 20 })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">Margin (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={form.margin_pct}
                    onChange={(e) => setForm({ ...form, margin_pct: parseFloat(e.target.value) || 15 })}
                  />
                </div>
              </div>

              <button
                className="btn w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => calculateQuote(form)}
              >
                Calculate
              </button>

              {calculated && (
                <div className="bg-white/[.05] rounded p-3 space-y-1 text-sm">
                  <p>Sheet: {calculated.sheet_length_mm} × {calculated.sheet_width_mm} mm</p>
                  <p>Weight/Box: {calculated.weight_kg.toFixed(3)} kg</p>
                  <p>Cost/Box: ₹{calculated.cost_per_box.toFixed(2)}</p>
                  <p className="font-semibold text-green-400">Rate: ₹{calculated.quoted_rate.toFixed(2)}</p>
                </div>
              )}

              {saveQuote.isError && <p className="text-xs text-red-400">{(saveQuote.error as Error).message}</p>}

              <button
                className="btn w-full"
                disabled={!calculated || saveQuote.isPending}
                onClick={() => saveQuote.mutate()}
              >
                {saveQuote.isPending ? "Saving..." : "Save Quote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
