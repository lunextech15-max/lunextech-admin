// Client-only: writes to public.staff (status changes). Kept in its own
// file — rather than team.ts — so client components importing it never
// pull in the server Supabase client's "next/headers" dependency. Same
// split as real-applications-client.ts. Account creation (login + profile
// together) is now a Server Action — see create-account.ts — since it
// needs the service-role key, which must never reach the client.

"use client";

import { createClient } from "@/lib/supabase/client";
import type { AccountStatus } from "./types";

/** Admin-only, enforced by RLS ("admins can update staff"). */
export async function updateStaffStatus(staffId: string, status: AccountStatus): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("staff").update({ status }).eq("staff_id", staffId);

  return { error: error?.message ?? null };
}
