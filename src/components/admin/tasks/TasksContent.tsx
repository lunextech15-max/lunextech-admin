"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminTaskRow from "./AdminTaskRow";
import CreateTaskModal from "./CreateTaskModal";
import EmptyState from "@/components/admin/EmptyState";
import type { AdminTaskView } from "@/lib/admin/tasks-view";
import type { PersonAccount } from "@/lib/admin/types";
import type { StaffProject } from "@/lib/staff/types";

type Filter = "all" | "todo" | "in-progress" | "in-review" | "completed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "in-progress", label: "In progress" },
  { id: "in-review", label: "In review" },
  { id: "completed", label: "Completed" },
];

function loadTasks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

export default function TasksContent({
  tasks,
  projects,
  people,
}: {
  tasks: AdminTaskView[];
  projects: StaffProject[];
  people: PersonAccount[];
}) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Filter>("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(() => searchParams.get("new") === "1");
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTasks().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const projectNames = useMemo(() => Array.from(new Set(tasks.map((t) => t.project))), [tasks]);

  const counts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    inReview: tasks.filter((t) => t.status === "in-review").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => statusFilter === "all" || t.status === statusFilter)
      .filter((t) => projectFilter === "all" || t.project === projectFilter)
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          t.assignedTo.toLowerCase().includes(q)
      );
  }, [tasks, query, statusFilter, projectFilter]);

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
            04 <span className="text-accent">/ Tasks</span>
          </p>
          <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            Tasks.
          </h1>
          <p className="mt-3 text-sm text-soft-white/50 sm:text-base">
            Monitor and manage work across all projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="task-action shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          + Create task
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
      </div>

      <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
        {[
          { label: "To do", value: counts.todo },
          { label: "In progress", value: counts.inProgress },
          { label: "In review", value: counts.inReview },
          { label: "Completed", value: counts.completed },
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
        <div role="tablist" aria-label="Filter tasks" className="flex flex-wrap items-center gap-6">
          {FILTERS.map((f) => (
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select
            aria-label="Filter by project"
            className="task-project-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All projects</option>
            {projectNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div className="sm:w-64">
            <input
              type="search"
              aria-label="Search tasks"
              placeholder="Search tasks…"
              className="proj-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
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
            {filtered.map((task, index) => (
              <AdminTaskRow key={task.id} task={task} number={String(index + 1).padStart(2, "0")} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks assigned."
            description="No tasks match the current filters."
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  setProjectFilter("all");
                }}
                className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
              >
                Clear filters →
              </button>
            }
          />
        )}
      </div>

      {modalOpen && (
        <CreateTaskModal
          projects={projects}
          people={people}
          defaultProjectCode={searchParams.get("project") ?? undefined}
          onClose={() => setModalOpen(false)}
          onCreate={(title) => {
            setModalOpen(false);
            setCreatedMessage(`"${title}" was created locally for this session — it isn't saved yet.`);
          }}
        />
      )}
    </div>
  );
}
