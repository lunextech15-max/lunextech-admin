import type { Task } from "@/lib/staff/types";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskDetailsPanel({ task }: { task: Task }) {
  const fields = [
    { label: "Task ID", value: task.id },
    { label: "Assigned to", value: task.assigneeName },
    { label: "Project", value: task.projectName },
    { label: "Created", value: formatDate(task.createdAt) },
    { label: "Last updated", value: formatDate(task.updatedAt) },
    { label: "Due date", value: formatDate(task.dueDate) },
  ];

  return (
    <section aria-labelledby="task-details-heading">
      <h2 id="task-details-heading" className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
        04 / Task details
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">{field.label}</p>
            <p className="mt-1.5 text-sm font-medium text-soft-white/80">{field.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
