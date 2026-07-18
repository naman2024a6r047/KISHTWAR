import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─────────────────────────────────────────────
// Next.js Edge Middleware — Route Protection
// ─────────────────────────────────────────────
// Runs at the edge BEFORE any page or API route renders.
// Protects /admin/* and /contributor/* routes by verifying
// the presence of a valid access_token cookie.
//
// If the access_token is missing/expired but a refresh_token
// exists, we let the request through — the AuthProvider on
// the client side will handle the token refresh automatically.
// If both are missing, we redirect to /login.

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

/** Routes that require authentication */
const PROTECTED_PREFIXES = ["/admin", "/contributor"];

/** Routes that should redirect to dashboard if already logged in */
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // ── Check protected routes ────────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    // If no tokens at all, redirect to login
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If we have an access token, verify it and check role
    if (accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, JWT_SECRET);
        const role = payload.role as string;

        // Admin routes require SUPER_ADMIN role
        if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
          return NextResponse.redirect(new URL("/", request.url));
        }

        // Contributor routes require CONTRIBUTOR or SUPER_ADMIN
        if (
          pathname.startsWith("/contributor") &&
          role !== "CONTRIBUTOR" &&
          role !== "SUPER_ADMIN"
        ) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch {
        // Token is expired or invalid — if we have a refresh token,
        // redirect to the refresh API route which will refresh the cookies
        // and redirect back to this page.
        if (!refreshToken) {
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        } else {
          const refreshUrl = new URL("/api/auth/refresh", request.url);
          refreshUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(refreshUrl);
        }
      }
    }

    // If only refresh token exists (no access token), let through —
    // the AuthProvider will refresh the access token client-side
  }

  // ── Redirect logged-in users away from auth pages ──
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, JWT_SECRET);
      const role = payload.role as string;

      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (role === "CONTRIBUTOR") {
        return NextResponse.redirect(new URL("/contributor", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      // Token invalid, let them access auth pages
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected dashboard routes
    "/admin/:path*",
    "/contributor/:path*",
    // Auth routes (for redirect-if-logged-in)
    "/login",
    "/register",
  ],
};
