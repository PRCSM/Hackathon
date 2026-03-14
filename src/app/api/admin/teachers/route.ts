import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/teachers — List all teachers and pending requests
export async function GET() {
  try {
    const teachers = await db
      .selectFrom("users")
      .leftJoin("teacher_profiles", "teacher_profiles.user_id", "users.id")
      .where("users.role", "=", "teacher")
      .select([
        "users.id",
        "users.name",
        "users.email",
        "users.image",
        "users.onboarding_completed",
        "users.created_at",
        "teacher_profiles.subject",
        "teacher_profiles.grade_level",
        "teacher_profiles.school_name",
      ])
      .orderBy("users.created_at", "desc")
      .execute();

    const pendingRequests = await db
      .selectFrom("teacher_requests")
      .where("status", "=", "pending")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();

    return NextResponse.json({ teachers, pendingRequests });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

// POST /api/admin/teachers — Approve/add a teacher
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, name, requestId, adminId } = body;

    if (action === "approve" && requestId) {
      // Approve a pending request
      await db
        .updateTable("teacher_requests")
        .set({
          status: "approved",
          reviewed_by: adminId,
          reviewed_at: new Date(),
        })
        .where("id", "=", requestId)
        .execute();

      // Add to approved teachers list
      await db
        .insertInto("approved_teachers")
        .values({ email, added_by: adminId })
        .onConflict((oc) => oc.column("email").doNothing())
        .execute();
    } else if (action === "add") {
      // Directly add to approved list
      await db
        .insertInto("approved_teachers")
        .values({ email, added_by: adminId })
        .onConflict((oc) => oc.column("email").doNothing())
        .execute();
    } else if (action === "reject" && requestId) {
      await db
        .updateTable("teacher_requests")
        .set({
          status: "rejected",
          reviewed_by: adminId,
          reviewed_at: new Date(),
        })
        .where("id", "=", requestId)
        .execute();
    } else if (action === "remove") {
      // Remove from approved list
      await db
        .deleteFrom("approved_teachers")
        .where("email", "=", email)
        .execute();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error managing teacher:", error);
    return NextResponse.json({ error: "Failed to manage teacher" }, { status: 500 });
  }
}
