"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminProjectRow from "./AdminProjectRow";
import CreateProjectModal from "./CreateProjectModal";
import EmptyState from "@/components/admin/EmptyState";
import type { StaffProject } from "@/lib/staff/types";
import type { StaffTeamMember } from "@/lib/staff/types";
import type { AdminIntern } from "@/lib/admin/people-data";

type Filter = "all" | "active" | "completed" | "upcoming" | "on-hold";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "upcoming", label: "Upcoming" },
  { id: "on-hold", label: "On hold" },
];

function matches(project: StaffProject, filter: Filter) {
  if (filter === "all") return true;
  if (filter === "active") return project.status === "in-progress" || project.status === "review";
  if (filter === "completed") return project.status === "completed";
  if (filter === "upcoming") return project.status === "planning";
  return project.status === "archived";
}

function loadProjects(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

export default function ProjectsContent({
  projects,
  staff,
  interns,
}: {
  projects: StaffProject[];
  staff: StaffTeamMember[];
  interns: AdminIntern[];
}) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(() => searchParams.get("new") === "1");
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadProjects().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = {
    active: projects.filter((p) => p.status === "in-progress" || p.status === "review").length,
    completed: projects.filter((p) => p.status === "completed").length,
    upcoming: projects.filter((p) => p.status === "planning").length,
    onHold: projects.filter((p) => p.status === "archived").length,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => matches(p, filter))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [projects, query, filter]);

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="dash-skeleton h-4 w-32" />
        <div className="dash-skeleton mt-4 h-10 w-56" />
        <div className="dash-skeleton mt-8 h-10 w-full" />
        <div className="dash-skeleton mt-6 h-40" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            03 <span className="text-accent">/ Projects</span>
          </p>
          <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            Projects.
          </h1>
          <p className="mt-3 text-sm text-soft-white/50 sm:text-base">Manage all LUNEX TECH projects.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="task-action shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          + Create project
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
      </div>

      <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
        {[
          { label: "Active", value: counts.active },
          { label: "Completed", value: counts.completed },
          { label: "Upcoming", value: counts.upcoming },
          { label: "On hold", value: counts.onHold },
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
        <div role="tablist" aria-label="Filter projects" className="flex flex-wrap items-center gap-6">
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
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            placeholder="Search projects…"
            className="proj-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {createdMessage && (
        <p className="dash-fade mt-6 text-[11px] font-medium tracking-[0.15em] text-accent uppercase">
          {createdMessage}
        </p>
      )}

      <div className="dash-fade mt-8" style={{ animationDelay: "0.18s" }}>
        {filtered.length > 0 ? (
          <div className="border border-line px-6 sm:px-8">
            {filtered.map((project) => (
              <AdminProjectRow key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects found."
            description="Create your first project to begin, or adjust your filters."
            action={
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
              >
                + Create project
              </button>
            }
          />
        )}
      </div>

      {modalOpen && (
        <CreateProjectModal
          staff={staff}
          interns={interns}
          onClose={() => setModalOpen(false)}
          onCreate={(name) => {
            setModalOpen(false);
            setCreatedMessage(
              `"${name}" was created locally for this session — it isn't saved to the shared project data yet.`
            );
          }}
        />
      )}
    </div>
  );
}
