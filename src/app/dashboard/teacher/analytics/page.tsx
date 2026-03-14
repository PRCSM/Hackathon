"use client";

import { ArrowLeft, BarChart2 } from "lucide-react";

export default function TeacherAnalyticsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Analytics</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Track student performance across your classrooms</p>
        </div>
      </div>

      <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <BarChart2 size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
        <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>Analytics will appear here</p>
        <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Once students take quizzes, you&apos;ll see detailed performance insights</p>
      </div>
    </div>
  );
}
