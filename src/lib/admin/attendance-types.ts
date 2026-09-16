export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "leave";

export type AttendanceRecord = {
  id: string;
  staffId: string;
  name: string;
  role: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkIn: string | null; // HH:MM
  checkOut: string | null; // HH:MM
  notes: string;
  markedBy: string | null;
};

export type AttendanceSettings = {
  workStartTime: string; // HH:MM
  workEndTime: string; // HH:MM
  lateAfterMinutes: number;
};

export const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  "half-day": "Half day",
  leave: "On leave",
};

// Reuses the existing dash-status modifier set rather than inventing new
// colors — late is the only status that gets the accent.
export const STATUS_CLASS: Record<AttendanceStatus, string> = {
  present: "dash-status--completed",
  late: "dash-status--in-progress",
  absent: "dash-status--archived",
  "half-day": "dash-status--planning",
  leave: "dash-status--todo",
};
