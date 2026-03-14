"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared";
import { ArrowLeft, Plus, BookOpen, Users } from "lucide-react";

interface Classroom {
  id: number;
  name: string;
  subject: string;
  grade_level: string;
  student_count?: number;
  created_at: string;
}

export default function TeacherClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/classrooms")
      .then((r) => r.ok ? r.json() : { classrooms: [] })
      .then((data) => { setClassrooms(data.classrooms || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
            <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
          </a>
          <div>
            <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>My Classrooms</h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Manage your classrooms and students</p>
          </div>
        </div>
        <Button variant="primary" size="sm"><Plus size={16} /> Create Classroom</Button>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : classrooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((c) => (
            <div key={c.id} className="rounded-2xl border p-6 hover:bg-[var(--color-card-hover)] transition-colors" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} style={{ color: "var(--color-forest)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{c.name}</h3>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--color-ink-muted)" }}>{c.subject} • {c.grade_level}</p>
              <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-ink-subtle)" }}>
                <Users size={12} /> {c.student_count || 0} students
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No classrooms yet</p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--color-ink-subtle)" }}>Create your first classroom to start uploading content</p>
          <Button variant="primary" size="sm"><Plus size={16} /> Create Classroom</Button>
        </div>
      )}
    </div>
  );
}
