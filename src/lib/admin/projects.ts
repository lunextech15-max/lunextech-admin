// Server-only: reads the real project list from Supabase public.projects —
// admin-only, enforced by RLS (0008_projects.sql, gated on
// get_my_role() = 'admin'). Replaces the old MOCK_PROJECTS
// (projects-data.ts) hardcoded list. For the client-side write (create a
// project, add/remove a member), see projects-client.ts — same split as
// team.ts / team-client.ts.

import { createClient } from "@/lib/supabase/server";
import { getAllStaff } from "./team";
import type { ProjectStatus, ProjectTeamMember, StaffProject } from "@/lib/staff/types";

type ProjectRow = {
  code: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  objective: string;
  started_date: string | null;
  next_milestone: string;
  created_at: string;
};

type MemberRow = {
  project_code: string;
  staff_id: string;
  role_on_project: string | null;
};

export type ProjectsResult = {
  projects: StaffProject[];
  /** True if the query failed — callers should show this, not silently
   * treat a failed fetch as "no projects yet" (a real Supabase error and
   * an empty table look identical if you only check `.data`). */
  error: boolean;
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const chars = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return chars.join("") || "—";
}

function formatStarted(date: string | null): string {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function numberFromCode(code: string, index: number): string {
  const match = code.match(/(\d+)$/);
  return (match ? match[1] : String(index + 1)).padStart(2, "0");
}

function toStaffProject(
  row: ProjectRow,
  index: number,
  members: MemberRow[],
  staffById: Map<string, { full_name: string }>
): StaffProject {
  const team: ProjectTeamMember[] = members
    .filter((m) => m.project_code === row.code)
    .map((m) => {
      const staff = staffById.get(m.staff_id);
      const name = staff?.full_name ?? m.staff_id;
      return {
        id: m.staff_id,
        initials: initialsFrom(name),
        name,
        role: m.role_on_project ?? "—",
      };
    });

  return {
    id: row.code,
    code: row.code,
    slug: row.slug,
    number: numberFromCode(row.code, index),
    name: row.name,
    category: row.category,
    description: row.description,
    status: row.status,
    progress: row.progress,
    objective: row.objective,
    startedDate: formatStarted(row.started_date),
    team,
    // No real milestone or activity-log system exists yet — honestly
    // empty rather than carrying over the old mock demo entries.
    nextMilestone: row.next_milestone,
    activity: [],
    resources: [],
  };
}

/** Fetch every real project, newest first, with real member assignments. */
export async function getAllProjects(): Promise<ProjectsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProjects: projects query failed", error);
    return { projects: [], error: true };
  }

  const rows = (data ?? []) as ProjectRow[];
  const codes = rows.map((r) => r.code);

  const [{ data: memberRows, error: memberError }, { staff }] = await Promise.all([
    codes.length
      ? supabase.from("project_members").select("*").in("project_code", codes)
      : Promise.resolve({ data: [] as MemberRow[], error: null }),
    getAllStaff(),
  ]);

  if (memberError) {
    console.error("getAllProjects: project_members query failed", memberError);
  }

  const staffById = new Map(staff.map((s) => [s.staff_id, { full_name: s.full_name }]));
  const members = (memberRows ?? []) as MemberRow[];

  return {
    projects: rows.map((row, index) => toStaffProject(row, index, members, staffById)),
    error: false,
  };
}

/** One project for the detail/workspace page, by its code. */
export async function getProject(code: string): Promise<StaffProject | null> {
  const { projects } = await getAllProjects();
  return projects.find((p) => p.code === code) ?? null;
}

/** Next project code to suggest in the Create Project form ("PRJ-001",
 * "PRJ-002", ...) — purely a UI suggestion, the code itself is what
 * actually gets inserted. */
export async function getNextProjectCode(): Promise<string> {
  const { projects } = await getAllProjects();
  return `PRJ-${String(projects.length + 1).padStart(3, "0")}`;
}
