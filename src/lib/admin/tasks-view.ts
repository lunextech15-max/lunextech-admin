// Unifies the Staff task pool (tasks-data.ts) and the Intern task pool
// (intern/mock-data.ts) into one shape for the Admin Tasks list — a
// read-time projection, not a third copy of task data.

import { MOCK_TASKS } from "@/lib/staff/tasks-data";
import { INTERN_TASKS, INTERN_USER } from "@/lib/intern/mock-data";
import type { TaskPriority, TaskStatus } from "@/lib/staff/types";

export type AdminTaskView = {
  id: string;
  title: string;
  project: string;
  assignedTo: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  source: "staff" | "intern";
};

export function getAllAdminTasks(): AdminTaskView[] {
  const staffTasks: AdminTaskView[] = MOCK_TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    project: t.projectName,
    assignedTo: t.assigneeName,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
    source: "staff",
  }));

  const internTasks: AdminTaskView[] = INTERN_TASKS.map((t) => ({
    id: t.id,
    title: t.title,
    project: t.project,
    assignedTo: INTERN_USER.name,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
    source: "intern",
  }));

  return [...staffTasks, ...internTasks];
}

export function getAdminTask(id: string): AdminTaskView | undefined {
  return getAllAdminTasks().find((t) => t.id === id);
}
