"use client";

import { useId, useState, type FormEvent } from "react";
import Modal from "@/components/admin/Modal";
import { createScript, updateScript } from "@/lib/admin/scripts-client";
import type { AdminScript } from "@/lib/admin/scripts";

const CATEGORIES = ["Opening", "Website pitch", "Software pitch", "AI/automation pitch", "Objection handling", "Closing"];

export default function CreateScriptModal({
  existing,
  onClose,
  onSaved,
}: {
  existing?: AdminScript;
  onClose: () => void;
  onSaved: () => void;
}) {
  const formId = useId();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState(existing?.category ?? CATEGORIES[0]);
  const [content, setContent] = useState(existing?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and script content are required.");
      return;
    }

    setError(null);
    setPending(true);

    const { error: saveError } = existing
      ? await updateScript(existing.id, { title: title.trim(), category, content: content.trim() })
      : await createScript({ title: title.trim(), category, content: content.trim() });

    setPending(false);

    if (saveError) {
      setError(`Couldn't save: ${saveError}`);
      return;
    }

    onSaved();
  };

  return (
    <Modal title={existing ? "Edit script." : "Create script."} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="staff-field-label" htmlFor={`${formId}-title`}>
            Title
          </label>
          <input
            id={`${formId}-title`}
            className="admin-input mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${formId}-category`}>
            Category
          </label>
          <select
            id={`${formId}-category`}
            className="admin-select mt-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="staff-field-label" htmlFor={`${formId}-content`}>
            Script content
          </label>
          <textarea
            id={`${formId}-content`}
            className="admin-textarea mt-2"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
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
            {pending ? "Saving…" : existing ? "Save script" : "Create script"}
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
