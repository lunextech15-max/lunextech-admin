// Admin Command Center types. The Admin Panel reads staff/project/task/
// announcement data from the SAME sources the Staff and Intern Portals use
// (src/lib/staff/*, src/lib/intern/*) — never a duplicate copy. Only
// genuinely new concepts (accounts roster, applications, milestones,
// cross-portal activity) get new data here.

export type AccountRole = "admin" | "staff" | "intern";
export type AccountStatus = "active" | "inactive";

// One row per person, unifying staff + intern identities for the People
// list. Derived from team-data.ts / intern mock data at read time — see
// people-data.ts — not a separately maintained record.
export type PersonAccount = {
  lunexId: string;
  name: string;
  initials: string;
  email: string;
  role: AccountRole;
  title: string;
  department: string;
  status: AccountStatus;
  joinedDate: string;
  supervisorName?: string;
  internshipStart?: string;
  internshipEnd?: string;
};

export type MilestoneStatus = "completed" | "in-progress" | "upcoming";

export type ProjectMilestone = {
  id: string;
  number: string;
  title: string;
  status: MilestoneStatus;
};

export type ApplicationStatus = "new" | "under-review" | "accepted" | "rejected";

export type Application = {
  id: string;
  applicantLabel: string;
  email: string;
  phone: string;
  role: string;
  appliedDate: string;
  status: ApplicationStatus;
  whyJoin: string;
  skills: string[];
  portfolioUrl?: string;
  resumeNote: string;
};

export type AdminActivityCategory = "people" | "projects" | "tasks" | "interns" | "system";

export type AdminActivityEntry = {
  id: string;
  category: AdminActivityCategory;
  title: string;
  description: string;
  relativeTime: string;
  day: "Today" | "Yesterday" | "Earlier";
  important?: boolean;
};

export type AnnouncementAudience = "everyone" | "staff" | "intern";
