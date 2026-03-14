import { db } from "@/db";
import { sql } from "kysely";
import { NextRequest, NextResponse } from "next/server";

// GET /api/quizzes?topicId= — Get quiz for a topic
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const topicId = url.searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ error: "topicId required" }, { status: 400 });
    }

    const quiz = await db
      .selectFrom("quizzes")
      .where("topic_id", "=", topicId)
      .selectAll()
      .executeTakeFirst();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = await db
      .selectFrom("quiz_questions")
      .where("quiz_id", "=", quiz.id)
      .select([
        "id",
        "question_text",
        "options",
        "difficulty",
        "order_index",
        // NOTE: correct_answer and ai_explanation sent only after submission
      ])
      .orderBy("order_index", "asc")
      .execute();

    return NextResponse.json({ quiz, questions });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

// POST /api/quizzes/submit — Submit quiz answers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizId, studentId, answers, timeTakenSeconds } = body;
    // answers: [{ questionId, selectedAnswer }]

    // Fetch correct answers
    const questions = await db
      .selectFrom("quiz_questions")
      .where("quiz_id", "=", quizId)
      .select(["id", "correct_answer", "ai_explanation"])
      .execute();

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let score = 0;
    const gradedAnswers = answers.map((a: { questionId: string; selectedAnswer: number }) => {
      const question = questionMap.get(a.questionId);
      const correct = question?.correct_answer === a.selectedAnswer;
      if (correct) score++;
      return {
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        correct,
        explanation: !correct ? question?.ai_explanation : null,
      };
    });

    // Save attempt
    const attempt = await db
      .insertInto("quiz_attempts")
      .values({
        quiz_id: quizId,
        student_id: studentId,
        score,
        total_questions: questions.length,
        answers: JSON.stringify(gradedAnswers),
        time_taken_seconds: timeTakenSeconds,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Update confidence scores
    const quiz = await db
      .selectFrom("quizzes")
      .where("id", "=", quizId)
      .select("topic_id")
      .executeTakeFirst();

    if (quiz) {
      const scorePercent = (score / questions.length) * 100;
      const label = scorePercent >= 75 ? "proficient" : scorePercent >= 45 ? "developing" : "weak";

      await db
        .insertInto("student_topic_confidence")
        .values({
          student_id: studentId,
          topic_id: quiz.topic_id,
          confidence_score: scorePercent,
          confidence_label: label,
          quiz_count: 1,
          last_quiz_at: new Date(),
        })
        .onConflict((oc) =>
          oc.columns(["student_id", "topic_id"]).doUpdateSet({
            confidence_score: scorePercent,
            confidence_label: label,
            quiz_count: sql`student_topic_confidence.quiz_count + 1`,
            last_quiz_at: new Date(),
            updated_at: new Date(),
          })
        )
        .execute();

      // Alert parent if score is weak
      if (label === "weak") {
        const parentLinks = await db
          .selectFrom("parent_student_links")
          .where("student_id", "=", studentId)
          .select("parent_id")
          .execute();

        if (parentLinks.length > 0) {
          await db
            .insertInto("notifications")
            .values(
              parentLinks.map((p) => ({
                user_id: p.parent_id,
                type: "weak_topic_alert" as const,
                title: "Weak Topic Alert",
                message: `Your child scored ${score}/${questions.length} on a quiz. This topic may need attention.`,
              }))
            )
            .execute();
        }
      }
    }

    return NextResponse.json({
      attempt,
      gradedAnswers,
      score,
      total: questions.length,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
