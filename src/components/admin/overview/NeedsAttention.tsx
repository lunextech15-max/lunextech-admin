import Link from "next/link";
import type { Task } from "@/lib/staff/types";

type AttentionItem = {
  id: string;
  label: string;
  detail: string;
  actionLabel: string;
  href: string;
};

export default function NeedsAttention({
  overdueTasks,
  pendingApplications,
  milestoneProjectName,
  milestoneTitle,
  milestoneSlug,
}: {
  overdueTasks: Task[];
  pendingApplications: number;
  milestoneProjectName: string | null;
  milestoneTitle: string | null;
  milestoneSlug: string | null;
}) {
  const items: AttentionItem[] = [];

  if (overdueTasks.length > 0) {
    items.push({
      id: "overdue",
      label: `${overdueTasks.length} ${overdueTasks.length === 1 ? "task" : "tasks"} overdue`,
      detail: "Review pending work across active projects.",
      actionLabel: "View tasks",
      href: "/admin/tasks",
    });
  }

  if (pendingApplications > 0) {
    items.push({
      id: "applications",
      label: `${pendingApplications} internship ${pendingApplications === 1 ? "application" : "applications"} pending`,
      detail: "New candidates require review.",
      actionLabel: "Review applications",
      href: "/admin/applications",
    });
  }

  if (milestoneProjectName && milestoneTitle && milestoneSlug) {
    items.push({
      id: "milestone",
      label: "Project milestone approaching",
      detail: `${milestoneProjectName} — ${milestoneTitle} in progress.`,
      actionLabel: "Open project",
      href: `/admin/projects/${milestoneSlug}`,
    });
  }

  return (
    <section aria-labelledby="needs-attention-heading">
      <h2
        id="needs-attention-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Needs attention
      </h2>

      {items.length > 0 ? (
        <div className="mt-4 border border-line px-6 sm:px-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 first:border-t-0">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <div>
                  <p className="text-sm font-semibold tracking-wide text-soft-white uppercase">{item.label}</p>
                  <p className="mt-1 text-sm text-soft-white/55">{item.detail}</p>
                </div>
              </div>
              <Link
                href={item.href}
                className="dash-metric-link shrink-0 text-xs font-medium tracking-[0.15em] uppercase"
              >
                {item.actionLabel} →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-line p-8 text-center">
          <p className="text-sm font-semibold tracking-wide text-soft-white/70 uppercase">All clear.</p>
          <p className="mt-2 text-sm text-soft-white/45">Nothing needs your attention right now.</p>
        </div>
      )}
    </section>
  );
}
