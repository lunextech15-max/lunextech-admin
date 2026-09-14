"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectOverview from "@/components/staff/projects/ProjectOverview";
import ProjectTaskList from "@/components/staff/projects/ProjectTaskList";
import ProjectTeam from "@/components/staff/projects/ProjectTeam";
import ProjectActivityTimeline from "@/components/staff/projects/ProjectActivityTimeline";
import AdminMilestones from "./AdminMilestones";
import { getProjectTasks } from "@/lib/staff/tasks-data";
import type { ProjectMilestone } from "@/lib/admin/types";
import type { StaffProject, ProjectStatus } from "@/lib/staff/types";

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
}: {
  project: StaffProject;
  milestones: ProjectMilestone[];
}) {
  const [section, setSection] = useState<Section>("overview");
  const [status, setStatus] = useState<ProjectStatus>(project.status);

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
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Link
          href={`/admin/tasks?new=1&project=${project.code}`}
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
        >
          + Create task
        </Link>
        <span
          className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
          aria-disabled="true"
        >
          Edit project
        </span>
        <span
          className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
          aria-disabled="true"
        >
          Assign team members
        </span>
      </div>

      <div role="tablist" aria-label="Project workspace" className="proj-workspace-nav mt-8 border-b border-line">
        {SECTIONS.map((s, index) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === section}
            onClick={() => setSection(s.id)}
            className={`proj-tab ${s.id === section ? "is-active" : ""}`}
          >
            <span className="proj-tab-num">{String(index + 1).padStart(2, "0")}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div key={section} className="proj-section mt-8">
        {section === "overview" && <ProjectOverview project={{ ...project, status }} />}
        {section === "tasks" && <ProjectTaskList tasks={getProjectTasks(project.code)} />}
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
