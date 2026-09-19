"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { markAllNotificationsRead, markNotificationRead, rowToNotification } from "@/lib/notifications/client";
import { TYPE_ICON, timeAgo } from "@/lib/notifications/ui";
import type { Notification, NotificationCategory } from "@/lib/notifications/types";
import "@/styles/notifications.css";

const PAGE_SIZE = 20;
const READ_FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
] as const;
const CATEGORIES: { id: NotificationCategory; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "task", label: "Tasks" },
  { id: "lead", label: "Leads" },
  { id: "project", label: "Projects" },
  { id: "announcement", label: "Announcements" },
  { id: "application", label: "Applications" },
  { id: "attendance", label: "Attendance" },
  { id: "system", label: "System" },
];

export default function NotificationsPageContent({ breadcrumbNumber }: { breadcrumbNumber: string }) {
  const router = useRouter();
  const [readFilter, setReadFilter] = useState<(typeof READ_FILTERS)[number]["id"]>("all");
  const [category, setCategory] = useState<NotificationCategory | null>(null);
  const [page, setPage] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  // Only tracks the very first fetch — a filter/page change re-queries
  // without flashing a loading state over the list already on screen.
  const [loaded, setLoaded] = useState(false);
  // Bumped to force a re-fetch (e.g. after "mark all read") without the
  // filter/page state itself changing.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      let query = supabase.from("notifications").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (readFilter === "unread") query = query.eq("is_read", false);
      if (readFilter === "read") query = query.eq("is_read", true);
      if (category) query = query.eq("category", category);
      query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (cancelled) return;
      if (error) console.error("NotificationsPageContent: query failed", error);
      setNotifications(((data ?? []) as Record<string, unknown>[]).map(rowToNotification));
      setTotal(count ?? 0);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [readFilter, category, page, refreshKey]);

  const handleSelect = async (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));
      void markNotificationRead(notification.id);
    }
    if (notification.actionUrl) router.push(notification.actionUrl);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsRead();
    setRefreshKey((k) => k + 1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            {breadcrumbNumber} <span className="text-accent">/ Notifications</span>
          </p>
          <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            Notifications.
          </h1>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-semibold tracking-[0.15em] text-soft-white/70 uppercase transition-colors hover:text-accent"
        >
          Mark all read
        </button>
      </div>

      <div className="dash-fade mt-8 flex flex-col gap-4" style={{ animationDelay: "0.06s" }}>
        <div className="notif-filter-row">
          {READ_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setReadFilter(f.id);
                setPage(0);
              }}
              className={`notif-filter-chip ${readFilter === f.id ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="notif-filter-row">
          <button
            type="button"
            onClick={() => {
              setCategory(null);
              setPage(0);
            }}
            className={`notif-filter-chip ${category === null ? "is-active" : ""}`}
          >
            All categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategory(c.id);
                setPage(0);
              }}
              className={`notif-filter-chip ${category === c.id ? "is-active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-fade mt-8 border-t border-line" style={{ animationDelay: "0.12s" }}>
        {!loaded ? (
          <div className="py-16 text-center text-sm text-soft-white/40">Loading…</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-sm text-soft-white/40">No notifications here.</div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleSelect(notification)}
              className={`notif-row w-full text-left ${!notification.isRead ? "is-unread" : ""}`}
            >
              <span className="notif-item-icon" aria-hidden>
                {TYPE_ICON[notification.type] ?? "●"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="notif-row-title block">{notification.title}</span>
                <span className="notif-row-message block">{notification.message}</span>
                <span className="notif-item-meta">
                  {timeAgo(notification.createdAt)}
                  {notification.priority === "important" && (
                    <span className="text-accent">● Important</span>
                  )}
                </span>
              </span>
              {!notification.isRead && <span className="notif-item-unread-dot" aria-hidden />}
            </button>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="text-xs font-semibold tracking-[0.15em] text-soft-white/70 uppercase disabled:opacity-30"
          >
            ← Previous
          </button>
          <p className="text-[11px] font-medium tracking-[0.15em] text-soft-white/40 uppercase">
            Page {page + 1} of {totalPages}
          </p>
          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs font-semibold tracking-[0.15em] text-soft-white/70 uppercase disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
