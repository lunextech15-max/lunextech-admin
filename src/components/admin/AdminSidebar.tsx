import Link from "next/link";
import SignOutButton from "@/components/staff/SignOutButton";

export type AdminNavId =
  | "overview"
  | "people"
  | "projects"
  | "tasks"
  | "interns"
  | "applications"
  | "announcements"
  | "activity"
  | "settings";

type NavItem = {
  id: AdminNavId;
  number: string;
  label: string;
  href: string;
};

const MAIN_NAV: NavItem[] = [
  { id: "overview", number: "01", label: "Overview", href: "/admin" },
  { id: "people", number: "02", label: "People", href: "/admin/people" },
  { id: "projects", number: "03", label: "Projects", href: "/admin/projects" },
  { id: "tasks", number: "04", label: "Tasks", href: "/admin/tasks" },
  { id: "interns", number: "05", label: "Interns", href: "/admin/interns" },
  { id: "applications", number: "06", label: "Applications", href: "/admin/applications" },
  { id: "announcements", number: "07", label: "Announcements", href: "/admin/announcements" },
  { id: "activity", number: "08", label: "Activity", href: "/admin/activity" },
];

const SETTINGS_NAV: NavItem = { id: "settings", number: "09", label: "Settings", href: "/admin/settings" };

export default function AdminSidebar({
  active,
  adminName,
  adminInitials,
  onNavigate,
}: {
  active: AdminNavId;
  adminName: string;
  adminInitials: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-carbon-deep">
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/" className="dash-logo text-sm">
          LUNEX <span className="text-accent">TECH</span>
        </Link>
      </div>
      <div className="px-6 pb-6">
        <p className="text-[10px] font-medium tracking-[0.3em] text-soft-white/35 uppercase">Admin command</p>
        <p className="dash-status-indicator mt-2 text-[10px] font-medium tracking-[0.2em] uppercase">
          <span aria-hidden>●</span> Founder access
        </p>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1 pt-2">
        {MAIN_NAV.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            aria-current={item.id === active ? "page" : undefined}
            className={`dash-nav-item ${item.id === active ? "is-active" : ""}`}
          >
            <span className="dash-nav-num">{item.number}</span>
            {item.label}
          </Link>
        ))}

        <div className="mx-6 my-3 border-t border-line" aria-hidden />

        <Link
          href={SETTINGS_NAV.href}
          onClick={onNavigate}
          aria-current={SETTINGS_NAV.id === active ? "page" : undefined}
          className={`dash-nav-item ${SETTINGS_NAV.id === active ? "is-active" : ""}`}
        >
          <span className="dash-nav-num">{SETTINGS_NAV.number}</span>
          {SETTINGS_NAV.label}
        </Link>
      </nav>

      <div className="border-t border-line px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="dash-avatar" aria-hidden>
            {adminInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold tracking-[0.05em] text-soft-white uppercase">
              {adminName}
            </p>
            <p className="text-[10px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
              Founder &amp; admin
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Link
            href="/admin/settings"
            className="dash-signout inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase"
          >
            Profile
            <span aria-hidden>→</span>
          </Link>
          <SignOutButton className="dash-signout inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase disabled:opacity-50" />
        </div>
      </div>
    </div>
  );
}
