import Link from "next/link";
import type { PersonAccount } from "@/lib/admin/types";

export default function PeopleTable({ people }: { people: PersonAccount[] }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Joined</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.lunexId}>
              <td className="whitespace-nowrap font-display text-xs text-soft-white/60">{person.lunexId}</td>
              <td className="whitespace-nowrap">{person.name}</td>
              <td className="whitespace-nowrap text-[11px] font-medium tracking-[0.15em] text-accent uppercase">
                {person.role}
              </td>
              <td className="whitespace-nowrap text-soft-white/70">{person.department}</td>
              <td className="whitespace-nowrap">
                <span className={`dash-status ${person.status === "active" ? "dash-status--completed" : "dash-status--todo"}`}>
                  {person.status === "active" ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="whitespace-nowrap text-soft-white/50">{person.joinedDate}</td>
              <td className="whitespace-nowrap text-right">
                <Link href={`/admin/people/${person.lunexId}`} className="admin-table-link text-xs font-medium tracking-[0.15em] uppercase">
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
