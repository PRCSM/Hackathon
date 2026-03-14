import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/topics/[id]/approve — Teacher approves/rejects topic content
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, approvedBy } = body; // action: "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const updated = await db
      .updateTable("topics")
      .set({
        status: newStatus as "approved" | "rejected",
        approved_by: action === "approve" ? approvedBy : null,
        approved_at: action === "approve" ? new Date() : null,
        updated_at: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!updated) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Create notification for students in the classroom
    if (action === "approve") {
      const students = await db
        .selectFrom("classroom_students")
        .where("classroom_id", "=", updated.classroom_id)
        .select("student_id")
        .execute();

      if (students.length > 0) {
        await db
          .insertInto("notifications")
          .values(
            students.map((s) => ({
              user_id: s.student_id,
              type: "content_approved" as const,
              title: "New Content Available",
              message: `New topic "${updated.title}" is now available for study.`,
            }))
          )
          .execute();
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}
