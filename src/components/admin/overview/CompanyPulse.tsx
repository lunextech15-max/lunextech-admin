import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";

export default function CompanyPulse({
  projectDelivery,
  taskCompletion,
  teamCapacity,
  internProgress,
}: {
  projectDelivery: number;
  taskCompletion: number;
  teamCapacity: number;
  internProgress: number;
}) {
  const items = [
    { label: "Project delivery", value: projectDelivery },
    { label: "Task completion", value: taskCompletion },
    { label: "Team capacity", value: teamCapacity },
    { label: "Intern progress", value: internProgress },
  ];

  return (
    <section aria-labelledby="company-pulse-heading" className="border border-line p-6 sm:p-8">
      <h2
        id="company-pulse-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Company pulse
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">{item.label}</p>
            <div className="mt-3 max-w-xs">
              <ProgressIndicator value={item.value} label={item.label} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
