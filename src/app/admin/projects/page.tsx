import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectsContent from "@/components/admin/projects/ProjectsContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { getAllPeople } from "@/lib/admin/team";

export const metadata: Metadata = {
  title: "Projects — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const identity = await getAdminIdentity();
  const { people } = await getAllPeople();

  return (
    <AdminLayout active="projects" adminName={identity.name} adminInitials={identity.initials}>
      <Suspense fallback={null}>
        <ProjectsContent
          projects={MOCK_PROJECTS}
          staff={people.filter((p) => p.role === "staff" || p.role === "admin")}
          interns={people.filter((p) => p.role === "intern")}
        />
      </Suspense>
    </AdminLayout>
  );
}
