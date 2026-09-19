import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectsContent from "@/components/admin/projects/ProjectsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllProjects, getNextProjectCode } from "@/lib/admin/projects";
import { getAllPeople } from "@/lib/admin/team";

export const metadata: Metadata = {
  title: "Projects — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const identity = await getAdminIdentity();
  const [{ people }, { projects, error }, nextProjectCode] = await Promise.all([
    getAllPeople(),
    getAllProjects(),
    getNextProjectCode(),
  ]);

  return (
    <AdminLayout active="projects" adminName={identity.name} adminInitials={identity.initials} staffId={identity.staffId}>
      <Suspense fallback={null}>
        <ProjectsContent
          projects={projects}
          loadError={error}
          nextProjectCode={nextProjectCode}
          staff={people.filter((p) => p.role === "staff" || p.role === "admin")}
          interns={people.filter((p) => p.role === "intern")}
          actorStaffId={identity.lunexId}
        />
      </Suspense>
    </AdminLayout>
  );
}
