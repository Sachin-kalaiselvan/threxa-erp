import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Customer } from "../types/db";

/* Customers — the reference CRUD pattern for the whole app.
   Every other master/list page follows this same shape:
   useQuery for the list, useMutation + invalidate for writes,
   a slide-over form for create/edit. */

const empty = {
  name: "", gstin: "", contact_person: "", phone: "",
  whatsapp: "", email: "", billing_address: "", shipping_address: "", notes: "",
};
type FormState = typeof empty;

export default function Customers() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Customer[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("customers").update(form).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      closeForm();
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name, gstin: c.gstin ?? "", contact_person: c.contact_person ?? "",
      phone: c.phone ?? "", whatsapp: c.whatsapp ?? "", email: c.email ?? "",
      billing_address: c.billing_address ?? "", shipping_address: c.shipping_address ?? "",
      notes: c.notes ?? "",
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Customers</h1>
        <div className="flex gap-3">
          <input
            className="input w-[220px]"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn flex items-center gap-1.5" onClick={openCreate}>
            <Plus size={14} /> New Customer
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">GSTIN</th>
              <th className="px-4 py-3 w-[90px]"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={5}>Loading...</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={5}>No customers yet. Add your first one.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-white/[.04] hover:bg-white/[.02]">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{c.contact_person || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{c.gstin || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="text-[#B9BAC5] hover:text-white" onClick={() => openEdit(c)}>
                      <Pencil size={14} />
                    </button>
                    <button
                      className="text-[#B9BAC5] hover:text-red-400"
                      onClick={() => { if (confirm(`Delete ${c.name}?`)) remove.mutate(c.id); }}
                    >
                      <Trash2 size={14} />
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
            className="h-full w-[420px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editing ? "Edit Customer" : "New Customer"}</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={closeForm}><X size={16} /></button>
            </div>
            <div className="space-y-3">
              {([
                ["name", "Company name *"],
                ["contact_person", "Contact person"],
                ["phone", "Phone"],
                ["whatsapp", "WhatsApp"],
                ["email", "Email"],
                ["gstin", "GSTIN"],
              ] as [keyof FormState, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">{label}</label>
                  <input
                    className="input"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              {([
                ["billing_address", "Billing address"],
                ["shipping_address", "Shipping address"],
                ["notes", "Notes"],
              ] as [keyof FormState, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-[11px] text-[#B9BAC5]">{label}</label>
                  <textarea
                    className="input min-h-[64px]"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              {save.isError && (
                <p className="text-xs text-red-400">{(save.error as Error).message}</p>
              )}
              <button
                className="btn w-full"
                disabled={!form.name || save.isPending}
                onClick={() => save.mutate()}
              >
                {save.isPending ? "Saving..." : editing ? "Save changes" : "Create customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
