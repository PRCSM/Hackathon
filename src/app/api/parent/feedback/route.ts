import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

// GET /api/parent/feedback — Get teacher intervention notes for linked children
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parentId = session.user.id;

    const links = await db
      .selectFrom("parent_student_links")
      .where("parent_id", "=", parentId!)
      .select("student_id")
      .execute();

    if (links.length === 0) return NextResponse.json({ feedback: [] });

    const studentIds = links.map((l) => l.student_id);

    const notes = await db
      .selectFrom("intervention_notes")
      .innerJoin("users as teacher", "teacher.id", "intervention_notes.teacher_id")
      .innerJoin("users as student", "student.id", "intervention_notes.student_id")
      .where("intervention_notes.student_id", "in", studentIds)
      .where("intervention_notes.visible_to_parent", "=", true)
      .select([
        "intervention_notes.id",
        "intervention_notes.note",
        "intervention_notes.created_at",
        "teacher.name as teacher_name",
        "student.name as student_name",
      ])
      .orderBy("intervention_notes.created_at", "desc")
      .execute();

    return NextResponse.json({ feedback: notes });
  } catch (error) {
    console.error("Parent feedback error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
