// Server-only: reads real announcements from Supabase public.announcements
// — admin sees every row (published and drafts), per RLS
// (0012_announcements.sql, in the public repo's migrations).

import { createClient } from "@/lib/supabase/server";
import { getAllStaff } from "./team";
import type { AnnouncementAudience } from "./types";

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  audience: AnnouncementAudience;
  published: boolean;
  author_staff_id: string;
  created_at: string;
};

export type AdminAnnouncement = {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  audience: AnnouncementAudience;
  published: boolean;
  authorName: string;
  createdAt: string;
};

export async function getAllAnnouncements(): Promise<AdminAnnouncement[]> {
  const supabase = await createClient();
  const [{ data, error }, { staff }] = await Promise.all([
    supabase.from("announcements").select("*").order("created_at", { ascending: false }),
    getAllStaff(),
  ]);

  if (error) {
    console.error("getAllAnnouncements: query failed", error);
    return [];
  }

  const nameByStaffId = new Map(staff.map((s) => [s.staff_id, s.full_name]));
  const rows = (data ?? []) as AnnouncementRow[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    priority: row.priority,
    audience: row.audience,
    published: row.published,
    authorName: nameByStaffId.get(row.author_staff_id) ?? row.author_staff_id,
    createdAt: row.created_at.slice(0, 10),
  }));
}
