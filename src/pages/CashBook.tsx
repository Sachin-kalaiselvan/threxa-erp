import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { supabase } from "../lib/supabase";

/* Cash book — daily receipts, payments, running balance.
   Running balance is computed oldest -> newest, displayed newest first. */

interface CashEntry {
  id: string; entry_date: string; kind: "receipt" | "payment";
  party: string | null; description: string | null; amount: number;
  mode: string; reference: string | null; created_at: string;
}

const empty = {
  entry_date: new Date().toISOString().slice(0, 10),
  kind: "receipt" as "receipt" | "payment",
  party: "", description: "", amount: 0, mode: "cash", reference: "",
};

export default function CashBook() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof empty>(empty);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["cash-entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cash_entries").select("*")
        .order("entry_date", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as CashEntry[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("cash_entries").insert(form);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cash-entries"] }); setShowForm(false); setForm(empty); },
  });

  const withBalance = useMemo(() => {
    let bal = 0;
    const rows = entries.map((e) => {
      bal += e.kind === "receipt" ? Number(e.amount) : -Number(e.amount);
      return { ...e, balance: bal };
    });
    return rows.reverse(); // newest first for display
  }, [entries]);

  const balance = withBalance[0]?.balance ?? 0;
  const today = new Date().toISOString().slice(0, 10);
  const todayIn = entries.filter((e) => e.entry_date === today && e.kind === "receipt")
    .reduce((s, e) => s + Number(e.amount), 0);
  const todayOut = entries.filter((e) => e.entry_date === today && e.kind === "payment")
    .reduce((s, e) => s + Number(e.amount), 0);

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Cash Book</h1>
        <button className="btn flex items-center gap-1.5" onClick={() => setShowForm(true)}>
          <Plus size={14} /> New Entry
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Running balance</div>
          <div className={`text-lg font-semibold ${balance < 0 ? "text-red-400" : ""}`}>₹{fmt(balance)}</div>
        </div>
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Today — receipts</div>
          <div className="text-lg font-semibold text-green-400">₹{fmt(todayIn)}</div>
        </div>
        <div className="card p-4">
          <div className="mb-1 text-[11px] text-[#B9BAC5]">Today — payments</div>
          <div className="text-lg font-semibold text-red-400">₹{fmt(todayOut)}</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Party / Description</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3 text-right">Receipt</th>
              <th className="px-4 py-3 text-right">Payment</th>
              <th className="px-4 py-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={6}>Loading...</td></tr>}
            {!isLoading && withBalance.length === 0 && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={6}>No entries yet.</td></tr>
            )}
            {withBalance.map((e) => (
              <tr key={e.id} className="border-b border-white/[.04]">
                <td className="px-4 py-3 text-[#B9BAC5]">{e.entry_date}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">{e.party || "—"}</span>
                  {e.description && <span className="text-[#B9BAC5]"> · {e.description}</span>}
                </td>
                <td className="px-4 py-3 text-[#B9BAC5]">{e.mode.replace("_", " ")}</td>
                <td className="px-4 py-3 text-right text-green-400">
                  {e.kind === "receipt" ? `₹${fmt(Number(e.amount))}` : ""}
                </td>
                <td className="px-4 py-3 text-right text-red-400">
                  {e.kind === "payment" ? `₹${fmt(Number(e.amount))}` : ""}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${e.balance < 0 ? "text-red-400" : ""}`}>
                  ₹{fmt(e.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowForm(false)}>
          <div className="h-full w-[400px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">New Entry</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] ${
                    form.kind === "receipt"
                      ? "border-green-500/40 bg-green-500/10 text-green-400"
                      : "border-white/[.1] text-[#B9BAC5]"
                  }`}
                  onClick={() => setForm({ ...form, kind: "receipt" })}>
                  <ArrowDownLeft size={14} /> Receipt
                </button>
                <button
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] ${
                    form.kind === "payment"
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : "border-white/[.1] text-[#B9BAC5]"
                  }`}
                  onClick={() => setForm({ ...form, kind: "payment" })}>
                  <ArrowUpRight size={14} /> Payment
                </button>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Date</label>
                <input type="date" className="input" value={form.entry_date}
                  onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Amount (₹) *</label>
                <input type="number" className="input" value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Party</label>
                <input className="input" value={form.party}
                  onChange={(e) => setForm({ ...form, party: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Description</label>
                <input className="input" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Mode</label>
                <select className="input" value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                  {["cash", "upi", "bank_transfer", "cheque", "other"].map((m) => (
                    <option key={m} value={m}>{m.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Reference</label>
                <input className="input" value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })} />
              </div>
              {save.isError && <p className="text-xs text-red-400">{(save.error as Error).message}</p>}
              <button className="btn w-full" disabled={!form.amount || save.isPending}
                onClick={() => save.mutate()}>
                {save.isPending ? "Saving..." : "Add entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
