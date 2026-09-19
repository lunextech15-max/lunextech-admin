"use server";

// Creates a REAL Supabase Auth login (email + password) plus the matching
// public.staff profile row, in one action — using the service-role key
// (admin.ts), which is why this must run server-side and re-verify the
// caller is an admin itself (requireAdmin) before touching anything, since
// a Server Action is a directly callable endpoint, not just page-gated UI.
//
// Replaces the old flow where CreateAccountModal could only insert the
// profile row and told the admin to create the login manually in Supabase
// Dashboard — that manual step is no longer needed once
// SUPABASE_SERVICE_ROLE_KEY is set.

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./require-admin";
import { createNotification } from "@/lib/notifications/create-server";
import type { AccountRole } from "./types";

export type CreateAccountInput = {
  staffId: string;
  fullName: string;
  email: string;
  password: string;
  role: AccountRole;
  title?: string;
  department?: string;
  internshipRole?: string;
  supervisorStaffId?: string;
  internshipStart?: string;
  internshipEnd?: string;
  territory?: string;
  dailyCallTarget?: number;
};

export async function createAccount(input: CreateAccountInput): Promise<{ error: string | null }> {
  const { error: authError } = await requireAdmin();
  if (authError) {
    return { error: authError };
  }

  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const admin = createAdminClient();

  const { data: created, error: createUserError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });

  if (createUserError || !created.user) {
    return { error: createUserError?.message ?? "Couldn't create the login." };
  }

  const { error: profileError } = await admin.from("staff").insert({
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
    territory: input.territory || null,
    daily_call_target: input.dailyCallTarget || null,
  });

  if (profileError) {
    // Login was created but the profile insert failed (e.g. duplicate
    // Lunex ID) — remove the orphaned login rather than leave a login
    // with no matching staff row, which would break get_staff_login_info.
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: profileError.message };
  }

  void createNotification({
    recipientStaffId: input.staffId,
    title: "Your LUNEX account has been created",
    message: `Your LUNEX ID is ${input.staffId}. Sign in at the Staff Portal with the password your admin set for you.`,
    type: "ACCOUNT_CREATED",
    actionUrl: "/staff",
  });

  return { error: null };
}
