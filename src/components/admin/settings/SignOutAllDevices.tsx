"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";

export default function SignOutAllDevices() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
    router.push("/staff");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="dash-quick-action admin-danger text-xs font-medium tracking-[0.15em] uppercase"
      >
        Sign out all devices
      </button>
      {confirming && (
        <ConfirmDialog
          title="Sign out all devices?"
          description="This ends every active session for your admin account, including this one."
          confirmLabel="Sign out everywhere"
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
