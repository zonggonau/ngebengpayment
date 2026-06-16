import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of paths that don't require API Key authentication
const publicPaths = [
  "/api/midtrans/webhook",
  "/api/health",
];

// Paths that use cookie-based auth (dashboard), not API Key
const cookieAuthPaths = [
  "/api/auth/",
  "/api/dashboard/",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow cookie-auth paths (dashboard) - they handle auth themselves
  if (cookieAuthPaths.some((path) => pathname.startsWith(path))) {
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
