import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";
import AdminProjectWorkspace from "@/components/admin/projects/AdminProjectWorkspace";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { getProjectMilestones } from "@/lib/admin/milestones-data";

export function generateStaticParams() {
  return MOCK_PROJECTS.map((project) => ({ id: project.code }));
}

export async function generateMetadata({ params }: PageProps<"/admin/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = MOCK_PROJECTS.find((p) => p.code === id);
  return {
    title: project ? `${project.name} — LUNEX TECH Admin` : "Project — LUNEX TECH Admin",
    robots: { index: false, follow: false },
  };
}

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  "in-progress": "In progress",
  review: "Review",
  completed: "Completed",
  archived: "Archived",
};

export default async function AdminProjectDetailPage({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const project = MOCK_PROJECTS.find((p) => p.code === id);
  if (!project) notFound();

  return (
    <AdminLayout active="projects" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <Link href="/admin/projects" className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase">
          ← All projects
        </Link>

        <p className="mt-6 text-[10px] font-medium tracking-[0.2em] text-accent uppercase">{project.category}</p>
        <h1 className="mt-2 font-display text-[9vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          {project.name}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-soft-white/55">{project.description}</p>

        <div className="mt-8 grid grid-cols-1 gap-6 border border-line p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Status</p>
            <span className={`dash-status dash-status--${project.status} mt-2`}>{STATUS_LABEL[project.status]}</span>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Progress</p>
            <div className="mt-2 max-w-[200px]">
              <ProgressIndicator value={project.progress} label={`${project.name} progress`} />
            </div>
          </div>
        </div>

        <AdminProjectWorkspace project={project} milestones={getProjectMilestones(project.code)} />
      </div>
    </AdminLayout>
  );
}
