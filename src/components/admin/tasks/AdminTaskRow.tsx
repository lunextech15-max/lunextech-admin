import Link from "next/link";
import TaskPriority from "@/components/staff/tasks/TaskPriority";
import type { AdminTaskView } from "@/lib/admin/tasks-view";

const STATUS_LABEL: Record<AdminTaskView["status"], string> = {
  todo: "To do",
  "in-progress": "In progress",
  "in-review": "In review",
  completed: "Completed",
};

export default function AdminTaskRow({ task, number }: { task: AdminTaskView; number: string }) {
  return (
    <Link href={`/admin/tasks/${task.id}`} className="task-row admin-task-row group">
      <div>
        <span className="font-display text-xs text-soft-white/30">{number}</span>
        <p className="task-row-title mt-1 text-sm font-semibold tracking-wide text-soft-white/85">{task.title}</p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.15em] text-accent uppercase">{task.project}</p>
      </div>

      <div>
        <p className="text-[9px] font-medium tracking-[0.2em] text-soft-white/35 uppercase">Assigned to</p>
        <p className="mt-1 text-sm font-medium text-soft-white/80">{task.assignedTo}</p>
      </div>

      <div>
        <p className="text-[9px] font-medium tracking-[0.2em] text-soft-white/35 uppercase">Priority</p>
        <div className="mt-1">
          <TaskPriority priority={task.priority} />
        </div>
      </div>

      <div>
        <p className="text-[9px] font-medium tracking-[0.2em] text-soft-white/35 uppercase">Status</p>
        <span className={`dash-status dash-status--${task.status} mt-1`}>{STATUS_LABEL[task.status]}</span>
      </div>

      <div>
        <p className="text-[9px] font-medium tracking-[0.2em] text-soft-white/35 uppercase">Due</p>
        <p className="mt-1 text-sm font-medium text-soft-white/80">{task.dueDate}</p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-soft-white/70 uppercase">
        Open
        <span className="task-row-arrow" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
