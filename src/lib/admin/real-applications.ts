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

/** Fetch every application across both tables, newest first. */
export async function getAllApplications(): Promise<AdminApplication[]> {
  const supabase = await createClient();
  const [internships, jobs] = await Promise.all([
    supabase.from("applications").select("*").order("created_at", { ascending: false }),
    supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
  ]);

  const internshipApps = ((internships.data ?? []) as InternshipRow[]).map(fromInternshipRow);
  const jobApps = ((jobs.data ?? []) as JobRow[]).map(fromJobRow);

  return [...internshipApps, ...jobApps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Fetch one application by its composite id ("internship:<uuid>" / "job:<uuid>"). */
export async function getApplicationById(id: string): Promise<AdminApplication | null> {
  const parsed = parseCompositeId(id);
  if (!parsed) return null;

  const supabase = await createClient();
  const table = parsed.kind === "internship" ? "applications" : "job_applications";
  const { data } = await supabase.from(table).select("*").eq("id", parsed.rawId).maybeSingle();
  if (!data) return null;

  return parsed.kind === "internship" ? fromInternshipRow(data as InternshipRow) : fromJobRow(data as JobRow);
}
