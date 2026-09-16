// Server-only: reads real attendance data from Supabase public.attendance /
// public.attendance_settings — admin sees everyone's rows, per RLS
// (0010_attendance.sql, in the public repo's migrations).

import { createClient } from "@/lib/supabase/server";
import { getAllStaff } from "./team";
import type { AttendanceRecord, AttendanceSettings, AttendanceStatus } from "./attendance-types";

type AttendanceRow = {
  id: string;
  staff_id: string;
  date: string;
  status: AttendanceStatus;
  check_in: string | null;
  check_out: string | null;
  notes: string;
  marked_by: string | null;
};

export type AttendanceResult = { records: AttendanceRecord[]; error: boolean };

export async function getAllAttendance(opts?: { from?: string; to?: string }): Promise<AttendanceResult> {
  const supabase = await createClient();
  let query = supabase.from("attendance").select("*").order("date", { ascending: false });
  if (opts?.from) query = query.gte("date", opts.from);
  if (opts?.to) query = query.lte("date", opts.to);

  const [{ data, error }, { staff }] = await Promise.all([query, getAllStaff()]);

  if (error) {
    console.error("getAllAttendance: query failed", error);
    return { records: [], error: true };
  }

  const staffById = new Map(staff.map((s) => [s.staff_id, s]));
  const rows = (data ?? []) as AttendanceRow[];

  return {
    records: rows.map((row) => {
      const person = staffById.get(row.staff_id);
      return {
        id: row.id,
        staffId: row.staff_id,
        name: person?.full_name ?? row.staff_id,
        role: person?.role ?? "—",
        date: row.date,
        status: row.status,
        checkIn: row.check_in?.slice(0, 5) ?? null,
        checkOut: row.check_out?.slice(0, 5) ?? null,
        notes: row.notes,
        markedBy: row.marked_by,
      };
    }),
    error: false,
  };
}

export async function getAttendanceSettings(): Promise<AttendanceSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_settings")
    .select("work_start_time, work_end_time, late_after_minutes")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    console.error("getAttendanceSettings: query failed", error);
    return { workStartTime: "09:30", workEndTime: "18:30", lateAfterMinutes: 15 };
  }

  return {
    workStartTime: data.work_start_time.slice(0, 5),
    workEndTime: data.work_end_time.slice(0, 5),
    lateAfterMinutes: data.late_after_minutes,
  };
}
