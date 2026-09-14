"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminActivityCategory, AdminActivityEntry } from "@/lib/admin/types";

type Filter = "all" | AdminActivityCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "projects", label: "Projects" },
  { id: "tasks", label: "Tasks" },
  { id: "interns", label: "Interns" },
  { id: "system", label: "System" },
];

const DAY_ORDER = ["Today", "Yesterday", "Earlier"] as const;

function loadActivity(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

export default function ActivityContent({ activity }: { activity: AdminActivityEntry[] }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    loadActivity().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => activity.filter((entry) => filter === "all" || entry.category === filter),
    [activity, filter]
  );

  const groups = useMemo(() => {
    return DAY_ORDER.map((day) => ({
      day,
      entries: filtered.filter((entry) => entry.day === day),
    })).filter((group) => group.entries.length > 0);
  }, [filtered]);

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="dash-skeleton h-4 w-32" />
        <div className="dash-skeleton mt-4 h-10 w-56" />
        <div className="dash-skeleton mt-8 h-64" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade">
        <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
          08 <span className="text-accent">/ Activity</span>
        </p>
        <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          Activity.
        </h1>
        <p className="mt-3 text-sm text-soft-white/50 sm:text-base">System-wide operational history.</p>
      </div>

      <div
        role="tablist"
        aria-label="Filter activity"
        className="dash-fade mt-8 flex flex-wrap items-center gap-6 border-y border-line py-5"
        style={{ animationDelay: "0.06s" }}
      >
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

      {groups.length > 0 ? (
        <div className="mt-8 flex flex-col gap-10">
          {groups.map((group) => (
            <div key={group.day} className="dash-fade">
              <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">{group.day}</p>
              <ol className="mt-4 border border-line px-6 py-2 sm:px-8">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="dash-activity-item">
                    <span
                      className="dash-activity-dot"
                      style={!entry.important ? { background: "rgba(229,229,229,0.35)", boxShadow: "none" } : undefined}
                      aria-hidden
                    />
                    <p className="text-[11px] font-medium tracking-[0.15em] text-soft-white/45 uppercase">
                      {entry.title}
                    </p>
                    <p className="text-sm text-soft-white">{entry.description}</p>
                    <p className="text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
                      {entry.relativeTime}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-line p-8 text-center">
          <p className="text-sm font-semibold tracking-wide text-soft-white/70 uppercase">No activity found.</p>
          <p className="mt-2 text-sm text-soft-white/45">Nothing matches this filter yet.</p>
        </div>
      )}
    </div>
  );
}
