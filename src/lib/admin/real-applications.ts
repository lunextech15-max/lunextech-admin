// Server-only: fetches real applications from Supabase — public.applications
// (internship program applicants) and public.job_applications (open-role
// applicants) in the lunextech.git repo. Both tables are insert-only from
// the public side; 0005_admin_application_review.sql adds the admin-only
// SELECT/UPDATE policies (gated on get_my_role() = 'admin') this relies on.
// For the client-side status update, see real-applications-client.ts.

import { createClient } from "@/lib/supabase/server";
import {
  fromInternshipRow,
  fromJobRow,
  parseCompositeId,
  type AdminApplication,
  type InternshipRow,
  type JobRow,
} from "./application-types";

export type ApplicationsResult = {
  applications: AdminApplication[];
  /** True if either query failed — callers should show this, not silently
   * treat a failed fetch as "zero applications" (a real Supabase error and
   * an empty table look identical if you only check `.data`). */
  error: boolean;
};

/** Fetch every application across both tables, newest first. */
export async function getAllApplications(): Promise<ApplicationsResult> {
  const supabase = await createClient();
  const [internships, jobs] = await Promise.all([
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
    supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
  ]);

  if (internships.error) {
    console.error("getAllApplications: applications query failed", internships.error);
  }
  if (jobs.error) {
    console.error("getAllApplications: job_applications query failed", jobs.error);
  }

  const internshipApps = ((internships.data ?? []) as InternshipRow[]).map(fromInternshipRow);
  const jobApps = ((jobs.data ?? []) as JobRow[]).map(fromJobRow);

  const applications = [...internshipApps, ...jobApps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return { applications, error: Boolean(internships.error || jobs.error) };
}

/**
 * Fetch one application by its composite id ("internship:<uuid>" /
 * "job:<uuid>"). Throws on a real Supabase error so it's visibly distinct
 * from "this id doesn't exist" (which returns null, for the caller to
 * notFound() on) — the two used to look identical to the caller.
 */
export async function getApplicationById(id: string): Promise<AdminApplication | null> {
  const parsed = parseCompositeId(id);
  if (!parsed) return null;

  const supabase = await createClient();
  const table = parsed.kind === "internship" ? "applications" : "job_applications";
  const { data, error } = await supabase.from(table).select("*").eq("id", parsed.rawId).maybeSingle();

  if (error) {
    throw new Error(`Failed to load application ${id}: ${error.message}`);
  }
  if (!data) return null;

  return parsed.kind === "internship" ? fromInternshipRow(data as InternshipRow) : fromJobRow(data as JobRow);
}
