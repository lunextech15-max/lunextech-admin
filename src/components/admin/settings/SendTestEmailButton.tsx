"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Result = { status: "idle" | "sending" | "ok" | "error"; message: string };

// Calls the send-test-email Edge Function, which sends to the CALLING
// admin's own address only (never an arbitrary address from this
// component) — see supabase/functions/send-test-email/index.ts in the
// public repo's migrations tree for the server-side check.
export default function SendTestEmailButton() {
  const [result, setResult] = useState<Result>({ status: "idle", message: "" });

  const handleClick = async () => {
    setResult({ status: "sending", message: "" });
    const supabase = createClient();
    try {
      const { data, error } = await supabase.functions.invoke("send-test-email", { body: {} });
      if (error) {
        setResult({ status: "error", message: "Email failed to send." });
        return;
      }
      const payload = data as { ok?: boolean; sentTo?: string; error?: string } | null;
      if (payload?.ok) {
        setResult({ status: "ok", message: `Sent to ${payload.sentTo}.` });
      } else {
        setResult({ status: "error", message: payload?.error ?? "Email failed to send." });
      }
    } catch {
      setResult({ status: "error", message: "Email failed to send." });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={result.status === "sending"}
        className="task-action w-fit text-xs font-semibold tracking-[0.15em] text-soft-white uppercase disabled:opacity-50"
      >
        {result.status === "sending" ? "Sending…" : "Send test email"}
        <span className="task-action-arrow text-accent" aria-hidden>
          →
        </span>
      </button>
      {result.status === "ok" && (
        <p className="text-[11px] text-soft-white/60" role="status">
          ✓ Email sent — {result.message}
        </p>
      )}
      {result.status === "error" && (
        <p className="text-[11px] text-accent" role="alert">
          ✕ {result.message}
        </p>
      )}
    </div>
  );
}
