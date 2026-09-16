// Computed Command Center metrics — always derived from the underlying
// project/task/people data, never hardcoded independently.
//
// People-derived metrics (team size, active interns) now read the real
// public.staff roster (see team.ts). Project/task-derived metrics still
// read MOCK_PROJECTS/MOCK_TASKS — those are a later phase.

import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { MOCK_TASKS } from "@/lib/staff/tasks-data";
import { INTERN_TASKS } from "@/lib/intern/mock-data";
import { getAllStaff } from "./team";
import type { AdminApplication } from "./application-types";

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

export function getPendingApplicationsCount(applications: AdminApplication[]): number {
  return applications.filter((a) => a.status === "new" || a.status === "under-review").length;
}

export async function getActiveInternCount(): Promise<number> {
  const { staff } = await getAllStaff();
  return staff.filter((s) => s.role === "intern" && s.status === "active").length;
}

export async function getTeamMemberCount(): Promise<number> {
  const { staff } = await getAllStaff();
  return staff.filter((s) => s.role === "staff").length;
}

export async function getInternMetrics() {
  const { staff } = await getAllStaff();
  const interns = staff.filter((s) => s.role === "intern");
  const today = new Date(`${ADMIN_TODAY}T00:00:00`);
  const active = interns.filter((i) => i.status === "active");
  const completingSoon = active.filter((i) => {
    if (!i.internship_end) return false;
    const end = new Date(i.internship_end);
    const days = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  }).length;
  const completed = interns.filter((i) => i.status === "inactive").length;
  // Per-intern progress isn't tracked yet — that's derived from real tasks,
  // a later phase. Honestly 0 rather than inventing a number.
  const averageProgress = 0;

  return { active: active.length, completingSoon, completed, averageProgress };
}

export async function getCompanyPulse() {
  const projectDelivery =
    Math.round(MOCK_PROJECTS.reduce((sum, p) => sum + p.progress, 0) / MOCK_PROJECTS.length) || 0;

  const taskCounts = getTaskStatusCounts();
  const totalTasks = taskCounts.todo + taskCounts.inProgress + taskCounts.inReview + taskCounts.completed;
  const taskCompletion = totalTasks > 0 ? Math.round((taskCounts.completed / totalTasks) * 100) : 0;

  const activeProjects = getActiveProjectCount();
  const teamMemberCount = await getTeamMemberCount();
  const teamCapacity =
    teamMemberCount > 0 ? Math.min(100, Math.round((activeProjects / teamMemberCount) * 100 * 1.8)) : 0;

  // Per-intern progress isn't tracked yet — see getInternMetrics above.
  const internProgress = 0;

  return { projectDelivery, taskCompletion, teamCapacity, internProgress };
}
