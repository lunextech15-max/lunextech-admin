import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProgressIndicator from "@/components/staff/dashboard/ProgressIndicator";
import PersonActions from "@/components/admin/people/PersonActions";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { getPerson, getStaffMemberByLunexId, getInternByLunexId } from "@/lib/admin/people-data";
import { getMemberProjects, getActiveProjectCount as getStaffActiveProjectCount } from "@/lib/staff/team-data";
import { MOCK_TASKS } from "@/lib/staff/tasks-data";

export async function generateMetadata({ params }: PageProps<"/admin/people/[id]">): Promise<Metadata> {
  const { id } = await params;
  const person = getPerson(id);
  return {
    title: person ? `${person.name} — LUNEX TECH Admin` : "Person — LUNEX TECH Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminPersonDetailPage({ params }: PageProps<"/admin/people/[id]">) {
  const { id } = await params;
  const person = getPerson(id);
  if (!person) notFound();

  const staffMember = person.role === "staff" ? getStaffMemberByLunexId(id) : undefined;
  const intern = person.role === "intern" ? getInternByLunexId(id) : undefined;

  return (
    <AdminLayout active="people" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <Link href="/admin/people" className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase">
          ← All people
        </Link>

        <div className="mt-6 flex items-center gap-5">
          <span className="dash-avatar" style={{ width: 56, height: 56, fontSize: 16 }} aria-hidden>
            {person.initials}
          </span>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-accent uppercase">{person.lunexId}</p>
            <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-soft-white uppercase sm:text-3xl">
              {person.name}
            </h1>
            <p className="mt-1 text-[11px] font-medium tracking-[0.15em] text-soft-white/45 uppercase">
              {person.title}
            </p>
          </div>
          <span className={`dash-status ${person.status === "active" ? "dash-status--completed" : "dash-status--todo"} ml-2`}>
            {person.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        <section aria-labelledby="account-info-heading" className="mt-10">
          <h2
            id="account-info-heading"
            className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
          >
            Account information
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-5 border border-line p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Lunex ID</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{person.lunexId}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Email</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{person.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Role</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white uppercase">{person.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                {person.role === "staff" ? "Department" : "Internship"}
              </p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{person.department}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Joined</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{person.joinedDate}</p>
            </div>
          </div>
        </section>

        {staffMember && (
          <section aria-labelledby="staff-work-heading" className="mt-10">
            <h2
              id="staff-work-heading"
              className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
            >
              Work overview
            </h2>
            {(() => {
              const projects = getMemberProjects(staffMember);
              const tasks = MOCK_TASKS.filter((t) => t.assigneeId === staffMember.initials);
              const completed = tasks.filter((t) => t.status === "completed").length;
              const completion = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
              return (
                <>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="border border-line p-4">
                      <p className="font-display text-2xl font-black text-soft-white">
                        {String(getStaffActiveProjectCount(staffMember)).padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
                        Active projects
                      </p>
                    </div>
                    <div className="border border-line p-4">
                      <p className="font-display text-2xl font-black text-soft-white">
                        {String(tasks.length).padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
                        Assigned tasks
                      </p>
                    </div>
                    <div className="border border-line p-4">
                      <p className="font-display text-2xl font-black text-soft-white">
                        {String(completed).padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
                        Completed tasks
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 max-w-xs">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                      Task completion
                    </p>
                    <div className="mt-2">
                      <ProgressIndicator value={completion} label="Task completion" />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-line">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between gap-6 border-b border-line py-5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold tracking-wide text-soft-white/85 uppercase">
                            {project.name}
                          </p>
                          <div className="mt-2 max-w-[160px]">
                            <ProgressIndicator value={project.progress} label={`${project.name} progress`} />
                          </div>
                        </div>
                        <Link
                          href={`/admin/projects/${project.code}`}
                          className="dash-metric-link shrink-0 text-xs font-medium tracking-[0.15em] uppercase"
                        >
                          Open →
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </section>
        )}

        {intern && (
          <section aria-labelledby="intern-overview-heading" className="mt-10">
            <h2
              id="intern-overview-heading"
              className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
            >
              Internship overview
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-5 border border-line p-6 sm:grid-cols-4 sm:p-8">
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Supervisor</p>
                <p className="mt-1.5 text-sm font-medium text-soft-white">{person.supervisorName ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Start date</p>
                <p className="mt-1.5 text-sm font-medium text-soft-white">{intern.startDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">End date</p>
                <p className="mt-1.5 text-sm font-medium text-soft-white">{intern.endDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Progress</p>
                <div className="mt-2 max-w-[140px]">
                  <ProgressIndicator value={intern.progress} label="Internship progress" />
                </div>
              </div>
            </div>

            <h2 className="mt-8 text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
              Internship work
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="border border-line p-4">
                <p className="font-display text-2xl font-black text-soft-white">
                  {String(intern.activeProjects).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
                  Active projects
                </p>
              </div>
              <div className="border border-line p-4">
                <p className="font-display text-2xl font-black text-soft-white">
                  {String(intern.assignedTasks).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
                  Assigned tasks
                </p>
              </div>
              <div className="border border-line p-4">
                <p className="font-display text-2xl font-black text-soft-white">
                  {String(intern.completedTasks).padStart(2, "0")}
                </p>
                <p className="mt-2 text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
                  Completed tasks
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="mt-10">
          <PersonActions name={person.name} initialStatus={person.status} />
        </div>
      </div>
    </AdminLayout>
  );
}
