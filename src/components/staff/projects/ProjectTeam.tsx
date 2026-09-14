import type { ProjectTeamMember } from "@/lib/staff/types";

export default function ProjectTeam({ team }: { team: ProjectTeamMember[] }) {
  if (team.length === 0) {
    return <p className="text-sm text-soft-white/40">No team members assigned.</p>;
  }

  return (
    <div>
      {team.map((member) => (
        <div key={member.id} className="proj-team-member">
          <span className="dash-avatar" aria-hidden>
            {member.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-[0.05em] text-soft-white uppercase">
              {member.name}
            </p>
            <p className="truncate text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
              {member.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
