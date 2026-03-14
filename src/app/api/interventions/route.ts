import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/interventions?studentId= — Get intervention notes for a student
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");
    if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

    const notes = await db
      .selectFrom("intervention_notes")
      .innerJoin("users as teacher", "teacher.id", "intervention_notes.teacher_id")
      .where("intervention_notes.student_id", "=", studentId)
      .select([
        "intervention_notes.id",
        "intervention_notes.note",
        "intervention_notes.visible_to_parent",
        "intervention_notes.created_at",
        "teacher.name as teacher_name",
      ])
      .orderBy("intervention_notes.created_at", "desc")
      .execute();

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Interventions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch interventions" }, { status: 500 });
  }
}

// POST /api/interventions — Add intervention note
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string }).role;
    if (role !== "teacher") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { studentId, note, topicId, visibleToParent = false } = body;

    if (!studentId || !note) {
      return NextResponse.json({ error: "studentId and note required" }, { status: 400 });
    }

    const inserted = await db
      .insertInto("intervention_notes")
      .values({
        teacher_id: session.user.id!,
        student_id: studentId,
        topic_id: topicId || null,
        note,
        visible_to_parent: visibleToParent,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Notify parent if note is visible to them
    if (visibleToParent) {
      const parentLinks = await db
        .selectFrom("parent_student_links")
        .where("student_id", "=", studentId)
        .select("parent_id")
        .execute();

      if (parentLinks.length > 0) {
        await db
          .insertInto("notifications")
          .values(
            parentLinks.map((p) => ({
              user_id: p.parent_id,
              type: "new_feedback" as const,
              title: "New Teacher Feedback",
              message: `Your child's teacher left a new note: "${note.substring(0, 80)}..."`,
            }))
          )
          .execute();
      }
    }

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error("Intervention POST error:", error);
    return NextResponse.json({ error: "Failed to create intervention note" }, { status: 500 });
  }
}
