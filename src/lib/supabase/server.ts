// Server-side Supabase client — use this in Server Components, Server
// Actions, and Route Handlers. Reads/writes the session via cookies, so it
// must be created fresh on every request (never module-level singleton).
// Uses the publishable key (Supabase's newer name for the anon key).

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — cookies can't be set here.
            // Safe to ignore as long as proxy.ts refreshes the session.
          }
        },
      },
    }
  );
}
