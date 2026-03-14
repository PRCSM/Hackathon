"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, ClipboardList, TrendingUp, MessageSquare, ArrowLeft } from "lucide-react";

interface Child {
  id: string;
  name: string | null;
  class: string | null;
  section: string | null;
  rollNumber: string | null;
  avgScore: number | null;
  weakTopics: { topic_title: string; confidence_score: number }[];
  confidence: { topic_title: string; subject: string; confidence_score: number; confidence_label: string }[];
  recentQuizzes: { score: number; total_questions: number; topic_title: string; created_at: string }[];
  topicCount: number;
  weakCount: number;
}

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [linked, setLinked] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then((r) => r.ok ? r.json() : { children: [], linked: false })
      .then((data) => {
        setChildren(data.children || []);
        setLinked(data.linked !== false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--color-forest)" }} />
      </div>
    );
  }

  if (!linked || children.length === 0) {
    return (
      <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
        <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
        <h2 className="text-h4 mb-2" style={{ color: "var(--color-ink)" }}>No child linked yet</h2>
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
          Complete your onboarding to link your child&apos;s account. You&apos;ll need their email or roll number.
        </p>
      </div>
    );
  }

  const child = children[selectedIndex];
  const avgScore = child.avgScore;
  const scoreColor = avgScore === null ? "var(--color-ink-subtle)" : avgScore >= 75 ? "var(--color-success)" : avgScore >= 45 ? "var(--color-warning)" : "var(--color-danger)";

  return (
    <div>
      {/* Child selector */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-6">
          {children.map((c, i) => (
            <button key={c.id} onClick={() => setSelectedIndex(i)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: i === selectedIndex ? "var(--color-forest)" : "var(--color-card)", color: i === selectedIndex ? "white" : "var(--color-ink)", border: "1px solid var(--color-border)" }}>
              {c.name || c.rollNumber}
            </button>
          ))}
        </div>
      )}

      <h1 className="text-h3 mb-1" style={{ color: "var(--color-ink)" }}>
        {child.name ? `${child.name.split(" ")[0]}'s Progress` : "Child Progress"}
      </h1>
      <p className="text-body-sm mb-6" style={{ color: "var(--color-ink-muted)" }}>
        {child.class && `Class ${child.class}`}{child.section && `-${child.section}`}
        {child.rollNumber && ` • Roll #${child.rollNumber}`}
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Avg Score", value: avgScore !== null ? `${avgScore}%` : "—", color: scoreColor, icon: TrendingUp },
          { label: "Topics Studied", value: child.topicCount, color: "var(--color-forest)", icon: BookOpen },
          { label: "Weak Topics", value: child.weakCount, color: child.weakCount > 0 ? "var(--color-danger)" : "var(--color-success)", icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <Icon size={18} className="mb-2" style={{ color }} />
            <p className="text-2xl font-bold mb-1" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{value}</p>
            <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Weak topics alert */}
      {child.weakTopics.length > 0 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ backgroundColor: "rgba(224,82,82,0.04)", borderColor: "var(--color-danger)", borderLeftWidth: 4, boxShadow: "var(--shadow-bento)" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} style={{ color: "var(--color-danger)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-danger)" }}>Needs Attention</h3>
          </div>
          <div className="space-y-2">
            {child.weakTopics.map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--color-ink)" }}>{t.topic_title}</p>
                <span className="text-xs font-bold" style={{ color: "var(--color-danger)" }}>{Math.round(t.confidence_score)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic performance */}
      {child.confidence.length > 0 && (
        <div className="rounded-2xl border p-5 mb-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-ink)" }}>Topic Scores</h3>
          <div className="space-y-3">
            {child.confidence.map((c, i) => {
              const barColor = c.confidence_score >= 75 ? "var(--color-success)" : c.confidence_score >= 45 ? "var(--color-warning)" : "var(--color-danger)";
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium" style={{ color: "var(--color-ink)" }}>{c.topic_title}</p>
                    <span className="text-xs font-semibold" style={{ color: barColor }}>{Math.round(c.confidence_score)}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${c.confidence_score}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent quizzes */}
      {child.recentQuizzes.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-ink)" }}>Recent Quiz Attempts</h3>
          <div className="space-y-2">
            {child.recentQuizzes.map((q, i) => {
              const pct = Math.round((q.score / q.total_questions) * 100);
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--color-bg)" }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-ink)" }}>{q.topic_title}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(q.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: pct >= 75 ? "var(--color-success)" : pct >= 45 ? "var(--color-warning)" : "var(--color-danger)" }}>
                    {q.score}/{q.total_questions}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation links */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {[
          { label: "Detailed Feedback", href: "/dashboard/parent/feedback", icon: MessageSquare },
          { label: "Assignment Tracking", href: "/dashboard/parent/assignments", icon: ClipboardList },
        ].map(({ label, href, icon: Icon }) => (
          <a key={href} href={href} className="rounded-2xl border p-4 flex items-center gap-3 hover:bg-[var(--color-card-hover)] transition-colors" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
            <Icon size={16} style={{ color: "var(--color-forest)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
