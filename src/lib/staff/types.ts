// Shared types for the Staff Portal. Real data (session, projects, tasks,
// announcements) will replace `src/lib/staff/mock-data.ts` once the backend
// (Supabase) is connected — components consume these shapes either way.

export type StaffRole = "admin" | "staff" | "intern";

export type StaffUser = {
  id: string;
  name: string;
  initials: string;
  role: StaffRole;
};

export type TeamMember = {
  id: string;
  initials: string;
};

export type CurrentFocusProject = {
  name: string;
  category: string;
  description: string;
  progress: number;
  role: string;
  team: TeamMember[];
  nextMilestone: string;
  /** Future project detail route — undefined until that page exists. */
  href?: string;
};

export type TimelineEvent = {
  id: string;
  time: string;
  title: string;
};

export type ProjectStatus = "planning" | "in-progress" | "review" | "completed" | "archived";

export type ProjectTeamMember = TeamMember & {
  name: string;
  role: string;
};

export type TaskStatus = "todo" | "in-progress" | "in-review" | "completed";

export type TaskPriority = "high" | "medium" | "low";

export type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type TaskComment = {
  id: string;
  author: string;
  body: string;
  relativeTime: string;
};

// Unified task shape — the single source of truth for the Project
// Workspace's "Tasks" tab (filtered by projectId), the My Tasks page
// (filtered by assigneeId), and the Task Detail Workspace (looked up by
// id). Never duplicate a task's data in two places.
export type Task = {
  id: string;
  title: string;
  description: string[];
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItem[];
  activity: ProjectActivityEntry[];
  comments: TaskComment[];
};

export type ProjectActivityEntry = {
  id: string;
  title: string;
  description: string;
  user?: string;
  relativeTime: string;
};

export type ProjectResource = {
  id: string;
  name: string;
  type: string;
  url?: string;
  uploadedBy?: string;
  createdAt?: string;
};

export type StaffProject = {
  id: string;
  code: string;
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  objective: string;
  startedDate: string;
  team: ProjectTeamMember[];
  nextMilestone: string;
  activity: ProjectActivityEntry[];
  resources: ProjectResource[];
};

export type AnnouncementCategory = "general" | "project" | "team" | "system";
export type AnnouncementPriority = "normal" | "important";

// Centralized announcement source — the Dashboard's announcement widget and
// the dedicated Announcements module both read from the same data (see
// `announcements-data.ts`). "Read" status is tracked separately, in
// per-viewer localStorage (see `announcements-read-state.ts`), since it's
// not shared data.
export type StaffAnnouncement = {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  authorId: string;
  authorName: string;
  createdAt: string;
  relativeTime: string;
};

export type ActivityItem = {
  id: string;
  label: string;
  detail: string;
  relativeTime: string;
};

export type DashboardMetrics = {
  activeProjects: number;
  myTasks: number;
  completedThisWeek: number;
  nextDeadline: string;
};

// Team directory — a canonical roster, separate from the compact
// `ProjectTeamMember[]` embedded per-project (which exists only to render
// avatars). `projectIds` reference `StaffProject.code`; resolve the actual
// project data from `projects-data.ts` rather than duplicating it here.
export type StaffTeamMember = {
  id: string;
  name: string;
  initials: string;
  role: string;
  discipline: string;
  skills: string[];
  projectIds: string[];
  status: "active";
};
