import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rollNumber, class: studentClass, section, school, language, consent } = body;

    const userId = "mock-student-id";

    await db
      .insertInto("student_profiles")
      .values({
        user_id: userId,
        roll_number: rollNumber,
        class: studentClass,
        section,
        school_name: school,
        consent_given: consent,
      })
      .onConflict((oc) => oc.column("user_id").doUpdateSet({
        roll_number: rollNumber,
        class: studentClass,
        section,
        school_name: school,
        consent_given: consent,
      }))
      .execute();

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
    console.error("Student onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
