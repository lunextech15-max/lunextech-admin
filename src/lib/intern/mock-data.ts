// Intern Portal mock data. Self-contained prototype data, clearly separate
// from the Staff Portal's own mock data — the intern's project (SatQuery AI)
// reuses the same real project name/category used in the Staff Portal for
// consistency, but the intern-specific task/learning/journey content here is
// its own demo layer.

import type {
  InternAnnouncement,
  InternActivityEntry,
  InternJourneyStage,
  InternLearningModule,
  InternProject,
  InternTask,
  InternTeamMember,
  InternUser,
} from "./types";

export const CURRENT_INTERN_ID = "intern-ak";

export const INTERN_USER: InternUser = {
  id: CURRENT_INTERN_ID,
  name: "Alex Kumar",
  initials: "AK",
  role: "AI Development Intern",
  department: "AI & Technology",
  startDate: "Jul 2026",
};

export const INTERN_TEAM: InternTeamMember[] = [
  { id: "team-rn", initials: "RN", name: "Rahul N", role: "Project Lead", department: "AI Systems" },
  { id: "team-sk", initials: "SK", name: "Suresh K", role: "Senior Developer", department: "Full Stack" },
  { id: "team-ak", initials: "AK", name: "Alex K", role: "Intern", department: "AI Development" },
];

export const INTERN_PROJECT: InternProject = {
  name: "SatQuery AI",
  category: "AI + Satellite Intelligence",
  description:
    "An AI-powered platform designed to make satellite imagery easier to understand through natural language.",
  status: "in-progress",
  progress: 65,
  team: INTERN_TEAM,
  goal: "Build a system that allows users to explore and understand satellite imagery using natural language queries.",
  roleTitle: "Intern — AI Development",
  responsibilities: [
    "Research AI models",
    "Assist with model evaluation",
    "Prepare datasets",
    "Test model outputs",
    "Maintain project documentation",
  ],
  nextMilestone: "Model evaluation",
  milestones: [
    { id: "m1", number: "01", title: "Project research", status: "completed" },
    { id: "m2", number: "02", title: "Data preparation", status: "completed" },
    { id: "m3", number: "03", title: "Model development", status: "in-progress" },
    { id: "m4", number: "04", title: "Model evaluation", status: "upcoming" },
    { id: "m5", number: "05", title: "System integration", status: "upcoming" },
  ],
};

export const INTERN_TASKS: InternTask[] = [
  {
    id: "INTASK-001",
    title: "Review model evaluation pipeline",
    project: "SatQuery AI",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-09-18",
    description: "Review the current model evaluation pipeline and document potential improvements.",
    objectives: [
      { id: "o1", label: "Understand the current evaluation process", completed: true },
      { id: "o2", label: "Review model performance metrics", completed: true },
      { id: "o3", label: "Identify possible issues", completed: false },
      { id: "o4", label: "Document observations", completed: false },
    ],
    comments: [
      { id: "c1", author: "Rahul N", body: "Please review the accuracy metrics before Friday.", relativeTime: "2 hours ago" },
      { id: "c2", author: "Alex K", body: "Currently reviewing the evaluation pipeline.", relativeTime: "1 hour ago" },
    ],
  },
  {
    id: "INTASK-002",
    title: "Update API documentation",
    project: "SatQuery AI",
    status: "todo",
    priority: "medium",
    dueDate: "2026-09-20",
    description: "Update the API documentation to reflect the latest endpoint changes.",
    objectives: [
      { id: "o1", label: "List updated endpoints", completed: false },
      { id: "o2", label: "Add request/response examples", completed: false },
    ],
    comments: [],
  },
  {
    id: "INTASK-003",
    title: "Prepare satellite dataset",
    project: "SatQuery AI",
    status: "todo",
    priority: "medium",
    dueDate: "2026-09-22",
    description: "Prepare and clean the next batch of satellite imagery for model evaluation.",
    objectives: [
      { id: "o1", label: "Collect source imagery", completed: false },
      { id: "o2", label: "Clean and label samples", completed: false },
    ],
    comments: [],
  },
  {
    id: "INTASK-004",
    title: "Review model results",
    project: "SatQuery AI",
    status: "in-review",
    priority: "medium",
    dueDate: "2026-09-17",
    description: "Review the latest model evaluation results against the benchmark set.",
    objectives: [
      { id: "o1", label: "Compare against benchmark", completed: true },
      { id: "o2", label: "Flag anomalies", completed: true },
    ],
    comments: [],
  },
  {
    id: "INTASK-005",
    title: "Create weekly progress report",
    project: "Internship",
    status: "todo",
    priority: "medium",
    dueDate: "2026-09-19",
    description: "Prepare the weekly progress report summarizing internship contributions.",
    objectives: [
      { id: "o1", label: "Summarize completed work", completed: false },
      { id: "o2", label: "List blockers", completed: false },
    ],
    comments: [],
  },
  {
    id: "INTASK-006",
    title: "Test query responses",
    project: "SatQuery AI",
    status: "completed",
    priority: "low",
    dueDate: "2026-09-12",
    description: "Test natural-language query responses against a set of sample questions.",
    objectives: [
      { id: "o1", label: "Run sample queries", completed: true },
      { id: "o2", label: "Log incorrect responses", completed: true },
    ],
    comments: [],
  },
];

