import type { NotificationType } from "./types";

export const TYPE_ICON: Record<NotificationType, string> = {
  ACCOUNT_CREATED: "●",
  PASSWORD_RESET: "●",
  TASK_ASSIGNED: "◆",
  TASK_UPDATED: "◆",
  LEAD_ASSIGNED: "▲",
  LEAD_UPDATED: "▲",
  FOLLOW_UP_DUE: "▲",
  PROJECT_ASSIGNED: "■",
  PROJECT_UPDATED: "■",
  ANNOUNCEMENT: "◈",
  APPLICATION_RECEIVED: "◇",
  APPLICATION_STATUS_UPDATED: "◇",
  ATTENDANCE_REMINDER: "○",
  ATTENDANCE_UPDATED: "○",
  COMMENT_ADDED: "◆",
  SYSTEM_ALERT: "!",
};

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
