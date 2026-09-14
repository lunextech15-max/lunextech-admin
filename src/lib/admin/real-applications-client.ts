// Client-only: updates an application's status. Kept in its own file
// (rather than real-applications.ts) so client components importing it
// never pull in the server Supabase client's "next/headers" dependency.

"use client";

import { createClient } from "@/lib/supabase/client";
import { parseCompositeId, statusToDb, type ApplicationStatus } from "./application-types";

/** Admin-only, enforced by RLS (see 0005_admin_application_review.sql). */
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<{ error: string | null }> {
  const parsed = parseCompositeId(id);
  if (!parsed) return { error: "Invalid application id." };

  const supabase = createClient();
  const table = parsed.kind === "internship" ? "applications" : "job_applications";
  const { error } = await supabase
    .from(table)
    .update({ status: statusToDb(status, parsed.kind) })
    .eq("id", parsed.rawId);

  return { error: error?.message ?? null };
}
