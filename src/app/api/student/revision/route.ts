import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

// GET /api/student/revision — Get flashcard sets for logged-in student's classrooms
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const studentId = session.user.id;

    // Get classrooms this student is in
    const classroomIds = await db
      .selectFrom("classroom_students")
      .where("student_id", "=", studentId!)
      .select("classroom_id")
      .execute();

    if (classroomIds.length === 0) return NextResponse.json({ sets: [] });

    // Get approved topics in those classrooms
    const topicIds = await db
      .selectFrom("topics")
      .where("classroom_id", "in", classroomIds.map((c) => c.classroom_id))
      .where("status", "=", "approved")
      .select(["id", "title"])
      .execute();

    if (topicIds.length === 0) return NextResponse.json({ sets: [] });

    // Get flashcard sets with flashcards
    const sets = await Promise.all(
      topicIds.map(async (topic) => {
        const set = await db
          .selectFrom("flashcard_sets")
          .where("topic_id", "=", topic.id)
          .selectAll()
          .executeTakeFirst();

        if (!set) return null;

        const flashcards = await db
          .selectFrom("flashcards")
          .where("set_id", "=", set.id)
          .selectAll()
          .orderBy("order_index", "asc")
          .execute();

        return {
          id: set.id,
          title: set.title,
          topic_title: topic.title,
          flashcards,
        };
      })
    );

    const validSets = sets.filter(Boolean);
    return NextResponse.json({ sets: validSets });
  } catch (error) {
    console.error("Student revision error:", error);
    return NextResponse.json({ error: "Failed to fetch revision data" }, { status: 500 });
  }
}
