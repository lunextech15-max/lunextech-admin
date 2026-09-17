// Computed Command Center metrics — always derived from the underlying
// project/task/people data, never hardcoded independently.
//
// People-, project-, and staff-task-derived metrics now read the real
// public.staff/public.projects/public.tasks tables. Intern tasks
// (intern/mock-data.ts) remain mock — that's a separate, later phase.

import { getAllRealTasks } from "./tasks";
import { INTERN_TASKS } from "@/lib/intern/mock-data";
import { getAllStaff } from "./team";
import { getAllProjects } from "./projects";
import type { AdminApplication } from "./application-types";

// Real tasks have real due dates now, so "overdue"/"completing soon"
// comparisons use the actual current date rather than a fixed anchor.
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getActiveProjectCount(): Promise<number> {
  const { projects } = await getAllProjects();
  return projects.filter((p) => p.status === "in-progress" || p.status === "review").length;
}

export async function getProjectStatusCounts() {
  const { projects } = await getAllProjects();
  return {
    active: projects.filter((p) => p.status === "in-progress" || p.status === "review").length,
    completed: projects.filter((p) => p.status === "completed").length,
    upcoming: projects.filter((p) => p.status === "planning").length,
    onHold: projects.filter((p) => p.status === "archived").length,
  };
}

export async function getOpenTaskCount(): Promise<number> {
  const staffTasks = await getAllRealTasks();
  const staffOpen = staffTasks.filter((t) => t.status !== "completed").length;
  const internOpen = INTERN_TASKS.filter((t) => t.status !== "completed").length;
  return staffOpen + internOpen;
}

export async function getTaskStatusCounts() {
  const staffTasks = await getAllRealTasks();
  const all = [...staffTasks.map((t) => t.status), ...INTERN_TASKS.map((t) => t.status)];
  return {
    todo: all.filter((s) => s === "todo").length,
    inProgress: all.filter((s) => s === "in-progress").length,
    inReview: all.filter((s) => s === "in-review").length,
    completed: all.filter((s) => s === "completed").length,
  };
}

export async function getOverdueTasks() {
  const staffTasks = await getAllRealTasks();
  const now = today();
  return staffTasks.filter((t) => t.status !== "completed" && t.dueDate && t.dueDate < now);
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
  const now = new Date();
  const active = interns.filter((i) => i.status === "active");
  const completingSoon = active.filter((i) => {
    if (!i.internship_end) return false;
    const end = new Date(i.internship_end);
    const days = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  }).length;
  const completed = interns.filter((i) => i.status === "inactive").length;
  // Per-intern progress isn't tracked yet — that's derived from real tasks,
  // a later phase. Honestly 0 rather than inventing a number.
  const averageProgress = 0;

  return { active: active.length, completingSoon, completed, averageProgress };
}

export async function getCompanyPulse() {
  const { projects } = await getAllProjects();
  const projectDelivery = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  const taskCounts = await getTaskStatusCounts();
  const totalTasks = taskCounts.todo + taskCounts.inProgress + taskCounts.inReview + taskCounts.completed;
  const taskCompletion = totalTasks > 0 ? Math.round((taskCounts.completed / totalTasks) * 100) : 0;

  const activeProjects = await getActiveProjectCount();
  const teamMemberCount = await getTeamMemberCount();
  const teamCapacity =
    teamMemberCount > 0 ? Math.min(100, Math.round((activeProjects / teamMemberCount) * 100 * 1.8)) : 0;

  // Per-intern progress isn't tracked yet — see getInternMetrics above.
  const internProgress = 0;

  return { projectDelivery, taskCompletion, teamCapacity, internProgress };
}
