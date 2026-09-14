"use client";

import { useId, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const idBase = useId();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords don't match.");
      return;
    }

    setPending(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    setMessage("Password updated.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idBase}-pw`} className="staff-field-label">
            New password
          </label>
          <input
            id={`${idBase}-pw`}
            type="password"
            className="admin-input mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${idBase}-confirm`} className="staff-field-label">
            Confirm password
          </label>
          <input
            id={`${idBase}-confirm`}
            type="password"
            className="admin-input mt-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
        >
          {pending ? "Updating…" : "Change password"}
        </button>
        {message && <p className="text-[11px] text-accent uppercase tracking-[0.1em]">{message}</p>}
      </div>
    </form>
  );
}
