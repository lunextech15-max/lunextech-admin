import TaskPriority from "./TaskPriority";
import type { Task } from "@/lib/staff/types";

const STATUS_LABEL: Record<Task["status"], string> = {
  todo: "To do",
  "in-progress": "In progress",
  "in-review": "In review",
  completed: "Completed",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskMetadataBar({
  status,
  priority,
  dueDate,
}: {
  status: Task["status"];
  priority: Task["priority"];
  dueDate: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-6 border border-line p-6 sm:p-8">
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Status</p>
        <span className={`dash-status dash-status--${status} mt-2`}>{STATUS_LABEL[status]}</span>
      </div>
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Priority</p>
        <div className="mt-2">
          <TaskPriority priority={priority} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Due</p>
        <p className="mt-2 text-sm font-medium text-soft-white/80">{formatDate(dueDate)}</p>
      </div>
    </div>
  );
}
