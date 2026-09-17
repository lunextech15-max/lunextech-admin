"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PeopleTable from "./PeopleTable";
import CreateAccountModal from "./CreateAccountModal";
import EmptyState from "@/components/admin/EmptyState";
import type { PersonAccount } from "@/lib/admin/types";

type Filter = "all" | "staff" | "intern" | "caller" | "active" | "inactive";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "staff", label: "Staff" },
  { id: "intern", label: "Interns" },
  { id: "caller", label: "Callers" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export default function PeopleContent({
  initialPeople,
  loadError = false,
  nextStaffId,
  nextInternId,
  nextCallerId,
  supervisors,
}: {
  initialPeople: PersonAccount[];
  loadError?: boolean;
  nextStaffId: string;
  nextInternId: string;
  nextCallerId: string;
  supervisors: { lunexId: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const [people, setPeople] = useState(initialPeople);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(() => searchParams.get("new") === "1");

  const total = people.length;
  const staffCount = people.filter((p) => p.role === "staff").length;
  const internCount = people.filter((p) => p.role === "intern").length;
  const callerCount = people.filter((p) => p.role === "caller").length;
  const activeCount = people.filter((p) => p.status === "active").length;
  const inactiveCount = people.filter((p) => p.status === "inactive").length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people
      .filter((p) => {
        if (filter === "staff") return p.role === "staff";
        if (filter === "intern") return p.role === "intern";
        if (filter === "caller") return p.role === "caller";
        if (filter === "active") return p.status === "active";
        if (filter === "inactive") return p.status === "inactive";
        return true;
      })
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.lunexId.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
  }, [people, query, filter]);


  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            02 <span className="text-accent">/ People</span>
          </p>
          <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            People.
          </h1>
          <p className="mt-3 text-sm text-soft-white/50 sm:text-base">
            Manage staff and intern accounts across LUNEX TECH.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="task-action shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          + Create account
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
      </div>

      {loadError && (
        <p role="alert" className="dash-fade mt-6 border border-line px-5 py-3 text-sm text-accent">
          Couldn&apos;t load the full roster — the list below may be incomplete. Try refreshing the page.
        </p>
      )}

      <div className="dash-fade mt-8 flex flex-wrap gap-x-8 gap-y-3" style={{ animationDelay: "0.06s" }}>
        {[
          { label: "Total people", value: total },
          { label: "Staff", value: staffCount },
          { label: "Interns", value: internCount },
          { label: "Callers", value: callerCount },
          { label: "Active", value: activeCount },
          { label: "Inactive", value: inactiveCount },
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
        <div role="group" aria-label="Filter people" className="flex flex-wrap items-center gap-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={f.id === filter}
              onClick={() => setFilter(f.id)}
              className={`proj-filter ${f.id === filter ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="sm:w-72">
          <label htmlFor="people-search" className="sr-only">
            Search people
          </label>
          <input
            id="people-search"
            type="search"
            placeholder="Search people…"
            className="proj-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="dash-fade mt-8" style={{ animationDelay: "0.18s" }}>
        {filtered.length > 0 ? (
          <PeopleTable people={filtered} />
        ) : (
          <EmptyState
            title="No people found."
            description="Try adjusting your search or filters."
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
              >
                Clear filters →
              </button>
            }
          />
        )}
      </div>

      {modalOpen && (
        <CreateAccountModal
          nextStaffId={nextStaffId}
          nextInternId={nextInternId}
          nextCallerId={nextCallerId}
          supervisors={supervisors}
          initialType={searchParams.get("type") === "intern" ? "intern" : "staff"}
          initialName={searchParams.get("name") ?? ""}
          initialEmail={searchParams.get("email") ?? ""}
          onClose={() => setModalOpen(false)}
          onCreated={(account) => {
            setPeople((prev) => [
              {
                lunexId: account.lunexId,
                name: account.name,
                initials: account.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
                email: account.email,
                role: account.role,
                title: account.title,
                department: account.department,
                status: "active",
                joinedDate: "Just now",
                supervisorName: account.supervisorName,
                internshipStart: account.internshipStart,
                internshipEnd: account.internshipEnd,
                territory: account.territory,
                dailyCallTarget: account.dailyCallTarget,
              },
              ...prev,
            ]);
          }}
        />
      )}
    </div>
  );
}
