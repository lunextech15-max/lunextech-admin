// Client-only: writes to public.leads. Admin-only for insert/delete, per
// RLS (0013_cold_caller_portal.sql, in the public repo's migrations).

"use client";

import { createClient } from "@/lib/supabase/client";
import type { LeadPriority } from "@/lib/caller/types";

export type NewLeadInput = {
  name: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  source: string;
  assignedCallerId: string;
  priority: LeadPriority;
  requirement: string;
  createdBy: string;
};

export async function createLead(input: NewLeadInput): Promise<{ error: string | null; id: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      company: input.company,
      phone: input.phone,
      email: input.email,
      location: input.location,
      source: input.source,
      assigned_caller_id: input.assignedCallerId || null,
      priority: input.priority,
      requirement: input.requirement,
      created_by: input.createdBy,
    })
    .select("id")
    .single();

  return { error: error?.message ?? null, id: (data as { id: string } | null)?.id ?? null };
}

export async function deleteLead(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  return { error: error?.message ?? null };
}
