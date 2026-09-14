"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CreateAnnouncementModal, { type NewAnnouncement } from "./CreateAnnouncementModal";
import type { StaffAnnouncement } from "@/lib/staff/types";
import type { AnnouncementAudience } from "@/lib/admin/types";

type Row = {
  id: string;
  title: string;
  audience: AnnouncementAudience;
  publishedDate: string;
  published: boolean;
};

function loadAnnouncements(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 450));
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default function AnnouncementsContent({ base }: { base: StaffAnnouncement[] }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(() => searchParams.get("new") === "1");
  const [rows, setRows] = useState<Row[]>(() =>
    base.map((a) => ({ id: a.id, title: a.title, audience: "everyone", publishedDate: a.createdAt, published: true }))
  );

  useEffect(() => {
    let cancelled = false;
    loadAnnouncements().then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = (announcement: NewAnnouncement) => {
    setRows((prev) => [
      {
        id: `local-${prev.length + 1}`,
        title: announcement.title,
        audience: announcement.audience,
        publishedDate: new Date().toISOString().slice(0, 10),
        published: announcement.published,
      },
      ...prev,
    ]);
    setModalOpen(false);
  };

  const audienceLabel = useMemo(
    () => ({ everyone: "Everyone", staff: "Staff only", intern: "Interns only" }) as Record<AnnouncementAudience, string>,
    []
  );

  if (loading) {
    return (
      <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="dash-skeleton h-4 w-32" />
        <div className="dash-skeleton mt-4 h-10 w-56" />
        <div className="dash-skeleton mt-8 h-40" />
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            07 <span className="text-accent">/ Announcements</span>
          </p>
          <h1 className="mt-4 font-display text-[10vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            Announcements.
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="task-action shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          + Create announcement
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
      </div>

      <div className="dash-fade mt-8 overflow-x-auto border border-line" style={{ animationDelay: "0.12s" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Audience</th>
              <th>Published</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td className="whitespace-nowrap text-[11px] font-medium tracking-[0.15em] text-accent uppercase">
                  {audienceLabel[row.audience]}
                </td>
                <td className="whitespace-nowrap text-soft-white/50">{formatDate(row.publishedDate)}</td>
                <td className="whitespace-nowrap">
                  <span className={`dash-status ${row.published ? "dash-status--completed" : "dash-status--todo"}`}>
                    {row.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="whitespace-nowrap text-right">
                  <a
                    href={`/staff/announcements/${row.id}`}
                    className="admin-table-link text-xs font-medium tracking-[0.15em] uppercase"
                  >
                    Open →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <CreateAnnouncementModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}
