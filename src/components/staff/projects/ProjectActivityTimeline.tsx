import type { ProjectActivityEntry } from "@/lib/staff/types";

export default function ProjectActivityTimeline({
  activity,
  title = "Project activity",
}: {
  activity: ProjectActivityEntry[];
  title?: string;
}) {
  return (
    <div>
      <h2 className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">{title}</h2>

      {activity.length > 0 ? (
        <ol className="mt-6">
          {activity.map((entry) => (
            <li key={entry.id} className="dash-activity-item">
              <span className="dash-activity-dot" aria-hidden />
              <p className="text-[11px] font-medium tracking-[0.15em] text-soft-white/45 uppercase">
                {entry.title}
              </p>
              <p className="text-sm text-soft-white">{entry.description}</p>
              <p className="text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
                {entry.user ? `${entry.user} · ` : ""}
                {entry.relativeTime}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-6">
          <p className="text-sm font-semibold tracking-wide text-soft-white/70 uppercase">No activity yet</p>
          <p className="mt-2 text-sm text-soft-white/45">Activity will appear here as work happens.</p>
        </div>
      )}
    </div>
  );
}
