"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import { createProject } from "@/lib/admin/projects-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { PersonAccount } from "@/lib/admin/types";
import type { ProjectStatus } from "@/lib/staff/types";

const CATEGORIES = [
  "Digital Experience",
  "AI × Product",
  "E-Commerce",
  "Internal Systems",
  "Other",
];

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export type CreatedProject = {
  code: string;
  name: string;
};

export default function CreateProjectModal({
  nextProjectCode,
  staff,
  interns,
  actorStaffId,
  onClose,
  onCreated,
}: {
  nextProjectCode: string;
  staff: PersonAccount[];
  interns: PersonAccount[];
  actorStaffId: string;
  onClose: () => void;
  onCreated: (project: CreatedProject) => void;
}) {
  const nameId = useId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [startedDate, setStartedDate] = useState("");
  const [staffIds, setStaffIds] = useState<string[]>([]);
  const [internIds, setInternIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: createError } = await createProject({
      code: nextProjectCode,
      name: name.trim(),
      category,
      description: description.trim(),
      status,
      startedDate: startedDate || undefined,
      staffIds,
      internIds,
    });

    setPending(false);

    if (createError) {
      setError(createError);
      return;
    }

    onCreated({ code: nextProjectCode, name: name.trim() });
    void logActivity(actorStaffId, "projects", "Created project", name.trim());
  };

  return (
    <Modal title="Create project." onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor={nameId} className="staff-field-label">
            Project name
          </label>
          <input
            id={nameId}
            className="admin-input mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-desc`}>
            Description
          </label>
          <textarea
            id={`${nameId}-desc`}
            className="admin-textarea mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-cat`}>
              Category
            </label>
            <select
              id={`${nameId}-cat`}
              className="admin-select mt-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-status`}>
              Project status
            </label>
            <select
              id={`${nameId}-status`}
              className="admin-select mt-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-start`}>
            Start date
          </label>
          <input
            id={`${nameId}-start`}
            type="date"
            className="admin-input mt-2"
            value={startedDate}
            onChange={(e) => setStartedDate(e.target.value)}
          />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-staff`}>
            Assign staff
          </label>
          <select
            id={`${nameId}-staff`}
            className="admin-select mt-2"
            multiple
            size={4}
            value={staffIds}
            onChange={(e) => setStaffIds(Array.from(e.target.selectedOptions, (o) => o.value))}
          >
            {staff.map((m) => (
              <option key={m.lunexId} value={m.lunexId}>
                {m.name} ({m.title})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-interns`}>
            Assign interns
          </label>
          <select
            id={`${nameId}-interns`}
            className="admin-select mt-2"
            multiple
            size={3}
            value={internIds}
            onChange={(e) => setInternIds(Array.from(e.target.selectedOptions, (o) => o.value))}
          >
            {interns.map((i) => (
              <option key={i.lunexId} value={i.lunexId}>
                {i.name} — {i.department} ({i.lunexId})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="staff-error">{error}</p>}

        <div className="mt-2 flex items-center gap-6">
          <button
            type="submit"
            disabled={pending}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase disabled:opacity-50"
          >
            {pending ? "Creating…" : "Create project"}
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
