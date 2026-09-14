"use client";

import { useId, useState } from "react";
import type { ProjectMilestone } from "@/lib/admin/types";

const STATUS_LABEL: Record<ProjectMilestone["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
  upcoming: "Upcoming",
};

const STATUS_CLASS: Record<ProjectMilestone["status"], string> = {
  completed: "dash-status--completed",
  "in-progress": "dash-status--in-progress",
  upcoming: "dash-status--todo",
};

export default function AdminMilestones({ initial }: { initial: ProjectMilestone[] }) {
  const [milestones, setMilestones] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputId = useId();

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: `local-${prev.length + 1}`,
        number: String(prev.length + 1).padStart(2, "0"),
        title: trimmed,
        status: "upcoming",
      },
    ]);
    setTitle("");
    setAdding(false);
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
          />
          <button
            type="button"
            onClick={handleAdd}
            className="dash-metric-link shrink-0 text-xs font-medium tracking-[0.15em] uppercase"
          >
            Add →
          </button>
        </div>
      )}

      {milestones.length > 0 ? (
        <ol className="mt-6">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="dash-activity-item">
              <span className="dash-activity-dot" aria-hidden />
              <p className="font-display text-xs text-soft-white/40">{milestone.number}</p>
              <p className="text-sm font-semibold tracking-wide text-soft-white uppercase">{milestone.title}</p>
              <span className={`dash-status ${STATUS_CLASS[milestone.status]}`}>
                {STATUS_LABEL[milestone.status]}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-soft-white/45">No milestones yet.</p>
      )}
    </div>
  );
}
