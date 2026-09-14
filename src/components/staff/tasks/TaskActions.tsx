import type { TaskStatus } from "@/lib/staff/types";

const NEXT_ACTION: Partial<Record<TaskStatus, { label: string; next: TaskStatus }>> = {
  todo: { label: "Start task", next: "in-progress" },
  "in-progress": { label: "Move to review", next: "in-review" },
  "in-review": { label: "Mark as complete", next: "completed" },
};

export default function TaskActions({
  status,
  onAdvance,
}: {
  status: TaskStatus;
  onAdvance: (next: TaskStatus) => void;
}) {
  const action = NEXT_ACTION[status];

  if (!action) {
    return (
      <p className="text-sm font-semibold tracking-[0.1em] text-soft-white/70 uppercase">
        Task completed <span aria-hidden>✓</span>
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onAdvance(action.next)}
      className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
    >
      {action.label}
      <span className="task-action-arrow text-accent" aria-hidden>
        →
      </span>
    </button>
  );
}
