"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Users, GraduationCap } from "lucide-react";

interface Classroom {
  id: number;
  name: string;
  subject: string;
  grade_level: string;
  teacher_name: string;
  student_count: number;
  created_at: string;
}

export default function AdminClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/classrooms?all=true")
      .then((r) => r.ok ? r.json() : { classrooms: [] })
      .then((data) => { setClassrooms(data.classrooms || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/admin" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Classroom Overview</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>All classrooms across the institution</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : classrooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((c) => (
            <div key={c.id} className="rounded-2xl border p-6 transition-colors hover:bg-[var(--color-card-hover)]" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} style={{ color: "var(--color-forest)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{c.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-ink-muted)" }}>
                  <GraduationCap size={14} /> {c.teacher_name || "Unassigned"}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-ink-muted)" }}>
                  <Users size={14} /> {c.student_count || 0} students
                </div>
                <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                  {c.subject} • {c.grade_level}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>No classrooms created yet.</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Teachers can create classrooms from their dashboard.</p>
        </div>
      )}
    </div>
  );
}
