// Client-only: writes to public.staff (create a profile row, change its
// status). Kept in its own file — rather than team.ts — so client
// components importing it never pull in the server Supabase client's
// "next/headers" dependency. Same split as real-applications-client.ts.
//
// Important: there is no Supabase service-role key available to this app,
// so this can only ever create/update the `staff` profile row — never a
// real Supabase Auth login. Creating the login (email + password) is a
// separate manual step in Supabase Dashboard -> Authentication -> Users.

"use client";

import { createClient } from "@/lib/supabase/client";
import type { AccountRole, AccountStatus } from "./types";

export type NewStaffProfileInput = {
  staffId: string;
  fullName: string;
  email: string;
  role: AccountRole;
  title?: string;
  department?: string;
  internshipRole?: string;
  supervisorStaffId?: string;
  internshipStart?: string;
  internshipEnd?: string;
};

/** Admin-only, enforced by RLS ("admins can insert staff" in
 * 0007_team_profiles.sql). Inserts the profile row only — does not create
 * a login. */
export async function createStaffProfile(input: NewStaffProfileInput): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("staff").insert({
    staff_id: input.staffId,
    email: input.email,
    full_name: input.fullName,
    role: input.role,
    title: input.title || null,
    department: input.department || null,
    status: "active",
    internship_role: input.internshipRole || null,
    supervisor_staff_id: input.supervisorStaffId || null,
    internship_start: input.internshipStart || null,
    internship_end: input.internshipEnd || null,
  });

  return { error: error?.message ?? null };
}

/** Admin-only, enforced by RLS ("admins can update staff"). */
export async function updateStaffStatus(staffId: string, status: AccountStatus): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("staff").update({ status }).eq("staff_id", staffId);

  return { error: error?.message ?? null };
}
