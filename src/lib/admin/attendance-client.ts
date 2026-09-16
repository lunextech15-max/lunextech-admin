// Client-only: writes to public.attendance / public.attendance_settings.
// Admin-only for settings; staff+admin for marking/correcting/deleting
// records, enforced by RLS (0010_attendance.sql, in the public repo).

"use client";

import { createClient } from "@/lib/supabase/client";
import type { AttendanceSettings, AttendanceStatus } from "./attendance-types";

export type MarkAttendanceInput = {
  staffId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  markedBy: string;
};

/** Upserts one day's record for one person — marking and correcting are the
 * same operation (unique(staff_id, date) on the table). */
export async function markAttendance(input: MarkAttendanceInput): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("attendance").upsert(
    {
      staff_id: input.staffId,
      date: input.date,
      status: input.status,
      check_in: input.checkIn || null,
      check_out: input.checkOut || null,
      notes: input.notes ?? "",
      marked_by: input.markedBy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "staff_id,date" }
  );

  return { error: error?.message ?? null };
}

export async function deleteAttendanceRecord(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from("attendance").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function updateAttendanceSettings(settings: AttendanceSettings): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("attendance_settings")
    .update({
      work_start_time: settings.workStartTime,
      work_end_time: settings.workEndTime,
      late_after_minutes: settings.lateAfterMinutes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  return { error: error?.message ?? null };
}
