import type { Task } from "@/lib/staff/types";

const STATUS_LABEL: Record<Task["status"], string> = {
  todo: "To do",
  "in-progress": "In progress",
  "in-review": "In review",
  completed: "Completed",
};

// Visually prepared for a future task-detail route (hover affordance +
// arrow) but not wired to one yet — no fake navigation, no fake editing.
export default function ProjectTaskItem({ task, number }: { task: Task; number: string }) {
  return (
    <div className="proj-task">
      <span className="font-display text-xs text-soft-white/30">{number}</span>

      <p className="proj-task-title text-sm font-semibold tracking-wide text-soft-white/85">{task.title}</p>

      <span className={`dash-status dash-status--${task.status}`}>{STATUS_LABEL[task.status]}</span>

      <div className="flex items-center gap-3">
        <div>
          <p className="text-[9px] font-medium tracking-[0.2em] text-soft-white/35 uppercase">Assigned to</p>
          <span className="dash-team-avatar mt-1" title={task.assigneeId}>
            {task.assigneeId}
          </span>
        </div>
        <span className="proj-task-arrow" aria-hidden>
          →
        </span>
      </div>
    </div>
  );
}
