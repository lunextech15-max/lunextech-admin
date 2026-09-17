"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { addMilestone, updateMilestoneStatus, deleteMilestone } from "@/lib/admin/milestones-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { ProjectMilestone, MilestoneStatus } from "@/lib/admin/types";

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  upcoming: "Upcoming",
};

const STATUS_CLASS: Record<MilestoneStatus, string> = {
  completed: "dash-status--completed",
  "in-progress": "dash-status--in-progress",
  upcoming: "dash-status--todo",
};

// Cycling upcoming → in-progress → completed → upcoming lets a single
// click on the status badge advance a milestone, no extra form needed.
const NEXT_STATUS: Record<MilestoneStatus, MilestoneStatus> = {
  upcoming: "in-progress",
  "in-progress": "completed",
  completed: "upcoming",
};

export default function AdminMilestones({
  initial,
  projectCode,
  projectName,
  actorStaffId,
}: {
  initial: ProjectMilestone[];
  projectCode: string;
  projectName: string;
  actorStaffId: string;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const inputId = useId();

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setPending(true);
    setError(null);
    const { error: addError } = await addMilestone(projectCode, trimmed, initial.length);
    setPending(false);
    if (addError) {
      setError(addError);
      return;
    }
    void logActivity(actorStaffId, "projects", "Added milestone", `${projectName} — ${trimmed}`);
    setTitle("");
    setAdding(false);
    router.refresh();
  };

  const handleAdvance = async (milestone: ProjectMilestone) => {
    const next = NEXT_STATUS[milestone.status];
    const { error: statusError } = await updateMilestoneStatus(milestone.id, next);
    if (statusError) {
      setError(statusError);
      return;
    }
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await deleteMilestone(id);
    if (deleteError) {
      setError(deleteError);
      return;
    }
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">Milestones</h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
        >
          + Add milestone
        </button>
      </div>

      {adding && (
        <div className="mt-4 flex flex-col gap-3 border border-line p-4 sm:flex-row sm:items-center">
          <label htmlFor={inputId} className="sr-only">
            Milestone title
          </label>
          <input
            id={inputId}
            className="admin-input"
            placeholder="Milestone title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            disabled={pending}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={pending}
            className="dash-metric-link shrink-0 text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add →"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {error}
        </p>
      )}

      {initial.length > 0 ? (
        <ol className="mt-6">
          {initial.map((milestone) => (
            <li key={milestone.id} className="dash-activity-item">
              <span className="dash-activity-dot" aria-hidden />
              <p className="font-display text-xs text-soft-white/40">{milestone.number}</p>
              <p className="text-sm font-semibold tracking-wide text-soft-white uppercase">{milestone.title}</p>
              <button
                type="button"
                onClick={() => handleAdvance(milestone)}
                className={`dash-status ${STATUS_CLASS[milestone.status]}`}
                title="Click to advance status"
              >
                {STATUS_LABEL[milestone.status]}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(milestone.id)}
                className="dash-metric-link text-[10px] font-medium tracking-[0.15em] uppercase"
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-soft-white/45">No milestones yet.</p>
      )}
    </div>
  );
}
