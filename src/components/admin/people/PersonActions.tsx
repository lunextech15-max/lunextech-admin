"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { updateStaffStatus } from "@/lib/admin/team-client";
import type { AccountStatus } from "@/lib/admin/types";

export default function PersonActions({
  staffId,
  name,
  initialStatus,
}: {
  staffId: string;
  name: string;
  initialStatus: AccountStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [confirming, setConfirming] = useState<"deactivate" | "reactivate" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyStatus = async (next: AccountStatus) => {
    setPending(true);
    setError(null);
    const { error: updateError } = await updateStaffStatus(staffId, next);
    setPending(false);
    setConfirming(null);

    if (updateError) {
      console.error("PersonActions: updateStaffStatus failed", updateError);
      setError(`Couldn't update the account: ${updateError}`);
      return;
    }
    setStatus(next);
    router.refresh();
  };

  return (
    <section aria-labelledby="person-actions-heading">
      <h2
        id="person-actions-heading"
        className="text-[11px] font-medium tracking-[0.25em] text-soft-white/45 uppercase"
      >
        Admin actions
      </h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          title="Not available yet — edit the row directly in Supabase Dashboard for now."
          className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
        >
          Edit account
        </button>
        <button
          type="button"
          disabled
          title="No login-reset flow is wired up — there's no service-role key available to this app. Reset the password in Supabase Dashboard → Authentication → Users."
          className="dash-quick-action is-disabled text-xs font-medium tracking-[0.15em] uppercase"
        >
          Reset password
        </button>
        {status === "active" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirming("deactivate")}
            className="dash-quick-action admin-danger text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
          >
            Deactivate account
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirming("reactivate")}
            className="dash-quick-action text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
          >
            Reactivate account
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] text-soft-white/35">
        Account status: <span className="text-soft-white/60 uppercase">{status}</span>
      </p>

      {error && (
        <p role="alert" className="mt-3 text-[11px] text-accent">
          {error}
        </p>
      )}

      {confirming === "deactivate" && (
        <ConfirmDialog
          title="Deactivate account?"
          description={`${name} will no longer be able to access the LUNEX TECH workspace.`}
          confirmLabel="Deactivate"
          onConfirm={() => applyStatus("inactive")}
          onCancel={() => setConfirming(null)}
        />
      )}

      {confirming === "reactivate" && (
        <ConfirmDialog
          title="Reactivate account?"
          description={`${name} will regain access to the LUNEX TECH workspace.`}
          confirmLabel="Reactivate"
          danger={false}
          onConfirm={() => applyStatus("active")}
          onCancel={() => setConfirming(null)}
        />
      )}
    </section>
  );
}
