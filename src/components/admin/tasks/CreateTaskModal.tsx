"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import { createTask } from "@/lib/admin/tasks-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { PersonAccount } from "@/lib/admin/types";
import type { StaffProject, TaskPriority } from "@/lib/staff/types";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export type CreatedTask = { id: string; title: string };

export default function CreateTaskModal({
  projects,
  people,
  defaultProjectCode,
  actorStaffId,
  onClose,
  onCreated,
}: {
  projects: StaffProject[];
  people: PersonAccount[];
  defaultProjectCode?: string;
  actorStaffId: string;
  onClose: () => void;
  onCreated: (task: CreatedTask) => void;
}) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectCode, setProjectCode] = useState(defaultProjectCode ?? projects[0]?.code ?? "");
  const [assigneeId, setAssigneeId] = useState(people[0]?.lunexId ?? "");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: createError, id } = await createTask({
      title: title.trim(),
      description: description.trim(),
      projectCode: projectCode || undefined,
      priority,
      assigneeStaffId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      checklistLabels: [],
    });

    setPending(false);

    if (createError || !id) {
      setError(`Couldn't create this task: ${createError}`);
      return;
    }

    onCreated({ id, title: title.trim() });
    void logActivity(actorStaffId, "tasks", "Created task", title.trim());
  };

  return (
    <Modal title="Create task." onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor={titleId} className="staff-field-label">
            Task title
          </label>
          <input
            id={titleId}
            className="admin-input mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-desc`}>
            Description
          </label>
          <textarea
            id={`${titleId}-desc`}
            className="admin-textarea mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-project`}>
            Project
          </label>
          {projects.length > 0 ? (
            <select
              id={`${titleId}-project`}
              className="admin-select mt-2"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="admin-input mt-2 text-soft-white/40">No projects yet to assign this task to.</p>
          )}
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-assignee`}>
            Assign to
          </label>
          {people.length > 0 ? (
            <select
              id={`${titleId}-assignee`}
              className="admin-select mt-2"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {people.map((p) => (
                <option key={p.lunexId} value={p.lunexId}>
                  {p.name} ({p.lunexId})
                </option>
              ))}
            </select>
          ) : (
            <p className="admin-input mt-2 text-soft-white/40">No people yet to assign this task to.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${titleId}-priority`}>
              Priority
            </label>
            <select
              id={`${titleId}-priority`}
              className="admin-select mt-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${titleId}-due`}>
              Due date
            </label>
            <input
              id={`${titleId}-due`}
              type="date"
              className="admin-input mt-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="staff-field-label">Status</p>
          <span className="dash-status dash-status--todo mt-2">To do</span>
        </div>

        {error && (
          <p role="alert" className="staff-error">
            {error}
          </p>
        )}

        <div className="mt-2 flex items-center gap-6">
          <button
            type="submit"
            disabled={pending}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create task"}
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
