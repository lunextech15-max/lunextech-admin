// Resolves the signed-in admin's real display identity for the Admin
// Layout header (avatar initials + name) and the Settings page, instead of
// always showing the static ADMIN_USER placeholder. Falls back to
// ADMIN_USER for any field Supabase doesn't have yet.

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

  const name = (user?.user_metadata?.full_name as string | undefined)?.trim() || ADMIN_USER.name;

  return {
    name,
    initials: initialsFrom(name),
    email: user?.email ?? ADMIN_USER.email,
    lunexId: ADMIN_USER.lunexId,
  };
}
