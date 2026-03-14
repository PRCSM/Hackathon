import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/analytics — School-wide analytics
export async function GET() {
  try {
    // Total counts
    const studentCount = await db
      .selectFrom("users")
      .where("role", "=", "student")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirst();

    const teacherCount = await db
      .selectFrom("users")
      .where("role", "=", "teacher")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirst();

    const classroomCount = await db
      .selectFrom("classrooms")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirst();

    const topicCount = await db
      .selectFrom("topics")
      .where("status", "=", "approved")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirst();

    // Average performance
    const avgPerformance = await db
      .selectFrom("student_topic_confidence")
      .select(db.fn.avg("confidence_score").as("avg_score"))
      .executeTakeFirst();

    // Confidence distribution
    const confidenceDist = await db
      .selectFrom("student_topic_confidence")
      .select([
        "confidence_label",
        db.fn.count("id").as("count"),
      ])
      .groupBy("confidence_label")
      .execute();

    // Hardest topics (lowest avg confidence)
    const hardestTopics = await db
      .selectFrom("student_topic_confidence")
      .innerJoin("topics", "topics.id", "student_topic_confidence.topic_id")
      .select([
        "topics.title",
        db.fn.avg("student_topic_confidence.confidence_score").as("avg_confidence"),
        db.fn.count("student_topic_confidence.id").as("attempts"),
      ])
      .groupBy(["topics.id", "topics.title"])
      .orderBy("avg_confidence", "asc")
      .limit(10)
      .execute();

    return NextResponse.json({
      overview: {
        students: Number(studentCount?.count || 0),
        teachers: Number(teacherCount?.count || 0),
        classrooms: Number(classroomCount?.count || 0),
        activeTopics: Number(topicCount?.count || 0),
      },
      averagePerformance: Number(avgPerformance?.avg_score || 0),
      confidenceDistribution: confidenceDist.map((d) => ({
        label: d.confidence_label,
        count: Number(d.count),
      })),
      hardestTopics: hardestTopics.map((t) => ({
        title: t.title,
        avgConfidence: Number(t.avg_confidence),
        attempts: Number(t.attempts),
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
