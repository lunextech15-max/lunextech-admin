export type NotificationCategory =
  | "account"
  | "task"
  | "lead"
  | "project"
  | "announcement"
  | "application"
  | "attendance"
  | "system";

// Extensible by design: a new type is a new string here + an entry in
// TYPE_META below — never a schema migration (see 0019_notifications.sql).
export type NotificationType =
  | "ACCOUNT_CREATED"
  | "PASSWORD_RESET"
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "LEAD_ASSIGNED"
  | "LEAD_UPDATED"
  | "FOLLOW_UP_DUE"
  | "PROJECT_ASSIGNED"
  | "PROJECT_UPDATED"
  | "ANNOUNCEMENT"
  | "APPLICATION_RECEIVED"
  | "APPLICATION_STATUS_UPDATED"
  | "ATTENDANCE_REMINDER"
  | "ATTENDANCE_UPDATED"
  | "COMMENT_ADDED"
  | "SYSTEM_ALERT";

export type NotificationPriority = "normal" | "important";

export type Notification = {
  id: string;
  recipientStaffId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  entityType: string | null;
  entityId: string | null;
  actionUrl: string | null;
  isRead: boolean;
  emailRequested: boolean;
  emailSent: boolean;
  createdAt: string;
};

export type NotificationPreferences = {
  staffId: string;
  taskEmail: boolean;
  leadEmail: boolean;
  followupEmail: boolean;
  projectEmail: boolean;
  announcementEmail: boolean;
  attendanceEmail: boolean;
  applicationEmail: boolean;
};

export const DEFAULT_PREFERENCES: Omit<NotificationPreferences, "staffId"> = {
  taskEmail: true,
  leadEmail: true,
  followupEmail: true,
  projectEmail: true,
  announcementEmail: true,
  attendanceEmail: false,
  applicationEmail: true,
};

// Types that always email regardless of the recipient's preferences —
// checked by the Edge Function, not just the client.
export const CRITICAL_TYPES: NotificationType[] = ["ACCOUNT_CREATED", "PASSWORD_RESET", "SYSTEM_ALERT"];

// Which preference column (if any) gates email for a type, and the
// category/default-email-requested it carries. Central source of truth for
// both the client (create-client.ts) and the Edge Function.
export const TYPE_META: Record<
  NotificationType,
  { category: NotificationCategory; preferenceKey: keyof NotificationPreferences | null; emailByDefault: boolean }
> = {
  ACCOUNT_CREATED: { category: "account", preferenceKey: null, emailByDefault: true },
  PASSWORD_RESET: { category: "account", preferenceKey: null, emailByDefault: true },
  TASK_ASSIGNED: { category: "task", preferenceKey: "taskEmail", emailByDefault: true },
  TASK_UPDATED: { category: "task", preferenceKey: "taskEmail", emailByDefault: false },
  LEAD_ASSIGNED: { category: "lead", preferenceKey: "leadEmail", emailByDefault: true },
  LEAD_UPDATED: { category: "lead", preferenceKey: "leadEmail", emailByDefault: false },
  FOLLOW_UP_DUE: { category: "lead", preferenceKey: "followupEmail", emailByDefault: true },
  PROJECT_ASSIGNED: { category: "project", preferenceKey: "projectEmail", emailByDefault: true },
  PROJECT_UPDATED: { category: "project", preferenceKey: "projectEmail", emailByDefault: false },
  ANNOUNCEMENT: { category: "announcement", preferenceKey: "announcementEmail", emailByDefault: true },
  APPLICATION_RECEIVED: { category: "application", preferenceKey: "applicationEmail", emailByDefault: false },
  APPLICATION_STATUS_UPDATED: { category: "application", preferenceKey: "applicationEmail", emailByDefault: true },
  ATTENDANCE_REMINDER: { category: "attendance", preferenceKey: "attendanceEmail", emailByDefault: false },
  ATTENDANCE_UPDATED: { category: "attendance", preferenceKey: "attendanceEmail", emailByDefault: false },
  COMMENT_ADDED: { category: "task", preferenceKey: null, emailByDefault: false },
  SYSTEM_ALERT: { category: "system", preferenceKey: null, emailByDefault: true },
};
