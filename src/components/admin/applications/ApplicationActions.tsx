"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/lib/admin/real-applications-client";
import type { ApplicationKind, ApplicationStatus } from "@/lib/admin/application-types";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "New",
  "under-review": "Under review",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  new: "dash-status--in-progress",
  "under-review": "dash-status--in-review",
  interview: "dash-status--review",
  accepted: "dash-status--completed",
  rejected: "dash-status--todo",
};

export default function ApplicationActions({
  id,
  initialStatus,
  kind,
  name,
  email,
  roleLabel,
}: {
  id: string;
  initialStatus: ApplicationStatus;
  kind: ApplicationKind;
  name: string;
  email: string;
  roleLabel: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyStatus = async (next: ApplicationStatus) => {
    setPending(true);
    setError(null);
    const previous = status;
    setStatus(next);
    const { error: updateError } = await updateApplicationStatus(id, next);
    setPending(false);
    if (updateError) {
      setStatus(previous);
      setError("Couldn't update status. Please try again.");
      return;
    }
    router.refresh();
  };

  const accountType = kind === "job" ? "staff" : "intern";

  return (
    <section aria-labelledby="application-actions-heading" className="mt-8 border border-line p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h2
          id="application-actions-heading"
          className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
        >
          Status
        </h2>
        <span className={`dash-status ${STATUS_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => applyStatus("accepted")}
          className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
        >
          Accept application
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => applyStatus("under-review")}
          className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
        >
          Mark under review
        </button>
        {kind === "job" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => applyStatus("interview")}
            className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
          >
            Move to interview
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => applyStatus("rejected")}
          className="dash-quick-action admin-danger text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
        >
          Reject application
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[11px] text-accent">
          {error}
        </p>
      )}

      {status === "accepted" && (
        <div className="mt-6 border-t border-line pt-6">
          <Link
            href={`/admin/people?new=1&type=${accountType}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            Create {accountType} account
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </Link>
          <p className="mt-3 text-[11px] text-soft-white/35">
            Opens Create Account pre-filled for {roleLabel}.
          </p>
        </div>
      )}
    </section>
  );
}
