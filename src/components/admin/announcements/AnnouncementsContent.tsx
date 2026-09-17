"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateAnnouncementModal, { type CreatedAnnouncement } from "./CreateAnnouncementModal";
import type { AdminAnnouncement } from "@/lib/admin/announcements";
import type { AnnouncementAudience } from "@/lib/admin/types";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

const AUDIENCE_LABEL: Record<AnnouncementAudience, string> = {
  everyone: "Everyone",
  staff: "Staff only",
  intern: "Interns only",
};

export default function AnnouncementsContent({
  announcements,
  authorStaffId,
}: {
  announcements: AdminAnnouncement[];
  authorStaffId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(() => searchParams.get("new") === "1");
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  const rows = useMemo(() => announcements, [announcements]);

  const handleCreated = (announcement: CreatedAnnouncement) => {
    setModalOpen(false);
    setCreatedMessage(`"${announcement.title}" was created.`);
    router.refresh();
  };

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            08 <span className="text-accent">/ Announcements</span>
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

      {createdMessage && (
        <p className="dash-fade mt-6 text-[11px] font-medium tracking-[0.15em] text-accent uppercase">
          {createdMessage}
        </p>
      )}

      <div className="dash-fade mt-8 overflow-x-auto border border-line" style={{ animationDelay: "0.12s" }}>
        {rows.length > 0 ? (
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
                    {AUDIENCE_LABEL[row.audience]}
                  </td>
                  <td className="whitespace-nowrap text-soft-white/50">{formatDate(row.createdAt)}</td>
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
        ) : (
          <p className="px-6 py-10 text-center text-sm text-soft-white/45">No announcements yet.</p>
        )}
      </div>

      {modalOpen && (
        <CreateAnnouncementModal
          authorStaffId={authorStaffId}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
