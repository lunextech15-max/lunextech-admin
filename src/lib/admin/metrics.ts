// Computed Command Center metrics — always derived from the underlying
// project/task/people data, never hardcoded independently.

import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { MOCK_TASKS } from "@/lib/staff/tasks-data";
import { MOCK_TEAM } from "@/lib/staff/team-data";
import { INTERN_TASKS } from "@/lib/intern/mock-data";
import { ADMIN_INTERNS } from "./people-data";
import { MOCK_APPLICATIONS } from "./applications-data";

// Anchors "today" to the same date this whole mock dataset's task due-dates
// are written against, so overdue/upcoming comparisons stay internally
// consistent — not tied to the real system clock.
export const ADMIN_TODAY = "2026-09-14";

export function getActiveProjectCount(): number {
  return MOCK_PROJECTS.filter((p) => p.status === "in-progress" || p.status === "review").length;
}

export function getProjectStatusCounts() {
  return {
    active: MOCK_PROJECTS.filter((p) => p.status === "in-progress" || p.status === "review").length,
    completed: MOCK_PROJECTS.filter((p) => p.status === "completed").length,
    upcoming: MOCK_PROJECTS.filter((p) => p.status === "planning").length,
    onHold: MOCK_PROJECTS.filter((p) => p.status === "archived").length,
  };
}

export function getOpenTaskCount(): number {
  const staffOpen = MOCK_TASKS.filter((t) => t.status !== "completed").length;
  const internOpen = INTERN_TASKS.filter((t) => t.status !== "completed").length;
  return staffOpen + internOpen;
}

export function getTaskStatusCounts() {
  const all = [
    ...MOCK_TASKS.map((t) => t.status),
    ...INTERN_TASKS.map((t) => t.status),
  ];
  return {
    todo: all.filter((s) => s === "todo").length,
    inProgress: all.filter((s) => s === "in-progress").length,
    inReview: all.filter((s) => s === "in-review").length,
    completed: all.filter((s) => s === "completed").length,
  };
}

export function getOverdueTasks() {
  return MOCK_TASKS.filter((t) => t.status !== "completed" && t.dueDate < ADMIN_TODAY);
}

export function getPendingApplicationsCount(): number {
  return MOCK_APPLICATIONS.filter((a) => a.status === "new" || a.status === "under-review").length;
}

export function getActiveInternCount(): number {
  return ADMIN_INTERNS.filter((i) => i.status === "active").length;
}

export function getTeamMemberCount(): number {
  return MOCK_TEAM.length;
}

export function getInternMetrics() {
  const today = new Date(`${ADMIN_TODAY}T00:00:00`);
  const active = ADMIN_INTERNS.filter((i) => i.status === "active");
  const completingSoon = active.filter((i) => {
    const end = new Date(i.endDate);
    const days = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  }).length;
  const completed = ADMIN_INTERNS.filter((i) => i.status === "inactive").length;
  const averageProgress =
    Math.round(ADMIN_INTERNS.reduce((sum, i) => sum + i.progress, 0) / ADMIN_INTERNS.length) || 0;

  return { active: active.length, completingSoon, completed, averageProgress };
}

export function getCompanyPulse() {
  const projectDelivery =
    Math.round(MOCK_PROJECTS.reduce((sum, p) => sum + p.progress, 0) / MOCK_PROJECTS.length) || 0;

  const taskCounts = getTaskStatusCounts();
  const totalTasks = taskCounts.todo + taskCounts.inProgress + taskCounts.inReview + taskCounts.completed;
  const taskCompletion = totalTasks > 0 ? Math.round((taskCounts.completed / totalTasks) * 100) : 0;

  const activeProjects = getActiveProjectCount();
  const teamCapacity = Math.min(100, Math.round((activeProjects / MOCK_TEAM.length) * 100 * 1.8));

  const internProgress =
    Math.round(ADMIN_INTERNS.reduce((sum, i) => sum + i.progress, 0) / ADMIN_INTERNS.length) || 0;

  return { projectDelivery, taskCompletion, teamCapacity, internProgress };
}
