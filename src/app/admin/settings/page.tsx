import type { Metadata } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import ChangePasswordForm from "@/components/admin/settings/ChangePasswordForm";
import SignOutAllDevices from "@/components/admin/settings/SignOutAllDevices";
import { ADMIN_USER } from "@/lib/admin/mock-data";
import { getDisciplines } from "@/lib/staff/team-data";

const DEPARTMENTS = ["Product Development", "Design", "Engineering", "Operations", "Management"];
const STAFF_ROLES = ["Staff Member", "Project Manager", "Developer", "Designer", "Other"];
const PROJECT_CATEGORIES = ["Digital Experience", "AI × Product", "E-Commerce", "Internal Systems"];

export const metadata: Metadata = {
  title: "Settings — LUNEX TECH Admin",
  description: "Internal LUNEX TECH admin workspace.",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  const disciplines = getDisciplines();

  return (
    <AdminLayout active="settings" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
          09 <span className="text-accent">/ Settings</span>
        </p>
        <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          System
          <br />
          Settings.
        </h1>

        <section aria-labelledby="company-heading" className="mt-10">
          <h2 id="company-heading" className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
            Company
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 border border-line p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Company name</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">LUNEX TECH</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Tagline</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">Ideas + Technology + Real Growth</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="workspace-heading" className="mt-10">
          <h2 id="workspace-heading" className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
            Workspace settings
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 border border-line p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Departments</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-soft-white/70">
                {DEPARTMENTS.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Roles</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-soft-white/70">
                {STAFF_ROLES.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
                Project categories
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-soft-white/70">
                {PROJECT_CATEGORIES.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-soft-white/35">
            Disciplines currently in use across the team: {disciplines.join(", ")}.
          </p>
        </section>

        <section aria-labelledby="account-heading" className="mt-10">
          <h2 id="account-heading" className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
            Account settings
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 border border-line p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Name</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{ADMIN_USER.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Email</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{ADMIN_USER.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">Lunex ID</p>
              <p className="mt-1.5 text-sm font-medium text-soft-white">{ADMIN_USER.lunexId}</p>
            </div>
          </div>
          <div className="mt-4">
            <span
              className="dash-quick-action is-disabled inline-block text-xs font-medium tracking-[0.15em] uppercase"
              aria-disabled="true"
            >
              Update profile
            </span>
          </div>
        </section>

        <section aria-labelledby="security-heading" className="mt-10">
          <h2 id="security-heading" className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase">
            Security
          </h2>
          <div className="mt-4 border border-line p-6 sm:p-8">
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              Change admin password
            </p>
            <div className="mt-3">
              <ChangePasswordForm />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <span
              className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
              aria-disabled="true"
            >
              View active sessions
            </span>
            <SignOutAllDevices />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
