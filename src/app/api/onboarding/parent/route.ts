import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, childEmail, childRollNumber } = body;

    const userId = "mock-parent-id";

    // Create parent profile
    await db
      .insertInto("parent_profiles")
      .values({
        user_id: userId,
        phone,
      })
      .onConflict((oc) => oc.column("user_id").doUpdateSet({ phone }))
      .execute();

    // Update user
    await db
      .updateTable("users")
      .set({
        name,
        onboarding_completed: true,
        updated_at: new Date(),
      })
      .where("id", "=", userId)
      .execute();

    // Try to link child by email or roll number
    if (childEmail) {
      const student = await db
        .selectFrom("users")
        .where("email", "=", childEmail)
        .where("role", "=", "student")
        .select("id")
        .executeTakeFirst();

      if (student) {
        await db
          .insertInto("parent_student_links")
          .values({
            parent_id: userId,
            student_id: student.id,
          })
          .onConflict((oc) => oc.columns(["parent_id", "student_id"]).doNothing())
          .execute();
      }
    } else if (childRollNumber) {
      const student = await db
        .selectFrom("student_profiles")
        .innerJoin("users", "users.id", "student_profiles.user_id")
        .where("student_profiles.roll_number", "=", childRollNumber)
        .select("users.id")
        .executeTakeFirst();

      if (student) {
        await db
          .insertInto("parent_student_links")
          .values({
            parent_id: userId,
            student_id: student.id,
          })
          .onConflict((oc) => oc.columns(["parent_id", "student_id"]).doNothing())
          .execute();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Parent onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
