import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/settings — Get school settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const settings = await db
      .selectFrom("school_settings")
      .selectAll()
      .executeTakeFirst();

    return NextResponse.json({ settings: settings || null });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT /api/admin/settings — Update school settings
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string }).role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { school_name, academic_year, supported_languages, subjects } = body;

    const existing = await db.selectFrom("school_settings").selectAll().executeTakeFirst();

    if (existing) {
      await db
        .updateTable("school_settings")
        .set({
          school_name: school_name || existing.school_name,
          academic_year: academic_year || existing.academic_year,
          supported_languages: supported_languages || existing.supported_languages,
          subjects: subjects || existing.subjects,
          updated_by: session.user.id,
          updated_at: new Date(),
        })
        .where("id", "=", existing.id)
        .execute();
    } else {
      await db
        .insertInto("school_settings")
        .values({
          school_name: school_name || "My School",
          academic_year: academic_year || "2025-26",
          supported_languages: supported_languages || ["en"],
          subjects: subjects || [],
          updated_by: session.user.id,
        })
        .execute();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
