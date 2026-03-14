"use client";

import { useEffect, useState } from "react";
import { StatCard, ProgressBar, StatusBadge } from "@/components/shared";
import { BookOpen, TrendingUp, AlertTriangle, ClipboardList, MessageSquare, Activity } from "lucide-react";

export default function ParentDashboard() {
  const [childData, setChildData] = useState<{ name: string; className: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setChildData(data.child || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { icon: BookOpen, value: "—", label: "Subjects" },
    { icon: TrendingUp, value: "—", label: "Avg. Score (%)" },
    { icon: AlertTriangle, value: 0, label: "Weak Topics" },
    { icon: ClipboardList, value: 0, label: "Assignments" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>
            Child&apos;s Progress
          </h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
            {childData ? (
              <>Viewing progress for <strong>{childData.name}</strong> • {childData.className}</>
            ) : (
              "Link your child's account to view their progress"
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info Card */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} />
              <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>Overview</h3>
            </div>
            {childData ? (
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                Your child&apos;s learning data will appear here as they take quizzes and study topics.
              </p>
            ) : (
              <div className="text-center py-6">
                <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                  No child linked yet. Please complete the onboarding process to link your child&apos;s student account.
                </p>
                <a href="/onboarding/parent" className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--color-forest)", color: "white" }}>
                  Link Child Account
                </a>
              </div>
            )}
          </div>

          {/* Assignment Tracker */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Assignments</h3>
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              Assignment tracking data will appear once your child has been assigned work by teachers.
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Daily Activity */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} style={{ color: "var(--color-sage)" }} />
              <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>Today&apos;s Activity</h3>
            </div>
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              Activity data will show once your child starts learning.
            </p>
          </div>

          {/* Teacher Feedback */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} style={{ color: "var(--color-sage)" }} />
              <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>Teacher Feedback</h3>
            </div>
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              No feedback from teachers yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
