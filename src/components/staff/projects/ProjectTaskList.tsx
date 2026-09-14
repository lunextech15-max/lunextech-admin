import ProjectTaskItem from "./ProjectTaskItem";
import type { Task } from "@/lib/staff/types";

export default function ProjectTaskList({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = tasks.filter((t) => t.status === "todo" || t.status === "in-review").length;

  const counts = [
    { label: "Total", value: total },
    { label: "Completed", value: completed },
    { label: "In progress", value: inProgress },
    { label: "To do", value: todo },
  ];

  return (
    <div>
      <h2 className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">Project tasks</h2>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {counts.map((count) => (
          <p key={count.label} className="flex items-baseline gap-2">
            <span className="font-display text-lg font-black text-soft-white">
              {String(count.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              {count.label}
            </span>
          </p>
        ))}
      </div>

      <div className="mt-6 border-t border-line">
        {total > 0 ? (
          tasks.map((task, index) => (
            <ProjectTaskItem key={task.id} task={task} number={String(index + 1).padStart(2, "0")} />
          ))
        ) : (
          <div className="py-8">
            <p className="text-sm font-semibold tracking-wide text-soft-white/70 uppercase">No tasks</p>
            <p className="mt-2 text-sm text-soft-white/45">No tasks have been created for this project yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
