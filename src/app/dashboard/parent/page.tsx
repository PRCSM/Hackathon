"use client";

import { StatCard, ProgressBar, StatusBadge } from "@/components/shared";
import { BookOpen, TrendingUp, AlertTriangle, ClipboardList, MessageSquare, Activity } from "lucide-react";
import React from "react";

/* ── Mock data ── */
const stats = [
  { icon: BookOpen, value: 6, label: "Subjects" },
  { icon: TrendingUp, value: 74, label: "Avg. Score (%)", trend: { value: "+3%", positive: true } },
  { icon: AlertTriangle, value: 2, label: "Weak Topics" },
  { icon: ClipboardList, value: 12, label: "Assignments" },
];

const weakAlerts = [
  { topic: "Quadratic Equations", subject: "Mathematics", confidence: 28, trend: "declining" },
  { topic: "Mechanics", subject: "Physics", confidence: 35, trend: "stable" },
];

const assignments = [
  { title: "Algebra Practice Set", subject: "Mathematics", due: "Mar 15", status: "submitted" as const },
  { title: "Newton's Laws Worksheet", subject: "Physics", due: "Mar 14", status: "pending" as const },
  { title: "Essay: Romeo & Juliet", subject: "English", due: "Mar 12", status: "approved" as const },
];

const dailyActivity = [
  { label: "Topics Studied", value: 3 },
  { label: "Quizzes Attempted", value: 2 },
  { label: "Revision Sessions", value: 1 },
  { label: "Flashcards Reviewed", value: 15 },
];

const feedback = [
  { teacher: "Ms. Sharma", message: "Great improvement in Algebra! Keep practicing word problems.", date: "Mar 12" },
  { teacher: "Mr. Kumar", message: "Please review Newton's Third Law before the test.", date: "Mar 11" },
];

export default function ParentDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>
            Child&apos;s Progress
          </h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
            Viewing progress for <strong>Rahul K.</strong> • Class 9-A
          </p>
        </div>
        {/* Child selector */}
        <select
          className="rounded-xl border px-4 py-2 text-sm"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-ink)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <option>Rahul K. (9-A)</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} trend={s.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Weak Topic Alerts */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-bento)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} style={{ color: "var(--color-danger)" }} />
              <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>
                Weak Topic Alerts
              </h3>
            </div>
            {weakAlerts.map((a) => (
              <div
                key={a.topic}
                className="p-4 rounded-xl mb-3 last:mb-0"
                style={{ backgroundColor: "rgba(224,82,82,0.04)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{a.topic}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{a.subject}</p>
                  </div>
                  <StatusBadge status="weak" />
                </div>
                <ProgressBar value={a.confidence} height={5} animate={false} />
                <p className="text-xs mt-2" style={{ color: "var(--color-ink-subtle)" }}>
                  Trend: {a.trend === "declining" ? "📉 Declining" : "➡️ Stable"}
                </p>
              </div>
            ))}
          </div>

          {/* Assignment Tracker */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-bento)",
            }}
          >
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>
              Assignments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr
                    className="border-b text-xs font-semibold uppercase tracking-wider"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-ink-subtle)" }}
                  >
                    <th className="pb-3 pr-4">Title</th>
                    <th className="pb-3 pr-4">Subject</th>
                    <th className="pb-3 pr-4">Due</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr
                      key={a.title}
                      className="border-b last:border-b-0"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="py-3 pr-4 text-sm font-medium" style={{ color: "var(--color-ink)" }}>{a.title}</td>
                      <td className="py-3 pr-4 text-body-sm" style={{ color: "var(--color-ink-muted)" }}>{a.subject}</td>
                      <td className="py-3 pr-4 text-body-sm" style={{ color: "var(--color-ink-muted)" }}>{a.due}</td>
                      <td className="py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Daily Activity */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-bento)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} style={{ color: "var(--color-sage)" }} />
              <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>
                Today&apos;s Activity
              </h3>
            </div>
            <div className="space-y-3">
              {dailyActivity.map((a) => (
                <div key={a.label} className="flex items-center justify-between">
                  <span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>{a.label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--color-ink)" }}>{a.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Feedback */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-bento)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} style={{ color: "var(--color-sage)" }} />
              <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>
                Teacher Feedback
              </h3>
            </div>
            <div className="space-y-4">
              {feedback.map((f, i) => (
                <div
                  key={i}
                  className="pl-4 relative"
                  style={{ borderLeft: "2px solid var(--color-sage-light)" }}
                >
                  <p className="text-sm" style={{ color: "var(--color-ink)" }}>{f.message}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>
                    — {f.teacher} • {f.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
