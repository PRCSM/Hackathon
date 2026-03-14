"use client";

import { StatCard, ProgressBar, StatusBadge, Button } from "@/components/shared";
import { BookOpen, Users, FileText, UploadCloud, BarChart2, AlertTriangle } from "lucide-react";
import React from "react";

/* ── Mock data ── */
const stats = [
  { icon: BookOpen, value: 6, label: "Classrooms" },
  { icon: Users, value: 182, label: "Total Students", trend: { value: "+14", positive: true } },
  { icon: FileText, value: 24, label: "Active Topics", trend: { value: "+5", positive: true } },
  { icon: AlertTriangle, value: 8, label: "Weak Students", trend: { value: "-2", positive: true } },
];

const recentTopics = [
  { name: "Quadratic Equations", subject: "Mathematics", status: "approved" as const, date: "Mar 12", students: 45, avgScore: 72 },
  { name: "Newton's Laws", subject: "Physics", status: "processing" as const, date: "Mar 11", students: 38, avgScore: 0 },
  { name: "Photosynthesis", subject: "Biology", status: "approved" as const, date: "Mar 10", students: 42, avgScore: 81 },
  { name: "Shakespeare Sonnets", subject: "English", status: "pending" as const, date: "Mar 9", students: 40, avgScore: 0 },
];

const weakStudents = [
  { name: "Rahul K.", topic: "Algebra", confidence: 28, className: "9-A" },
  { name: "Sneha M.", topic: "Mechanics", confidence: 32, className: "10-B" },
  { name: "Aditya P.", topic: "Genetics", confidence: 25, className: "11-A" },
];

const subjectAccents: Record<string, string> = {
  Mathematics: "var(--accent-math)",
  Physics: "var(--accent-science)",
  Biology: "var(--accent-geo)",
  English: "var(--accent-english)",
};

export default function TeacherDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>
            Teacher Dashboard
          </h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
            Manage classrooms, topics, and track student performance
          </p>
        </div>
        <Button variant="primary" size="sm">
          <UploadCloud size={16} />
          Upload Material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} trend={s.trend} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Topics — 2 cols */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-bento)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>
              Recent Topics
            </h3>
            <a href="/dashboard/teacher/topics" className="text-sm font-medium" style={{ color: "var(--color-forest)" }}>
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {recentTopics.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-[var(--color-card-hover)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: subjectAccents[t.subject] || "var(--color-sage)" }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                      {t.subject} • {t.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {t.avgScore > 0 && (
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold" style={{ color: "var(--color-ink)" }}>{t.avgScore}%</p>
                      <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>avg score</p>
                    </div>
                  )}
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Students — 1 col */}
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
              Needs Attention
            </h3>
          </div>

          <div className="space-y-4">
            {weakStudents.map((s) => (
              <div key={s.name} className="p-3 rounded-xl" style={{ backgroundColor: "rgba(224,82,82,0.04)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{s.name}</span>
                  <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{s.className}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--color-ink-muted)" }}>
                  Weak in: {s.topic}
                </p>
                <ProgressBar value={s.confidence} height={5} animate={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
