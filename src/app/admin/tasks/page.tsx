import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TasksContent from "@/components/admin/tasks/TasksContent";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { getAllAdminTasks } from "@/lib/admin/tasks-view";
import { MOCK_PROJECTS } from "@/lib/staff/projects-data";
import { getAllPeople } from "@/lib/admin/people-data";

export const metadata: Metadata = {
  title: "Tasks — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminTasksPage() {
  return (
    <AdminLayout active="tasks" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <Suspense fallback={null}>
        <TasksContent tasks={getAllAdminTasks()} projects={MOCK_PROJECTS} people={getAllPeople()} />
      </Suspense>
    </AdminLayout>
  );
}
