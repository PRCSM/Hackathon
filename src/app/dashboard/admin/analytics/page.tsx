"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BarChart2 } from "lucide-react";

interface HardestTopic {
  title: string;
  avgConfidence: number;
  attempts: number;
}

interface ConfidenceDist {
  label: string;
  count: number;
}

export default function AdminAnalyticsPage() {
  const [avgPerformance, setAvgPerformance] = useState(0);
  const [hardestTopics, setHardestTopics] = useState<HardestTopic[]>([]);
  const [distribution, setDistribution] = useState<ConfidenceDist[]>([]);
  const [overview, setOverview] = useState({ students: 0, teachers: 0, classrooms: 0, activeTopics: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        setOverview(data.overview || {});
        setAvgPerformance(Math.round(data.averagePerformance || 0));
        setHardestTopics(data.hardestTopics || []);
        setDistribution(data.confidenceDistribution || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const difficultyColor = (score: number) => {
    if (score < 40) return "var(--color-danger)";
    if (score < 70) return "var(--color-warning)";
    return "var(--color-success)";
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/admin" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Institutional Analytics</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>School-wide performance and insights</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading analytics...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Students", value: overview.students },
              { label: "Teachers", value: overview.teachers },
              { label: "Classrooms", value: overview.classrooms },
              { label: "Active Topics", value: overview.activeTopics },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border p-4 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Performance + Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Average Performance</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}>
                    {avgPerformance > 0 ? `${avgPerformance}%` : "N/A"}
                  </div>
                  <p className="text-body-sm mt-2" style={{ color: "var(--color-ink-muted)" }}>
                    {avgPerformance > 0 ? "Across all subjects" : "No quiz data yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Confidence Distribution</h3>
              {distribution.length > 0 ? (
                <div className="space-y-3">
                  {distribution.map((d) => (
                    <div key={d.label} className="flex items-center justify-between">
                      <span className="text-sm capitalize font-medium" style={{ color: "var(--color-ink)" }}>{d.label}</span>
                      <span className="text-sm font-bold" style={{ color: d.label === "proficient" ? "var(--color-success)" : d.label === "developing" ? "var(--color-warning)" : "var(--color-danger)" }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No confidence data available yet.</p>
              )}
            </div>
          </div>

          {/* Hardest Topics */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
            <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Hardest Topics</h3>
            {hardestTopics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--color-border)", color: "var(--color-ink-subtle)" }}>
                      <th className="pb-3 pr-4">Topic</th>
                      <th className="pb-3 pr-4">Avg Confidence</th>
                      <th className="pb-3">Attempts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hardestTopics.map((t) => (
                      <tr key={t.title} className="border-b last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
                        <td className="py-3 pr-4 text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.title}</td>
                        <td className="py-3 pr-4 text-sm font-bold" style={{ color: difficultyColor(t.avgConfidence) }}>{Math.round(t.avgConfidence)}%</td>
                        <td className="py-3 text-sm" style={{ color: "var(--color-ink-muted)" }}>{t.attempts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No topic data available yet. Upload content as a teacher to generate analytics.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
