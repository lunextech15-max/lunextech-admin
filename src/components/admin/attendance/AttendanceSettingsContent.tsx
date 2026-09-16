"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { updateAttendanceSettings } from "@/lib/admin/attendance-client";
import type { AttendanceSettings } from "@/lib/admin/attendance-types";

export default function AttendanceSettingsContent({ settings }: { settings: AttendanceSettings }) {
  const [workStartTime, setWorkStartTime] = useState(settings.workStartTime);
  const [workEndTime, setWorkEndTime] = useState(settings.workEndTime);
  const [lateAfterMinutes, setLateAfterMinutes] = useState(settings.lateAfterMinutes);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setStatus(null);

    const { error } = await updateAttendanceSettings({ workStartTime, workEndTime, lateAfterMinutes });

    setPending(false);
    setStatus(error ? `Couldn't save: ${error}` : "Saved.");
  };

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <Link href="/admin/attendance" className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase">
        ← Attendance
      </Link>

      <p className="mt-6 text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
        06 <span className="text-accent">/ Attendance policy</span>
      </p>
      <h1 className="mt-4 font-display text-[9vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
        Attendance settings.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-soft-white/55">
        Organization-wide work hours and the grace period before a check-in counts as late.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex max-w-lg flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="staff-field-label" htmlFor="work-start">
              Work start time
            </label>
            <input
              id="work-start"
              type="time"
              className="admin-input mt-2"
              value={workStartTime}
              onChange={(e) => setWorkStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="staff-field-label" htmlFor="work-end">
              Work end time
            </label>
            <input
              id="work-end"
              type="time"
              className="admin-input mt-2"
              value={workEndTime}
              onChange={(e) => setWorkEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="staff-field-label" htmlFor="late-after">
            Late after (minutes past start time)
          </label>
          <input
            id="late-after"
            type="number"
            min={0}
            max={180}
            className="admin-input mt-2"
            value={lateAfterMinutes}
            onChange={(e) => setLateAfterMinutes(Number(e.target.value))}
            required
          />
        </div>

        {status && (
          <p role="status" aria-live="polite" className="text-[11px] font-medium tracking-[0.1em] text-accent uppercase">
            {status}
          </p>
        )}

        <div className="mt-2">
          <button
            type="submit"
            disabled={pending}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save settings"}
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
