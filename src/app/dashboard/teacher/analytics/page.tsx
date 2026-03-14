"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, BarChart2, TrendingUp, TrendingDown, Users, AlertTriangle } from "lucide-react";
import { ProgressBar } from "@/components/shared";

interface TopicStat {
  id: string;
  title: string;
  status: string;
  difficulty: string | null;
  avgScore: number | null;
  attemptCount: number;
}

interface StudentPerf {
  student_id: string;
  student_name: string | null;
  avg_confidence: string;
  topic_count: string;
}

interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade: string;
  section: string;
}

export default function TeacherAnalyticsPage() {
  const { data: session } = useSession();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [analytics, setAnalytics] = useState<{ studentCount: number; topics: TopicStat[]; studentPerformance: StudentPerf[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const teacherId = (session?.user as { id?: string })?.id;
    if (!teacherId) return;
    fetch(`/api/classrooms?teacherId=${teacherId}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setClassrooms(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
        }
      });
  }, [session]);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    fetch(`/api/classrooms/${selectedId}/analytics`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setAnalytics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedId]);

  const approvedTopics = analytics?.topics.filter((t) => t.status === "approved") || [];
  const avgClassScore = approvedTopics.length > 0
    ? Math.round(approvedTopics.filter(t => t.avgScore !== null).reduce((s, t) => s + (t.avgScore || 0), 0) / (approvedTopics.filter(t => t.avgScore !== null).length || 1))
    : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Analytics</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Student performance across your classrooms</p>
        </div>
      </div>

      {/* Classroom selector */}
      {classrooms.length > 1 && (
        <div className="mb-5">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-4 py-2 rounded-xl border text-sm"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)", color: "var(--color-ink)" }}
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading analytics...</p>
      ) : !analytics ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BarChart2 size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No classrooms yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Create a classroom to see analytics</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Overview stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Students", value: analytics.studentCount, icon: Users },
              { label: "Topics", value: approvedTopics.length, icon: BarChart2 },
              { label: "Avg Score", value: avgClassScore !== null ? `${avgClassScore}%` : "—", icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
                <Icon size={18} className="mb-2" style={{ color: "var(--color-forest)" }} />
                <p className="text-2xl font-bold mb-1" style={{ color: "var(--color-ink)", fontFamily: "var(--font-display)" }}>{value}</p>
                <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Topic performance */}
          {approvedTopics.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-ink)" }}>Topic Performance</h3>
              <div className="space-y-3">
                {approvedTopics.map((t) => {
                  const score = t.avgScore;
                  const barColor = score === null ? "var(--color-ink-subtle)" : score >= 75 ? "var(--color-success)" : score >= 45 ? "var(--color-warning)" : "var(--color-danger)";
                  return (
                    <div key={t.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                          <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>{score !== null ? `${score}%` : "No attempts"}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-border)" }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: score !== null ? `${score}%` : "0%", backgroundColor: barColor }} />
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{t.attemptCount} attempts</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student rankings */}
          {analytics.studentPerformance.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-ink)" }}>Student Performance</h3>
              <div className="space-y-2">
                {analytics.studentPerformance.map((s, i) => {
                  const score = Math.round(Number(s.avg_confidence));
                  const isWeak = score < 45;
                  return (
                    <div key={s.student_id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: isWeak ? "rgba(224,82,82,0.04)" : "transparent" }}>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-5" style={{ color: "var(--color-ink-subtle)" }}>#{i + 1}</span>
                        {isWeak && <AlertTriangle size={14} style={{ color: "var(--color-danger)" }} />}
                        <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{s.student_name || "Unknown"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{s.topic_count} topics</span>
                        <span className={`text-sm font-bold`} style={{ color: score >= 75 ? "var(--color-success)" : score >= 45 ? "var(--color-warning)" : "var(--color-danger)" }}>
                          {score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
