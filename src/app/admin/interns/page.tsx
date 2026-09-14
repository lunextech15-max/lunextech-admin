import type { Metadata } from "next";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import InternsTable from "@/components/admin/interns/InternsTable";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { ADMIN_INTERNS, getAllPeople } from "@/lib/admin/people-data";
import { getInternMetrics } from "@/lib/admin/metrics";

export const metadata: Metadata = {
  title: "Interns — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminInternsPage() {
  const metrics = getInternMetrics();
  const people = getAllPeople();
  const supervisorName = (lunexId: string) => people.find((p) => p.lunexId === lunexId)?.name ?? "—";

  return (
    <AdminLayout active="interns" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
              05 <span className="text-accent">/ Interns</span>
            </p>
            <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
              Interns.
            </h1>
            <p className="mt-3 text-sm text-soft-white/50 sm:text-base">
              Manage internship programs and track intern progress.
            </p>
          </div>
          <Link
            href="/admin/people?new=1&type=intern"
            className="task-action shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            + Create intern account
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </Link>
        </div>

        <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
          {[
            { label: "Active interns", value: `${metrics.active}` },
            { label: "Completing soon", value: `${metrics.completingSoon}` },
            { label: "Completed", value: `${metrics.completed}` },
            { label: "Average progress", value: `${metrics.averageProgress}%` },
          ].map((item) => (
            <p key={item.label} className="flex items-baseline gap-2">
              <span className="font-display text-lg font-black text-soft-white">{item.value}</span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                {item.label}
              </span>
            </p>
          ))}
        </div>

        <div className="dash-fade mt-8" style={{ animationDelay: "0.12s" }}>
          <InternsTable interns={ADMIN_INTERNS} supervisorName={supervisorName} />
        </div>
      </div>
    </AdminLayout>
  );
}
