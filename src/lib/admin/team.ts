// Server-only: reads the real team roster from Supabase public.staff —
// admin-only, enforced by RLS (0007_team_profiles.sql, gated on
// get_my_role() = 'admin'). Replaces the old MOCK_TEAM (team-data.ts) /
// ADMIN_INTERNS (people-data.ts) hardcoded rosters. For the client-side
// write (create a profile, change status), see team-client.ts — same
// split as real-applications.ts / real-applications-client.ts.

import { createClient } from "@/lib/supabase/server";
import type { AccountRole, AccountStatus, PersonAccount } from "./types";

export type StaffRow = {
  staff_id: string;
  email: string;
  full_name: string;
  role: AccountRole;
  title: string | null;
  department: string | null;
  status: AccountStatus;
  internship_role: string | null;
  supervisor_staff_id: string | null;
  internship_start: string | null;
  internship_end: string | null;
  created_at: string;
};

export type StaffResult = {
  staff: StaffRow[];
  /** True if the query failed — callers should show this, not silently
   * treat a failed fetch as "nobody's on the roster" (a real Supabase
   * error and an empty table look identical if you only check `.data`). */
  error: boolean;
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const chars = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return chars.join("") || "—";
}

function formatJoined(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function defaultTitle(row: StaffRow): string {
  if (row.title) return row.title;
  if (row.role === "intern") return row.internship_role ? `${row.internship_role} Intern` : "Intern";
  if (row.role === "admin") return "Administrator";
  return "Staff Member";
}

function toPersonAccount(row: StaffRow, nameByStaffId: Map<string, string>): PersonAccount {
  const isIntern = row.role === "intern";
  return {
    lunexId: row.staff_id,
    name: row.full_name,
    initials: initialsFrom(row.full_name),
    email: row.email,
    role: row.role,
    title: defaultTitle(row),
    department: row.department ?? (isIntern ? row.internship_role ?? "—" : "—"),
    status: row.status,
    joinedDate: formatJoined(row.created_at),
    supervisorName: row.supervisor_staff_id ? nameByStaffId.get(row.supervisor_staff_id) : undefined,
    internshipStart: row.internship_start ?? undefined,
    internshipEnd: row.internship_end ?? undefined,
  };
}

/** Fetch every staff/admin/intern profile row, newest first. */
export async function getAllStaff(): Promise<StaffResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("getAllStaff: staff query failed", error);
  }

  return { staff: (data ?? []) as StaffRow[], error: Boolean(error) };
}

/** Fetch a single profile row by its staff_id (the "Lunex ID"). */
export async function getStaffById(staffId: string): Promise<StaffRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("staff").select("*").eq("staff_id", staffId).maybeSingle();

  if (error) {
    console.error(`getStaffById: query failed for ${staffId}`, error);
  }

  return (data as StaffRow | null) ?? null;
}

/** The People list, as PersonAccount rows (staff + admin + intern, unified). */
export async function getAllPeople(): Promise<{ people: PersonAccount[]; error: boolean }> {
  const { staff, error } = await getAllStaff();
  const nameByStaffId = new Map(staff.map((row) => [row.staff_id, row.full_name]));
  return { people: staff.map((row) => toPersonAccount(row, nameByStaffId)), error };
}

/** One person for the Person Detail page, by Lunex ID. */
export async function getPerson(staffId: string): Promise<PersonAccount | null> {
  const row = await getStaffById(staffId);
  if (!row) return null;

  const nameByStaffId = new Map<string, string>();
  if (row.supervisor_staff_id) {
    const supervisor = await getStaffById(row.supervisor_staff_id);
    if (supervisor) nameByStaffId.set(supervisor.staff_id, supervisor.full_name);
  }

  return toPersonAccount(row, nameByStaffId);
}

/** Staff/admin rows eligible to supervise an intern, for the picker in
 * CreateAccountModal and the projects/tasks assignee pickers. */
export async function getSupervisorOptions(): Promise<{ lunexId: string; name: string }[]> {
  const { staff } = await getAllStaff();
  return staff.filter((s) => s.role !== "intern").map((s) => ({ lunexId: s.staff_id, name: s.full_name }));
}

/** Next Lunex ID to suggest in the Create Account form, derived from how
 * many staff/admin (LX-xxx) vs intern (IN-xxx) rows already exist. Purely
 * a UI suggestion — the id itself is what actually gets inserted. */
export async function getNextStaffIds(): Promise<{ nextStaffId: string; nextInternId: string }> {
  const { staff } = await getAllStaff();
  const staffCount = staff.filter((s) => s.role !== "intern").length;
  const internCount = staff.filter((s) => s.role === "intern").length;
  return {
    nextStaffId: `LX-${String(staffCount + 1).padStart(3, "0")}`,
    nextInternId: `IN-${String(internCount + 1).padStart(3, "0")}`,
  };
}

/** Department names actually in use across the real roster (for Settings).
 * Empty until admins start filling in `department` on staff rows. */
export async function getDepartmentsInUse(): Promise<string[]> {
  const { staff } = await getAllStaff();
  return Array.from(new Set(staff.map((s) => s.department).filter((d): d is string => Boolean(d))));
}
