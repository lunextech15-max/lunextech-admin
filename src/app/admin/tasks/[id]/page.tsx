import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import TaskWorkspace from "@/components/staff/tasks/TaskWorkspace";
import InternTaskWorkspace from "@/components/intern/tasks/InternTaskWorkspace";
import AdminTaskMeta from "@/components/admin/tasks/AdminTaskMeta";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getRealTask } from "@/lib/admin/tasks";
import { getProject } from "@/lib/admin/projects";
import { INTERN_TASKS } from "@/lib/intern/mock-data";

export async function generateMetadata({ params }: PageProps<"/admin/tasks/[id]">): Promise<Metadata> {
  const { id } = await params;
  const task = (await getRealTask(id)) ?? INTERN_TASKS.find((t) => t.id === id);
  return {
    title: task ? `${task.title} — LUNEX TECH Admin` : "Task — LUNEX TECH Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminTaskDetailPage({ params }: PageProps<"/admin/tasks/[id]">) {
  const identity = await getAdminIdentity();

  const { id } = await params;
  const staffTask = await getRealTask(id);
  const internTask = staffTask ? undefined : INTERN_TASKS.find((t) => t.id === id);
  if (!staffTask && !internTask) notFound();

  const project = staffTask?.projectId ? await getProject(staffTask.projectId) : undefined;

  return (
    <AdminLayout active="tasks" adminName={identity.name} adminInitials={identity.initials}>
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

        {staffTask ? (
          <TaskWorkspace task={staffTask} viewer={{ staffId: identity.lunexId, name: identity.name }} />
        ) : internTask ? (
          <InternTaskWorkspace task={internTask} />
        ) : null}

        <AdminTaskMeta taskTitle={(staffTask ?? internTask)!.title} />
      </div>
    </AdminLayout>
  );
}
