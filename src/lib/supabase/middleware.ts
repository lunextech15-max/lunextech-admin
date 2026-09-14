// Refreshes the Supabase auth session on every request that passes through
// proxy.ts, so server components always see an up-to-date session — and
// redirects signed-out visitors away from protected /admin/* pages.
// /admin/* requires role === "admin", checked via the get_my_role() RPC
// (supabase/migrations/0002_roles.sql) — real, backend-enforced, not just a
// hidden nav item. This deployment is the admin-only portal: a signed-in
// non-admin is bounced back to /staff (LoginForm signs them out there).

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // Touching getUser() is what actually refreshes the session token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/staff";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!user && isAdminRoute) {
    return NextResponse.redirect(new URL("/staff", request.url));
  }

  if (user && (isAdminRoute || isLoginPage)) {
    const { data: role } = (await supabase.rpc("get_my_role")) as { data: string | null };

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/staff", request.url));
    }
    if (isLoginPage && role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return supabaseResponse;
}
