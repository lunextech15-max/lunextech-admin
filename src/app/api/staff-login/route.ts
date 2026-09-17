// Replaces the old client-side flow of calling get_staff_login_info (a
// public RPC that returned a real employee's email + role to ANY caller
// who guessed a Staff ID) followed by a client-side signInWithPassword.
// This Route Handler does the same resolution server-side instead, using
// the service-role key (admin.ts) — the client never receives a raw
// email. This deployment is the admin-only portal, so only role==='admin'
// is allowed through; anyone else is signed back out immediately, same as
// the previous client-side check. The RPC itself is revoked from anon/
// authenticated in the public repo's 0017_login_rpc_hardening.sql.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const GENERIC_ERROR = "Invalid Admin ID or password.";
const NOT_ADMIN_ERROR = "This portal is for admin accounts only.";
const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const DUMMY_EMAIL = "no-such-account@lunextech.internal";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const { staffId, password } = (body ?? {}) as { staffId?: unknown; password?: unknown };
  if (typeof staffId !== "string" || typeof password !== "string" || !staffId.trim() || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }
  const trimmedId = staffId.trim();

  const admin = createAdminClient();

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { count } = await admin
    .from("staff_login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("staff_id", trimmedId)
    .gte("attempted_at", since);

  await admin.from("staff_login_attempts").insert({ staff_id: trimmedId });

  const supabase = await createClient();

  if ((count ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 429 });
  }

  const { data: staffRow } = await admin
    .from("staff")
    .select("email, role")
    .eq("staff_id", trimmedId)
    .maybeSingle();

  if (!staffRow) {
    await supabase.auth.signInWithPassword({ email: DUMMY_EMAIL, password });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: staffRow.email,
    password,
  });

  if (signInError) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  if (staffRow.role !== "admin") {
    await supabase.auth.signOut();
    return NextResponse.json({ error: NOT_ADMIN_ERROR }, { status: 403 });
  }

  return NextResponse.json({ role: staffRow.role });
}
