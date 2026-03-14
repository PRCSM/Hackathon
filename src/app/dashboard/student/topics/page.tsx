"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function StudentTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.ok ? r.json() : { topics: [] })
      .then((data) => { setTopics((data.topics || []).filter((t: Topic) => t.status === "approved")); setLoading(false); })
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
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Browse and study available topics</p>
        </div>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : topics.length > 0 ? (
        <div className="space-y-2">
          {topics.map((t) => (
            <div key={t.id} className="rounded-2xl border p-5 flex items-center justify-between hover:bg-[var(--color-card-hover)] transition-colors cursor-pointer" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-3">
                <BookOpen size={20} style={{ color: "var(--color-forest)" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: "var(--color-ink-subtle)" }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No topics available yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Your teacher will upload content soon!</p>
        </div>
      )}
    </div>
  );
}
