"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateNotificationPreferences } from "@/lib/notifications/client";
import { DEFAULT_PREFERENCES, type NotificationPreferences } from "@/lib/notifications/types";

const ROWS: { key: keyof Omit<NotificationPreferences, "staffId">; label: string; hint: string }[] = [
  { key: "taskEmail", label: "Task assignments", hint: "When a task is assigned to you" },
  { key: "leadEmail", label: "Lead assignments", hint: "When a lead is assigned to you" },
  { key: "followupEmail", label: "Follow-up reminders", hint: "When a lead follow-up is due" },
  { key: "projectEmail", label: "Project updates", hint: "When you're assigned to or a project changes" },
  { key: "announcementEmail", label: "Announcements", hint: "Company and team announcements" },
  { key: "attendanceEmail", label: "Attendance", hint: "Attendance reminders and corrections" },
  { key: "applicationEmail", label: "Applications", hint: "Application status changes" },
];

// Account/security emails (account creation, password reset, system
// alerts) are never listed here — they're never gated by preferences, by
// design (see TYPE_META in lib/notifications/types.ts).
export default function NotificationPreferencesPanel({ staffId }: { staffId: string }) {
  const [prefs, setPrefs] = useState<Omit<NotificationPreferences, "staffId">>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("notification_preferences").select("*").eq("staff_id", staffId).maybeSingle();
      if (cancelled) return;
      if (data) {
        setPrefs({
          taskEmail: data.task_email,
          leadEmail: data.lead_email,
          followupEmail: data.followup_email,
          projectEmail: data.project_email,
          announcementEmail: data.announcement_email,
          attendanceEmail: data.attendance_email,
          applicationEmail: data.application_email,
        });
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [staffId]);

  const toggle = async (key: (typeof ROWS)[number]["key"]) => {
    const next = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: next }));
    setSavingKey(key);
    await updateNotificationPreferences(staffId, { [key]: next });
    setSavingKey(null);
  };

  return (
    <div className={loaded ? "" : "opacity-60"}>
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0">
          <div>
            <p className="text-sm font-medium text-soft-white/85">{row.label}</p>
            <p className="mt-0.5 text-[11px] text-soft-white/40">{row.hint}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs[row.key]}
            aria-label={`${prefs[row.key] ? "Disable" : "Enable"} email for ${row.label}`}
            disabled={savingKey === row.key}
            onClick={() => void toggle(row.key)}
            className={`notif-pref-toggle ${prefs[row.key] ? "is-on" : ""}`}
          >
            <span className="notif-pref-toggle-knob" />
          </button>
        </div>
      ))}
    </div>
  );
}
