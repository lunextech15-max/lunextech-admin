// Every Server Action that uses the service-role client (admin.ts) must
// call this first. A Server Action is a directly callable network endpoint
// — the page-level redirect in identity.ts only gates page renders, not
// action calls, so without this check any authenticated non-admin could
// invoke an admin-only action directly and bypass RLS via the service role.

import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in." };
  }

  const { data: role } = (await supabase.rpc("get_my_role")) as { data: string | null };
  if (role !== "admin") {
    return { error: "Admin access required." };
  }

  return { error: null };
}
