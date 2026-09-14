import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";
import ProjectTeam from "./ProjectTeam";
import ProjectInfoPanel from "./ProjectInfoPanel";
import type { StaffProject } from "@/lib/staff/types";

export default function ProjectOverview({ project }: { project: StaffProject }) {
  return (
    <div>
      <h2 className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">Project overview</h2>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Objective</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-soft-white/60">{project.objective}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              Current milestone
            </p>
            <p className="mt-3 text-sm font-medium text-soft-white">{project.nextMilestone}</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Progress</p>
            <div className="mt-3 max-w-[200px]">
              <ProgressIndicator value={project.progress} label={`${project.name} progress`} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Project team</p>
            <div className="mt-2">
              <ProjectTeam team={project.team} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProjectInfoPanel project={project} />
      </div>
    </div>
  );
}
