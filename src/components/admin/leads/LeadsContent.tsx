"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CreateLeadModal, { type CreatedLead } from "./CreateLeadModal";
import CreateScriptModal from "./CreateScriptModal";
import EmptyState from "@/components/admin/EmptyState";
import type { AdminLead } from "@/lib/admin/leads";
import type { AdminScript } from "@/lib/admin/scripts";
import { STATUS_CLASS, STATUS_LABEL, type LeadStatus } from "@/lib/caller/types";

type Tab = "leads" | "scripts";

const STATUS_FILTERS: (LeadStatus | "all")[] = [
  "all",
  "not-called",
  "connected",
  "interested",
  "follow-up",
  "converted",
];

export default function LeadsContent({
  leads,
  scripts,
  callers,
  adminStaffId,
}: {
  leads: AdminLead[];
  scripts: AdminScript[];
  callers: { lunexId: string; name: string }[];
  adminStaffId: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("leads");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<AdminScript | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter((l) => statusFilter === "all" || l.status === statusFilter)
      .filter(
        (l) =>
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.assignedCallerName.toLowerCase().includes(q)
      );
  }, [leads, query, statusFilter]);

  const handleLeadCreated = (lead: CreatedLead) => {
    setLeadModalOpen(false);
    setMessage(`"${lead.name}" was created and assigned.`);
    router.refresh();
  };

  const closeScriptModal = () => {
    setScriptModalOpen(false);
    setEditingScript(null);
  };

  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 lg:py-14">
      <div className="dash-fade flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.25em] text-soft-white/40 uppercase">
            07 <span className="text-accent">/ Cold Calling</span>
          </p>
          <h1 className="mt-4 font-display text-[11vw] font-black leading-[0.95] tracking-tight text-soft-white sm:text-[6vw] lg:text-[3vw] xl:text-4xl">
            Leads.
          </h1>
          <p className="mt-3 text-sm text-soft-white/50 sm:text-base">Manage leads, assignments, and call scripts.</p>
        </div>
        <button
          type="button"
          onClick={() => (tab === "leads" ? setLeadModalOpen(true) : setScriptModalOpen(true))}
          className="task-action shrink-0 text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
        >
          + {tab === "leads" ? "Create lead" : "Create script"}
          <span className="task-action-arrow text-accent" aria-hidden>
            →
          </span>
        </button>
      </div>

      {message && (
        <p className="dash-fade mt-6 text-[11px] font-medium tracking-[0.15em] text-accent uppercase">{message}</p>
      )}

      <div className="dash-fade mt-8 flex gap-6 border-b border-line" role="tablist" aria-label="Cold calling views">
        {(["leads", "scripts"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`proj-tab ${tab === t ? "is-active" : ""}`}
          >
            {t === "leads" ? `Leads (${leads.length})` : `Scripts (${scripts.length})`}
          </button>
        ))}
      </div>

      {tab === "leads" ? (
        <>
          <div
            className="dash-fade mt-8 flex flex-col gap-4 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between"
            style={{ animationDelay: "0.06s" }}
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
            <div className="sm:w-64">
              <label htmlFor="lead-search" className="sr-only">
                Search leads
              </label>
              <input
                id="lead-search"
                type="search"
                placeholder="Search name, company, caller…"
                className="proj-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="dash-fade mt-8" style={{ animationDelay: "0.12s" }}>
            {filteredLeads.length > 0 ? (
              <div className="border border-line px-6 sm:px-8">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="team-row flex items-center justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <p className="team-row-name text-sm font-semibold tracking-wide text-soft-white/85 uppercase">
                        {lead.name}
                      </p>
                      <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-accent uppercase">
                        {lead.assignedCallerName} {lead.company && `· ${lead.company}`}
                      </p>
                      <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-soft-white/35 uppercase">
                        {lead.phone} {lead.location && `· ${lead.location}`}
                      </p>
                    </div>
                    <span className={`dash-status ${STATUS_CLASS[lead.status]} shrink-0`}>
                      {STATUS_LABEL[lead.status]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No leads found."
                description="Create a lead and assign it to a caller to begin."
                action={
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(true)}
                    className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
                  >
                    + Create lead
                  </button>
                }
              />
            )}
          </div>
        </>
      ) : (
        <div className="dash-fade mt-8" style={{ animationDelay: "0.06s" }}>
          {scripts.length > 0 ? (
            <div className="border border-line px-6 sm:px-8">
              {scripts.map((script) => (
                <div key={script.id} className="team-row flex items-center justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="team-row-name text-sm font-semibold tracking-wide text-soft-white/85 uppercase">
                      {script.title}
                    </p>
                    <p className="mt-1 text-[10px] font-medium tracking-[0.15em] text-accent uppercase">
                      {script.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingScript(script);
                      setScriptModalOpen(true);
                    }}
                    className="dash-metric-link shrink-0 text-xs font-medium tracking-[0.15em] uppercase"
                  >
                    Edit →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No scripts yet."
              description="Add opening, pitch, objection-handling, and closing scripts for your callers."
              action={
                <button
                  type="button"
                  onClick={() => setScriptModalOpen(true)}
                  className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase"
                >
                  + Create script
                </button>
              }
            />
          )}
        </div>
      )}

      {leadModalOpen && (
        <CreateLeadModal
          callers={callers}
          createdBy={adminStaffId}
          onClose={() => setLeadModalOpen(false)}
          onCreated={handleLeadCreated}
        />
      )}

      {scriptModalOpen && (
        <CreateScriptModal
          existing={editingScript ?? undefined}
          onClose={closeScriptModal}
          onSaved={() => {
            closeScriptModal();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
