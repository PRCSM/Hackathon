"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, TrendingUp, BarChart2, AlertTriangle } from "lucide-react";

interface Confidence {
  topic_title: string;
  subject: string;
  confidence_score: number;
  confidence_label: string;
  last_quiz_at: string | null;
}

export default function StudentProgressPage() {
  const { data: session } = useSession();
  const [confidence, setConfidence] = useState<Confidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = (session?.user as { id?: string })?.id;
    if (!studentId) return;
    // Fetch from parent dashboard endpoint structure (reuse)
    fetch(`/api/student/progress`)
      .then((r) => r.ok ? r.json() : { confidence: [] })
      .then((data) => { setConfidence(data.confidence || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  const avgScore = confidence.length > 0
    ? Math.round(confidence.reduce((s, c) => s + c.confidence_score, 0) / confidence.length)
    : null;
  const weakTopics = confidence.filter((c) => c.confidence_label === "weak");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/student" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>My Progress</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Track your learning journey</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : confidence.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <TrendingUp size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No progress data yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Take some quizzes to see your progress here!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <BarChart2 size={18} className="mb-2" style={{ color: "var(--color-forest)" }} />
              <p className="text-2xl font-bold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{confidence.length}</p>
              <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>Topics studied</p>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <TrendingUp size={18} className="mb-2" style={{ color: avgScore && avgScore >= 75 ? "var(--color-success)" : avgScore && avgScore >= 45 ? "var(--color-warning)" : "var(--color-danger)" }} />
              <p className="text-2xl font-bold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{avgScore}%</p>
              <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>Average score</p>
            </div>
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <AlertTriangle size={18} className="mb-2" style={{ color: weakTopics.length > 0 ? "var(--color-danger)" : "var(--color-success)" }} />
              <p className="text-2xl font-bold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{weakTopics.length}</p>
              <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>Weak topics</p>
            </div>
          </div>

          {/* Topic scores */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-ink)" }}>Topic Scores</h3>
            <div className="space-y-3">
              {confidence.map((c, i) => {
                const barColor = c.confidence_score >= 75 ? "var(--color-success)" : c.confidence_score >= 45 ? "var(--color-warning)" : "var(--color-danger)";
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium" style={{ color: "var(--color-ink)" }}>{c.topic_title}</p>
                      <span className="text-xs font-semibold" style={{ color: barColor }}>{Math.round(c.confidence_score)}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.confidence_score}%`, backgroundColor: barColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
