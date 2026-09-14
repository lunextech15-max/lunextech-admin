import type { StaffProject } from "@/lib/staff/types";

const STATUS_LABEL: Record<StaffProject["status"], string> = {
  planning: "Planning",
  "in-progress": "In progress",
  review: "Review",
  completed: "Completed",
  archived: "Archived",
};

export default function ProjectInfoPanel({ project }: { project: StaffProject }) {
  const fields = [
    { label: "Project ID", value: project.code },
    { label: "Category", value: project.category },
    { label: "Status", value: STATUS_LABEL[project.status] },
    { label: "Started", value: project.startedDate },
    { label: "Next milestone", value: project.nextMilestone },
  ];

  return (
    <div className="proj-info-grid border-t border-line pt-6">
      {fields.map((field) => (
        <div key={field.label}>
          <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">{field.label}</p>
          <p className="mt-2 text-sm font-medium text-soft-white/80">{field.value}</p>
        </div>
      ))}
    </div>
  );
}
