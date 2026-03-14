"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, ChevronRight } from "lucide-react";

interface Quiz {
  id: number;
  title: string;
  topic_title?: string;
  created_at: string;
}

export default function StudentQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quizzes")
      .then((r) => r.ok ? r.json() : { quizzes: [] })
      .then((data) => { setQuizzes(data.quizzes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/student" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Quizzes</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Test your knowledge with AI-generated quizzes</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : quizzes.length > 0 ? (
        <div className="space-y-2">
          {quizzes.map((q) => (
            <div key={q.id} className="rounded-2xl border p-5 flex items-center justify-between hover:bg-[var(--color-card-hover)] transition-colors cursor-pointer" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-3">
                <ClipboardList size={20} style={{ color: "var(--color-forest)" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{q.topic_title || q.title}</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(q.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: "var(--color-ink-subtle)" }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <ClipboardList size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No quizzes available yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Quizzes will appear once your teacher uploads and approves content</p>
        </div>
      )}
    </div>
  );
}
