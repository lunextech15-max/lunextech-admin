"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectOverview from "@/components/staff/projects/ProjectOverview";
import ProjectTaskList from "@/components/staff/projects/ProjectTaskList";
import ProjectTeam from "@/components/staff/projects/ProjectTeam";
import ProjectActivityTimeline from "@/components/staff/projects/ProjectActivityTimeline";
import AdminMilestones from "./AdminMilestones";
import { updateProjectStatus } from "@/lib/admin/projects-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { ProjectMilestone } from "@/lib/admin/types";
import type { StaffProject, ProjectStatus, Task } from "@/lib/staff/types";

type Section = "overview" | "tasks" | "team" | "milestones" | "activity";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "team", label: "Team" },
  { id: "milestones", label: "Milestones" },
  { id: "activity", label: "Activity" },
];

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export default function AdminProjectWorkspace({
  project,
  milestones,
  tasks,
  actorStaffId,
}: {
  project: StaffProject;
  milestones: ProjectMilestone[];
  tasks: Task[];
  actorStaffId: string;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleStatusChange = async (next: ProjectStatus) => {
    const previous = status;
    setStatus(next);
    setStatusError(null);
    const { error } = await updateProjectStatus(project.code, next);
    if (error) {
      setStatus(previous);
      setStatusError(error);
    } else {
      void logActivity(actorStaffId, "projects", "Changed project status", `${project.name} → ${next}`);
      router.refresh();
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-6 border border-line p-5">
        <div className="flex items-center gap-3">
          <label htmlFor="admin-project-status" className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
            Change status
          </label>
          <select
            id="admin-project-status"
            className="admin-select"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {statusError && (
            <p role="alert" className="text-[11px] text-accent">
              {statusError}
            </p>
          )}
        </div>
        <Link
          href={`/admin/tasks?new=1&project=${project.code}`}
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
        >
          + Create task
        </Link>
        <button
          type="button"
          disabled
          className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
        >
          Edit project
        </button>
        <button
          type="button"
          disabled
          className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
        >
          Assign team members
        </button>
      </div>

      <div role="tablist" aria-label="Project workspace" className="proj-workspace-nav mt-8 border-b border-line">
        {SECTIONS.map((s, index) => (
          <button
            key={s.id}
            id={`tab-${s.id}`}
            type="button"
            role="tab"
            aria-selected={s.id === section}
            aria-controls={`panel-${s.id}`}
            onClick={() => setSection(s.id)}
            className={`proj-tab ${s.id === section ? "is-active" : ""}`}
          >
            <span className="proj-tab-num">{String(index + 1).padStart(2, "0")}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div
        key={section}
        id={`panel-${section}`}
        role="tabpanel"
        aria-labelledby={`tab-${section}`}
        tabIndex={0}
        className="proj-section mt-8"
      >
        {section === "overview" && <ProjectOverview project={{ ...project, status }} />}
        {section === "tasks" && <ProjectTaskList tasks={tasks} />}
        {section === "team" && (
          <div>
            <h2 className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">Project team</h2>
            <div className="mt-4">
              <ProjectTeam team={project.team} />
            </div>
          </div>
        )}
        {section === "milestones" && <AdminMilestones initial={milestones} />}
        {section === "activity" && <ProjectActivityTimeline activity={project.activity} title="Project activity" />}
      </div>
    </div>
  );
}
