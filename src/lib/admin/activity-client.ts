// Client-only: writes to public.activity_log. RLS requires actor_staff_id
// to match the caller's own staff_id — see 0014_activity_log.sql (public
// repo's migrations).

"use client";

import { createClient } from "@/lib/supabase/client";

export async function logActivity(
  actorStaffId: string,
  category: string,
  action: string,
  targetLabel: string,
  targetHref?: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("activity_log").insert({
    actor_staff_id: actorStaffId,
    category,
    action,
    target_label: targetLabel,
    target_href: targetHref ?? null,
  });

  if (error) {
    console.error("logActivity: insert failed", error);
  }
}
