import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/classrooms/[id]/analytics — Classroom analytics for a teacher
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Student count
    const studentCountResult = await db
      .selectFrom("classroom_students")
      .where("classroom_id", "=", id)
      .select(db.fn.count("id").as("count"))
      .executeTakeFirst();

    // Topic stats
    const topics = await db
      .selectFrom("topics")
      .where("classroom_id", "=", id)
      .select([
        "topics.id",
        "topics.title",
        "topics.status",
        "topics.difficulty",
        "topics.difficulty_score",
      ])
      .execute();

    // Quiz completion per topic
    const topicsWithStats = await Promise.all(
      topics.map(async (topic) => {
        const quiz = await db
          .selectFrom("quizzes")
          .where("topic_id", "=", topic.id)
          .select("id")
          .executeTakeFirst();

        if (!quiz) return { ...topic, avgScore: null, attemptCount: 0 };

        const attempts = await db
          .selectFrom("quiz_attempts")
          .where("quiz_id", "=", quiz.id)
          .select([
            db.fn.avg("score").as("avg_score"),
            db.fn.count("id").as("attempt_count"),
          ])
          .executeTakeFirst();

        return {
          ...topic,
          avgScore: attempts?.avg_score ? Math.round(Number(attempts.avg_score)) : null,
          attemptCount: Number(attempts?.attempt_count || 0),
        };
      })
    );

    // Student performance (confidence scores)
    const studentPerf = await db
      .selectFrom("student_topic_confidence")
      .innerJoin("users", "users.id", "student_topic_confidence.student_id")
      .innerJoin("topics", "topics.id", "student_topic_confidence.topic_id")
      .where("topics.classroom_id", "=", id)
      .select([
        "users.id as student_id",
        "users.name as student_name",
        db.fn.avg("student_topic_confidence.confidence_score").as("avg_confidence"),
        db.fn.count("student_topic_confidence.id").as("topic_count"),
      ])
      .groupBy(["users.id", "users.name"])
      .orderBy(db.fn.avg("student_topic_confidence.confidence_score"), "asc")
      .execute();

    return NextResponse.json({
      studentCount: Number(studentCountResult?.count || 0),
      topics: topicsWithStats,
      studentPerformance: studentPerf,
    });
  } catch (error) {
    console.error("Classroom analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
