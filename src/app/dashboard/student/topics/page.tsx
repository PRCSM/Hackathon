"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight, ClipboardList } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  status: string;
  classroom_name: string;
  subject: string;
  created_at: string;
}

export default function StudentTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics?status=approved")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setTopics(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/student" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Topics</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Browse approved topics and take quizzes</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : topics.length > 0 ? (
        <div className="space-y-3">
          {topics.map((t) => (
            <div key={t.id} className="rounded-2xl border p-5 hover:bg-[var(--color-card-hover)] transition-colors" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} style={{ color: "var(--color-forest)" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-subtle)" }}>{t.subject} • {t.classroom_name}</p>
                  </div>
                </div>
                <a href={`/dashboard/student/quiz/${t.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ backgroundColor: "rgba(74,122,89,0.1)", color: "var(--color-forest)" }}>
                  <ClipboardList size={12} /> Take Quiz
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No topics available yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Your teacher hasn&apos;t approved any content yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
