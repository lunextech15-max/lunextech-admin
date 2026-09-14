import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ApplicationActions from "@/components/admin/applications/ApplicationActions";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { MOCK_APPLICATIONS } from "@/lib/admin/applications-data";

export function generateStaticParams() {
  return MOCK_APPLICATIONS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/admin/applications/[id]">): Promise<Metadata> {
  const { id } = await params;
  const application = MOCK_APPLICATIONS.find((a) => a.id === id);
  return {
    title: application ? `${application.applicantLabel} — LUNEX TECH Admin` : "Application — LUNEX TECH Admin",
    robots: { index: false, follow: false },
  };
}

export default async function AdminApplicationDetailPage({ params }: PageProps<"/admin/applications/[id]">) {
  const { id } = await params;
  const application = MOCK_APPLICATIONS.find((a) => a.id === id);
  if (!application) notFound();

  return (
    <AdminLayout active="applications" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <Link
          href="/admin/applications"
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
        >
          ← All applications
        </Link>

        <p className="mt-6 text-[10px] font-medium tracking-[0.2em] text-accent uppercase">{application.role}</p>
        <h1 className="mt-2 font-display text-[9vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          {application.applicantLabel}
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
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.applicantLabel}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Email</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Phone</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.phone}</p>
            </div>
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
                Internship role
              </p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{application.role}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                Why they want to join
              </p>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-soft-white/60">{application.whyJoin}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Skills</p>
              <p className="mt-1.5 text-sm text-soft-white/70">{application.skills.join(", ")}</p>
            </div>
            {application.portfolioUrl && (
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Portfolio</p>
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dash-metric-link mt-1.5 inline-block text-sm"
                >
                  {application.portfolioUrl}
                </a>
              </div>
            )}
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Resume</p>
              <p className="mt-1.5 text-sm text-soft-white/60">{application.resumeNote}</p>
            </div>
          </div>
        </section>

        <ApplicationActions
          initialStatus={application.status}
          applicantLabel={application.applicantLabel}
          email={application.email}
          internshipRole={application.role}
        />
      </div>
    </AdminLayout>
  );
}
