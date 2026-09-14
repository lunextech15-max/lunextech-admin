// System-wide activity timeline. New admin-only aggregate — not derived
// from per-project/per-task activity feeds (those stay scoped to their own
// pages); this is a separate, deliberately curated operational log.

import type { AdminActivityEntry } from "./types";

export const MOCK_ADMIN_ACTIVITY: AdminActivityEntry[] = [
  {
    id: "aa-1",
    category: "interns",
    title: "Admin created intern account",
    description: "IN-006 created.",
    relativeTime: "2 hours ago",
    day: "Today",
  },
  {
    id: "aa-2",
    category: "tasks",
    title: "Task completed",
    description: "Design system review completed on LUNEX Website Relaunch.",
    relativeTime: "4 hours ago",
    day: "Today",
  },
  {
    id: "aa-3",
    category: "people",
    title: "New application received",
    description: "Candidate 01 applied for Frontend Development.",
    relativeTime: "6 hours ago",
    day: "Today",
  },
  {
    id: "aa-4",
    category: "projects",
    title: "Project updated",
    description: "SatQuery AI progress updated to 60%.",
    relativeTime: "1 day ago",
    day: "Yesterday",
  },
  {
    id: "aa-5",
    category: "system",
    title: "Announcement published",
    description: "\"System maintenance\" published to everyone.",
    relativeTime: "1 day ago",
    day: "Yesterday",
    important: true,
  },
  {
    id: "aa-6",
    category: "tasks",
    title: "Task overdue",
    description: "Payment integration on SmartBuyX passed its due date.",
    relativeTime: "1 day ago",
    day: "Yesterday",
    important: true,
  },
  {
    id: "aa-7",
    category: "interns",
    title: "Intern milestone approaching",
    description: "IN-005 internship ends in 3 days.",
    relativeTime: "2 days ago",
    day: "Earlier",
  },
  {
    id: "aa-8",
    category: "people",
    title: "Staff account created",
    description: "LX-008 created.",
    relativeTime: "5 days ago",
    day: "Earlier",
  },
  {
    id: "aa-9",
    category: "projects",
    title: "Project created",
    description: "SmartBuyX added to the active project roster.",
    relativeTime: "1 week ago",
    day: "Earlier",
  },
];
