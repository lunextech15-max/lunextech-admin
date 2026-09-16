// Server-only Supabase client using the service-role key — bypasses RLS
// entirely, so it must NEVER be imported into a Client Component, and every
// caller of a function that uses this must independently re-verify the
// requester is an admin first (see requireAdmin() in
// src/lib/admin/require-admin.ts). Reads SUPABASE_SERVICE_ROLE_KEY, which
// has no NEXT_PUBLIC_ prefix, so it's only ever available server-side.

import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "createAdminClient: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — real account creation is unavailable until both are set."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
