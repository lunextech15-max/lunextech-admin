"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import type { StaffTeamMember } from "@/lib/staff/types";
import type { AdminIntern } from "@/lib/admin/people-data";

const CATEGORIES = [
  "Digital Experience",
  "AI × Product",
  "E-Commerce",
  "Internal Systems",
  "Other",
];

const STATUSES = ["Planning", "In progress", "Review", "Completed", "Archived"];

export default function CreateProjectModal({
  staff,
  interns,
  onClose,
  onCreate,
}: {
  staff: StaffTeamMember[];
  interns: AdminIntern[];
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const nameId = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    onCreate(name.trim());
  };

  return (
    <Modal title="Create project." onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor={nameId} className="staff-field-label">
            Project name
          </label>
          <input id={nameId} className="admin-input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
          {error && <p className="staff-error">{error}</p>}
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-desc`}>
            Description
          </label>
          <textarea id={`${nameId}-desc`} className="admin-textarea mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-cat`}>
              Category
            </label>
            <select id={`${nameId}-cat`} className="admin-select mt-2" defaultValue={CATEGORIES[0]}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-status`}>
              Project status
            </label>
            <select id={`${nameId}-status`} className="admin-select mt-2" defaultValue={STATUSES[0]}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-start`}>
              Start date
            </label>
            <input id={`${nameId}-start`} type="date" className="admin-input mt-2" />
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${nameId}-target`}>
              Target date
            </label>
            <input id={`${nameId}-target`} type="date" className="admin-input mt-2" />
          </div>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-staff`}>
            Assign staff
          </label>
          <select id={`${nameId}-staff`} className="admin-select mt-2" multiple size={4}>
            {staff.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name === "Team member" ? `${m.initials} — Team member` : m.name} ({m.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${nameId}-interns`}>
            Assign interns
          </label>
          <select id={`${nameId}-interns`} className="admin-select mt-2" multiple size={3}>
            {interns.map((i) => (
              <option key={i.lunexId} value={i.lunexId}>
                {i.initials} — {i.internshipRole} ({i.lunexId})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex items-center gap-6">
          <button
            type="submit"
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            Create project
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
