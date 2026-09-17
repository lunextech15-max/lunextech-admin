"use client";

import { useId, useState } from "react";
import Modal from "@/components/admin/Modal";
import { createAnnouncement } from "@/lib/admin/announcements-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { AnnouncementAudience } from "@/lib/admin/types";

export type CreatedAnnouncement = { id: string; title: string };

export default function CreateAnnouncementModal({
  authorStaffId,
  onClose,
  onCreated,
}: {
  authorStaffId: string;
  onClose: () => void;
  onCreated: (announcement: CreatedAnnouncement) => void;
}) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("everyone");
  const [important, setImportant] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = (published: boolean) => async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: createError, id } = await createAnnouncement({
      title: title.trim(),
      content: message.trim(),
      category: "general",
      priority: important ? "important" : "normal",
      audience,
      published,
      authorStaffId,
    });

    setPending(false);

    if (createError || !id) {
      setError(`Couldn't save: ${createError}`);
      return;
    }

    onCreated({ id, title: title.trim() });
    void logActivity(authorStaffId, "announcements", published ? "Published announcement" : "Drafted announcement", title.trim());
  };

  return (
    <Modal title="Create announcement." onClose={onClose}>
      <form onSubmit={submit(true)} className="flex flex-col gap-5">
        <div>
          <label htmlFor={titleId} className="staff-field-label">
            Title
          </label>
          <input id={titleId} className="admin-input mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-message`}>
            Message
          </label>
          <textarea
            id={`${titleId}-message`}
            className="admin-textarea mt-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div>
          <p id={`${titleId}-audience-label`} className="staff-field-label">
            Audience
          </p>
          <div role="radiogroup" aria-labelledby={`${titleId}-audience-label`} className="mt-2 flex gap-3">
            {(["everyone", "staff", "intern"] as AnnouncementAudience[]).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={audience === option}
                onClick={() => setAudience(option)}
                className={`admin-type-option ${audience === option ? "is-active" : ""}`}
              >
                {option === "everyone" ? "Everyone" : option === "staff" ? "Staff only" : "Interns only"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p id={`${titleId}-priority-label`} className="staff-field-label">
            Priority
          </p>
          <div role="radiogroup" aria-labelledby={`${titleId}-priority-label`} className="mt-2 flex gap-3">
            <button
              type="button"
              role="radio"
              aria-checked={!important}
              onClick={() => setImportant(false)}
              className={`admin-type-option ${!important ? "is-active" : ""}`}
            >
              Normal
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={important}
              onClick={() => setImportant(true)}
              className={`admin-type-option ${important ? "is-active" : ""}`}
            >
              Important
            </button>
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
            {pending ? "Publishing…" : "Publish"}
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
          <button
            type="button"
            onClick={submit(false)}
            disabled={pending}
            className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase"
          >
            Save draft
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
