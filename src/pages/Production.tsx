import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { supabase } from "../lib/supabase";

interface JobCard {
  id: string;
  job_no: string;
  order_item_id: string;
  planned_start: string | null;
  planned_end: string | null;
  notes: string | null;
  created_at: string;
  order_items?: {
    quantity: number;
    box_specs?: { name: string; ply: number };
    orders?: { order_no: string; customers?: { name: string } };
  };
  production_stages?: ProductionStage[];
}

interface ProductionStage {
  id: string;
  job_card_id: string;
  stage: string;
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  operator: string | null;
  started_at: string | null;
  completed_at: string | null;
  qty_ok: number | null;
  qty_rejected: number | null;
  remarks: string | null;
}

const STAGES = ["corrugation", "printing", "die_cutting", "pasting", "finishing", "quality_check"];

export default function Production() {
  const qc = useQueryClient();
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<{ stageId: string; jobId: string } | null>(null);
  const [stageForm, setStageForm] = useState({
    operator: "",
    qty_ok: 0,
    qty_rejected: 0,
    remarks: "",
  });
  const [showCreateJobCard, setShowCreateJobCard] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<string>("");
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");
  const [jobCardNotes, setJobCardNotes] = useState("");

  // Fetch job cards with production stages
  const { data: jobCards = [], isLoading } = useQuery({
    queryKey: ["production"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_cards")
        .select(
          `*, 
           order_items(quantity, box_specs(name, ply), orders(order_no, customers(name))),
           production_stages(*)`
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as JobCard[];
    },
  });

  // Fetch pending order items (without job cards)
  const { data: pendingOrderItems = [] } = useQuery({
    queryKey: ["pendingOrderItems"],
    queryFn: async () => {
      const { data: allItems, error: itemsError } = await supabase
        .from("order_items")
        .select("id, quantity, box_specs(name, ply), orders(order_no, customers(name))");
      if (itemsError) throw itemsError;

      const { data: jobCardItems, error: jobError } = await supabase
        .from("job_cards")
        .select("order_item_id");
      if (jobError) throw jobError;

      const jobCardItemIds = new Set(jobCardItems?.map((jc) => jc.order_item_id) || []);
      return (allItems || []).filter((item: any) => !jobCardItemIds.has(item.id));
    },
  });

  // Create job card
  const createJobCard = useMutation({
    mutationFn: async () => {
      if (!selectedOrderItem) throw new Error("Select an order item");
      const jobNo = await generateJobNumber();
      const { error } = await supabase.from("job_cards").insert({
        job_no: jobNo,
        order_item_id: selectedOrderItem,
        planned_start: plannedStart || null,
        planned_end: plannedEnd || null,
        notes: jobCardNotes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["production", "pendingOrderItems"] });
      setShowCreateJobCard(false);
      setSelectedOrderItem("");
      setPlannedStart("");
      setPlannedEnd("");
      setJobCardNotes("");
    },
  });

  // Generate job number
  const generateJobNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("next_doc_number", { seq_key: "job" });
    if (error) throw error;
    return data;
  };

  // Update stage status
  const updateStage = useMutation({
    mutationFn: async (variables: {
      stageId: string;
      status: string;
      operator: string;
      qty_ok: number;
      qty_rejected: number;
      remarks: string;
    }) => {
      const startedAt = variables.status === "in_progress" ? new Date().toISOString() : null;
      const completedAt = variables.status === "completed" ? new Date().toISOString() : null;

      const { error } = await supabase
        .from("production_stages")
        .update({
          status: variables.status,
          operator: variables.operator || null,
          started_at: startedAt,
          completed_at: completedAt,
          qty_ok: variables.qty_ok || null,
          qty_rejected: variables.qty_rejected || null,
          remarks: variables.remarks || null,
        })
        .eq("id", variables.stageId);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["production"] });
      setEditingStage(null);
      setStageForm({ operator: "", qty_ok: 0, qty_rejected: 0, remarks: "" });
    },
  });

  const openStageEdit = (jobCard: JobCard, stage: ProductionStage) => {
    setEditingStage({ stageId: stage.id, jobId: jobCard.id });
    setStageForm({
      operator: stage.operator || "",
      qty_ok: stage.qty_ok || 0,
      qty_rejected: stage.qty_rejected || 0,
      remarks: stage.remarks || "",
    });
  };

  const closeStageEdit = () => {
    setEditingStage(null);
    setStageForm({ operator: "", qty_ok: 0, qty_rejected: 0, remarks: "" });
  };

  const getStageProgress = (stages: ProductionStage[] | undefined) => {
    if (!stages) return 0;
    const completed = stages.filter((s) => s.status === "completed").length;
    return Math.round((completed / stages.length) * 100);
  };

  const getStageColor = (status: string) => {
    const colors: Record<string, string> = {
      not_started: "bg-gray-500/10 text-gray-600",
      in_progress: "bg-blue-500/10 text-blue-600",
      completed: "bg-green-500/10 text-green-600",
      on_hold: "bg-yellow-500/10 text-yellow-600",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Production</h1>
        <button className="btn flex items-center gap-1.5" onClick={() => setShowCreateJobCard(true)}>
          <Plus size={14} /> New Job Card
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="card p-5 text-[#B9BAC5]">Loading...</div>
        )}

        {!isLoading && jobCards.length === 0 && (
          <div className="card p-5 text-[#B9BAC5]">No job cards yet. Create orders first.</div>
        )}

        {jobCards.map((job) => {
          const isExpanded = expandedJob === job.id;
          const progress = getStageProgress(job.production_stages);
          const customerName = job.order_items?.orders?.customers?.name || "Unknown";
          const boxName = job.order_items?.box_specs?.name || "Unknown";
          const qty = job.order_items?.quantity || 0;

          return (
            <div key={job.id} className="card overflow-hidden">
              <button
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[.02]"
                onClick={() => setExpandedJob(isExpanded ? null : job.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-[#B9BAC5]" />
                  ) : (
                    <ChevronRight size={16} className="text-[#B9BAC5]" />
                  )}
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm font-semibold">{job.job_no}</p>
                      <p className="text-[13px] text-[#B9BAC5]">
                        {customerName} — {boxName}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#B9BAC5] mt-1">
                      Qty: {qty} · Progress: {progress}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[120px] h-2 bg-white/[.05] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-[#B9BAC5] w-[40px] text-right">{progress}%</p>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-white/[.06] px-5 py-4 space-y-3">
                  {job.production_stages?.map((stage, idx) => {
                    const isEditing = editingStage?.stageId === stage.id;
                    return (
                      <div key={stage.id} className="pb-3 border-b border-white/[.04] last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-[13px] font-medium capitalize">{stage.stage.replace("_", " ")}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getStageColor(stage.status)}`}>
                              {stage.status.replace("_", " ")}
                            </span>
                          </div>
                          <button
                            className="text-[11px] text-blue-500 hover:text-blue-400"
                            onClick={() => openStageEdit(job, stage)}
                          >
                            Update
                          </button>
                        </div>

                        {!isEditing && (
                          <div className="text-[12px] text-[#B9BAC5] space-y-1 pl-0">
                            {stage.operator && <p>Operator: <span className="text-white">{stage.operator}</span></p>}
                            {stage.qty_ok || stage.qty_rejected ? (
                              <p>
                                Output: <span className="text-white">{stage.qty_ok} OK</span>
                                {stage.qty_rejected ? `, ${stage.qty_rejected} rejected` : ""}
                              </p>
                            ) : null}
                            {stage.remarks && <p>Notes: <span className="text-white">{stage.remarks}</span></p>}
                            {stage.started_at && (
                              <p>
                                Started: <span className="text-white">{new Date(stage.started_at).toLocaleString("en-IN")}</span>
                              </p>
                            )}
                            {stage.completed_at && (
                              <p>
                                Completed: <span className="text-white">{new Date(stage.completed_at).toLocaleString("en-IN")}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {isEditing && (
                          <div className="bg-white/[.03] rounded p-3 space-y-2 text-[12px]">
                            <select
                              className="input text-sm"
                              value={stage.status}
                              onChange={(e) => {
                                updateStage.mutate({
                                  stageId: stage.id,
                                  status: e.target.value,
                                  operator: stageForm.operator,
                                  qty_ok: stageForm.qty_ok,
                                  qty_rejected: stageForm.qty_rejected,
                                  remarks: stageForm.remarks,
                                });
                              }}
                            >
                              <option value="not_started">Not Started</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="on_hold">On Hold</option>
                            </select>

                            <input
                              className="input text-sm"
                              placeholder="Operator name"
                              value={stageForm.operator}
                              onChange={(e) => setStageForm({ ...stageForm, operator: e.target.value })}
                            />

                            <div className="flex gap-2">
                              <input
                                type="number"
                                className="input text-sm flex-1"
                                placeholder="Qty OK"
                                value={stageForm.qty_ok || ""}
                                onChange={(e) =>
                                  setStageForm({ ...stageForm, qty_ok: parseInt(e.target.value) || 0 })
                                }
                              />
                              <input
                                type="number"
                                className="input text-sm flex-1"
                                placeholder="Rejected"
                                value={stageForm.qty_rejected || ""}
                                onChange={(e) =>
                                  setStageForm({ ...stageForm, qty_rejected: parseInt(e.target.value) || 0 })
                                }
                              />
                            </div>

                            <textarea
                              className="input text-sm"
                              placeholder="Remarks (optional)"
                              value={stageForm.remarks}
                              onChange={(e) => setStageForm({ ...stageForm, remarks: e.target.value })}
                              rows={2}
                            />

                            <div className="flex gap-2">
                              <button
                                className="btn text-sm flex-1"
                                disabled={updateStage.isPending}
                                onClick={() =>
                                  updateStage.mutate({
                                    stageId: stage.id,
                                    status: stage.status,
                                    operator: stageForm.operator,
                                    qty_ok: stageForm.qty_ok,
                                    qty_rejected: stageForm.qty_rejected,
                                    remarks: stageForm.remarks,
                                  })
                                }
                              >
                                {updateStage.isPending ? "Saving..." : "Save"}
                              </button>
                              <button
                                className="text-[#B9BAC5] hover:text-white px-3 py-1 text-sm"
                                onClick={closeStageEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCreateJobCard && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowCreateJobCard(false)}>
          <div
            className="h-full w-[420px] overflow-y-auto border-l border-white/[.08] bg-[#0b0c14] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">Create Job Card</h2>
              <button className="text-[#B9BAC5] hover:text-white" onClick={() => setShowCreateJobCard(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Order Item *</label>
                <select
                  className="input"
                  value={selectedOrderItem}
                  onChange={(e) => setSelectedOrderItem(e.target.value)}
                >
                  <option value="">Select order item...</option>
                  {pendingOrderItems.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.orders?.order_no} — {item.box_specs?.name} ({item.quantity} qty)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Planned Start</label>
                <input
                  type="date"
                  className="input"
                  value={plannedStart}
                  onChange={(e) => setPlannedStart(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Planned End</label>
                <input
                  type="date"
                  className="input"
                  value={plannedEnd}
                  onChange={(e) => setPlannedEnd(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-[#B9BAC5]">Notes</label>
                <textarea
                  className="input min-h-[60px]"
                  value={jobCardNotes}
                  onChange={(e) => setJobCardNotes(e.target.value)}
                />
              </div>

              {createJobCard.isError && (
                <p className="text-xs text-red-400">{(createJobCard.error as Error).message}</p>
              )}

              <button
                className="btn w-full"
                disabled={!selectedOrderItem || createJobCard.isPending}
                onClick={() => createJobCard.mutate()}
              >
                {createJobCard.isPending ? "Creating..." : "Create Job Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
