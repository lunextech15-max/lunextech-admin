// Client-only: writes to public.projects / public.project_members. Kept in
// its own file — rather than projects.ts — so client components importing
// it never pull in the server Supabase client's "next/headers" dependency.
// Same split as team-client.ts / real-applications-client.ts.

"use client";

import { createClient } from "@/lib/supabase/client";
import type { ProjectStatus } from "@/lib/staff/types";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type NewProjectInput = {
  code: string;
  name: string;
  category: string;
  description: string;
  status: ProjectStatus;
  startedDate?: string;
  staffIds: string[];
  internIds: string[];
};

/** Admin-only, enforced by RLS ("admins can insert projects" /
 * "admins can insert project members" in 0008_projects.sql). Creates the
 * project row and its member rows together. */
export async function createProject(input: NewProjectInput): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error: projectError } = await supabase.from("projects").insert({
    code: input.code,
    name: input.name,
    slug: slugify(input.name) || input.code.toLowerCase(),
    category: input.category,
    description: input.description,
    status: input.status,
    started_date: input.startedDate || null,
  });

  if (projectError) {
    return { error: projectError.message };
  }

  const memberIds = [...input.staffIds, ...input.internIds];
  if (memberIds.length === 0) {
    return { error: null };
  }

  const { error: memberError } = await supabase
    .from("project_members")
    .insert(memberIds.map((staffId) => ({ project_code: input.code, staff_id: staffId })));

  return { error: memberError?.message ?? null };
}

/** Admin-only, enforced by RLS ("admins can update projects"). */
export async function updateProjectStatus(code: string, status: ProjectStatus): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").update({ status }).eq("code", code);
  return { error: error?.message ?? null };
}

/** Admin-only, enforced by RLS ("admins can update projects"). */
export async function updateProjectProgress(code: string, progress: number): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").update({ progress }).eq("code", code);
  return { error: error?.message ?? null };
}
