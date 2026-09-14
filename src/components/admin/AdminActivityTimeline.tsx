import type { AdminActivityEntry } from "@/lib/admin/types";

export default function AdminActivityTimeline({
  items,
  title = "Recent activity",
}: {
  items: AdminActivityEntry[];
  title?: string;
}) {
  return (
    <section aria-labelledby="admin-activity-heading" className="border border-line p-6 sm:p-8">
      <h2
        id="admin-activity-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        {title}
      </h2>

      {items.length > 0 ? (
        <ol className="mt-6">
          {items.map((item) => (
            <li key={item.id} className="dash-activity-item">
              <span
                className="dash-activity-dot"
                style={!item.important ? { background: "rgba(229,229,229,0.35)", boxShadow: "none" } : undefined}
                aria-hidden
              />
              <p className="text-[11px] font-medium tracking-[0.15em] text-soft-white/45 uppercase">
                {item.title}
              </p>
              <p className="text-sm text-soft-white">{item.description}</p>
              <p className="text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
                {item.relativeTime}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-6">
          <p className="text-sm font-semibold tracking-wide text-soft-white/70 uppercase">No activity yet</p>
          <p className="mt-2 text-sm text-soft-white/45">System activity will appear here.</p>
        </div>
      )}
    </section>
  );
}
