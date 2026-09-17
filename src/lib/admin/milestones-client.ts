// Client-only: writes to public.project_milestones. Staff+admin, per RLS
// (0015_project_milestones.sql).

"use client";

import { createClient } from "@/lib/supabase/client";
import type { MilestoneStatus } from "./types";

export async function addMilestone(
  projectCode: string,
  title: string,
  position: number
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("project_milestones")
    .insert({ project_code: projectCode, title, position, status: "upcoming" });
  return { error: error?.message ?? null };
}

export async function updateMilestoneStatus(
  id: string,
  status: MilestoneStatus
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("project_milestones").update({ status }).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteMilestone(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("project_milestones").delete().eq("id", id);
  return { error: error?.message ?? null };
}
