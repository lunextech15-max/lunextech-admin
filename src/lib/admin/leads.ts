// Server-only: reads real leads across every caller from Supabase
// public.leads — admin sees everything, per RLS
// (0013_cold_caller_portal.sql, in the public repo's migrations).

import { createClient } from "@/lib/supabase/server";
import { getAllStaff } from "./team";
import type { LeadPriority, LeadStatus } from "@/lib/caller/types";

type LeadRow = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  source: string;
  assigned_caller_id: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  follow_up_date: string | null;
  last_contact_at: string | null;
  created_at: string;
};

export type AdminLead = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  location: string;
  source: string;
  assignedCallerId: string | null;
  assignedCallerName: string;
  status: LeadStatus;
  priority: LeadPriority;
  followUpDate: string | null;
  lastContactAt: string | null;
  createdAt: string;
};

export async function getAllLeads(): Promise<AdminLead[]> {
  const supabase = await createClient();
  const [{ data, error }, { staff }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    getAllStaff(),
  ]);

  if (error) {
    console.error("getAllLeads: query failed", error);
    return [];
  }

  const nameByStaffId = new Map(staff.map((s) => [s.staff_id, s.full_name]));
  const rows = (data ?? []) as LeadRow[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    location: row.location,
    source: row.source,
    assignedCallerId: row.assigned_caller_id,
    assignedCallerName: row.assigned_caller_id
      ? nameByStaffId.get(row.assigned_caller_id) ?? row.assigned_caller_id
      : "Unassigned",
    status: row.status,
    priority: row.priority,
    followUpDate: row.follow_up_date,
    lastContactAt: row.last_contact_at,
    createdAt: row.created_at.slice(0, 10),
  }));
}

/** Callers eligible for lead assignment, for the picker in the Create Lead
 * form. */
export async function getCallerOptions(): Promise<{ lunexId: string; name: string }[]> {
  const { staff } = await getAllStaff();
  return staff.filter((s) => s.role === "caller").map((s) => ({ lunexId: s.staff_id, name: s.full_name }));
}
