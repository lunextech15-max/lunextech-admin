import Link from "next/link";
import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";
import type { AdminIntern } from "@/lib/admin/people-data";

export default function InternsTable({
  interns,
  supervisorName,
}: {
  interns: AdminIntern[];
  supervisorName: (lunexId: string) => string;
}) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Intern</th>
            <th>Role</th>
            <th>Supervisor</th>
            <th>Progress</th>
            <th>Tasks</th>
            <th>End date</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {interns.map((intern) => (
            <tr key={intern.lunexId}>
              <td className="whitespace-nowrap">
                <span className="font-display text-xs text-soft-white/50">{intern.lunexId}</span>
                <span className="ml-2">{intern.name}</span>
              </td>
              <td className="whitespace-nowrap text-[11px] font-medium tracking-[0.15em] text-accent uppercase">
                {intern.internshipRole}
              </td>
              <td className="whitespace-nowrap text-soft-white/70">{supervisorName(intern.supervisorLunexId)}</td>
              <td className="min-w-[140px]">
                <ProgressIndicator value={intern.progress} label={`${intern.name} progress`} />
              </td>
              <td className="whitespace-nowrap text-soft-white/70">
                {intern.completedTasks} / {intern.assignedTasks}
              </td>
              <td className="whitespace-nowrap text-soft-white/50">{intern.endDate}</td>
              <td className="whitespace-nowrap">
                <span className={`dash-status ${intern.status === "active" ? "dash-status--completed" : "dash-status--todo"}`}>
                  {intern.status === "active" ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="whitespace-nowrap text-right">
                <Link
                  href={`/admin/people/${intern.lunexId}`}
                  className="admin-table-link text-xs font-medium tracking-[0.15em] uppercase"
                >
                  Open →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
