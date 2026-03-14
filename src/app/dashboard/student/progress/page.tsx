"use client";

import { ArrowLeft, TrendingUp } from "lucide-react";

export default function StudentProgressPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/student" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>My Progress</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Track your learning journey across all subjects</p>
        </div>
      </div>

      <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <TrendingUp size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
        <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No progress data yet</p>
        <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Start taking quizzes and studying topics to see your progress here</p>
      </div>
    </div>
  );
}
