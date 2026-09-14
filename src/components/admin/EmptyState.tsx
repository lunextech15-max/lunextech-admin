import type { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-line p-8 text-center sm:p-12">
      <p className="text-sm font-semibold tracking-wide text-soft-white/70 uppercase">{title}</p>
      <p className="mt-2 text-sm text-soft-white/45">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
