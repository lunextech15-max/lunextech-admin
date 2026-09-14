"use client";

import { useEffect, useMemo, useState } from "react";
import ApplicationRow from "./ApplicationRow";
import EmptyState from "@/components/admin/EmptyState";
import type { Application } from "@/lib/admin/types";

type Filter = "all" | "new" | "under-review" | "accepted" | "rejected";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "under-review", label: "Under review" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

function loadApplications(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

export default function ApplicationsContent({ applications }: { applications: Application[] }) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    loadApplications().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = {
    new: applications.filter((a) => a.status === "new").length,
    underReview: applications.filter((a) => a.status === "under-review").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications
      .filter((a) => filter === "all" || a.status === filter)
      .filter((a) => !q || a.applicantLabel.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
  }, [applications, query, filter]);

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="dash-skeleton h-4 w-32" />
        <div className="dash-skeleton mt-4 h-10 w-56" />
        <div className="dash-skeleton mt-8 h-40" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade">
        <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
          06 <span className="text-accent">/ Applications</span>
        </p>
        <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          Applications.
        </h1>
        <p className="mt-3 text-sm text-soft-white/50 sm:text-base">Review internship applications.</p>
      </div>

      <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
        {[
          { label: "New", value: counts.new },
          { label: "Under review", value: counts.underReview },
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
        <div role="tablist" aria-label="Filter applications" className="flex flex-wrap items-center gap-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={f.id === filter}
              onClick={() => setFilter(f.id)}
              className={`proj-filter ${f.id === filter ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
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
            description="Try adjusting your search or filters."
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
              >
                Clear filters →
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
