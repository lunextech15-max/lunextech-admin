// Server-only: reads from public.notifications / public.notification_preferences.
// RLS (0019_notifications.sql) already scopes every query to the caller's
// own rows, so these never filter by staff_id themselves — same convention
// as the rest of this codebase (e.g. getAttendanceRecords).

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PREFERENCES, type Notification, type NotificationPreferences, type NotificationType } from "./types";

type NotificationRow = {
  id: string;
  recipient_staff_id: string;
  title: string;
  message: string;
  type: string;
  category: Notification["category"];
  priority: Notification["priority"];
  entity_type: string | null;
  entity_id: string | null;
  action_url: string | null;
  is_read: boolean;
  email_requested: boolean;
  email_sent: boolean;
  created_at: string;
};

function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    recipientStaffId: row.recipient_staff_id,
    title: row.title,
    message: row.message,
    type: row.type as NotificationType,
    category: row.category,
    priority: row.priority,
    entityType: row.entity_type,
    entityId: row.entity_id,
    actionUrl: row.action_url,
    isRead: row.is_read,
    emailRequested: row.email_requested,
    emailSent: row.email_sent,
    createdAt: row.created_at,
  };
}

const PAGE_SIZE = 20;

export async function getNotifications(opts?: {
  filter?: "all" | "unread" | "read";
  category?: Notification["category"];
  page?: number;
}): Promise<{ notifications: Notification[]; total: number }> {
  const supabase = await createClient();
  const page = opts?.page ?? 0;

  let query = supabase.from("notifications").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (opts?.filter === "unread") query = query.eq("is_read", false);
  if (opts?.filter === "read") query = query.eq("is_read", true);
  if (opts?.category) query = query.eq("category", opts.category);
  query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("getNotifications: query failed", error);
    return { notifications: [], total: 0 };
  }
  return { notifications: (data ?? []).map((r) => toNotification(r as NotificationRow)), total: count ?? 0 };
}

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);
  if (error) {
    console.error("getUnreadCount: query failed", error);
    return 0;
  }
  return count ?? 0;
}

export async function getRecentNotifications(limit = 8): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getRecentNotifications: query failed", error);
    return [];
  }
  return (data ?? []).map((r) => toNotification(r as NotificationRow));
}

export async function getNotificationPreferences(staffId: string): Promise<NotificationPreferences> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("staff_id", staffId)
    .maybeSingle();

  if (error) {
    console.error("getNotificationPreferences: query failed", error);
  }
  if (!data) {
    return { staffId, ...DEFAULT_PREFERENCES };
  }
  return {
    staffId,
    taskEmail: data.task_email,
    leadEmail: data.lead_email,
    followupEmail: data.followup_email,
    projectEmail: data.project_email,
    announcementEmail: data.announcement_email,
    attendanceEmail: data.attendance_email,
    applicationEmail: data.application_email,
  };
}
