import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — checks session cookie AND enforces role-based route access.
 * Full role validation happens server-side (auth callback + API routes).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  // Not authenticated — redirect to home
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Role-based route guard using role stored in a separate cookie set at login
  // The role cookie is set by the session callback (non-HttpOnly so middleware can read it)
  const roleCookie = request.cookies.get("padhai_role")?.value;

  if (roleCookie && pathname.startsWith("/dashboard/")) {
    // Extract the role segment from the URL: /dashboard/{role}/...
    const segments = pathname.split("/");
    const dashboardRole = segments[2]; // e.g. "admin", "teacher", "student", "parent"

    const allowedRoles: Record<string, string> = {
      admin: "admin",
      teacher: "teacher",
      student: "student",
      parent: "parent",
    };

    if (dashboardRole && allowedRoles[dashboardRole] && roleCookie !== allowedRoles[dashboardRole]) {
      // Redirect to their own dashboard
      const url = request.nextUrl.clone();
      url.pathname = `/dashboard/${roleCookie}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};
