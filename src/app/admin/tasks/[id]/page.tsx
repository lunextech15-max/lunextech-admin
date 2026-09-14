import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import TaskWorkspace from "@/components/staff/tasks/TaskWorkspace";
import InternTaskWorkspace from "@/components/intern/tasks/InternTaskWorkspace";
import AdminTaskMeta from "@/components/admin/tasks/AdminTaskMeta";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { MOCK_TASKS } from "@/lib/staff/tasks-data";
import { INTERN_TASKS } from "@/lib/intern/mock-data";
import { MOCK_PROJECTS } from "@/lib/staff/projects-data";

export function generateStaticParams() {
  return [...MOCK_TASKS.map((t) => ({ id: t.id })), ...INTERN_TASKS.map((t) => ({ id: t.id }))];
}

export async function generateMetadata({ params }: PageProps<"/admin/tasks/[id]">): Promise<Metadata> {
  const { id } = await params;
  const task = MOCK_TASKS.find((t) => t.id === id) ?? INTERN_TASKS.find((t) => t.id === id);
  return {
    title: task ? `${task.title} — LUNEX TECH Admin` : "Task — LUNEX TECH Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminTaskDetailPage({ params }: PageProps<"/admin/tasks/[id]">) {
  const { id } = await params;
  const staffTask = MOCK_TASKS.find((t) => t.id === id);
  const internTask = staffTask ? undefined : INTERN_TASKS.find((t) => t.id === id);
  if (!staffTask && !internTask) notFound();

  const project = staffTask ? MOCK_PROJECTS.find((p) => p.code === staffTask.projectId) : undefined;

  return (
    <AdminLayout active="tasks" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <Link href="/admin/tasks" className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase">
          ← All tasks
        </Link>

        <p className="mt-6 text-[10px] font-medium tracking-[0.2em] text-accent uppercase">
          {staffTask?.projectName ?? internTask?.project}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-[9vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            {staffTask?.title ?? internTask?.title}
          </h1>
          {project && (
            <Link
              href={`/admin/projects/${project.code}`}
              className="dash-metric-link text-[11px] font-medium tracking-[0.15em] uppercase"
            >
              View project →
            </Link>
          )}
        </div>

        {staffTask ? <TaskWorkspace task={staffTask} /> : internTask ? <InternTaskWorkspace task={internTask} /> : null}

        <AdminTaskMeta taskTitle={(staffTask ?? internTask)!.title} />
      </div>
    </AdminLayout>
  );
}
