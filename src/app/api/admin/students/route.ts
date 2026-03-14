import { db } from "@/db";
import { NextResponse } from "next/server";

// GET /api/admin/students — List all students
export async function GET() {
  try {
    const students = await db
      .selectFrom("users")
      .where("role", "=", "student")
      .select([
        "id",
        "name",
        "email",
        "role",
        "onboarding_completed",
        "created_at",
      ])
      .orderBy("created_at", "desc")
      .execute();

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
