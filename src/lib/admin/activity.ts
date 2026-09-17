// Server-only: reads real activity from Supabase public.activity_log —
// admin sees every entry, per RLS (0014_activity_log.sql, in the public
// repo's migrations).

import { createClient } from "@/lib/supabase/server";
import { getAllStaff } from "./team";
import type { AdminActivityCategory, AdminActivityEntry } from "./types";

type ActivityRow = {
  id: string;
  actor_staff_id: string;
  category: string;
  action: string;
  target_label: string;
  target_href: string | null;
  created_at: string;
};

function formatRelative(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function dayBucket(iso: string): "Today" | "Yesterday" | "Earlier" {
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}

function toCategory(raw: string): AdminActivityCategory {
  if (raw === "people" || raw === "projects" || raw === "tasks" || raw === "interns" || raw === "system") {
    return raw;
  }
  return "system";
}

export async function getAllActivity(limit = 100): Promise<AdminActivityEntry[]> {
  const supabase = await createClient();
  const [{ data, error }, { staff }] = await Promise.all([
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(limit),
    getAllStaff(),
  ]);

  if (error) {
    console.error("getAllActivity: query failed", error);
    return [];
  }

  const nameByStaffId = new Map(staff.map((s) => [s.staff_id, s.full_name]));
  const rows = (data ?? []) as ActivityRow[];

  return rows.map((row) => ({
    id: row.id,
    category: toCategory(row.category),
    title: row.action,
    description: `${nameByStaffId.get(row.actor_staff_id) ?? row.actor_staff_id} — ${row.target_label}`,
    relativeTime: formatRelative(row.created_at),
    day: dayBucket(row.created_at),
  }));
}
