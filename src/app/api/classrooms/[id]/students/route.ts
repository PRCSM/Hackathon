import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/classrooms/[id]/students — List students in classroom
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const students = await db
      .selectFrom("classroom_students")
      .innerJoin("users", "users.id", "classroom_students.student_id")
      .leftJoin("student_profiles", "student_profiles.user_id", "users.id")
      .where("classroom_students.classroom_id", "=", id)
      .select([
        "users.id",
        "users.name",
        "users.email",
        "student_profiles.roll_number",
        "student_profiles.class",
        "student_profiles.section",
        "classroom_students.joined_at",
      ])
      .orderBy("users.name", "asc")
      .execute();

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Classroom students GET error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

// POST /api/classrooms/[id]/students — Add student to classroom
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { studentEmail, studentId } = await req.json();

    let resolvedStudentId = studentId;

    if (!resolvedStudentId && studentEmail) {
      const user = await db
        .selectFrom("users")
        .where("email", "=", studentEmail)
        .where("role", "=", "student")
        .select("id")
        .executeTakeFirst();

      if (!user) {
        return NextResponse.json({ error: "Student not found with that email" }, { status: 404 });
      }
      resolvedStudentId = user.id;
    }

    await db
      .insertInto("classroom_students")
      .values({ classroom_id: id, student_id: resolvedStudentId })
      .onConflict((oc) => oc.columns(["classroom_id", "student_id"]).doNothing())
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Classroom students POST error:", error);
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
  }
}
