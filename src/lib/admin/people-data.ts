// Admin People roster. Staff rows are DERIVED from team-data.ts (the same
// roster the Staff Portal's Team page uses) — not duplicated. Interns
// beyond the one modeled in the Intern Portal (Alex Kumar / IN-001) are
// admin-only roster entries; they don't have a full Intern Portal
// dashboard behind them, only the summary data an admin needs to see.

import { MOCK_TEAM, getMemberSinceYear } from "@/lib/staff/team-data";
import { INTERN_USER } from "@/lib/intern/mock-data";
import type { StaffTeamMember } from "@/lib/staff/types";
import type { AccountStatus, PersonAccount } from "./types";

// Maps each staff member's initials to their admin-issued Lunex ID (the
// same identifier used as the Staff ID at login).
export const STAFF_LUNEX_IDS: Record<string, string> = {
  JD: "LX-001",
  AR: "LX-002",
  SK: "LX-003",
  MK: "LX-004",
  TN: "LX-005",
  VP: "LX-006",
  RS: "LX-007",
  NT: "LX-008",
};

const STAFF_EMAIL_LOCAL: Record<string, string> = {
  JD: "john.doe",
  AR: "ar",
  SK: "sk",
  MK: "mk",
  TN: "tn",
  VP: "vp",
  RS: "rs",
  NT: "nt",
};

// Additional joined-date years for members whose team-data.ts project
// history doesn't resolve one (getMemberSinceYear falls back to "—").
const STAFF_JOINED: Record<string, string> = {
  JD: "Jun 1, 2026",
  AR: "Jun 1, 2026",
  SK: "Jun 1, 2026",
  MK: "Aug 20, 2026",
  TN: "Aug 15, 2026",
  VP: "Aug 15, 2026",
  RS: "Jun 1, 2026",
  NT: "Feb 15, 2026",
};

export type AdminIntern = {
  lunexId: string;
  name: string;
  initials: string;
  email: string;
  internshipRole: string;
  supervisorLunexId: string;
  startDate: string;
  endDate: string;
  status: AccountStatus;
  progress: number;
  assignedTasks: number;
  completedTasks: number;
  activeProjects: number;
};

export const ADMIN_INTERNS: AdminIntern[] = [
  {
    lunexId: "IN-001",
    name: INTERN_USER.name,
    initials: INTERN_USER.initials,
    email: "alex.kumar@lunextech.dev",
    internshipRole: "AI Development",
    supervisorLunexId: "LX-001",
    startDate: "Jul 1, 2026",
    endDate: "Oct 1, 2026",
    status: "active",
    progress: 64,
    assignedTasks: 12,
    completedTasks: 8,
    activeProjects: 1,
  },
  {
    lunexId: "IN-002",
    name: "Team intern",
    initials: "PS",
    email: "in002@lunextech.dev",
    internshipRole: "Frontend Development",
    supervisorLunexId: "LX-002",
    startDate: "Aug 1, 2026",
    endDate: "Nov 1, 2026",
    status: "active",
    progress: 48,
    assignedTasks: 9,
    completedTasks: 4,
    activeProjects: 1,
  },
  {
    lunexId: "IN-003",
    name: "Team intern",
    initials: "KM",
    email: "in003@lunextech.dev",
    internshipRole: "Backend Development",
    supervisorLunexId: "LX-004",
    startDate: "Aug 1, 2026",
    endDate: "Nov 1, 2026",
    status: "active",
    progress: 41,
    assignedTasks: 8,
    completedTasks: 3,
    activeProjects: 1,
  },
  {
    lunexId: "IN-004",
    name: "Team intern",
    initials: "DS",
    email: "in004@lunextech.dev",
    internshipRole: "UI / UX Design",
    supervisorLunexId: "LX-002",
    startDate: "Jul 1, 2026",
    endDate: "Oct 1, 2026",
    status: "active",
    progress: 70,
    assignedTasks: 10,
    completedTasks: 7,
    activeProjects: 1,
  },
  {
    lunexId: "IN-005",
    name: "Team intern",
    initials: "LT",
    email: "in005@lunextech.dev",
    internshipRole: "Product Development",
    supervisorLunexId: "LX-003",
    startDate: "Jun 1, 2026",
    endDate: "Sep 14, 2026",
    status: "active",
    progress: 92,
    assignedTasks: 11,
    completedTasks: 10,
    activeProjects: 1,
  },
  {
    lunexId: "IN-006",
    name: "Team intern",
    initials: "RV",
    email: "in006@lunextech.dev",
    internshipRole: "AI / Machine Learning",
    supervisorLunexId: "LX-004",
    startDate: "May 1, 2026",
    endDate: "Aug 1, 2026",
    status: "inactive",
    progress: 100,
    assignedTasks: 9,
    completedTasks: 9,
    activeProjects: 0,
  },
];

function staffToPerson(member: StaffTeamMember): PersonAccount {
  const lunexId = STAFF_LUNEX_IDS[member.initials] ?? member.id;
  return {
    lunexId,
    name: member.name,
    initials: member.initials,
    email: `${STAFF_EMAIL_LOCAL[member.initials] ?? member.initials.toLowerCase()}@lunextech.com`,
    role: "staff",
    title: member.role,
    department: member.discipline,
    status: "active",
    joinedDate: STAFF_JOINED[member.initials] ?? `${getMemberSinceYear(member)}`,
  };
}

function internToPerson(intern: AdminIntern): PersonAccount {
  const supervisor = MOCK_TEAM.find((m) => STAFF_LUNEX_IDS[m.initials] === intern.supervisorLunexId);
  return {
    lunexId: intern.lunexId,
    name: intern.name,
    initials: intern.initials,
    email: intern.email,
    role: "intern",
    title: `${intern.internshipRole} Intern`,
    department: intern.internshipRole,
    status: intern.status,
    joinedDate: intern.startDate,
    supervisorName: supervisor?.name,
    internshipStart: intern.startDate,
    internshipEnd: intern.endDate,
  };
}

export function getAllPeople(): PersonAccount[] {
  return [...MOCK_TEAM.map(staffToPerson), ...ADMIN_INTERNS.map(internToPerson)];
}

export function getPerson(lunexId: string): PersonAccount | undefined {
  return getAllPeople().find((p) => p.lunexId === lunexId);
}

export function getStaffMemberByLunexId(lunexId: string): StaffTeamMember | undefined {
  return MOCK_TEAM.find((m) => STAFF_LUNEX_IDS[m.initials] === lunexId);
}

export function getInternByLunexId(lunexId: string): AdminIntern | undefined {
  return ADMIN_INTERNS.find((i) => i.lunexId === lunexId);
}
