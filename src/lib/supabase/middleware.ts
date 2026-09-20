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

  // Every redirect this function can issue goes through here. Auth state
  // (getUser(), get_my_role()) has turned out to be inconsistent across the
  // rapid consecutive requests a redirect chain itself fires — sometimes
  // seeing a valid session, sometimes not, for the SAME browser session
  // milliseconds apart (a token-refresh race). Bouncing on every
  // inconsistent read can turn into an infinite ping-pong loop between
  // /admin and /staff (ERR_TOO_MANY_REDIRECTS). A Referer-based loop check
  // isn't reliable here — browsers don't consistently update Referer per
  // hop while auto-following a redirect chain — so this counts consecutive
  // redirects in a short-lived cookie instead: a real, deliberate redirect
  // happens once; several in immediate succession is the race, not a real
  // navigation attempt.
  const REDIRECT_GUARD_COOKIE = "mw_redirect_count";
  const MAX_CONSECUTIVE_REDIRECTS = 3;
  const redirectCount = Number(request.cookies.get(REDIRECT_GUARD_COOKIE)?.value ?? "0");

  const redirectTo = (path: string) => {
    if (redirectCount >= MAX_CONSECUTIVE_REDIRECTS) {
      console.error("updateSession: too many redirects in a row, breaking a potential loop", {
        pathname,
        target: path,
        redirectCount,
      });
      supabaseResponse.cookies.delete(REDIRECT_GUARD_COOKIE);
      return supabaseResponse;
    }
    const response = NextResponse.redirect(new URL(path, request.url));
    response.cookies.set(REDIRECT_GUARD_COOKIE, String(redirectCount + 1), { maxAge: 5, path: "/" });
    return response;
  };

  // Any request that reaches here without redirecting is a real, landed
  // page load — clear the guard so it doesn't outlive the burst it was
  // meant to catch.
  const landed = () => {
    if (redirectCount > 0) supabaseResponse.cookies.delete(REDIRECT_GUARD_COOKIE);
    return supabaseResponse;
  };

  if (!user && isAdminRoute) {
    return redirectTo("/staff");
  }

  if (user && (isAdminRoute || isLoginPage)) {
    const { data: role, error: roleError } = (await supabase.rpc("get_my_role")) as {
      data: string | null;
      error: unknown;
    };

    // A transient RPC failure must never be treated as "not admin" — that
    // bounces a real admin to /staff.
    if (roleError) {
      console.error("updateSession: get_my_role failed, skipping role-based redirect", roleError);
      return landed();
    }

    if (isAdminRoute && role !== "admin") {
      return redirectTo("/staff");
    }
    if (isLoginPage && role === "admin") {
      return redirectTo("/admin");
    }
  }

  return landed();
}
