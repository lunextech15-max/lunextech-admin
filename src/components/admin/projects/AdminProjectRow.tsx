import Link from "next/link";
import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";
import TeamAvatars from "@/components/staff/dashboard/TeamAvatars";
import type { StaffProject } from "@/lib/staff/types";

const STATUS_LABEL: Record<StaffProject["status"], string> = {
  planning: "Planning",
  "in-progress": "In progress",
  review: "Review",
  completed: "Completed",
  archived: "Archived",
};

export default function AdminProjectRow({ project }: { project: StaffProject }) {
  return (
    <Link href={`/admin/projects/${project.code}`} className="proj-row group">
      <div>
        <span className="font-display text-xs text-soft-white/30">{project.number}</span>
        <h3 className="proj-row-title mt-2 font-display text-xl font-black tracking-tight text-soft-white/85 sm:text-2xl">
          {project.name}
        </h3>
        <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-accent uppercase">{project.category}</p>
      </div>

      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Status</p>
        <span className={`dash-status dash-status--${project.status} mt-2`}>{STATUS_LABEL[project.status]}</span>

        <p className="mt-4 text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Progress</p>
        <div className="mt-2 max-w-[160px]">
          <ProgressIndicator value={project.progress} label={`${project.name} progress`} />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Team</p>
        <div className="mt-2">
          <TeamAvatars team={project.team} />
        </div>

        <p className="mt-4 text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
          Next milestone
        </p>
        <p className="mt-2 text-sm font-medium text-soft-white/80">{project.nextMilestone}</p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-soft-white/70 uppercase lg:justify-end">
        Open
        <span className="proj-row-arrow" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
