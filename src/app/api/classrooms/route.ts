import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/classrooms — List classrooms
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const teacherId = url.searchParams.get("teacherId");
    const studentId = url.searchParams.get("studentId");

    let query = db
      .selectFrom("classrooms")
      .innerJoin("users", "users.id", "classrooms.teacher_id")
      .select([
        "classrooms.id",
        "classrooms.name",
        "classrooms.grade",
        "classrooms.section",
        "classrooms.subject",
        "classrooms.academic_year",
        "classrooms.created_at",
        "users.name as teacher_name",
      ]);

    if (teacherId) {
      query = query.where("classrooms.teacher_id", "=", teacherId);
    }

    if (studentId) {
      query = query.where(
        "classrooms.id",
        "in",
        db
          .selectFrom("classroom_students")
          .where("student_id", "=", studentId)
          .select("classroom_id")
      );
    }

    const classrooms = await query.orderBy("classrooms.created_at", "desc").execute();

    // Get student counts
    const classroomsWithCounts = await Promise.all(
      classrooms.map(async (c) => {
        const countResult = await db
          .selectFrom("classroom_students")
          .where("classroom_id", "=", c.id)
          .select(db.fn.count("id").as("count"))
          .executeTakeFirst();

        return {
          ...c,
          studentCount: Number(countResult?.count || 0),
        };
      })
    );

    return NextResponse.json(classroomsWithCounts);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json({ error: "Failed to fetch classrooms" }, { status: 500 });
  }
}

// POST /api/classrooms — Create classroom
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, grade, section, subject, teacherId, academicYear } = body;

    const classroom = await db
      .insertInto("classrooms")
      .values({
        name,
        grade,
        section: section || "A",
        subject,
        teacher_id: teacherId,
        academic_year: academicYear,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return NextResponse.json(classroom, { status: 201 });
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json({ error: "Failed to create classroom" }, { status: 500 });
  }
}
