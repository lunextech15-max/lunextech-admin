import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TasksContent from "@/components/admin/tasks/TasksContent";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getAllAdminTasks } from "@/lib/admin/tasks-view";
import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { getAllPeople } from "@/lib/admin/people-data";

export const metadata: Metadata = {
  title: "Tasks — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default async function AdminTasksPage() {
  const identity = await getAdminIdentity();

  return (
    <AdminLayout active="tasks" adminName={identity.name} adminInitials={identity.initials}>
      <Suspense fallback={null}>
        <TasksContent tasks={getAllAdminTasks()} projects={MOCK_PROJECTS} people={getAllPeople()} />
      </Suspense>
    </AdminLayout>
  );
}
