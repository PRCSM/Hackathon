import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

// GET /api/parent/dashboard — Get child overview for logged-in parent
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parentId = session.user.id;

    // Find linked children
    const links = await db
      .selectFrom("parent_student_links")
      .innerJoin("users", "users.id", "parent_student_links.student_id")
      .leftJoin("student_profiles", "student_profiles.user_id", "users.id")
      .where("parent_student_links.parent_id", "=", parentId!)
      .select([
        "users.id",
        "users.name",
        "users.email",
        "student_profiles.class",
        "student_profiles.section",
        "student_profiles.roll_number",
      ])
      .execute();

    if (links.length === 0) {
      return NextResponse.json({ children: [], linked: false });
    }

    // Get data for first child (or all)
    const childrenData = await Promise.all(
      links.map(async (child) => {
        // Get confidence scores
        const confidence = await db
          .selectFrom("student_topic_confidence")
          .innerJoin("topics", "topics.id", "student_topic_confidence.topic_id")
          .innerJoin("classrooms", "classrooms.id", "topics.classroom_id")
          .where("student_topic_confidence.student_id", "=", child.id)
          .select([
            "topics.title as topic_title",
            "classrooms.subject",
            "student_topic_confidence.confidence_score",
            "student_topic_confidence.confidence_label",
            "student_topic_confidence.last_quiz_at",
          ])
          .orderBy("student_topic_confidence.confidence_score", "asc")
          .execute();

        const avgScore =
          confidence.length > 0
            ? Math.round(confidence.reduce((s, c) => s + c.confidence_score, 0) / confidence.length)
            : null;

        const weakTopics = confidence.filter((c) => c.confidence_label === "weak");

        // Get recent quiz attempts
        const recentQuizzes = await db
          .selectFrom("quiz_attempts")
          .innerJoin("quizzes", "quizzes.id", "quiz_attempts.quiz_id")
          .innerJoin("topics", "topics.id", "quizzes.topic_id")
          .where("quiz_attempts.student_id", "=", child.id)
          .select([
            "quiz_attempts.id",
            "quiz_attempts.score",
            "quiz_attempts.total_questions",
            "quiz_attempts.created_at",
            "topics.title as topic_title",
          ])
          .orderBy("quiz_attempts.created_at", "desc")
          .limit(5)
          .execute();

        return {
          id: child.id,
          name: child.name,
          email: child.email,
          class: child.class,
          section: child.section,
          rollNumber: child.roll_number,
          avgScore,
          confidence,
          weakTopics,
          recentQuizzes,
          topicCount: confidence.length,
          weakCount: weakTopics.length,
        };
      })
    );

    return NextResponse.json({ children: childrenData, linked: true });
  } catch (error) {
    console.error("Parent dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch parent dashboard" }, { status: 500 });
  }
}
