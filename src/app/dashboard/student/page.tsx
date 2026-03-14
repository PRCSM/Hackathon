"use client";

import { StatCard, ProgressBar, StatusBadge, Button } from "@/components/shared";
import { BookOpen, Target, Brain, Award, ChevronRight } from "lucide-react";
import React from "react";

/* ── Mock data ── */
const stats = [
  { icon: BookOpen, value: 12, label: "Active Topics" },
  { icon: Target, value: 78, label: "Avg. Score (%)", trend: { value: "+5%", positive: true } },
  { icon: Brain, value: 3, label: "Weak Topics", trend: { value: "-1", positive: true } },
  { icon: Award, value: 15, label: "Quizzes Done" },
];

const subjects = [
  { name: "Mathematics", topics: 5, progress: 72, accent: "var(--accent-math)" },
  { name: "Physics", topics: 4, progress: 60, accent: "var(--accent-science)" },
  { name: "English", topics: 3, progress: 88, accent: "var(--accent-english)" },
  { name: "Biology", topics: 4, progress: 65, accent: "var(--accent-geo)" },
];

const weakTopics = [
  { name: "Quadratic Equations", subject: "Mathematics", confidence: 28 },
  { name: "Mechanics", subject: "Physics", confidence: 35 },
  { name: "Genetics", subject: "Biology", confidence: 30 },
];

const recentQuizzes = [
  { topic: "Algebra", score: 85, total: 10, date: "Mar 12" },
  { topic: "Optics", score: 60, total: 10, date: "Mar 11" },
  { topic: "Photosynthesis", score: 90, total: 10, date: "Mar 10" },
];

export default function StudentDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>
          Welcome back! 👋
        </h1>
        <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
          Continue learning where you left off
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} trend={s.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subjects — 2 cols */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-bento)",
          }}
        >
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>
            My Subjects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((sub) => (
              <div
                key={sub.name}
                className="group p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sub.accent }}
                  />
                  <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                    {sub.name}
                  </span>
                  <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-ink-subtle)" }} />
                </div>
                <ProgressBar value={sub.progress} height={6} />
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                    {sub.topics} topics
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--color-ink-muted)" }}>
                    {sub.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Weak Topics */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-bento)",
            }}
          >
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>
              Focus Areas
            </h3>
            <div className="space-y-3">
              {weakTopics.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{t.subject}</p>
                  </div>
                  <StatusBadge status="weak" />
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" fullWidth className="mt-4">
              Start Revision
            </Button>
          </div>

          {/* Recent Quizzes */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-bento)",
            }}
          >
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>
              Recent Quizzes
            </h3>
            <div className="space-y-3">
              {recentQuizzes.map((q) => (
                <div key={q.topic} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{q.topic}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{q.date}</p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: q.score >= 80
                        ? "var(--color-success)"
                        : q.score >= 50
                          ? "var(--color-warning)"
                          : "var(--color-danger)",
                    }}
                  >
                    {q.score}/{q.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
