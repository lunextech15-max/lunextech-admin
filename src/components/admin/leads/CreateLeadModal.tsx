"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import { createLead } from "@/lib/admin/leads-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { LeadPriority } from "@/lib/caller/types";

const PRIORITIES: LeadPriority[] = ["high", "medium", "low"];

export type CreatedLead = { id: string; name: string };

export default function CreateLeadModal({
  callers,
  createdBy,
  onClose,
  onCreated,
}: {
  callers: { lunexId: string; name: string }[];
  createdBy: string;
  onClose: () => void;
  onCreated: (lead: CreatedLead) => void;
}) {
  const formId = useId();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [assignedCallerId, setAssignedCallerId] = useState(callers[0]?.lunexId ?? "");
  const [priority, setPriority] = useState<LeadPriority>("medium");
  const [requirement, setRequirement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: createError, id } = await createLead({
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location: location.trim(),
      source: source.trim(),
      assignedCallerId,
      priority,
      requirement: requirement.trim(),
      createdBy,
    });

    setPending(false);

    if (createError || !id) {
      setError(`Couldn't create this lead: ${createError}`);
      return;
    }

    onCreated({ id, name: name.trim() });
    void logActivity(createdBy, "leads", "Created lead", name.trim());
  };

  return (
    <Modal title="Create lead." onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-name`}>
              Name
            </label>
            <input
              id={`${formId}-name`}
              className="admin-input mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-company`}>
              Company
            </label>
            <input
              id={`${formId}-company`}
              className="admin-input mt-2"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-phone`}>
              Phone
            </label>
            <input
              id={`${formId}-phone`}
              className="admin-input mt-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-email`}>
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              className="admin-input mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-location`}>
              Location
            </label>
            <input
              id={`${formId}-location`}
              className="admin-input mt-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-source`}>
              Lead source
            </label>
            <input
              id={`${formId}-source`}
              className="admin-input mt-2"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Website, Referral"
            />
          </div>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${formId}-requirement`}>
            Requirement
          </label>
          <textarea
            id={`${formId}-requirement`}
            className="admin-textarea mt-2"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-caller`}>
              Assign to
            </label>
            {callers.length > 0 ? (
              <select
                id={`${formId}-caller`}
                className="admin-select mt-2"
                value={assignedCallerId}
                onChange={(e) => setAssignedCallerId(e.target.value)}
              >
                {callers.map((c) => (
                  <option key={c.lunexId} value={c.lunexId}>
                    {c.name} ({c.lunexId})
                  </option>
                ))}
              </select>
            ) : (
              <p className="admin-input mt-2 text-soft-white/40">No caller accounts yet to assign.</p>
            )}
          </div>
          <div>
            <label className="staff-field-label" htmlFor={`${formId}-priority`}>
              Priority
            </label>
            <select
              id={`${formId}-priority`}
              className="admin-select mt-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value as LeadPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p[0].toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
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
            {pending ? "Creating…" : "Create lead"}
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
