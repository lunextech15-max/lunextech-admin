import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ApplicationActions from "@/components/admin/applications/ApplicationActions";
import { getAdminIdentity } from "@/lib/admin/identity";
import { getApplicationById } from "@/lib/admin/real-applications";
import { safeHref } from "@/lib/admin/application-types";

export async function generateMetadata({ params }: PageProps<"/admin/applications/[id]">): Promise<Metadata> {
  const { id } = await params;
  const application = await getApplicationById(decodeURIComponent(id));
  return {
    title: application ? `${application.name} — LUNEX TECH Admin` : "Application — LUNEX TECH Admin",
    robots: { index: false, follow: false },
  };
}

const KIND_LABEL = { internship: "Internship application", job: "Job application" } as const;

export default async function AdminApplicationDetailPage({ params }: PageProps<"/admin/applications/[id]">) {
  const identity = await getAdminIdentity();

  const { id } = await params;
  const application = await getApplicationById(decodeURIComponent(id));
  if (!application) notFound();

  return (
    <AdminLayout active="applications" adminName={identity.name} adminInitials={identity.initials} staffId={identity.staffId}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <Link
          href="/admin/applications"
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
        >
          ← All applications
        </Link>

        <p className="mt-6 text-[10px] font-medium tracking-[0.2em] text-accent uppercase">
          {KIND_LABEL[application.kind]} · {application.roleLabel}
        </p>
        <h1 className="mt-2 font-display text-[9vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          {application.name}
        </h1>

        <section aria-labelledby="applicant-info-heading" className="mt-8">
          <h2
            id="applicant-info-heading"
            className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
          >
            Applicant information
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-5 border border-line p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Name</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Email</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Phone</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.phone || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Location</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.location || "—"}</p>
            </div>
            {application.kind === "internship" ? (
              <>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Education</p>
                  <p className="mt-1.5 text-sm font-medium text-soft-white">
                    {application.education || "—"}
                    {application.fieldOfStudy ? ` · ${application.fieldOfStudy}` : ""}
                  </p>
                </div>
                {application.year && (
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Year</p>
                    <p className="mt-1.5 text-sm font-medium text-soft-white">{application.year}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {application.currentPosition && (
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                      Current role
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-soft-white">{application.currentPosition}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                    Experience level
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-soft-white">{application.experienceLevel || "—"}</p>
                </div>
              </>
            )}
          </div>
        </section>

        <section aria-labelledby="application-heading" className="mt-8">
          <h2
            id="application-heading"
            className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
          >
            Application
          </h2>
          <div className="mt-4 flex flex-col gap-6 border border-line p-6 sm:p-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                {application.kind === "internship" ? "Program" : "Role"}
              </p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.roleLabel}</p>
            </div>

            {application.kind === "internship" && application.learningGoals && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                  What they want to learn
                </p>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-soft-white/60">
                  {application.learningGoals}
                </p>
              </div>
            )}

            {application.kind === "job" && application.experience && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Experience</p>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-soft-white/60">{application.experience}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                {application.kind === "internship" ? "Why they want to join" : "Why LUNEX TECH"}
              </p>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-soft-white/60">{application.motivation}</p>
            </div>

            {application.skills && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Skills</p>
                <p className="mt-1.5 text-sm text-soft-white/70">{application.skills}</p>
              </div>
            )}

            {application.portfolio && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Portfolio</p>
                {safeHref(application.portfolio) ? (
                  <a
                    href={safeHref(application.portfolio)!}
                    target="_blank"
                    rel="noreferrer"
                    className="dash-metric-link mt-1.5 inline-block text-sm"
                  >
                    {application.portfolio}
                  </a>
                ) : (
                  <p className="mt-1.5 text-sm text-soft-white/70">{application.portfolio}</p>
                )}
              </div>
            )}

            {application.github && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">GitHub</p>
                {safeHref(application.github) ? (
                  <a
                    href={safeHref(application.github)!}
                    target="_blank"
                    rel="noreferrer"
                    className="dash-metric-link mt-1.5 inline-block text-sm"
                  >
                    {application.github}
                  </a>
                ) : (
                  <p className="mt-1.5 text-sm text-soft-white/70">{application.github}</p>
                )}
              </div>
            )}

            {application.linkedin && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">LinkedIn</p>
                {safeHref(application.linkedin) ? (
                  <a
                    href={safeHref(application.linkedin)!}
                    target="_blank"
                    rel="noreferrer"
                    className="dash-metric-link mt-1.5 inline-block text-sm"
                  >
                    {application.linkedin}
                  </a>
                ) : (
                  <p className="mt-1.5 text-sm text-soft-white/70">{application.linkedin}</p>
                )}
              </div>
            )}

            {application.kind === "job" && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Resume</p>
                <p className="mt-1.5 text-sm text-soft-white/60">
                  {application.resumeFileName || "No resume uploaded."}
                </p>
              </div>
            )}
          </div>
        </section>

        <ApplicationActions
          id={application.id}
          initialStatus={application.status}
          kind={application.kind}
          name={application.name}
          email={application.email}
          roleLabel={application.roleLabel}
        />
      </div>
    </AdminLayout>
  );
}
