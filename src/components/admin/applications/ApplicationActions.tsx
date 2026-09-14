"use client";

import { useState } from "react";
import Link from "next/link";
import type { ApplicationStatus } from "@/lib/admin/types";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "New",
  "under-review": "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  new: "dash-status--in-progress",
  "under-review": "dash-status--in-review",
  accepted: "dash-status--completed",
  rejected: "dash-status--todo",
};

export default function ApplicationActions({
  initialStatus,
  applicantLabel,
  email,
  internshipRole,
}: {
  initialStatus: ApplicationStatus;
  applicantLabel: string;
  email: string;
  internshipRole: string;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);

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
          onClick={() => setStatus("accepted")}
          className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase"
        >
          Accept application
        </button>
        <button
          type="button"
          onClick={() => setStatus("under-review")}
          className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase"
        >
          Mark under review
        </button>
        <button
          type="button"
          onClick={() => setStatus("rejected")}
          className="dash-quick-action admin-danger text-xs font-medium tracking-[0.15em] uppercase"
        >
          Reject application
        </button>
      </div>

      {status === "accepted" && (
        <div className="mt-6 border-t border-line pt-6">
          <Link
            href={`/admin/people?new=1&type=intern&name=${encodeURIComponent(applicantLabel)}&email=${encodeURIComponent(email)}`}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            Create intern account
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </Link>
          <p className="mt-3 text-[11px] text-soft-white/35">
            Opens Create Account pre-filled for {internshipRole}.
          </p>
        </div>
      )}
    </section>
  );
}
