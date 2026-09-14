import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { ADMIN_USER } from "@/lib/admin/mock-data";

export default function AdminProjectNotFound() {
  return (
    <AdminLayout active="projects" adminName={ADMIN_USER.name} adminInitials={ADMIN_USER.initials}>
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
          03 <span className="text-accent">/ Projects</span>
        </p>
        <h1 className="mt-6 font-display text-3xl font-black tracking-tight text-soft-white uppercase">
          Project not found.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-soft-white/50">
          The requested project does not exist.
        </p>
        <Link
          href="/admin/projects"
          className="dash-metric-link mt-6 inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase"
        >
          ← Back to projects
        </Link>
      </div>
    </AdminLayout>
  );
}
