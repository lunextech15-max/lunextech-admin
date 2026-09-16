"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkAttendanceModal from "./MarkAttendanceModal";
import EmptyState from "@/components/admin/EmptyState";
import { STATUS_CLASS, STATUS_LABEL, type AttendanceRecord, type AttendanceStatus } from "@/lib/admin/attendance-types";

const STATUS_FILTERS: (AttendanceStatus | "all")[] = ["all", "present", "late", "absent", "half-day", "leave"];

function toCsv(records: AttendanceRecord[]): string {
  const header = "Name,Staff ID,Role,Date,Status,Check-in,Check-out,Notes";
  const rows = records.map((r) =>
    [r.name, r.staffId, r.role, r.date, STATUS_LABEL[r.status], r.checkIn ?? "", r.checkOut ?? "", r.notes]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

function downloadCsv(records: AttendanceRecord[]) {
  const blob = new Blob([toCsv(records)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AttendanceContent({
  records,
  loadError,
  people,
  markedBy,
}: {
  records: AttendanceRecord[];
  loadError: boolean;
  people: { id: string; name: string }[];
  markedBy: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [correcting, setCorrecting] = useState<AttendanceRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => !dateFilter || r.date === dateFilter)
      .filter((r) => !monthFilter || r.date.startsWith(monthFilter))
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.staffId.toLowerCase().includes(q));
  }, [records, query, statusFilter, dateFilter, monthFilter]);

  const counts = {
    present: records.filter((r) => r.status === "present").length,
    late: records.filter((r) => r.status === "late").length,
    absent: records.filter((r) => r.status === "absent").length,
    onLeave: records.filter((r) => r.status === "leave").length,
  };

  const closeModal = () => {
    setModalOpen(false);
    setCorrecting(null);
  };

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            06 <span className="text-accent">/ Attendance</span>
          </p>
          <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            Attendance.
          </h1>
          <p className="mt-3 text-sm text-soft-white/50 sm:text-base">Organization-wide staff and intern attendance.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/admin/attendance/settings" className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase">
            Policy settings
          </Link>
          <button
            type="button"
            onClick={() => downloadCsv(filtered)}
            className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
          >
            + Mark attendance
            <span className="task-action-arrow text-accent" aria-hidden>
              →
            </span>
          </button>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="dash-fade mt-6 border border-line px-5 py-3 text-sm text-accent">
          Couldn&apos;t load the full attendance list — this view may be incomplete. Try refreshing the page.
        </p>
      )}

      <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
        {[
          { label: "Present", value: counts.present },
          { label: "Late", value: counts.late },
          { label: "Absent", value: counts.absent },
          { label: "On leave", value: counts.onLeave },
        ].map((item) => (
          <p key={item.label} className="flex items-baseline gap-2">
            <span className="font-display text-lg font-black text-soft-white">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              {item.label}
            </span>
          </p>
        ))}
      </div>

      <div
        className="dash-fade mt-8 flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between"
        style={{ animationDelay: "0.12s" }}
      >
        <div role="group" aria-label="Filter by status" className="flex flex-wrap items-center gap-4">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === statusFilter}
              onClick={() => setStatusFilter(s)}
              className={`proj-filter ${s === statusFilter ? "is-active" : ""}`}
            >
              {s === "all" ? "All" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="att-date-filter" className="sr-only">
            Filter by date
          </label>
          <input
            id="att-date-filter"
            type="date"
            className="admin-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <label htmlFor="att-month-filter" className="sr-only">
            Filter by month
          </label>
          <input
            id="att-month-filter"
            type="month"
            className="admin-input"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
          <label htmlFor="att-search" className="sr-only">
            Search person
          </label>
          <input
            id="att-search"
            type="search"
            placeholder="Search person…"
            className="proj-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="dash-fade mt-8" style={{ animationDelay: "0.18s" }}>
        {filtered.length > 0 ? (
          <div className="border border-line px-6 sm:px-8">
            {filtered.map((record) => (
              <div key={record.id} className="team-row flex items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <p className="team-row-name text-sm font-semibold tracking-wide text-soft-white/85 uppercase">
                    {record.name}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-accent uppercase">
                    {record.role} · {record.staffId}
                  </p>
                  <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
                    {record.date} {record.checkIn && `· In ${record.checkIn}`}
                    {record.checkOut && ` · Out ${record.checkOut}`}
                  </p>
                </div>
                <span className={`dash-status ${STATUS_CLASS[record.status]} shrink-0`}>
                  {STATUS_LABEL[record.status]}
                </span>
                <button
                  type="button"
                  onClick={() => setCorrecting(record)}
                  className="dash-metric-link shrink-0 text-xs font-medium tracking-[0.15em] uppercase"
                >
                  Correct →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No attendance records found."
            description="Mark today's attendance to begin, or adjust your filters."
            action={
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
              >
                + Mark attendance
              </button>
            }
          />
        )}
      </div>

      {(modalOpen || correcting) && (
        <MarkAttendanceModal
          people={people}
          markedBy={markedBy}
          existing={correcting ?? undefined}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
