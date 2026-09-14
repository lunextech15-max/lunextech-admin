"use client";

import { useId, useState } from "react";
import Modal from "@/components/admin/Modal";
import type { AnnouncementAudience } from "@/lib/admin/types";

export type NewAnnouncement = {
  title: string;
  message: string;
  audience: AnnouncementAudience;
  important: boolean;
  published: boolean;
};

export default function CreateAnnouncementModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (announcement: NewAnnouncement) => void;
}) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("everyone");
  const [important, setImportant] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (published: boolean) => (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }
    onCreate({ title: title.trim(), message: message.trim(), audience, important, published });
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
          <p className="staff-field-label">Audience</p>
          <div className="mt-2 flex gap-3">
            {(["everyone", "staff", "intern"] as AnnouncementAudience[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAudience(option)}
                className={`admin-type-option ${audience === option ? "is-active" : ""}`}
              >
                {option === "everyone" ? "Everyone" : option === "staff" ? "Staff only" : "Interns only"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="staff-field-label">Priority</p>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setImportant(false)}
              className={`admin-type-option ${!important ? "is-active" : ""}`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setImportant(true)}
              className={`admin-type-option ${important ? "is-active" : ""}`}
            >
              Important
            </button>
          </div>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${titleId}-date`}>
            Publish date
          </label>
          <input id={`${titleId}-date`} type="date" className="admin-input mt-2" />
        </div>

        {error && <p className="staff-error">{error}</p>}

        <div className="mt-2 flex items-center gap-6">
          <button
            type="submit"
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            Publish
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
          <button type="button" onClick={submit(false)} className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase">
            Save draft
          </button>
          <button type="button" onClick={onClose} className="profile-edit-toggle text-xs font-medium tracking-[0.15em] uppercase">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
