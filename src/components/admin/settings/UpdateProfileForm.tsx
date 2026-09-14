"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdateProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const idBase = useId();
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("Name can't be empty.");
      return;
    }

    setPending(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Profile updated.");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="max-w-sm">
        <label htmlFor={`${idBase}-name`} className="staff-field-label">
          Name
        </label>
        <input
          id={`${idBase}-name`}
          type="text"
          className="admin-input mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="dash-metric-link text-xs font-medium tracking-[0.15em] uppercase disabled:opacity-50"
        >
          {pending ? "Saving…" : "Update profile"}
        </button>
        {message && <p className="text-[11px] text-accent uppercase tracking-[0.1em]">{message}</p>}
      </div>
    </form>
  );
}
