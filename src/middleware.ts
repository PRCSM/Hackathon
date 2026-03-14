import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — checks for session cookie on protected routes.
 * Role-based access is enforced via the session callback and API routes.
 */
export function middleware(request: NextRequest) {
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};
