"use client";

import { StatCard, ProgressBar, StatusBadge } from "@/components/shared";
import { Users, GraduationCap, BookOpen, TrendingUp, MoreVertical } from "lucide-react";
import React from "react";

/* ── Mock data (will be replaced by API calls) ── */
const stats = [
  { icon: Users, value: 450, label: "Total Students", trend: { value: "+12%", positive: true } },
  { icon: GraduationCap, value: 32, label: "Total Teachers", trend: { value: "+3", positive: true } },
  { icon: BookOpen, value: 18, label: "Classrooms" },
  { icon: TrendingUp, value: 96, label: "Active Topics", trend: { value: "+8", positive: true } },
];

const teachers = [
  { name: "Anita Sharma", email: "anita@school.edu", subject: "Mathematics", status: "active" as const },
  { name: "Ravi Kumar", email: "ravi@school.edu", subject: "Physics", status: "active" as const },
  { name: "Priya Menon", email: "priya@school.edu", subject: "Biology", status: "pending" as const },
  { name: "Suresh Pillai", email: "suresh@school.edu", subject: "Computer Science", status: "active" as const },
  { name: "Deepa Nair", email: "deepa@school.edu", subject: "English", status: "pending" as const },
];

const heatmapData = [
  { subject: "Algebra", difficulty: "Hard", color: "var(--color-danger)" },
  { subject: "Geometry", difficulty: "Medium", color: "var(--color-warning)" },
  { subject: "Trigonometry", difficulty: "Easy", color: "var(--color-success)" },
  { subject: "Mechanics", difficulty: "Hard", color: "var(--color-danger)" },
  { subject: "Optics", difficulty: "Easy", color: "var(--color-success)" },
  { subject: "Thermodynamics", difficulty: "Medium", color: "var(--color-warning)" },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>
          School Overview
        </h1>
        <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
          Institution-wide statistics and management
        </p>
      </div>

      {/* Stat Cards — row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} trend={s.trend} />
        ))}
      </div>

      {/* Row 2 — Heatmap + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Subject Difficulty Heatmap */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-bento)",
          }}
        >
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>
            Subject Difficulty
          </h3>
          <div className="space-y-3">
            {heatmapData.map((item) => (
              <div key={item.subject} className="flex items-center justify-between">
                <span className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>
                  {item.subject}
                </span>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    value={item.difficulty === "Hard" ? 85 : item.difficulty === "Medium" ? 55 : 25}
                    colorVar={item.color}
                    className="w-24"
                    height={6}
                    animate={false}
                  />
                  <span
                    className="text-xs font-bold w-16 text-right"
                    style={{ color: item.color }}
                  >
                    {item.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Performance */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-bento)",
          }}
        >
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>
            Average Performance
          </h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div
                className="text-6xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}
              >
                72%
              </div>
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                Across all subjects
              </p>
              <div className="mt-4 flex gap-4 justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: "var(--color-success)" }}>320</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Proficient</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: "var(--color-warning)" }}>95</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Developing</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: "var(--color-danger)" }}>35</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Weak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Teacher Management Table */}
      <div
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-bento)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>
            Teacher Management
          </h3>
          <button
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--color-forest)", backgroundColor: "rgba(45,74,30,0.06)" }}
          >
            + Add Teacher
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className="border-b text-xs font-semibold uppercase tracking-wider"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink-subtle)" }}
              >
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Subject</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr
                  key={t.email}
                  className="border-b last:border-b-0 transition-colors hover:bg-[var(--color-card-hover)]"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="py-3.5 pr-4">
                    <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                      {t.name}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                      {t.email}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                      {t.subject}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
                      <MoreVertical size={16} style={{ color: "var(--color-ink-subtle)" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