export const INTERN_LEARNING_MODULES: InternLearningModule[] = [
  {
    id: "foundations",
    number: "01",
    title: "Foundations",
    status: "completed",
    topics: ["Git & GitHub", "Development Workflow", "Project Documentation"],
    lessons: [
      { id: "l1", number: "01", title: "Introduction to Git", status: "completed", content: ["Git tracks changes to your codebase over time, letting a team work on the same project without overwriting each other's work."] },
      { id: "l2", number: "02", title: "Development Workflow", status: "completed", content: ["A consistent workflow — branch, commit, review, merge — keeps a team's codebase stable as it grows."] },
      { id: "l3", number: "03", title: "Project Documentation", status: "completed", content: ["Good documentation explains not just what code does, but why it exists."] },
    ],
  },
  {
    id: "web-development",
    number: "02",
    title: "Web Development",
    status: "in-progress",
    topics: ["Frontend Fundamentals", "React Basics", "API Integration"],
    progress: 65,
    lessons: [
      {
        id: "l1",
        number: "01",
        title: "Introduction",
        status: "completed",
        content: ["Frontend development is about building the interface a user directly interacts with."],
      },
      {
        id: "l2",
        number: "02",
        title: "HTML Structure",
        status: "completed",
        content: ["HTML defines the structure and meaning of content on a page — headings, paragraphs, lists, and more."],
      },
      {
        id: "l3",
        number: "03",
        title: "CSS Layout",
        status: "in-progress",
        content: [
          "CSS controls how content is laid out and styled. Two layout systems handle most real-world interfaces: Flexbox and Grid.",
          "Flexbox is ideal for one-dimensional layouts — a row or a column of items that need to align and distribute space.",
          "Grid is ideal for two-dimensional layouts — rows and columns together, like a full page structure.",
        ],
      },
      {
        id: "l4",
        number: "04",
        title: "Responsive Design",
        status: "locked",
        content: ["Responsive design ensures an interface works well across desktop, tablet, and mobile screens."],
      },
      {
        id: "l5",
        number: "05",
        title: "Project Exercise",
        status: "locked",
        content: ["Apply what you've learned by building a small responsive page from scratch."],
      },
    ],
  },
  {
    id: "ai-fundamentals",
    number: "03",
    title: "AI Fundamentals",
    status: "in-progress",
    topics: ["Machine Learning Basics", "Model Evaluation", "Datasets"],
    progress: 30,
    lessons: [
      { id: "l1", number: "01", title: "Machine Learning Basics", status: "completed", content: ["Machine learning models find patterns in data rather than following explicitly programmed rules."] },
      { id: "l2", number: "02", title: "Model Evaluation", status: "in-progress", content: ["Evaluating a model means measuring how well its predictions match reality on data it hasn't seen before."] },
      { id: "l3", number: "03", title: "Datasets", status: "locked", content: ["The quality and diversity of a dataset directly shapes what a model is able to learn."] },
    ],
  },
  {
    id: "real-project-work",
    number: "04",
    title: "Real Project Work",
    status: "locked",
    topics: ["Production Development", "Code Reviews", "Deployment"],
    lessons: [
      { id: "l1", number: "01", title: "Production Development", status: "locked", content: [] },
      { id: "l2", number: "02", title: "Code Reviews", status: "locked", content: [] },
      { id: "l3", number: "03", title: "Deployment", status: "locked", content: [] },
    ],
  },
];

export const INTERN_ANNOUNCEMENTS: InternAnnouncement[] = [
  {
    id: "iann-001",
    category: "Project update",
    title: "SatQuery AI enters the model evaluation phase.",
    content: "The project has moved into its next development phase.",
    relativeTime: "2 hours ago",
  },
  {
    id: "iann-002",
    category: "Learning update",
    title: "New AI Fundamentals modules are now available.",
    content: "Additional learning material has been added to your learning path.",
    relativeTime: "1 day ago",
  },
  {
    id: "iann-003",
    category: "Team update",
    title: "Weekly project review scheduled for Friday.",
    content: "Join the weekly review to share progress and blockers.",
    relativeTime: "3 days ago",
    important: true,
  },
];

export const INTERN_ACTIVITY: InternActivityEntry[] = [
  { id: "iact-1", label: "Task updated", detail: "Model evaluation pipeline", relativeTime: "2 hours ago" },
  { id: "iact-2", label: "Learning completed", detail: "Introduction to Git", relativeTime: "1 day ago" },
  { id: "iact-3", label: "Project update", detail: "SatQuery AI documentation updated", relativeTime: "2 days ago" },
];

export const INTERN_JOURNEY: InternJourneyStage[] = [
  { id: "j1", number: "01", title: "Onboarding", status: "completed" },
  { id: "j2", number: "02", title: "Foundation learning", status: "completed" },
  { id: "j3", number: "03", title: "Project contribution", status: "in-progress" },
  { id: "j4", number: "04", title: "Project delivery", status: "upcoming" },
  { id: "j5", number: "05", title: "Final review", status: "upcoming" },
];

export function getLearningProgress(): { completed: number; total: number; percent: number } {
  const total = INTERN_LEARNING_MODULES.length;
  const completed = INTERN_LEARNING_MODULES.filter((m) => m.status === "completed").length;
  const percentSum = INTERN_LEARNING_MODULES.reduce((sum, m) => {
    if (m.status === "completed") return sum + 100;
    if (m.status === "locked") return sum + 0;
    return sum + (m.progress ?? 50);
  }, 0);
  return { completed, total, percent: Math.round(percentSum / total) };
}
