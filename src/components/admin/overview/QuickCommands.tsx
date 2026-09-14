import Link from "next/link";

const COMMANDS = [
  { label: "Create project", href: "/admin/projects?new=1" },
  { label: "Create account", href: "/admin/people?new=1" },
  { label: "Create task", href: "/admin/tasks?new=1" },
  { label: "Publish announcement", href: "/admin/announcements?new=1" },
];

export default function QuickCommands() {
  return (
    <section aria-labelledby="quick-commands-heading" className="border border-line p-6 sm:p-8">
      <h2
        id="quick-commands-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Quick commands
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {COMMANDS.map((command) => (
          <Link
            key={command.label}
            href={command.href}
            className="dash-quick-action flex items-center justify-between text-xs font-medium tracking-[0.15em] uppercase"
          >
            <span>
              <span aria-hidden className="mr-2 text-accent/70">
                +
              </span>
              {command.label}
            </span>
            <span aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
