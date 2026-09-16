import Link from "next/link";
import type { AdminApplication, ApplicationStatus } from "@/lib/admin/application-types";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "New",
  "under-review": "Under review",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

// Accent (red) is reserved for genuinely time-sensitive states — only
// "interview" (something scheduled) gets it here. "new" and "under-review"
// are this table's most common, routine states; giving them the same red
// as "needs attention"/destructive actions elsewhere diluted what the
// accent means on the busiest screen in the admin panel.
const STATUS_CLASS: Record<ApplicationStatus, string> = {
  new: "dash-status--planning",
  "under-review": "dash-status--review",
  interview: "dash-status--in-progress",
  accepted: "dash-status--completed",
  rejected: "dash-status--todo",
};

const KIND_LABEL = { internship: "Internship", job: "Job" } as const;

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default function ApplicationRow({ application }: { application: AdminApplication }) {
  return (
    <Link
      href={`/admin/applications/${encodeURIComponent(application.id)}`}
      className="team-row group flex items-center justify-between gap-6"
    >
      <div className="min-w-0 flex-1">
        <p className="team-row-name text-sm font-semibold tracking-wide text-soft-white/85 uppercase">
          {application.name}
        </p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.15em] text-accent uppercase">
          {KIND_LABEL[application.kind]} · {application.roleLabel}
        </p>
        <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
          Applied {formatDate(application.createdAt)}
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
