export default function TaskOverview({ description }: { description: string[] }) {
  return (
    <section aria-labelledby="task-overview-heading">
      <h2 id="task-overview-heading" className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
        01 / Overview
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {description.map((paragraph, index) => (
          <p key={index} className="max-w-xl text-sm leading-relaxed text-soft-white/60">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
