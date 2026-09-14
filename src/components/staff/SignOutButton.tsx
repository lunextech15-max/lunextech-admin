"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/staff");
    router.refresh();
  };

  return (
    <button type="button" onClick={handleSignOut} disabled={pending} className={className}>
      {pending ? "Signing out…" : "Sign out"}
      <span aria-hidden>→</span>
    </button>
  );
}
