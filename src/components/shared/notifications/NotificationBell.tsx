"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { markNotificationRead, markAllNotificationsRead, rowToNotification, subscribeToNotifications } from "@/lib/notifications/client";
import { TYPE_ICON, timeAgo } from "@/lib/notifications/ui";
import type { Notification } from "@/lib/notifications/types";
import "@/styles/notifications.css";

export default function NotificationBell({ staffId, notificationsHref }: { staffId: string; notificationsHref: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    (async () => {
      const [recentRes, countRes] = await Promise.all([
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(8),
        supabase.from("notifications").select("*", { count: "exact", head: true }).eq("is_read", false),
      ]);
      if (cancelled) return;
      setNotifications(((recentRes.data ?? []) as Record<string, unknown>[]).map(rowToNotification));
      setUnreadCount(countRes.count ?? 0);
    })();

    const unsubscribe = subscribeToNotifications(staffId, (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 8));
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [staffId]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleSelect = async (notification: Notification) => {
    setOpen(false);
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      void markNotificationRead(notification.id);
    }
    if (notification.actionUrl) router.push(notification.actionUrl);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    void markAllNotificationsRead();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="notif-bell"
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M10 2c-2.3 0-4 1.9-4 4.2v3l-1.6 3.1c-.3.6.1 1.2.7 1.2h9.8c.6 0 1-.6.7-1.2L14 9.2v-3C14 3.9 12.3 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M8 15.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-bell-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel" role="menu">
          <div className="notif-panel-head">
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/50 uppercase">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[10px] font-medium tracking-[0.1em] text-accent uppercase"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-panel-list">
            {notifications.length === 0 ? (
              <p className="notif-empty">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(notification)}
                  className={`notif-item ${!notification.isRead ? "is-unread" : ""}`}
                >
                  <span className="notif-item-icon" aria-hidden>
                    {TYPE_ICON[notification.type] ?? "●"}
                  </span>
                  <span className="notif-item-body">
                    <span className="notif-item-title block">{notification.title}</span>
                    <span className="notif-item-message block">{notification.message}</span>
                    <span className="notif-item-meta">{timeAgo(notification.createdAt)}</span>
                  </span>
                  {!notification.isRead && <span className="notif-item-unread-dot" aria-hidden />}
                </button>
              ))
            )}
          </div>

          <div className="notif-panel-foot">
            <a
              href={notificationsHref}
              className="text-[10.5px] font-semibold tracking-[0.15em] text-soft-white/70 uppercase"
            >
              View all →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
