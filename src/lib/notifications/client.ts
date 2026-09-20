// Client-only: the "Notification Service" other client-write modules call
// right after a real mutation succeeds — same fire-and-forget convention as
// logActivity (activity-client.ts). RLS (0019_notifications.sql) lets
// staff/admin create a notification for anyone; everyone can manage their
// own read state and preferences.

"use client";

import { createClient } from "@/lib/supabase/client";
import { TYPE_META, type Notification, type NotificationPreferences, type NotificationType } from "./types";

export type NotifyInput = {
  recipientStaffId: string;
  title: string;
  message: string;
  type: NotificationType;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  priority?: "normal" | "important";
  /** Same event firing twice (retry, double-submit) reuses this key instead of creating a duplicate row. */
  dedupeKey?: string;
  /** Overrides the type's default (e.g. the Admin announcement composer's "Email" checkbox). */
  sendEmail?: boolean;
};

// Inserts the notification row, then — if email was requested — asks the
// send-notification-email Edge Function to deliver it. The Edge Function
// re-checks the recipient's own preferences before actually sending (this
// client can't read another user's preferences; RLS blocks that), so this
// is only a request, not a guarantee.
export async function notify(input: NotifyInput): Promise<void> {
  try {
    const supabase = createClient();
    const meta = TYPE_META[input.type];
    const emailRequested = input.sendEmail ?? meta.emailByDefault;

    const { data, error } = await supabase
      .from("notifications")
      .upsert(
        {
          recipient_staff_id: input.recipientStaffId,
          title: input.title,
          message: input.message,
          type: input.type,
          category: meta.category,
          priority: input.priority ?? "normal",
          entity_type: input.entityType ?? null,
          entity_id: input.entityId ?? null,
          action_url: input.actionUrl ?? null,
          email_requested: emailRequested,
          dedupe_key: input.dedupeKey ?? null,
        },
        input.dedupeKey ? { onConflict: "recipient_staff_id,dedupe_key", ignoreDuplicates: true } : undefined
      )
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("notify: insert failed", error);
      return;
    }
    if (!data) {
      // Deduped: an identical notification already exists for this key.
      return;
    }

    if (emailRequested) {
      const { error: fnError } = await supabase.functions.invoke("send-notification-email", {
        body: { notification_id: data.id },
      });
      if (fnError) {
        // Non-fatal — the in-app notification above already succeeded.
        console.error("notify: send-notification-email invoke failed", fnError);
      }
    }
  } catch (err) {
    console.error("notify: unexpected failure", err);
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  if (error) console.error("markNotificationRead: update failed", error);
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  if (error) console.error("markAllNotificationsRead: update failed", error);
}

export async function updateNotificationPreferences(
  staffId: string,
  patch: Partial<Omit<NotificationPreferences, "staffId">>
): Promise<boolean> {
  const supabase = createClient();
  const columns: Record<string, boolean> = {};
  if (patch.taskEmail !== undefined) columns.task_email = patch.taskEmail;
  if (patch.leadEmail !== undefined) columns.lead_email = patch.leadEmail;
  if (patch.followupEmail !== undefined) columns.followup_email = patch.followupEmail;
  if (patch.projectEmail !== undefined) columns.project_email = patch.projectEmail;
  if (patch.announcementEmail !== undefined) columns.announcement_email = patch.announcementEmail;
  if (patch.attendanceEmail !== undefined) columns.attendance_email = patch.attendanceEmail;
  if (patch.applicationEmail !== undefined) columns.application_email = patch.applicationEmail;

  const { error } = await supabase.from("notification_preferences").upsert({ staff_id: staffId, ...columns });
  if (error) {
    console.error("updateNotificationPreferences: upsert failed", error);
    return false;
  }
  return true;
}

export function rowToNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    recipientStaffId: row.recipient_staff_id as string,
    title: row.title as string,
    message: row.message as string,
    type: row.type as NotificationType,
    category: row.category as Notification["category"],
    priority: row.priority as Notification["priority"],
    entityType: (row.entity_type as string | null) ?? null,
    entityId: (row.entity_id as string | null) ?? null,
    actionUrl: (row.action_url as string | null) ?? null,
    isRead: row.is_read as boolean,
    emailRequested: row.email_requested as boolean,
    emailSent: row.email_sent as boolean,
    createdAt: row.created_at as string,
  };
}

type ChannelEntry = {
  channel: ReturnType<ReturnType<typeof createClient>["channel"]>;
  listeners: Set<(notification: Notification) => void>;
};

// One real Realtime channel per staffId, shared across however many
// components ask for it — the notification bell renders 3 times per page
// (desktop sidebar, mobile drawer, mobile topbar), and Supabase's Realtime
// client throws if a second `.on("postgres_changes", ...)` is registered on
// a channel that's already `.subscribe()`d. Without this, the 2nd/3rd bell
// instance crashed the whole page on mount.
const activeChannels = new Map<string, ChannelEntry>();

// Subscribes to new notifications for one recipient. Returns an unsubscribe
// function — always call it on unmount/logout. The underlying channel is
// only created once per staffId and torn down once the last subscriber
// unsubscribes.
export function subscribeToNotifications(staffId: string, onInsert: (notification: Notification) => void): () => void {
  const supabase = createClient();
  let entry = activeChannels.get(staffId);

  if (!entry) {
    const listeners = new Set<(notification: Notification) => void>();
    const channel = supabase
      .channel(`notifications:${staffId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `recipient_staff_id=eq.${staffId}` },
        (payload) => {
          const notification = rowToNotification(payload.new as Record<string, unknown>);
          listeners.forEach((listener) => listener(notification));
        }
      )
      .subscribe();
    entry = { channel, listeners };
    activeChannels.set(staffId, entry);
  }

  entry.listeners.add(onInsert);

  return () => {
    const current = activeChannels.get(staffId);
    if (!current) return;
    current.listeners.delete(onInsert);
    if (current.listeners.size === 0) {
      supabase.removeChannel(current.channel);
      activeChannels.delete(staffId);
    }
  };
}
