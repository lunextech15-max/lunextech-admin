// Unifies the real Staff task pool (tasks.ts, public.tasks) and the
// still-mock Intern task pool (intern/mock-data.ts — a separate, later
// phase) into one shape for the Admin Tasks list — a read-time projection,
// not a third copy of task data.

import { getAllRealTasks } from "./tasks";
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

export async function getAllAdminTasks(): Promise<AdminTaskView[]> {
  const realTasks = await getAllRealTasks();
  const staffTasks: AdminTaskView[] = realTasks.map((t) => ({
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
