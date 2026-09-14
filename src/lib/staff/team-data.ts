// Staff Portal — Team directory. The single source of truth for staff
// identity/role/skills. Membership in a project is expressed only via
// `projectIds` (matching `StaffProject.code`) — project names, status and
// progress are resolved from `projects-data.ts`, never duplicated here.
// Only "JD" maps to a real placeholder identity (John Doe, the demo signed-in
// user) — every other member is a generic placeholder since no other real
// staff records exist yet. Replace this whole module with a real fetch once
// a backend exists.

import { MOCK_PROJECTS } from "./projects-data";
import type { StaffProject, StaffTeamMember } from "./types";

export const MOCK_TEAM: StaffTeamMember[] = [
  {
    id: "member-jd",
    name: "John Doe",
    initials: "JD",
    role: "Frontend Developer",
    discipline: "Engineering",
    skills: ["Frontend", "React", "UI Systems"],
    projectIds: ["LX-001", "LX-002", "LX-005"],
    status: "active",
  },
  {
    id: "member-ar",
    name: "Team member",
    initials: "AR",
    role: "UI / UX Designer",
    discipline: "Design",
    skills: ["UI Design", "Design Systems", "Prototyping"],
    projectIds: ["LX-001", "LX-003"],
    status: "active",
  },
  {
    id: "member-sk",
    name: "Team member",
    initials: "SK",
    role: "Project Manager",
    discipline: "Product",
    skills: ["Project Management", "Planning"],
    projectIds: ["LX-001", "LX-004"],
    status: "active",
  },
  {
    id: "member-mk",
    name: "Team member",
    initials: "MK",
    role: "AI Engineer",
    discipline: "AI",
    skills: ["Machine Learning", "Model Evaluation", "Python"],
    projectIds: ["LX-002", "LX-006"],
    status: "active",
  },
  {
    id: "member-tn",
    name: "Team member",
    initials: "TN",
    role: "QA Engineer",
    discipline: "Engineering",
    skills: ["Quality Assurance", "Testing"],
    projectIds: ["LX-003", "LX-007"],
    status: "active",
  },
  {
    id: "member-vp",
    name: "Team member",
    initials: "VP",
    role: "Backend Developer",
    discipline: "Engineering",
    skills: ["Backend", "Node.js", "Databases"],
    projectIds: ["LX-003"],
    status: "active",
  },
  {
    id: "member-rs",
    name: "Team member",
    initials: "RS",
    role: "Marketing Lead",
    discipline: "Product",
    skills: ["Marketing", "Content Strategy"],
    projectIds: ["LX-004"],
    status: "active",
  },
  {
    id: "member-nt",
    name: "Team member",
    initials: "NT",
    role: "DevOps Engineer",
    discipline: "Engineering",
    skills: ["CI/CD", "Infrastructure"],
    projectIds: ["LX-006"],
    status: "active",
  },
];

export function getMemberProjects(member: StaffTeamMember): StaffProject[] {
  return MOCK_PROJECTS.filter((project) => member.projectIds.includes(project.code));
}

export function getActiveProjectCount(member: StaffTeamMember): number {
  return getMemberProjects(member).filter(
    (project) => project.status === "in-progress" || project.status === "review"
  ).length;
}

export function getDisciplines(): string[] {
  return Array.from(new Set(MOCK_TEAM.map((member) => member.discipline)));
}

// Derived from the earliest project the member is connected to — there is
// no dedicated "join date" field yet, and this avoids inventing one.
export function getMemberSinceYear(member: StaffTeamMember): string {
  const years = getMemberProjects(member)
    .map((project) => project.startedDate.match(/\d{4}/)?.[0])
    .filter((year): year is string => Boolean(year));
  if (years.length === 0) return "—";
  return years.sort()[0];
}
