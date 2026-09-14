"use client";

import { useState } from "react";
import TaskMetadataBar from "./TaskMetadataBar";
import TaskOverview from "./TaskOverview";
import TaskChecklist from "./TaskChecklist";
import TaskActions from "./TaskActions";
import TaskDetailsPanel from "./TaskDetailsPanel";
import TaskAssignee from "./TaskAssignee";
import TaskComments from "./TaskComments";
import ProjectActivityTimeline from "@/components/staff/projects/ProjectActivityTimeline";
import type { Task, TaskStatus } from "@/lib/staff/types";

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  "in-review": "In review",
  completed: "Completed",
};

// Everything below is prototype-local state, seeded from the unified task
// data source (tasks-data.ts) on load. There is no backend yet, so status
// changes, checklist toggles and comments live only in this component and
// reset on refresh — they are never claimed to be permanently saved.
export default function TaskWorkspace({ task }: { task: Task }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [checklist, setChecklist] = useState(task.checklist);
  const [activity, setActivity] = useState(task.activity);
  const [comments, setComments] = useState(task.comments);

  const handleToggleChecklistItem = (id: string) => {
    setChecklist((items) => items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const handleAdvanceStatus = (next: TaskStatus) => {
    setActivity((entries) => [
      ...entries,
      {
        id: `local-${entries.length + 1}`,
        title: "Status updated",
        description: `${STATUS_LABEL[status]} → ${STATUS_LABEL[next]}`,
        relativeTime: "Just now",
      },
    ]);
    setStatus(next);
  };

  const handleAddComment = (body: string) => {
    setComments((prev) => [
      ...prev,
      {
        id: `local-comment-${prev.length + 1}`,
        author: task.assigneeName,
        body,
        relativeTime: "Just now",
      },
    ]);
  };

  return (
    <div>
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
          <ProjectActivityTimeline activity={activity} title="03 / Activity" />
        </div>

        <div className="task-section order-7 lg:order-7 lg:col-start-1" style={{ animationDelay: "0.3s" }}>
          <TaskComments comments={comments} onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
