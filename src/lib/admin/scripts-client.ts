// Client-only: writes to public.call_scripts. Admin-only, per RLS
// (0013_cold_caller_portal.sql, in the public repo's migrations).

"use client";

import { createClient } from "@/lib/supabase/client";

export type NewScriptInput = {
  title: string;
  category: string;
  content: string;
};

export async function createScript(input: NewScriptInput): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("call_scripts").insert({
    title: input.title,
    category: input.category,
    content: input.content,
  });
  return { error: error?.message ?? null };
}

export async function updateScript(
  id: string,
  input: NewScriptInput
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("call_scripts")
    .update({ title: input.title, category: input.category, content: input.content, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteScript(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("call_scripts").delete().eq("id", id);
  return { error: error?.message ?? null };
}
