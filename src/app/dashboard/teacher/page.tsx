"use client";

import { useEffect, useState } from "react";
import { StatCard, ProgressBar, StatusBadge, Button } from "@/components/shared";
import { BookOpen, Users, FileText, UploadCloud, AlertTriangle } from "lucide-react";

interface TopicData {
  id: number;
  title: string;
  subject?: string;
  status: string;
  created_at: string;
}

export default function TeacherDashboard() {
  const [classroomCount, setClassroomCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/classrooms").then((r) => r.ok ? r.json() : { classrooms: [] }),
      fetch("/api/topics").then((r) => r.ok ? r.json() : { topics: [] }),
    ]).then(([classData, topicData]) => {
      const classrooms = classData.classrooms || [];
      setClassroomCount(classrooms.length);
      // Sum students across classrooms
      const totalStudents = classrooms.reduce((sum: number, c: { student_count?: number }) => sum + (c.student_count || 0), 0);
      setStudentCount(totalStudents);
      setTopics(topicData.topics || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { icon: BookOpen, value: loading ? "..." : classroomCount, label: "Classrooms" },
    { icon: Users, value: loading ? "..." : studentCount, label: "Total Students" },
    { icon: FileText, value: loading ? "..." : topics.length, label: "Active Topics" },
    { icon: AlertTriangle, value: loading ? "..." : topics.filter((t) => t.status === "failed").length, label: "Failed Topics" },
  ];

  const statusMap: Record<string, "approved" | "pending" | "processing"> = {
    approved: "approved",
    pending: "pending",
    processing: "processing",
    failed: "pending",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Teacher Dashboard</h1>
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
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Topics — 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h5" style={{ color: "var(--color-ink)" }}>Recent Topics</h3>
            <a href="/dashboard/teacher/topics" className="text-sm font-medium" style={{ color: "var(--color-forest)" }}>
              View All →
            </a>
          </div>
          {topics.length > 0 ? (
            <div className="space-y-3">
              {topics.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-[var(--color-card-hover)]">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={statusMap[t.status] || "pending"} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              {loading ? "Loading..." : "No topics yet. Upload your first material to get started!"}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <h3 className="text-h5 mb-4" style={{ color: "var(--color-ink)" }}>Quick Actions</h3>
          <div className="space-y-3">
            <a href="/dashboard/teacher" className="block p-3 rounded-xl transition-colors hover:bg-[var(--color-card-hover)]">
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>📚 Create Classroom</p>
              <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Set up a new classroom for your students</p>
            </a>
            <a href="/dashboard/teacher" className="block p-3 rounded-xl transition-colors hover:bg-[var(--color-card-hover)]">
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>📤 Upload Material</p>
              <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Upload a PDF/PPT for AI processing</p>
            </a>
            <a href="/dashboard/teacher" className="block p-3 rounded-xl transition-colors hover:bg-[var(--color-card-hover)]">
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>📊 View Analytics</p>
              <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>Check student performance</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
