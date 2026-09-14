import type { TeamMember } from "@/lib/staff/types";

export default function TeamAvatars({ team }: { team: TeamMember[] }) {
  if (team.length === 0) {
    return <p className="text-sm text-soft-white/40">Unassigned</p>;
  }

  return (
    <div className="flex -space-x-1.5">
      {team.map((member) => (
        <span key={member.id} className="dash-team-avatar" title={member.initials}>
          {member.initials}
        </span>
      ))}
    </div>
  );
}
