"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import type { PersonAccount } from "@/lib/admin/types";
import type { StaffProject } from "@/lib/staff/types";

export default function CreateTaskModal({
  projects,
  people,
  defaultProjectCode,
  onClose,
  onCreate,
}: {
  projects: StaffProject[];
  people: PersonAccount[];
  defaultProjectCode?: string;
  onClose: () => void;
  onCreate: (title: string) => void;
}) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    onCreate(title.trim());
  };

  return (
    <Modal title="Create task." onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor={titleId} className="staff-field-label">
            Task title
          </label>
          <input id={titleId} className="admin-input mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          {error && <p className="staff-error">{error}</p>}
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-desc`}>
            Description
          </label>
          <textarea id={`${titleId}-desc`} className="admin-textarea mt-2" />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-project`}>
            Project
          </label>
          <select id={`${titleId}-project`} className="admin-select mt-2" defaultValue={defaultProjectCode}>
            {projects.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-assignee`}>
            Assign to
          </label>
          <select id={`${titleId}-assignee`} className="admin-select mt-2">
            {people.map((p) => (
              <option key={p.lunexId} value={p.lunexId}>
                {p.name === "Team member" || p.name === "Team intern" ? `${p.lunexId}` : p.name} ({p.lunexId})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${titleId}-priority`}>
              Priority
            </label>
            <select id={`${titleId}-priority`} className="admin-select mt-2" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${titleId}-due`}>
              Due date
            </label>
            <input id={`${titleId}-due`} type="date" className="admin-input mt-2" />
          </div>
        </div>

        <div>
          <p className="staff-field-label">Status</p>
          <span className="dash-status dash-status--todo mt-2">To do</span>
        </div>

        <div className="mt-2 flex items-center gap-6">
          <button
            type="submit"
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            Create task
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
