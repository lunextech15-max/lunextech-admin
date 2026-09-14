"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import AdminSidebar, { type AdminNavId } from "./AdminSidebar";
import "@/styles/staff-dashboard.css";
import "@/styles/staff-projects.css";
import "@/styles/staff-tasks.css";
import "@/styles/staff-task-detail.css";
import "@/styles/staff-team.css";
import "@/styles/staff-announcements.css";
import "@/styles/staff-profile.css";
import "@/styles/admin.css";

export default function AdminLayout({
  active,
  adminName,
  adminInitials,
  children,
}: {
  active: AdminNavId;
  adminName: string;
  adminInitials: string;
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar dash-sidebar--desktop" aria-label="Admin Command Center">
        <AdminSidebar active={active} adminName={adminName} adminInitials={adminInitials} />
      </aside>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="dash-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        id="admin-mobile-nav"
        className={`dash-drawer bg-carbon-deep ${drawerOpen ? "is-open" : ""}`}
        aria-label="Admin Command Center"
        aria-hidden={!drawerOpen}
      >
        <AdminSidebar
          active={active}
          adminName={adminName}
          adminInitials={adminInitials}
          onNavigate={() => setDrawerOpen(false)}
        />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="dash-topbar">
          <Link href="/" className="dash-logo text-sm">
            LUNEX <span className="text-accent">TECH</span>
          </Link>
          <button
            type="button"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="admin-mobile-nav"
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-[1.5px] w-6 bg-soft-white transition-transform ${
                drawerOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-soft-white transition-transform ${
                drawerOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
