import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// POST /api/user/set-role — Set the user's role after first sign-in
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "email and role required" }, { status: 400 });
    }

    const validRoles = ["admin", "teacher", "student", "parent"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // For admin — check approved_admins
    if (role === "admin") {
      const check = await db
        .selectFrom("approved_admins")
        .where("email", "=", email.toLowerCase())
        .select("email")
        .executeTakeFirst();

      if (!check) {
        return NextResponse.json({ error: "Not an approved admin" }, { status: 403 });
      }
    }

    // For teacher — check approved_teachers
    if (role === "teacher") {
      const check = await db
        .selectFrom("approved_teachers")
        .where("email", "=", email.toLowerCase())
        .select("email")
        .executeTakeFirst();

      if (!check) {
        // Create a pending teacher request
        await db
          .insertInto("teacher_requests")
          .values({ email, name: "", status: "pending" })
          .onConflict((oc) => oc.column("email").doNothing())
          .execute();

        return NextResponse.json({ error: "Teacher approval pending" }, { status: 403 });
      }
    }

    // Update the user's role
    await db
      .updateTable("users")
      .set({ role: role as "admin" | "teacher" | "student" | "parent", updated_at: new Date() })
      .where("email", "=", email)
      .execute();

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}
