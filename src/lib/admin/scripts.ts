// Server-only: reads call scripts from Supabase public.call_scripts.

import { createClient } from "@/lib/supabase/server";

export type AdminScript = {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
};

export async function getAllScripts(): Promise<AdminScript[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("call_scripts")
    .select("id, title, category, content, updated_at")
    .order("position", { ascending: true });

  if (error) {
    console.error("getAllScripts: query failed", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    content: row.content,
    updatedAt: row.updated_at.slice(0, 10),
  }));
}
