"use client";

import { useId, useState } from "react";
import Modal from "@/components/admin/Modal";
import { createAnnouncement } from "@/lib/admin/announcements-client";
import { logActivity } from "@/lib/admin/activity-client";
import { notify } from "@/lib/notifications/client";
import { createClient } from "@/lib/supabase/client";
import type { AnnouncementAudience } from "@/lib/admin/types";

const AUDIENCE_ROLES: Record<AnnouncementAudience, string[]> = {
  everyone: ["staff", "intern", "caller"],
  staff: ["staff"],
  intern: ["intern"],
  caller: ["caller"],
};

// Best-effort — an announcement is already saved by the time this runs, so
// a failure here never loses the announcement itself, only the fan-out
// notifications for it.
async function notifyAudience(input: {
  audience: AnnouncementAudience;
  authorStaffId: string;
  announcementId: string;
  title: string;
  content: string;
  important: boolean;
  sendEmail: boolean;
}) {
  try {
    const supabase = createClient();
    const { data: recipients, error } = await supabase
      .from("staff")
      .select("staff_id")
      .eq("status", "active")
      .in("role", AUDIENCE_ROLES[input.audience])
      .neq("staff_id", input.authorStaffId);

    if (error || !recipients) {
      console.error("notifyAudience: recipient lookup failed", error);
      return;
    }

    await Promise.all(
      recipients.map((r) =>
        notify({
          recipientStaffId: (r as { staff_id: string }).staff_id,
          title: `Announcement: ${input.title}`,
          message: input.content,
          type: "ANNOUNCEMENT",
          priority: input.important ? "important" : "normal",
          entityType: "announcement",
          entityId: input.announcementId,
          sendEmail: input.sendEmail,
        })
      )
    );
  } catch (err) {
    console.error("notifyAudience: unexpected failure", err);
  }
}

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
  const [emailEnabled, setEmailEnabled] = useState(true);
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

    // Drafts aren't visible to anyone yet, per the announcements RLS/audience
    // rules — only a published announcement should notify its audience.
    if (published) {
      void notifyAudience({
        audience,
        authorStaffId,
        announcementId: id,
        title: title.trim(),
        content: message.trim(),
        important,
        sendEmail: emailEnabled,
      });
    }
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
          <div role="radiogroup" aria-labelledby={`${titleId}-audience-label`} className="mt-2 flex flex-wrap gap-3">
            {(["everyone", "staff", "intern", "caller"] as AnnouncementAudience[]).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={audience === option}
                onClick={() => setAudience(option)}
                className={`admin-type-option ${audience === option ? "is-active" : ""}`}
              >
                {option === "everyone"
                  ? "Everyone"
                  : option === "staff"
                    ? "Staff only"
                    : option === "intern"
                      ? "Interns only"
                      : "Cold callers only"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p id={`${titleId}-delivery-label`} className="staff-field-label">
            Delivery
          </p>
          <div aria-labelledby={`${titleId}-delivery-label`} className="mt-2 flex flex-wrap gap-3">
            <span className="admin-type-option is-active" aria-disabled="true">
              In-app ✓
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={emailEnabled}
              onClick={() => setEmailEnabled((v) => !v)}
              className={`admin-type-option ${emailEnabled ? "is-active" : ""}`}
            >
              Email {emailEnabled ? "✓" : ""}
            </button>
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
