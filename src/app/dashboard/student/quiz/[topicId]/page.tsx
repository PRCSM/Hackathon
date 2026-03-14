"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/shared";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  difficulty: string;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  topic_id: string;
}

interface GradedAnswer {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
  explanation: string | null;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ score: number; total: number; gradedAnswers: GradedAnswer[] } | null>(null);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes?topicId=${topicId}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((data) => {
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch((e) => { setError(e.toString()); setLoading(false); });
  }, [topicId]);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    setSubmitting(true);

    const answers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer,
    }));

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          studentId: "current", // resolved server-side from session
          answers,
          timeTakenSeconds: timeTaken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults({ score: data.score, total: data.total, gradedAnswers: data.gradedAnswers });
        setSubmitted(true);
      }
    } catch {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  }, [quiz, selectedAnswers, startTime]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent mx-auto mb-4 animate-spin" style={{ borderColor: "var(--color-forest)" }} />
          <p style={{ color: "var(--color-ink-muted)" }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="text-center p-8">
          <XCircle size={48} className="mx-auto mb-4" style={{ color: "var(--color-danger)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>
            {error || "No quiz available for this topic yet."}
          </p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--color-ink-subtle)" }}>
            The teacher may not have approved content yet.
          </p>
          <button onClick={() => router.back()} className="text-sm font-medium" style={{ color: "var(--color-forest)" }}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (submitted && results) {
    const percentage = Math.round((results.score / results.total) * 100);
    const scoreColor = percentage >= 75 ? "var(--color-success)" : percentage >= 45 ? "var(--color-warning)" : "var(--color-danger)";

    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-2xl mx-auto">
          {/* Score card */}
          <div className="rounded-2xl border p-8 text-center mb-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4" style={{ borderColor: scoreColor }}>
              <span className="text-2xl font-bold" style={{ color: scoreColor, fontFamily: "var(--font-display)" }}>{percentage}%</span>
            </div>
            <h2 className="text-h4 mb-1" style={{ color: "var(--color-ink)" }}>
              {percentage >= 75 ? "Excellent! 🎉" : percentage >= 45 ? "Good effort! 📚" : "Keep practicing! 💪"}
            </h2>
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              You scored <strong>{results.score}</strong> out of <strong>{results.total}</strong>
            </p>
          </div>

          {/* Answer review */}
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Review Your Answers</h3>
          <div className="space-y-4">
            {results.gradedAnswers.map((ga, i) => {
              const q = questions.find((q) => q.id === ga.questionId);
              if (!q) return null;
              return (
                <div key={ga.questionId} className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: ga.correct ? "var(--color-success)" : "var(--color-danger)", boxShadow: "var(--shadow-bento)" }}>
                  <div className="flex items-start gap-3 mb-3">
                    {ga.correct ? <CheckCircle size={18} style={{ color: "var(--color-success)", flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} style={{ color: "var(--color-danger)", flexShrink: 0, marginTop: 2 }} />}
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Q{i + 1}. {q.question_text}</p>
                  </div>
                  <div className="ml-7 space-y-1">
                    {q.options.map((opt, idx) => (
                      <p key={idx} className="text-xs px-3 py-1.5 rounded-lg" style={{
                        backgroundColor: idx === ga.selectedAnswer ? (ga.correct ? "rgba(76,175,125,0.1)" : "rgba(224,82,82,0.1)") : "transparent",
                        color: "var(--color-ink-muted)",
                      }}>
                        {idx === ga.selectedAnswer && (ga.correct ? "✓ " : "✗ ")}{opt}
                      </p>
                    ))}
                  </div>
                  {!ga.correct && ga.explanation && (
                    <div className="ml-7 mt-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(255,193,7,0.08)", borderLeft: "3px solid var(--color-warning)" }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-warning)" }}>AI Explanation</p>
                      <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{ga.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/student/topics")}>
              <ArrowLeft size={16} /> Back to Topics
            </Button>
            <Button variant="primary" size="sm" onClick={() => { setSubmitted(false); setSelectedAnswers({}); setCurrentIndex(0); setResults(null); }}>
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / questions.length) * 100;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
            <ArrowLeft size={18} style={{ color: "var(--color-ink)" }} />
          </button>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{quiz.title}</p>
            <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-ink-subtle)" }}>
            <Clock size={14} />
            {answeredCount}/{questions.length} answered
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ backgroundColor: "var(--color-border)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: "var(--color-forest)" }} />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border p-8 mb-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "var(--color-forest)", color: "white" }}>
                {currentIndex + 1}/{questions.length}
              </span>
              <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{currentQ.difficulty}</span>
            </div>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--color-ink)", lineHeight: 1.6 }}>
              {currentQ.question_text}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(currentQ.id, idx)}
                    className="w-full text-left p-4 rounded-xl border transition-all duration-200"
                    style={{
                      borderColor: isSelected ? "var(--color-forest)" : "var(--color-border)",
                      backgroundColor: isSelected ? "rgba(74,122,89,0.08)" : "var(--color-bg)",
                      color: "var(--color-ink)",
                    }}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3" style={{ backgroundColor: isSelected ? "var(--color-forest)" : "var(--color-border)", color: isSelected ? "white" : "var(--color-ink-muted)" }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
              <ArrowLeft size={16} /> Previous
            </Button>

            <div className="flex gap-1">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)} className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: selectedAnswers[questions[i].id] !== undefined ? "var(--color-forest)" : i === currentIndex ? "var(--color-ink)" : "var(--color-border)" }} />
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <Button variant="primary" size="sm" onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!allAnswered || submitting}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
