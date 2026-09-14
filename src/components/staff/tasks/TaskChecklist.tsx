import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";
import type { ChecklistItem } from "@/lib/staff/types";

export default function TaskChecklist({
  items,
  onToggle,
  title = "02 / Checklist",
}: {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  title?: string;
}) {
  const completed = items.filter((item) => item.completed).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  return (
    <section aria-labelledby="task-checklist-heading">
      <div className="flex items-baseline justify-between">
        <h2
          id="task-checklist-heading"
          className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
        >
          {title}
        </h2>
        <span className="text-[11px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
          {completed} / {items.length} completed
        </span>
      </div>

      {items.length > 0 && (
        <div className="mt-4 max-w-xs">
          <ProgressIndicator value={progress} label="Checklist progress" />
        </div>
      )}

      {items.length > 0 ? (
        <div className="mt-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="checkbox"
              aria-checked={item.completed}
              onClick={() => onToggle(item.id)}
              className="task-checklist-item"
            >
              <span className="task-checklist-mark" aria-hidden>
                ✓
              </span>
              <span className="task-checklist-label text-sm text-soft-white">{item.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-soft-white/45">No checklist items for this task.</p>
      )}
    </section>
  );
}
