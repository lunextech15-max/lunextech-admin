import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TasksContent from "@/components/admin/tasks/TasksContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllAdminTasks } from "@/lib/admin/tasks-view";
import { getAllProjects } from "@/lib/admin/projects";
import { getAllPeople } from "@/lib/admin/team";

export const metadata: Metadata = {
  title: "Tasks — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminTasksPage() {
  const identity = await getAdminIdentity();
  const { people } = await getAllPeople();
  const { projects } = await getAllProjects();
  const tasks = await getAllAdminTasks();

  return (
    <AdminLayout active="tasks" adminName={identity.name} adminInitials={identity.initials} staffId={identity.staffId}>
      <Suspense fallback={null}>
        <TasksContent tasks={tasks} projects={projects} people={people} actorStaffId={identity.lunexId} />
      </Suspense>
    </AdminLayout>
  );
}
