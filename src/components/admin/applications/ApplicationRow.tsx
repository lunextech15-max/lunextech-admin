import Link from "next/link";
import type { Application } from "@/lib/admin/types";

const STATUS_LABEL: Record<Application["status"], string> = {
  new: "New",
  "under-review": "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<Application["status"], string> = {
  new: "dash-status--in-progress",
  "under-review": "dash-status--in-review",
  accepted: "dash-status--completed",
  rejected: "dash-status--todo",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default function ApplicationRow({ application }: { application: Application }) {
  return (
    <Link href={`/admin/applications/${application.id}`} className="team-row group flex items-center justify-between gap-6">
      <div className="min-w-0 flex-1">
        <p className="team-row-name text-sm font-semibold tracking-wide text-soft-white/85 uppercase">
          {application.applicantLabel}
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.15em] text-accent uppercase">{application.role}</p>
        <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
          Applied {formatDate(application.appliedDate)}
        </p>
      </div>
      <span className={`dash-status ${STATUS_CLASS[application.status]} shrink-0`}>
        {STATUS_LABEL[application.status]}
      </span>
      <span className="team-row-arrow shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white/70 uppercase">
        Open <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
