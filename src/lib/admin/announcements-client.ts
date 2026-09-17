// Client-only: writes to public.announcements. Staff+admin can create/edit;
// admin can delete — enforced by RLS (0012_announcements.sql).

"use client";

import { createClient } from "@/lib/supabase/client";
import type { AnnouncementAudience } from "./types";

export type NewAnnouncementInput = {
  title: string;
  content: string;
  category: "general" | "project" | "team" | "system";
  priority: "normal" | "important";
  audience: AnnouncementAudience;
  published: boolean;
  authorStaffId: string;
};

export async function createAnnouncement(
  input: NewAnnouncementInput
): Promise<{ error: string | null; id: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: input.title,
      content: input.content,
      category: input.category,
      priority: input.priority,
      audience: input.audience,
      published: input.published,
      author_staff_id: input.authorStaffId,
    })
    .select("id")
    .single();

  return { error: error?.message ?? null, id: (data as { id: string } | null)?.id ?? null };
}
