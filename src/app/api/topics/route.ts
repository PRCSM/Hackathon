import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/topics — List topics
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const classroomId = url.searchParams.get("classroomId");
    const status = url.searchParams.get("status");

    let query = db
      .selectFrom("topics")
      .innerJoin("classrooms", "classrooms.id", "topics.classroom_id")
      .innerJoin("users", "users.id", "topics.created_by")
      .select([
        "topics.id",
        "topics.title",
        "topics.description",
        "topics.status",
        "topics.difficulty",
        "topics.difficulty_score",
        "topics.original_filename",
        "topics.file_type",
        "topics.ai_summary",
        "topics.created_at",
        "topics.approved_at",
        "classrooms.name as classroom_name",
        "classrooms.subject",
        "users.name as created_by_name",
      ]);

    if (classroomId) {
      query = query.where("topics.classroom_id", "=", classroomId);
    }

    if (status) {
      query = query.where("topics.status", "=", status as "processing" | "pending" | "approved" | "rejected" | "failed");
    }

    const topics = await query.orderBy("topics.created_at", "desc").execute();
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}

// POST /api/topics — Create topic (initiate upload)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { classroomId, title, description, createdBy, s3Key, originalFilename, fileType } = body;

    const topic = await db
      .insertInto("topics")
      .values({
        classroom_id: classroomId,
        title,
        description,
        status: "processing",
        s3_key: s3Key,
        original_filename: originalFilename,
        file_type: fileType,
        created_by: createdBy,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}
