import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

// GET /api/student/progress — Get current student's confidence scores
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const studentId = session.user.id;

    const confidence = await db
      .selectFrom("student_topic_confidence")
      .innerJoin("topics", "topics.id", "student_topic_confidence.topic_id")
      .innerJoin("classrooms", "classrooms.id", "topics.classroom_id")
      .where("student_topic_confidence.student_id", "=", studentId!)
      .select([
        "topics.title as topic_title",
        "classrooms.subject",
        "student_topic_confidence.confidence_score",
        "student_topic_confidence.confidence_label",
        "student_topic_confidence.quiz_count",
        "student_topic_confidence.last_quiz_at",
      ])
      .orderBy("student_topic_confidence.confidence_score", "asc")
      .execute();

    return NextResponse.json({ confidence });
  } catch (error) {
    console.error("Student progress error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
