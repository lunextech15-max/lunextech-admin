// Server-only: reads real tasks from Supabase public.tasks /
// public.task_checklist_items / public.task_comments — the same tables the
// Staff Portal (separate repo) uses. Replaces MOCK_TASKS (tasks-data.ts).

import { createClient } from "@/lib/supabase/server";
import { getAllStaff } from "./team";
import type { ChecklistItem, Task, TaskComment, TaskPriority, TaskStatus } from "@/lib/staff/types";

type TaskRow = {
  id: string;
  title: string;
  description: string;
  project_code: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_staff_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

type ChecklistRow = { id: string; task_id: string; label: string; completed: boolean; position: number };
type CommentRow = { id: string; task_id: string; author_staff_id: string; body: string; created_at: string };
type ProjectNameRow = { code: string; name: string };

function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function assemble(rows: TaskRow[]): Promise<Task[]> {
  if (rows.length === 0) return [];
  const supabase = await createClient();
  const taskIds = rows.map((r) => r.id);
  const projectCodes = Array.from(new Set(rows.map((r) => r.project_code).filter((c): c is string => Boolean(c))));

  const [{ data: checklistRows }, { data: commentRows }, { staff }, { data: projectRows }] = await Promise.all([
    supabase.from("task_checklist_items").select("*").in("task_id", taskIds).order("position"),
    supabase.from("task_comments").select("*").in("task_id", taskIds).order("created_at"),
    getAllStaff(),
    projectCodes.length
      ? supabase.from("projects").select("code, name").in("code", projectCodes)
      : Promise.resolve({ data: [] as ProjectNameRow[] }),
  ]);

  const nameByStaffId = new Map(staff.map((s) => [s.staff_id, s.full_name]));
  const nameByProjectCode = new Map(((projectRows ?? []) as ProjectNameRow[]).map((p) => [p.code, p.name]));
  const checklist = (checklistRows ?? []) as ChecklistRow[];
  const comments = (commentRows ?? []) as CommentRow[];

  return rows.map((row) => {
    const items: ChecklistItem[] = checklist
      .filter((c) => c.task_id === row.id)
      .map((c) => ({ id: c.id, label: c.label, completed: c.completed }));
    const taskComments: TaskComment[] = comments
      .filter((c) => c.task_id === row.id)
      .map((c) => ({
        id: c.id,
        author: nameByStaffId.get(c.author_staff_id) ?? c.author_staff_id,
        body: c.body,
        relativeTime: formatRelative(c.created_at),
      }));

    return {
      id: row.id,
      title: row.title,
      description: row.description ? row.description.split("\n\n") : [],
      projectId: row.project_code ?? "",
      projectName: row.project_code ? nameByProjectCode.get(row.project_code) ?? row.project_code : "—",
      status: row.status,
      priority: row.priority,
      assigneeId: row.assignee_staff_id ?? "",
      assigneeName: row.assignee_staff_id
        ? nameByStaffId.get(row.assignee_staff_id) ?? row.assignee_staff_id
        : "Unassigned",
      dueDate: row.due_date ?? "",
      createdAt: row.created_at.slice(0, 10),
      updatedAt: row.updated_at.slice(0, 10),
      checklist: items,
      // No real per-task activity log exists yet (later phase) — honestly
      // empty rather than inventing a timeline.
      activity: [],
      comments: taskComments,
    };
  });
}

export async function getAllRealTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true });
  if (error) {
    console.error("getAllRealTasks: query failed", error);
    return [];
  }
  return assemble((data ?? []) as TaskRow[]);
}

export async function getRealTask(id: string): Promise<Task | null> {
  const tasks = await getAllRealTasks();
  return tasks.find((t) => t.id === id) ?? null;
}

export async function getTasksForProject(projectCode: string): Promise<Task[]> {
  const tasks = await getAllRealTasks();
  return tasks.filter((t) => t.projectId === projectCode);
}

export async function getTasksForAssignee(staffId: string): Promise<Task[]> {
  const tasks = await getAllRealTasks();
  return tasks.filter((t) => t.assigneeId === staffId);
}
