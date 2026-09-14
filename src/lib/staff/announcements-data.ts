// Staff Portal — Announcements. Single centralized source; the Dashboard's
// announcement widget and the dedicated Announcements module both read from
// this same list. All content is grounded in this project's own established
// demo universe (real project/portal names) — never fabricated business
// claims. Replace with a real fetch once a backend exists.

import type { StaffAnnouncement } from "./types";

export const MOCK_ANNOUNCEMENTS: StaffAnnouncement[] = [
  {
    id: "announcement-001",
    title: "New project initiated",
    content: "SmartBuyX has been added to the active project roster.",
    category: "project",
    priority: "normal",
    authorId: "JD",
    authorName: "John Doe",
    createdAt: "2026-09-13",
    relativeTime: "1 day ago",
  },
  {
    id: "announcement-002",
    title: "Team update",
    content: "Weekly project review scheduled for Friday.",
    category: "team",
    priority: "normal",
    authorId: "SK",
    authorName: "Team member",
    createdAt: "2026-09-11",
    relativeTime: "3 days ago",
  },
  {
    id: "announcement-003",
    title: "System maintenance",
    content:
      "The staff portal will undergo scheduled maintenance this weekend. Some features may be briefly unavailable.",
    category: "system",
    priority: "important",
    authorId: "SK",
    authorName: "Team member",
    createdAt: "2026-09-10",
    relativeTime: "4 days ago",
  },
  {
    id: "announcement-004",
    title: "SatQuery AI milestone reached",
    content: "SatQuery AI has entered the system evaluation phase.",
    category: "project",
    priority: "normal",
    authorId: "JD",
    authorName: "John Doe",
    createdAt: "2026-09-09",
    relativeTime: "5 days ago",
  },
  {
    id: "announcement-005",
    title: "New team member onboarding",
    content: "Please welcome new contributors joining the SmartBuyX project team.",
    category: "team",
    priority: "normal",
    authorId: "AR",
    authorName: "Team member",
    createdAt: "2026-09-07",
    relativeTime: "1 week ago",
  },
  {
    id: "announcement-006",
    title: "Portal update",
    content: "The Staff Portal now includes a Team directory and My Tasks workspace.",
    category: "system",
    priority: "normal",
    authorId: "JD",
    authorName: "John Doe",
    createdAt: "2026-09-05",
    relativeTime: "1 week ago",
  },
];
