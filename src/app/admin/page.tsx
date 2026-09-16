import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOverviewContent from "@/components/admin/overview/AdminOverviewContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { getProjectMilestones } from "@/lib/admin/milestones-data";
import { MOCK_ADMIN_ACTIVITY } from "@/lib/admin/activity-data";
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

  const milestoneProject = MOCK_PROJECTS.find((project) =>
    getProjectMilestones(project.code).some((m) => m.status === "in-progress")
  );
  const milestone = milestoneProject
    ? getProjectMilestones(milestoneProject.code).find((m) => m.status === "in-progress")
    : undefined;

  return (
    <AdminLayout active="overview" adminName={identity.name} adminInitials={identity.initials}>
      <AdminOverviewContent
        activeProjects={getActiveProjectCount()}
        teamMembers={getTeamMemberCount()}
        activeInterns={getActiveInternCount()}
        openTasks={getOpenTaskCount()}
        overdueTasks={getOverdueTasks()}
        pendingApplications={getPendingApplicationsCount(applications)}
        milestoneProjectName={milestoneProject?.name ?? null}
        milestoneTitle={milestone?.title ?? null}
        milestoneSlug={milestoneProject?.slug ?? null}
        pulse={getCompanyPulse()}
        activity={MOCK_ADMIN_ACTIVITY}
      />
    </AdminLayout>
  );
}
