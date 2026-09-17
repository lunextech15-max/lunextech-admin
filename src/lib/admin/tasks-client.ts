// Client-only: writes to public.tasks / public.task_checklist_items /
// public.task_comments — same tables and RLS as the Staff Portal.

"use client";

import { createClient } from "@/lib/supabase/client";
import type { TaskPriority, TaskStatus } from "@/lib/staff/types";

function nextTaskId(): string {
  return `TASK-${Date.now().toString(36).toUpperCase()}`;
}

export type NewTaskInput = {
  title: string;
  description: string;
  projectCode?: string;
  priority: TaskPriority;
  assigneeStaffId?: string;
  dueDate?: string;
  checklistLabels: string[];
};

export async function createTask(input: NewTaskInput): Promise<{ error: string | null; id: string | null }> {
  const supabase = createClient();
  const id = nextTaskId();

  const { error: taskError } = await supabase.from("tasks").insert({
    id,
    title: input.title,
    description: input.description,
    project_code: input.projectCode || null,
    priority: input.priority,
    assignee_staff_id: input.assigneeStaffId || null,
    due_date: input.dueDate || null,
  });

  if (taskError) {
    return { error: taskError.message, id: null };
  }

  const labels = input.checklistLabels.filter((l) => l.trim());
  if (labels.length > 0) {
    const { error: checklistError } = await supabase
      .from("task_checklist_items")
      .insert(labels.map((label, position) => ({ task_id: id, label: label.trim(), position })));
    if (checklistError) {
      return { error: checklistError.message, id };
    }
  }

  return { error: null, id };
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteTask(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function toggleChecklistItem(itemId: string, completed: boolean): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("task_checklist_items").update({ completed }).eq("id", itemId);
  return { error: error?.message ?? null };
}

export async function addTaskComment(
  taskId: string,
  authorStaffId: string,
  body: string
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("task_comments")
    .insert({ task_id: taskId, author_staff_id: authorStaffId, body });
  return { error: error?.message ?? null };
}
