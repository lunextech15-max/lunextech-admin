// Staff Portal — Projects. Names, categories and descriptions are the real
// LUNEX TECH projects from `src/lib/projects.ts` (the public Selected Work
// data) — never invented. Internal tracking fields that don't exist yet
// anywhere in the codebase (status, progress %, objective, dates, team
// assignment, activity) are clearly-marked demo data until real
// project-tracking backend is connected; replace this whole module with a
// real fetch then. Only "JD" maps to a real placeholder identity (the
// signed-in demo staff user, John Doe) — every other initial is a generic
// "Team member" since no other real staff records exist yet.
//
// Tasks are NOT stored here — they live in the unified `tasks-data.ts`
// source (keyed by `code`/projectId) so Project Tasks and My Tasks never
// duplicate the same data. Use `getProjectTasks(project.code)` to read a
// project's tasks.

import type { StaffProject } from "./types";

export const MOCK_PROJECTS: StaffProject[] = [
  {
    id: "lunex-website-relaunch",
    code: "LX-001",
    slug: "lunex-website-relaunch",
    number: "01",
    name: "LUNEX Website Relaunch",
    category: "Digital Experience",
    description: "Rebuilding the LUNEX TECH public website and internal workspace.",
    status: "in-progress",
    progress: 80,
    objective:
      "Build a premium digital presence and internal workspace that represents the LUNEX TECH brand and supports staff operations.",
    startedDate: "Jun 2026",
    team: [
      { id: "team-1", initials: "JD", name: "John Doe", role: "Frontend development" },
      { id: "team-2", initials: "AR", name: "Team member", role: "UI / UX design" },
      { id: "team-3", initials: "SK", name: "Team member", role: "Project management" },
    ],
    nextMilestone: "Final UI review",
    activity: [
      {
        id: "a1",
        title: "Task completed",
        description: "Design system review completed.",
        user: "John Doe",
        relativeTime: "2 hours ago",
      },
      { id: "a2", title: "Project progress updated", description: "Project progress updated to 80%.", relativeTime: "5 hours ago" },
      { id: "a3", title: "New task created", description: "Final UI Review was added.", relativeTime: "1 day ago" },
      { id: "a4", title: "Project initiated", description: "LUNEX Website Relaunch project created.", relativeTime: "3 days ago" },
    ],
    resources: [],
  },
  {
    id: "satquery-ai",
    code: "LX-002",
    slug: "satquery-ai",
    number: "02",
    name: "SatQuery AI",
    category: "AI × Satellite Intelligence",
    description:
      "Vision-language assistant for querying satellite imagery in plain language, with evidence-grounded results.",
    status: "in-progress",
    progress: 60,
    objective:
      "Deliver a vision-language assistant that lets analysts query satellite imagery in plain language, with evidence-grounded, auditable results.",
    startedDate: "Feb 2026",
    team: [
      { id: "team-1", initials: "JD", name: "John Doe", role: "Frontend development" },
      { id: "team-4", initials: "MK", name: "Team member", role: "Backend development" },
    ],
    nextMilestone: "System evaluation",
    activity: [
      { id: "a1", title: "Task completed", description: "API integration completed.", user: "John Doe", relativeTime: "1 day ago" },
      { id: "a2", title: "Project progress updated", description: "Project progress updated to 60%.", relativeTime: "2 days ago" },
      { id: "a3", title: "New task created", description: "System evaluation was added.", relativeTime: "4 days ago" },
      { id: "a4", title: "Project initiated", description: "SatQuery AI project created.", relativeTime: "3 weeks ago" },
    ],
    resources: [],
  },
  {
    id: "smartbuyx",
    code: "LX-003",
    slug: "smartbuyx",
    number: "03",
    name: "SmartBuyX",
    category: "AI Commerce × Construction",
    description: "AI-powered commerce and construction super-app, currently in active development.",
    status: "in-progress",
    progress: 45,
    objective:
      "Launch an AI-powered commerce and construction super-app covering everyday shopping and material estimation.",
    startedDate: "Jul 2026",
    team: [
      { id: "team-2", initials: "AR", name: "Team member", role: "UI / UX design" },
      { id: "team-5", initials: "TN", name: "Team member", role: "Quality assurance" },
    ],
    nextMilestone: "Marketplace beta",
    activity: [
      { id: "a1", title: "Project progress updated", description: "Project progress updated to 45%.", relativeTime: "6 hours ago" },
      { id: "a2", title: "New task created", description: "Payment integration was added.", relativeTime: "2 days ago" },
      { id: "a3", title: "Project initiated", description: "SmartBuyX project created.", relativeTime: "1 month ago" },
    ],
    resources: [],
  },
  {
    id: "deedis",
    code: "LX-004",
    slug: "deedis",
    number: "04",
    name: "Deedis",
    category: "E-Commerce · Food & Beverage",
    description: "D2C storefront for handcrafted South Indian pickles.",
    status: "completed",
    progress: 100,
    objective:
      "Give a handcrafted pickle brand a real D2C storefront that reflects its traditional, natural-ingredient story.",
    startedDate: "Nov 2025",
    team: [{ id: "team-3", initials: "SK", name: "Team member", role: "Project management" }],
    nextMilestone: "Post-launch support",
    activity: [
      { id: "a1", title: "Project completed", description: "Deedis launched successfully.", relativeTime: "2 months ago" },
      { id: "a2", title: "Project initiated", description: "Deedis project created.", relativeTime: "3 months ago" },
    ],
    resources: [],
  },
  {
    id: "f-gex-groups",
    code: "LX-005",
    slug: "f-gex-groups",
    number: "05",
    name: "F-Gex Groups",
    category: "Technology × Financial Ecosystem",
    description: "Dual-division ecosystem uniting technology infrastructure and financial education.",
    status: "completed",
    progress: 100,
    objective: "Establish a unified digital presence for a dual-division technology and financial-education ecosystem.",
    startedDate: "Aug 2025",
    team: [{ id: "team-1", initials: "JD", name: "John Doe", role: "Frontend development" }],
    nextMilestone: "Post-launch support",
    activity: [
      { id: "a1", title: "Project completed", description: "F-Gex Groups launched successfully.", relativeTime: "4 months ago" },
      { id: "a2", title: "Project initiated", description: "F-Gex Groups project created.", relativeTime: "5 months ago" },
    ],
    resources: [],
  },
  {
    id: "pupilnetwork",
    code: "LX-006",
    slug: "pupilnetwork",
    number: "06",
    name: "PupilNetwork",
    category: "EdTech · Collaborative Learning",
    description: "Collaborative study platform with live study rooms, peer Q&A, and AI tutoring.",
    status: "completed",
    progress: 100,
    objective: "Build a collaborative study platform for Indian students with live rooms, peer Q&A, and AI tutoring.",
    startedDate: "May 2025",
    team: [{ id: "team-4", initials: "MK", name: "Team member", role: "Backend development" }],
    nextMilestone: "Post-launch support",
    activity: [
      { id: "a1", title: "Project completed", description: "PupilNetwork launched successfully.", relativeTime: "5 months ago" },
      { id: "a2", title: "Project initiated", description: "PupilNetwork project created.", relativeTime: "6 months ago" },
    ],
    resources: [],
  },
  {
    id: "glamroyal-events",
    code: "LX-007",
    slug: "glamroyal-events",
    number: "07",
    name: "Glamroyal Events",
    category: "Events · Hospitality",
    description: "Brand and booking presence for a wedding and event management company.",
    status: "completed",
    progress: 100,
    objective: "Create a brand and booking presence showcasing real event work for a wedding and events company.",
    startedDate: "Mar 2025",
    team: [{ id: "team-5", initials: "TN", name: "Team member", role: "Quality assurance" }],
    nextMilestone: "Post-launch support",
    activity: [
      { id: "a1", title: "Project completed", description: "Glamroyal Events launched successfully.", relativeTime: "6 months ago" },
      { id: "a2", title: "Project initiated", description: "Glamroyal Events project created.", relativeTime: "7 months ago" },
    ],
    resources: [],
  },
];
