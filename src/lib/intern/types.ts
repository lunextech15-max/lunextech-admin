// Intern Portal — a separate, simplified workspace reusing the exact LUNEX
// TECH Staff Portal design system (same CSS classes: dash-*, proj-*, task-*).
// All data here is self-contained mock data for this prototype.

export type InternUser = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  startDate: string;
};

export type InternTeamMember = {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: string;
};

export type InternMilestoneStatus = "completed" | "in-progress" | "upcoming";

export type InternMilestone = {
  id: string;
  number: string;
  title: string;
  status: InternMilestoneStatus;
};

export type InternProject = {
  name: string;
  category: string;
  description: string;
  status: "in-progress" | "completed";
  progress: number;
  team: InternTeamMember[];
  goal: string;
  roleTitle: string;
  responsibilities: string[];
  nextMilestone: string;
  milestones: InternMilestone[];
};

export type InternTaskStatus = "todo" | "in-progress" | "in-review" | "completed";
export type InternTaskPriority = "high" | "medium" | "low";

export type InternComment = {
  id: string;
  author: string;
  body: string;
  relativeTime: string;
};

export type InternTask = {
  id: string;
  title: string;
  project: string;
  status: InternTaskStatus;
  priority: InternTaskPriority;
  dueDate: string;
  description: string;
  objectives: { id: string; label: string; completed: boolean }[];
  comments: InternComment[];
};

export type InternLessonStatus = "completed" | "in-progress" | "locked";

export type InternLesson = {
  id: string;
  number: string;
  title: string;
  status: InternLessonStatus;
  content: string[];
};

export type InternModuleStatus = "completed" | "in-progress" | "locked";

export type InternLearningModule = {
  id: string;
  number: string;
  title: string;
  status: InternModuleStatus;
  topics: string[];
  progress?: number;
  lessons: InternLesson[];
};

export type InternAnnouncement = {
  id: string;
  category: string;
  title: string;
  content: string;
  relativeTime: string;
  important?: boolean;
};

export type InternActivityEntry = {
  id: string;
  label: string;
  detail: string;
  relativeTime: string;
};

export type InternJourneyStage = {
  id: string;
  number: string;
  title: string;
  status: InternMilestoneStatus;
};
