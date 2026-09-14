"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Modal from "@/components/admin/Modal";

function generateTempPassword() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default function PersonActions({ name, initialStatus }: { name: string; initialStatus: "active" | "inactive" }) {
  const [status, setStatus] = useState(initialStatus);
  const [confirming, setConfirming] = useState<"deactivate" | "reactivate" | null>(null);
  const [resetPassword, setResetPassword] = useState<string | null>(null);

  return (
    <section aria-labelledby="person-actions-heading">
      <h2
        id="person-actions-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Admin actions
      </h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <span className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase" aria-disabled="true">
          Edit account
        </span>
        <button
          type="button"
          onClick={() => setResetPassword(generateTempPassword())}
          className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase"
        >
          Reset password
        </button>
        {status === "active" ? (
          <button
            type="button"
            onClick={() => setConfirming("deactivate")}
            className="dash-quick-action admin-danger text-xs font-medium tracking-[0.15em] uppercase"
          >
            Deactivate account
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming("reactivate")}
            className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase"
          >
            Reactivate account
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] text-soft-white/35">
        Account status: <span className="text-soft-white/60 uppercase">{status}</span>
      </p>

      {confirming === "deactivate" && (
        <ConfirmDialog
          title="Deactivate account?"
          description={`${name} will no longer be able to access the LUNEX TECH workspace.`}
          confirmLabel="Deactivate"
          onConfirm={() => {
            setStatus("inactive");
            setConfirming(null);
          }}
          onCancel={() => setConfirming(null)}
        />
      )}

      {confirming === "reactivate" && (
        <ConfirmDialog
          title="Reactivate account?"
          description={`${name} will regain access to the LUNEX TECH workspace.`}
          confirmLabel="Reactivate"
          danger={false}
          onConfirm={() => {
            setStatus("active");
            setConfirming(null);
          }}
          onCancel={() => setConfirming(null)}
        />
      )}

      {resetPassword && (
        <Modal title="Password reset." onClose={() => setResetPassword(null)}>
          <p className="max-w-sm text-sm leading-relaxed text-soft-white/55">
            Give {name} this new temporary password. This is a local prototype value — no backend has actually been
            updated.
          </p>
          <div className="mt-5 border border-line p-5">
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft-white/40 uppercase">
              Temporary password
            </p>
            <p className="mt-1.5 text-sm font-medium text-soft-white">{resetPassword}</p>
          </div>
          <div className="mt-7">
            <button
              type="button"
              onClick={() => setResetPassword(null)}
              className="task-action text-xs font-semibold tracking-[0.15em] text-soft-white uppercase"
            >
              Done
              <span className="task-action-arrow text-accent" aria-hidden>
                →
              </span>
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
