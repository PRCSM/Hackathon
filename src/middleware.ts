import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight middleware — checks for session cookie
// Full auth validation happens in server components and API routes
export function middleware(request: NextRequest) {
  // In development, allow access without authentication
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

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
