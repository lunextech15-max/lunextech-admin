// Server-only sibling to notify() (client.ts), for use inside Server
// Actions that already hold the service-role client (create-account.ts) —
// bypasses RLS since the action itself already re-verified admin access via
// requireAdmin(). Never throws: a failed notification must never fail the
// action that triggered it (an account/task/lead still gets created even
// if this fails).

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { TYPE_META, type NotificationType } from "./types";

export type CreateNotificationInput = {
  recipientStaffId: string;
  title: string;
  message: string;
  type: NotificationType;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  priority?: "normal" | "important";
  dedupeKey?: string;
  sendEmail?: boolean;
};

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const meta = TYPE_META[input.type];
    const emailRequested = input.sendEmail ?? meta.emailByDefault;

    const { data, error } = await admin
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
      console.error("createNotification: insert failed", error);
      return;
    }
    if (!data) return; // deduped — identical notification already exists

    if (emailRequested) {
      await dispatchEmail(data.id as string);
    }
  } catch (err) {
    console.error("createNotification: unexpected failure", err);
  }
}

async function dispatchEmail(notificationId: string): Promise<void> {
  const functionsUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification-email`
    : null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!functionsUrl || !serviceKey) {
    console.error("createNotification: missing Supabase URL or service role key for email dispatch");
    return;
  }
  try {
    const response = await fetch(functionsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
      body: JSON.stringify({ notification_id: notificationId }),
    });
    if (!response.ok) console.error("createNotification: edge function returned", response.status);
  } catch (err) {
    console.error("createNotification: email dispatch failed", err);
  }
}
