"use client";

import { useEffect, useState } from "react";
import { StatCard, ProgressBar, StatusBadge, Button } from "@/components/shared";
import { BookOpen, Target, Brain, Award, ChevronRight } from "lucide-react";

interface QuizData {
  id: number;
  title: string;
  topic_title: string;
  score?: number;
  total_questions?: number;
  created_at: string;
}

export default function StudentDashboard() {
  const [topicCount, setTopicCount] = useState(0);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/topics").then((r) => r.ok ? r.json() : { topics: [] }),
      fetch("/api/quizzes").then((r) => r.ok ? r.json() : { quizzes: [] }),
    ]).then(([topicData, quizData]) => {
      const topics = topicData.topics || [];
      setTopicCount(topics.length);
      setQuizzes(quizData.quizzes || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { icon: BookOpen, value: loading ? "..." : topicCount, label: "Active Topics" },
    { icon: Target, value: loading ? "..." : "—", label: "Avg. Score (%)" },
    { icon: Brain, value: loading ? "..." : 0, label: "Weak Topics" },
    { icon: Award, value: loading ? "..." : quizzes.length, label: "Quizzes Done" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Welcome back! 👋</h1>
        <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Continue learning where you left off</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content — 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>My Learning</h3>
          {loading ? (
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
          ) : topicCount > 0 ? (
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              You have access to <strong>{topicCount}</strong> topics. Browse them in the Topics section.
            </p>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No topics available yet.</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Your teacher will upload content soon!</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent Quizzes */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Recent Quizzes</h3>
            {quizzes.length > 0 ? (
              <div className="space-y-3">
                {quizzes.slice(0, 5).map((q) => (
                  <div key={q.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{q.topic_title || q.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(q.created_at).toLocaleDateString()}</p>
                    </div>
                    {q.score !== undefined && (
                      <span className="text-sm font-bold" style={{ color: q.score >= 80 ? "var(--color-success)" : q.score >= 50 ? "var(--color-warning)" : "var(--color-danger)" }}>
                        {q.score}/{q.total_questions || 10}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No quizzes attempted yet.</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Quick Actions</h3>
            <div className="space-y-3">
              <a href="/dashboard/student/topics" className="block p-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors">
                <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>📚 Browse Topics</p>
              </a>
              <a href="/dashboard/student/revision" className="block p-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors">
                <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>🔄 Revision Mode</p>
              </a>
              <a href="/dashboard/student/progress" className="block p-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors">
                <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>📊 My Progress</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
