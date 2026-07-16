import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Employee {
  id: string; name: string; designation: string | null;
  daily_wage: number; phone: string | null; joined_date: string | null; is_active: boolean;
}

const empty = { name: "", designation: "", daily_wage: 0, phone: "", joined_date: "" };

export default function Employees() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof empty>(empty);

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employees").select("*").order("name");
      if (error) throw error;
      return data as Employee[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, joined_date: form.joined_date || null };
      if (editing) {
        const { error } = await supabase.from("employees").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("employees").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["employees"] }); close(); },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });

  const openEdit = (e: Employee) => {
    setEditing(e);
    setForm({
      name: e.name, designation: e.designation ?? "", daily_wage: e.daily_wage,
      phone: e.phone ?? "", joined_date: e.joined_date ?? "",
    });
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Employees</h1>
        <button className="btn flex items-center gap-1.5"
          onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>
          <Plus size={14} /> New Employee
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[.06] text-left text-[11px] uppercase tracking-wide text-[#B9BAC5]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Daily wage</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3 w-[90px]"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={5}>Loading...</td></tr>}
            {!isLoading && employees.length === 0 && (
              <tr><td className="px-4 py-6 text-[#B9BAC5]" colSpan={5}>No employees yet.</td></tr>
            )}
            {employees.map((e) => (
              <tr key={e.id} className="border-b border-white/[.04] hover:bg-white/[.02]">
                <td className="px-4 py-3 font-medium">{e.name}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{e.designation || "—"}</td>
                <td className="px-4 py-3">₹{Number(e.daily_wage).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-[#B9BAC5]">{e.phone || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="text-[#B9BAC5] hover:text-white" onClick={() => openEdit(e)}>
                      <Pencil size={14} />
                    </button>
                    <button className="text-[#B9BAC5] hover:text-red-400"
                      onClick={() => { if (confirm(`Remove ${e.name}?`)) remove.mutate(e.id); }}>
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={close}>
          <div className="h-full w-[400px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(ev) => ev.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">{editing ? "Edit Employee" : "New Employee"}</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={close}><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Name *</label>
                <input className="input" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Designation</label>
                <input className="input" value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Daily wage (₹) *</label>
                <input type="number" className="input" value={form.daily_wage}
                  onChange={(e) => setForm({ ...form, daily_wage: +e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Phone</label>
                <input className="input" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Joined date</label>
                <input type="date" className="input" value={form.joined_date}
                  onChange={(e) => setForm({ ...form, joined_date: e.target.value })} />
              </div>
              {save.isError && <p className="text-xs text-red-400">{(save.error as Error).message}</p>}
              <button className="btn w-full" disabled={!form.name || save.isPending}
                onClick={() => save.mutate()}>
                {save.isPending ? "Saving..." : editing ? "Save changes" : "Add employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
