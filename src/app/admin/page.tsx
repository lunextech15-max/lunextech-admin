import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOverviewContent from "@/components/admin/overview/AdminOverviewContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllProjects } from "@/lib/admin/projects";
import { getProjectMilestones } from "@/lib/admin/milestones";
import { getAllActivity } from "@/lib/admin/activity";
import { getAllApplications } from "@/lib/admin/real-applications";
import {
  getActiveProjectCount,
  getTeamMemberCount,
  getActiveInternCount,
  getOpenTaskCount,
  getOverdueTasks,
  getPendingApplicationsCount,
  getCompanyPulse,
} from "@/lib/admin/metrics";

export const metadata: Metadata = {
  title: "Command Center — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const identity = await getAdminIdentity();
  const { applications } = await getAllApplications();
  const { projects } = await getAllProjects();
  const [teamMembers, activeInterns, activeProjects, pulse, openTasks, overdueTasks, activity] = await Promise.all([
    getTeamMemberCount(),
    getActiveInternCount(),
    getActiveProjectCount(),
    getCompanyPulse(),
    getOpenTaskCount(),
    getOverdueTasks(),
    getAllActivity(6),
  ]);

  const milestonesByProject = await Promise.all(
    projects.map(async (project) => ({ project, milestones: await getProjectMilestones(project.code) }))
  );
  const inProgressEntry = milestonesByProject.find(({ milestones }) =>
    milestones.some((m) => m.status === "in-progress")
  );
  const milestoneProject = inProgressEntry?.project;
  const milestone = inProgressEntry?.milestones.find((m) => m.status === "in-progress");

  return (
    <AdminLayout active="overview" adminName={identity.name} adminInitials={identity.initials}>
      <AdminOverviewContent
        activeProjects={activeProjects}
        teamMembers={teamMembers}
        activeInterns={activeInterns}
        openTasks={openTasks}
        overdueTasks={overdueTasks}
        pendingApplications={getPendingApplicationsCount(applications)}
        milestoneProjectName={milestoneProject?.name ?? null}
        milestoneTitle={milestone?.title ?? null}
        milestoneSlug={milestoneProject?.slug ?? null}
        pulse={pulse}
        activity={activity}
      />
    </AdminLayout>
  );
}
