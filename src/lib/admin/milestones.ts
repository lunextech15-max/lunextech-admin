// Server-only: reads real milestones from Supabase public.project_milestones
// — replaces the hardcoded MILESTONES_BY_PROJECT (milestones-data.ts). RLS
// (0015_project_milestones.sql): any authenticated user can read.

import { createClient } from "@/lib/supabase/server";
import type { MilestoneStatus, ProjectMilestone } from "./types";

type MilestoneRow = {
  id: string;
  project_code: string;
  title: string;
  status: MilestoneStatus;
  position: number;
};

function numberFor(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export async function getProjectMilestones(projectCode: string): Promise<ProjectMilestone[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_code", projectCode)
    .order("position", { ascending: true });

  if (error) {
    console.error(`getProjectMilestones: query failed for ${projectCode}`, error);
    return [];
  }

  return ((data ?? []) as MilestoneRow[]).map((row, index) => ({
    id: row.id,
    number: numberFor(index),
    title: row.title,
    status: row.status,
  }));
}
