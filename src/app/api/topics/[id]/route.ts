import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/topics/[id] — Get topic detail with content
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const topic = await db
      .selectFrom("topics")
      .where("topics.id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    // Get explanation
    const explanation = await db
      .selectFrom("explanations")
      .where("topic_id", "=", id)
      .where("language", "=", "en")
      .selectAll()
      .executeTakeFirst();

    // Get quiz with questions (no correct answers for students)
    const quiz = await db
      .selectFrom("quizzes")
      .where("topic_id", "=", id)
      .selectAll()
      .executeTakeFirst();

    let questions = null;
    if (quiz) {
      const role = (session.user as { role?: string }).role;
      questions = await db
        .selectFrom("quiz_questions")
        .where("quiz_id", "=", quiz.id)
        .select(
          role === "teacher"
            ? ["id", "question_text", "options", "correct_answer", "ai_explanation", "difficulty", "order_index"]
            : ["id", "question_text", "options", "difficulty", "order_index"]
        )
        .orderBy("order_index", "asc")
        .execute();
    }

    // Get flashcards
    const flashcardSet = await db
      .selectFrom("flashcard_sets")
      .where("topic_id", "=", id)
      .selectAll()
      .executeTakeFirst();

    let flashcards = null;
    if (flashcardSet) {
      flashcards = await db
        .selectFrom("flashcards")
        .where("set_id", "=", flashcardSet.id)
        .selectAll()
        .orderBy("order_index", "asc")
        .execute();
    }

    return NextResponse.json({ topic, explanation, quiz, questions, flashcards });
  } catch (error) {
    console.error("Error fetching topic:", error);
    return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
  }
}

// PATCH /api/topics/[id] — Update topic (approve, edit explanation, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { action, explanation } = body;

    if (action === "approve") {
      await db
        .updateTable("topics")
        .set({
          status: "approved",
          approved_by: session.user.id,
          approved_at: new Date(),
          updated_at: new Date(),
        })
        .where("id", "=", id)
        .execute();

      // Notify teacher
      const topic = await db.selectFrom("topics").where("id", "=", id).select(["created_by", "title"]).executeTakeFirst();
      if (topic) {
        await db.insertInto("notifications").values({
          user_id: topic.created_by,
          type: "content_approved",
          title: "Content Approved",
          message: `"${topic.title}" has been approved and is now visible to students.`,
        }).execute();
      }

      return NextResponse.json({ success: true, status: "approved" });
    }

    if (action === "reject") {
      await db
        .updateTable("topics")
        .set({ status: "rejected", updated_at: new Date() })
        .where("id", "=", id)
        .execute();
      return NextResponse.json({ success: true, status: "rejected" });
    }

    if (action === "edit_explanation" && explanation) {
      await db
        .updateTable("explanations")
        .set({ content: explanation })
        .where("topic_id", "=", id)
        .execute();
      return NextResponse.json({ success: true });
    }

    if (action === "regenerate") {
      await db.updateTable("topics").set({ status: "processing", updated_at: new Date() }).where("id", "=", id).execute();
      // TODO: trigger Lambda re-processing
      return NextResponse.json({ success: true, message: "Regeneration queued" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}
