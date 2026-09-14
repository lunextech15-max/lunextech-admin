"use client";

import { useEffect, useState } from "react";
import MetricBlock from "@/components/staff/dashboard/MetricBlock";
import NeedsAttention from "./NeedsAttention";
import CompanyPulse from "./CompanyPulse";
import QuickCommands from "./QuickCommands";
import AdminActivityTimeline from "@/components/admin/AdminActivityTimeline";
import type { Task } from "@/lib/staff/types";
import type { AdminActivityEntry } from "@/lib/admin/types";

function loadOverview(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

export default function AdminOverviewContent({
  activeProjects,
  teamMembers,
  activeInterns,
  openTasks,
  overdueTasks,
  pendingApplications,
  milestoneProjectName,
  milestoneTitle,
  milestoneSlug,
  pulse,
  activity,
}: {
  activeProjects: number;
  teamMembers: number;
  activeInterns: number;
  openTasks: number;
  overdueTasks: Task[];
  pendingApplications: number;
  milestoneProjectName: string | null;
  milestoneTitle: string | null;
  milestoneSlug: string | null;
  pulse: { projectDelivery: number; taskCompletion: number; teamCapacity: number; internProgress: number };
  activity: AdminActivityEntry[];
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadOverview().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="dash-skeleton h-4 w-40" />
        <div className="dash-skeleton mt-4 h-10 w-72" />
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="dash-skeleton h-24" />
          <div className="dash-skeleton h-24" />
          <div className="dash-skeleton h-24" />
          <div className="dash-skeleton h-24" />
        </div>
        <div className="dash-skeleton mt-6 h-40" />
        <div className="dash-skeleton mt-6 h-56" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade">
        <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
          01 <span className="text-accent">/ Command center</span>
        </p>
        <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
          Command
          <br />
          Center.
        </h1>
        <p className="mt-3 text-sm text-soft-white/50 sm:text-base">Operational overview of LUNEX TECH.</p>
      </div>

      <div className="dash-fade mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4" style={{ animationDelay: "0.06s" }}>
        <MetricBlock label="Active projects" value={String(activeProjects).padStart(2, "0")} ctaLabel="View projects" ctaHref="/admin/projects" />
        <MetricBlock label="Team members" value={String(teamMembers).padStart(2, "0")} ctaLabel="View people" ctaHref="/admin/people" />
        <MetricBlock label="Active interns" value={String(activeInterns).padStart(2, "0")} ctaLabel="View interns" ctaHref="/admin/interns" />
        <MetricBlock label="Open tasks" value={String(openTasks).padStart(2, "0")} ctaLabel="View tasks" ctaHref="/admin/tasks" />
      </div>

      <div className="dash-fade mt-6" style={{ animationDelay: "0.12s" }}>
        <NeedsAttention
          overdueTasks={overdueTasks}
          pendingApplications={pendingApplications}
          milestoneProjectName={milestoneProjectName}
          milestoneTitle={milestoneTitle}
          milestoneSlug={milestoneSlug}
        />
      </div>

      <div className="dash-fade mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ animationDelay: "0.18s" }}>
        <div className="lg:col-span-2">
          <CompanyPulse {...pulse} />
        </div>
        <QuickCommands />
      </div>

      <div className="dash-fade mt-6" style={{ animationDelay: "0.24s" }}>
        <AdminActivityTimeline items={activity.slice(0, 5)} />
      </div>
    </div>
  );
}
