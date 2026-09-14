"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Errors = {
  staffId?: string;
  password?: string;
};

type LoginResult = { ok: true; redirectTo: string } | { ok: false; message: string };

// Real authentication: a Staff ID isn't a Supabase Auth identity, so this
// first resolves it to the account's email + role via the
// `get_staff_login_info` RPC (see supabase/migrations/0002_roles.sql), then
// signs in with that email + password. This deployment is the admin-only
// portal, so any non-admin role is signed back out immediately — staff and
// intern accounts belong on the main LUNEX TECH portal. Generic error
// messages throughout — never reveal whether a given Admin ID exists.
async function submitStaffLogin(credentials: { staffId: string; password: string }): Promise<LoginResult> {
  const supabase = createClient();

  const { data, error: lookupError } = (await supabase
    .rpc("get_staff_login_info", { staff_id_input: credentials.staffId })
    .maybeSingle()) as { data: { email: string; role: string } | null; error: unknown };

  if (lookupError || !data?.email) {
    return { ok: false, message: "Invalid Admin ID or password." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: credentials.password,
  });

  if (signInError) {
    return { ok: false, message: "Invalid Admin ID or password." };
  }

  if (data.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false, message: "This portal is for admin accounts only." };
  }

  return { ok: true, redirectTo: "/admin" };
}

export default function LoginForm() {
  const router = useRouter();
  const staffIdId = useId();
  const passwordId = useId();
  const statusId = useId();

  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!staffId.trim()) {
      next.staffId = "Admin ID is required.";
    }
    if (!password) {
      next.password = "Password is required.";
    }
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(null);
      return;
    }

    setPending(true);
    setStatus(null);
    const result = await submitStaffLogin({ staffId: staffId.trim(), password });

    if (result.ok) {
      setStatus("Access granted. Redirecting…");
      router.push(result.redirectTo);
      router.refresh();
      return;
    }

    setPending(false);
    setStatus(result.message);
  };

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit} noValidate>
      <div className="staff-field">
        <label htmlFor={staffIdId} className="staff-field-label">
          Admin ID
        </label>
        <input
          id={staffIdId}
          name="staffId"
          type="text"
          autoComplete="username"
          placeholder="e.g. ADMIN-001"
          className="staff-input"
          value={staffId}
          onChange={(event) => setStaffId(event.target.value)}
          aria-invalid={errors.staffId ? "true" : "false"}
          aria-describedby={errors.staffId ? `${staffIdId}-error` : undefined}
        />
        {errors.staffId && (
          <p id={`${staffIdId}-error`} className="staff-error" role="alert">
            {errors.staffId}
          </p>
        )}
      </div>

      <div className="staff-field">
        <label htmlFor={passwordId} className="staff-field-label">
          Password
        </label>
        <input
          id={passwordId}
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••••••"
          className="staff-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? `${passwordId}-error` : undefined}
        />
        <button
          type="button"
          className="staff-toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase">
            {showPassword ? "Hide" : "Show"}
          </span>
        </button>
        {errors.password && (
          <p id={`${passwordId}-error`} className="staff-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-6">
        <button
          type="submit"
          disabled={pending}
          className="staff-submit inline-flex items-center justify-center gap-3 border border-soft-white/25 px-8 py-4 text-sm font-semibold tracking-[0.15em] text-soft-white uppercase transition-colors duration-300 hover:border-accent disabled:hover:border-soft-white/25"
        >
          {pending ? "Signing in…" : "Sign In"}
          <span className="staff-submit-arrow text-accent" aria-hidden>
            →
          </span>
        </button>

        <div className="flex items-center justify-between">
          <button type="button" className="staff-forgot text-xs font-medium tracking-[0.1em] uppercase" disabled>
            Forgot password?
          </button>
        </div>

        <p id={statusId} className="min-h-[1px]" aria-live="polite">
          {status && <span className="staff-status block py-2">{status}</span>}
        </p>
      </div>
    </form>
  );
}
