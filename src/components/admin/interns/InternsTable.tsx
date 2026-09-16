import Link from "next/link";
import type { PersonAccount } from "@/lib/admin/types";

export default function InternsTable({ interns }: { interns: PersonAccount[] }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Intern</th>
            <th>Role</th>
            <th>Supervisor</th>
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
                {intern.department}
              </td>
              <td className="whitespace-nowrap text-soft-white/70">{intern.supervisorName ?? "—"}</td>
              <td className="whitespace-nowrap text-soft-white/50">{intern.internshipEnd ?? "—"}</td>
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
