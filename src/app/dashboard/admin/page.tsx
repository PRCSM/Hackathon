"use client";

import { useEffect, useState } from "react";
import { StatCard, StatusBadge, Button } from "@/components/shared";
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";

interface OverviewData {
  students: number;
  teachers: number;
  classrooms: number;
  activeTopics: number;
}

interface HardestTopic {
  title: string;
  avgConfidence: number;
  attempts: number;
}

interface ConfidenceDist {
  label: string;
  count: number;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<OverviewData>({ students: 0, teachers: 0, classrooms: 0, activeTopics: 0 });
  const [avgPerformance, setAvgPerformance] = useState(0);
  const [hardestTopics, setHardestTopics] = useState<HardestTopic[]>([]);
  const [distribution, setDistribution] = useState<ConfidenceDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        setOverview(data.overview || { students: 0, teachers: 0, classrooms: 0, activeTopics: 0 });
        setAvgPerformance(Math.round(data.averagePerformance || 0));
        setHardestTopics(data.hardestTopics || []);
        setDistribution(data.confidenceDistribution || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { icon: Users, value: overview.students, label: "Total Students" },
    { icon: GraduationCap, value: overview.teachers, label: "Total Teachers" },
    { icon: BookOpen, value: overview.classrooms, label: "Classrooms" },
    { icon: TrendingUp, value: overview.activeTopics, label: "Active Topics" },
  ];

  const difficultyColor = (score: number) => {
    if (score < 40) return "var(--color-danger)";
    if (score < 70) return "var(--color-warning)";
    return "var(--color-success)";
  };

  const difficultyLabel = (score: number) => {
    if (score < 40) return "Hard";
    if (score < 70) return "Medium";
    return "Easy";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>School Overview</h1>
        <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
          Institution-wide statistics and management
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} value={loading ? "..." : s.value} label={s.label} />
        ))}
      </div>

      {/* Row 2 — Hardest Topics + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Hardest Topics */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Subject Difficulty</h3>
          {hardestTopics.length > 0 ? (
            <div className="space-y-3">
              {hardestTopics.slice(0, 6).map((t) => (
                <div key={t.title} className="flex items-center justify-between">
                  <span className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.title}</span>
                  <span className="text-xs font-bold" style={{ color: difficultyColor(t.avgConfidence) }}>
                    {difficultyLabel(t.avgConfidence)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              {loading ? "Loading..." : "No topic data yet. Upload content as a teacher to get started."}
            </p>
          )}
        </div>

        {/* Average Performance */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Average Performance</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}>
                {loading ? "..." : avgPerformance > 0 ? `${avgPerformance}%` : "N/A"}
              </div>
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                {avgPerformance > 0 ? "Across all subjects" : "No quiz data yet"}
              </p>
              {distribution.length > 0 && (
                <div className="mt-4 flex gap-4 justify-center">
                  {distribution.map((d) => (
                    <div key={d.label} className="text-center">
                      <p className="text-lg font-bold" style={{ color: d.label === "proficient" ? "var(--color-success)" : d.label === "developing" ? "var(--color-warning)" : "var(--color-danger)" }}>{d.count}</p>
                      <p className="text-xs capitalize" style={{ color: "var(--color-ink-subtle)" }}>{d.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/dashboard/admin/teachers" className="rounded-2xl border p-6 flex items-center gap-4 transition-colors hover:bg-[var(--color-card-hover)]" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <GraduationCap size={24} style={{ color: "var(--color-forest)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>Manage Teachers</p>
            <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>Approve, add, or remove teachers</p>
          </div>
        </a>
        <a href="/dashboard/admin/students" className="rounded-2xl border p-6 flex items-center gap-4 transition-colors hover:bg-[var(--color-card-hover)]" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <Users size={24} style={{ color: "var(--color-forest)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>Manage Students</p>
            <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>View and manage enrolled students</p>
          </div>
        </a>
        <a href="/dashboard/admin/classrooms" className="rounded-2xl border p-6 flex items-center gap-4 transition-colors hover:bg-[var(--color-card-hover)]" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BookOpen size={24} style={{ color: "var(--color-forest)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>View Classrooms</p>
            <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>See all classroom assignments</p>
          </div>
        </a>
      </div>
    </div>
  );
}
