import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";

/* Reel stock with 30-day supplier credit tracking.
   due_date is computed by Postgres (received_date + credit_days). */

interface Reel {
  id: string; supplier_name: string; gsm: number; bf: number;
  deckle_mm: number | null; weight_kg: number; rate_per_kg: number; amount: number;
  received_date: string; credit_days: number; due_date: string;
  is_paid: boolean; paid_date: string | null; consumed_kg: number;
}

const empty = {
  supplier_name: "", gsm: 120, bf: 18, deckle_mm: 0,
  weight_kg: 0, rate_per_kg: 42, received_date: new Date().toISOString().slice(0, 10),
  credit_days: 30,
};

export default function Inventory() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof empty>(empty);
  const [tab, setTab] = useState<"stock" | "credit">("stock");

  const { data: reels = [], isLoading } = useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reels").select("*").order("received_date", { ascending: false });
      if (error) throw error;
      return data as Reel[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reels").insert({
        ...form, deckle_mm: form.deckle_mm || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reels"] }); setShowForm(false); setForm(empty); },
  });

  const markPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reels")
        .update({ is_paid: true, paid_date: new Date().toISOString().slice(0, 10) })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reels"] }),
  });

  const today = new Date().toISOString().slice(0, 10);
  const unpaid = reels.filter((r) => !r.is_paid);
  const overdue = unpaid.filter((r) => r.due_date < today);
  const outstanding = unpaid.reduce((s, r) => s + Number(r.amount), 0);
  const stockKg = reels.reduce((s, r) => s + (Number(r.weight_kg) - Number(r.consumed_kg)), 0);

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Reel Stock</h1>
        <button className="btn flex items-center gap-1.5" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Receive Reel
        </button>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Stock on hand</div>
          <div className="text-lg font-semibold">{fmt(stockKg)} kg</div>
        </div>
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Supplier outstanding</div>
          <div className="text-lg font-semibold">₹{fmt(outstanding)}</div>
        </div>
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Unpaid purchases</div>
          <div className="text-lg font-semibold">{unpaid.length}</div>
        </div>
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Overdue (past credit)</div>
          <div className={`text-lg font-semibold ${overdue.length ? "text-red-400" : ""}`}>{overdue.length}</div>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <button className={tab === "stock" ? "btn" : "btn-ghost"} onClick={() => setTab("stock")}>All reels</button>
        <button className={tab === "credit" ? "btn" : "btn-ghost"} onClick={() => setTab("credit")}>
          Credit due {overdue.length > 0 && <span className="ml-1 text-red-300">({overdue.length} overdue)</span>}
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Spec</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-right">Payment</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={7}>Loading...</td></tr>}
            {(tab === "stock" ? reels : unpaid).map((r) => {
              const isOverdue = !r.is_paid && r.due_date < today;
              return (
                <tr key={r.id} className="border-b border-white/[.04]">
                  <td className="px-4 py-3 font-medium">{r.supplier_name}</td>
                  <td className="px-4 py-3 text-[#B9BAC5]">
                    {r.gsm} GSM · {r.bf} BF{r.deckle_mm ? ` · ${r.deckle_mm}mm` : ""}
                  </td>
                  <td className="px-4 py-3">{fmt(Number(r.weight_kg))} kg</td>
                  <td className="px-4 py-3">₹{fmt(Number(r.amount))}</td>
                  <td className="px-4 py-3 text-[#B9BAC5]">{r.received_date}</td>
                  <td className={`px-4 py-3 ${isOverdue ? "font-medium text-red-400" : "text-[#B9BAC5]"}`}>
                    {r.due_date}{isOverdue && " · overdue"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.is_paid ? (
                      <span className="text-[12px] text-green-400">Paid {r.paid_date}</span>
                    ) : (
                      <button className="btn-ghost flex items-center gap-1 !px-3 !py-1 text-[12px] ml-auto"
                        onClick={() => markPaid.mutate(r.id)}>
                        <CheckCircle2 size={13} /> Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && (tab === "stock" ? reels : unpaid).length === 0 && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={7}>Nothing here yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowForm(false)}>
          <div className="h-full w-[400px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">Receive Reel</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {([
                ["supplier_name", "Supplier *", "text"],
                ["gsm", "GSM", "number"],
                ["bf", "BF (bursting factor)", "number"],
                ["deckle_mm", "Deckle / width (mm)", "number"],
                ["weight_kg", "Weight (kg) *", "number"],
                ["rate_per_kg", "Rate ₹/kg *", "number"],
                ["received_date", "Received date", "date"],
                ["credit_days", "Credit days", "number"],
              ] as [keyof typeof empty, string, string][]).map(([key, label, type]) => (
                <div key={key}>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">{label}</label>
                  <input className="input" type={type} value={form[key] as any}
                    onChange={(e) => setForm({
                      ...form,
                      [key]: type === "number" ? +e.target.value : e.target.value,
                    })} />
                </div>
              ))}
              <div className="text-[12px] text-[#B9BAC5]">
                Amount: ₹{fmt(form.weight_kg * form.rate_per_kg)} · Due{" "}
                {form.received_date && new Date(new Date(form.received_date).getTime() + form.credit_days * 86400000)
                  .toISOString().slice(0, 10)}
              </div>
              {save.isError && <p className="text-xs text-red-400">{(save.error as Error).message}</p>}
              <button className="btn w-full"
                disabled={!form.supplier_name || !form.weight_kg || save.isPending}
                onClick={() => save.mutate()}>
                {save.isPending ? "Saving..." : "Add to stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
