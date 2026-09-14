"use client";

import { useMemo, useState } from "react";
import ApplicationRow from "./ApplicationRow";
import EmptyState from "@/components/admin/EmptyState";
import type { AdminApplication, ApplicationKind, ApplicationStatus } from "@/lib/admin/application-types";

type StatusFilter = "all" | ApplicationStatus;
type KindFilter = "all" | ApplicationKind;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "under-review", label: "Under review" },
  { id: "interview", label: "Interview" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

const KIND_FILTERS: { id: KindFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "internship", label: "Internship" },
  { id: "job", label: "Job" },
];

export default function ApplicationsContent({ applications }: { applications: AdminApplication[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");

  const counts = {
    new: applications.filter((a) => a.status === "new").length,
    underReview: applications.filter((a) => a.status === "under-review").length,
    interview: applications.filter((a) => a.status === "interview").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications
      .filter((a) => statusFilter === "all" || a.status === statusFilter)
      .filter((a) => kindFilter === "all" || a.kind === kindFilter)
      .filter((a) => !q || a.name.toLowerCase().includes(q) || a.roleLabel.toLowerCase().includes(q));
  }, [applications, query, statusFilter, kindFilter]);

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade">
        <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
          06 <span className="text-accent">/ Applications</span>
        </p>
        <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          Applications.
        </h1>
        <p className="mt-3 text-sm text-soft-white/50 sm:text-base">
          Review internship and job applications submitted from the public site.
        </p>
      </div>

      <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
        {[
          { label: "New", value: counts.new },
          { label: "Under review", value: counts.underReview },
          { label: "Interview", value: counts.interview },
          { label: "Accepted", value: counts.accepted },
          { label: "Rejected", value: counts.rejected },
        ].map((item) => (
          <p key={item.label} className="flex items-baseline gap-2">
            <span className="font-display text-lg font-black text-soft-white">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              {item.label}
            </span>
          </p>
        ))}
      </div>

      <div
        className="dash-fade mt-8 flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between"
        style={{ animationDelay: "0.12s" }}
      >
        <div className="flex flex-col gap-4">
          <div role="tablist" aria-label="Filter by type" className="flex flex-wrap items-center gap-6">
            {KIND_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={f.id === kindFilter}
                onClick={() => setKindFilter(f.id)}
                className={`proj-filter ${f.id === kindFilter ? "is-active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div role="tablist" aria-label="Filter by status" className="flex flex-wrap items-center gap-6">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={f.id === statusFilter}
                onClick={() => setStatusFilter(f.id)}
                className={`proj-filter ${f.id === statusFilter ? "is-active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:w-64">
          <input
            type="search"
            aria-label="Search applications"
            placeholder="Search applications…"
            className="proj-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="dash-fade mt-8" style={{ animationDelay: "0.18s" }}>
        {filtered.length > 0 ? (
          <div className="border border-line px-6 sm:px-8">
            {filtered.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No applications found."
            description={
              applications.length === 0
                ? "No applications have been submitted yet."
                : "Try adjusting your search or filters."
            }
            action={
              applications.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("all");
                    setKindFilter("all");
                  }}
                  className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
                >
                  Clear filters →
                </button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
