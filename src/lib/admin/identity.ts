// Resolves the signed-in admin's real display identity for the Admin
// Layout header (avatar initials + name) and the Settings page, instead of
// always showing the static ADMIN_USER placeholder. Falls back to
// ADMIN_USER for any field Supabase doesn't have yet.
//
// Also the defense-in-depth admin-role gate: proxy.ts/middleware.ts is the
// only other place that checks get_my_role(), so if every /admin/* page
// calls this (they all already do, just for display data before this
// change), a future middleware matcher mistake or edge-routing setup that
// skips proxy.ts no longer leaves every Server Component's data fetch
// exposed with zero fallback check.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_USER } from "@/lib/admin/mock-data";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const chars = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return chars.join("") || ADMIN_USER.initials;
}

export async function getAdminIdentity() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/staff");
  }

  const { data: role } = (await supabase.rpc("get_my_role")) as { data: string | null };
  if (role !== "admin") {
    redirect("/staff");
  }

  const { data: staffRow } = await supabase
    .from("staff")
    .select("staff_id, full_name")
    .eq("email", user.email ?? "")
    .maybeSingle();

  const name = staffRow?.full_name || (user.user_metadata?.full_name as string | undefined)?.trim() || ADMIN_USER.name;

  return {
    name,
    initials: initialsFrom(name),
    email: user.email ?? ADMIN_USER.email,
    lunexId: staffRow?.staff_id ?? ADMIN_USER.lunexId,
    staffId: staffRow?.staff_id ?? null,
  };
}
