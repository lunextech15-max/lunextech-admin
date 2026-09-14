// Project milestones — new to the data model (StaffProject only tracked a
// single `nextMilestone` string). Keyed by project code so this stays a
// separate concern from projects-data.ts rather than bolted onto it.

import type { ProjectMilestone } from "./types";

export const MILESTONES_BY_PROJECT: Record<string, ProjectMilestone[]> = {
  "LX-001": [
    { id: "m1", number: "01", title: "Design complete", status: "completed" },
    { id: "m2", number: "02", title: "Development", status: "completed" },
    { id: "m3", number: "03", title: "Final UI review", status: "in-progress" },
    { id: "m4", number: "04", title: "Launch", status: "upcoming" },
  ],
  "LX-002": [
    { id: "m1", number: "01", title: "Benchmark defined", status: "completed" },
    { id: "m2", number: "02", title: "Model development", status: "completed" },
    { id: "m3", number: "03", title: "System evaluation", status: "in-progress" },
    { id: "m4", number: "04", title: "Release", status: "upcoming" },
  ],
  "LX-003": [
    { id: "m1", number: "01", title: "Marketplace UI", status: "in-progress" },
    { id: "m2", number: "02", title: "Payment integration", status: "upcoming" },
    { id: "m3", number: "03", title: "Marketplace beta", status: "upcoming" },
  ],
  "LX-004": [
    { id: "m1", number: "01", title: "Storefront build", status: "completed" },
    { id: "m2", number: "02", title: "Launch", status: "completed" },
  ],
  "LX-005": [
    { id: "m1", number: "01", title: "Platform build", status: "completed" },
    { id: "m2", number: "02", title: "Launch", status: "completed" },
  ],
  "LX-006": [
    { id: "m1", number: "01", title: "Platform build", status: "completed" },
    { id: "m2", number: "02", title: "Launch", status: "completed" },
  ],
  "LX-007": [
    { id: "m1", number: "01", title: "Site build", status: "completed" },
    { id: "m2", number: "02", title: "Launch", status: "completed" },
  ],
};

export function getProjectMilestones(projectCode: string): ProjectMilestone[] {
  return MILESTONES_BY_PROJECT[projectCode] ?? [];
}
