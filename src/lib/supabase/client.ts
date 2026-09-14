// Browser-side Supabase client — use this in Client Components ("use client").
// Reads the public URL/publishable key from env vars; safe to expose to the
// browser (Supabase's newer name for what used to be called the anon key).

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
