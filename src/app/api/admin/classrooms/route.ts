import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

// GET /api/admin/classrooms — All classrooms with teacher and student counts
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const classrooms = await db
      .selectFrom("classrooms")
      .innerJoin("users as teacher", "teacher.id", "classrooms.teacher_id")
      .select([
        "classrooms.id",
        "classrooms.name",
        "classrooms.grade",
        "classrooms.section",
        "classrooms.subject",
        "classrooms.academic_year",
        "classrooms.created_at",
        "teacher.name as teacher_name",
        "teacher.email as teacher_email",
      ])
      .orderBy("classrooms.created_at", "desc")
      .execute();

    const withCounts = await Promise.all(
      classrooms.map(async (c) => {
        const [studentCount, topicCount] = await Promise.all([
          db.selectFrom("classroom_students").where("classroom_id", "=", c.id).select(db.fn.count("id").as("count")).executeTakeFirst(),
          db.selectFrom("topics").where("classroom_id", "=", c.id).select(db.fn.count("id").as("count")).executeTakeFirst(),
        ]);
        return {
          ...c,
          studentCount: Number(studentCount?.count || 0),
          topicCount: Number(topicCount?.count || 0),
        };
      })
    );

    return NextResponse.json({ classrooms: withCounts });
  } catch (error) {
    console.error("Admin classrooms error:", error);
    return NextResponse.json({ error: "Failed to fetch classrooms" }, { status: 500 });
  }
}
