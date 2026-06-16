import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const publicPaths = [
  "/api/midtrans/webhook",
  "/api/health",
];

// Paths that use cookie-based auth (dashboard), not API Key
const cookieAuthPaths = [
  "/api/auth/",
  "/api/dashboard/",
  "/api/apps/",
];

// Paths that are safe for CSRF (GET requests to dashboard)
const csrfSafeMethods = ["GET", "HEAD", "OPTIONS"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Handle cookie-auth paths (dashboard) with CSRF protection
  if (cookieAuthPaths.some((path) => pathname.startsWith(path))) {
    // CSRF Protection: Validate Origin/Referer for state-changing methods
    if (!csrfSafeMethods.includes(request.method)) {
      const origin = request.headers.get("origin");
      const referer = request.headers.get("referer");
      const host = request.headers.get("host");

      // Allow requests with no origin (e.g., same-origin, curl, etc.)
      if (origin || referer) {
        const source = (origin || referer || "").toLowerCase();
        const allowedHosts = [
          host,
          process.env.NEXT_PUBLIC_APP_URL
            ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
            : null,
        ].filter(Boolean);

        const isAllowed = allowedHosts.some(
          (allowed) => allowed && source.includes(allowed.toLowerCase())
        );

        if (!isAllowed) {
          return NextResponse.json(
            { error: "CSRF validation failed" },
            { status: 403 }
          );
        }
      }
    }

    return NextResponse.next();
  }

  // For API routes, check API Key
  if (pathname.startsWith("/api/")) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Unauthorized - X-API-Key header is required" },
        { status: 401 }
      );
    }

    // Store API key in request headers for route handlers to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-api-key-authenticated", apiKey);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
