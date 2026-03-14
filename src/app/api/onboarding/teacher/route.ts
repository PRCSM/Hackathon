import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, subject, gradeLevel, school, language } = body;

    // In production, get user from session
    // const session = await auth();
    // const userId = session?.user?.id;

    // For now, mock user — will be replaced with real session
    const userId = "mock-teacher-id";

    // Update user profile
    await db
      .insertInto("teacher_profiles")
      .values({
        user_id: userId,
        subject,
        grade_level: gradeLevel,
        school_name: school,
      })
      .onConflict((oc) => oc.column("user_id").doUpdateSet({
        subject,
        grade_level: gradeLevel,
        school_name: school,
      }))
      .execute();

    // Update user record
    await db
      .updateTable("users")
      .set({
        name,
        preferred_language: language || "en",
        onboarding_completed: true,
        updated_at: new Date(),
      })
      .where("id", "=", userId)
      .execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Teacher onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
