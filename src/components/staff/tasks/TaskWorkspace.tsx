"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskMetadataBar from "./TaskMetadataBar";
import TaskOverview from "./TaskOverview";
import TaskChecklist from "./TaskChecklist";
import TaskActions from "./TaskActions";
import TaskDetailsPanel from "./TaskDetailsPanel";
import TaskAssignee from "./TaskAssignee";
import TaskComments from "./TaskComments";
import ProjectActivityTimeline from "@/components/staff/projects/ProjectActivityTimeline";
import { toggleChecklistItem, updateTaskStatus, addTaskComment } from "@/lib/admin/tasks-client";
import { logActivity } from "@/lib/admin/activity-client";
import type { Task, TaskStatus } from "@/lib/staff/types";

export default function TaskWorkspace({
  task,
  viewer,
}: {
  task: Task;
  viewer: { staffId: string; name: string };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [checklist, setChecklist] = useState(task.checklist);
  const [error, setError] = useState<string | null>(null);

  const handleToggleChecklistItem = async (id: string) => {
    const item = checklist.find((i) => i.id === id);
    if (!item) return;
    setChecklist((items) => items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)));
    const { error: toggleError } = await toggleChecklistItem(id, !item.completed);
    if (toggleError) {
      setChecklist((items) => items.map((i) => (i.id === id ? { ...i, completed: item.completed } : i)));
      setError(`Couldn't update checklist: ${toggleError}`);
    }
  };

  const handleAdvanceStatus = async (next: TaskStatus) => {
    const previous = status;
    setStatus(next);
    const { error: statusError } = await updateTaskStatus(task.id, next);
    if (statusError) {
      setStatus(previous);
      setError(`Couldn't update status: ${statusError}`);
    } else {
      void logActivity(viewer.staffId, "tasks", "Updated task status", `${task.title} → ${next}`);
      router.refresh();
    }
  };

  const handleAddComment = async (body: string) => {
    const { error: commentError } = await addTaskComment(task.id, viewer.staffId, body);
    if (commentError) {
      setError(`Couldn't post comment: ${commentError}`);
      return;
    }
    router.refresh();
  };

  return (
    <div>
      {error && (
        <p role="alert" className="mb-6 border border-line px-5 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <div className="task-section">
        <TaskMetadataBar status={status} priority={task.priority} dueDate={task.dueDate} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        <div className="task-section order-1 lg:col-start-1" style={{ animationDelay: "0.06s" }}>
          <TaskOverview description={task.description} />
        </div>

        <div className="task-section order-2 lg:col-start-1" style={{ animationDelay: "0.12s" }}>
          <TaskChecklist items={checklist} onToggle={handleToggleChecklistItem} />
        </div>

        <div className="task-section order-3 lg:col-start-1" style={{ animationDelay: "0.18s" }}>
          <TaskActions status={status} onAdvance={handleAdvanceStatus} />
        </div>

        <div className="task-section order-4 lg:order-4 lg:col-start-2" style={{ animationDelay: "0.12s" }}>
          <TaskDetailsPanel task={task} />
        </div>

        <div className="task-section order-5 lg:order-5 lg:col-start-2" style={{ animationDelay: "0.18s" }}>
          <TaskAssignee initials={task.assigneeId} name={task.assigneeName} />
        </div>

        <div className="task-section order-6 lg:order-6 lg:col-start-2" style={{ animationDelay: "0.24s" }}>
          <ProjectActivityTimeline activity={task.activity} title="03 / Activity" />
        </div>

        <div className="task-section order-7 lg:order-7 lg:col-start-1" style={{ animationDelay: "0.3s" }}>
          <TaskComments comments={task.comments} onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
