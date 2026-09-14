// Single assignee for now — the layout is a plain list so a future
// multiple-assignee task can render more than one of these without change.
export default function TaskAssignee({
  initials,
  name,
}: {
  initials: string;
  name: string;
}) {
  return (
    <section aria-labelledby="task-assignee-heading">
      <h2
        id="task-assignee-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Assignee
      </h2>
      <div className="task-assignee mt-4">
        <span className="dash-avatar" aria-hidden>
          {initials}
        </span>
        <div>
          <p className="text-xs font-semibold tracking-[0.05em] text-soft-white uppercase">{name}</p>
          <p className="text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">Staff member</p>
        </div>
      </div>
    </section>
  );
}
