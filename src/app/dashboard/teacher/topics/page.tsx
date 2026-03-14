"use client";

import { useEffect, useState } from "react";
import { StatusBadge, Button } from "@/components/shared";
import { ArrowLeft, UploadCloud, FileText } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function TeacherTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.ok ? r.json() : { topics: [] })
      .then((data) => { setTopics(data.topics || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statusMap: Record<string, "approved" | "pending" | "processing"> = {
    approved: "approved", pending: "pending", processing: "processing", failed: "pending",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
            <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
          </a>
          <div>
            <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Topics</h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Manage uploaded educational content</p>
          </div>
        </div>
        <Button variant="primary" size="sm"><UploadCloud size={16} /> Upload Material</Button>
      </div>

      {loading ? (
        <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
      ) : topics.length > 0 ? (
        <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
          <div className="space-y-2">
            {topics.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-card-hover)] transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={18} style={{ color: "var(--color-forest)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>{t.title}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <StatusBadge status={statusMap[t.status] || "pending"} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <FileText size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
          <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No topics uploaded yet</p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--color-ink-subtle)" }}>Upload a PDF or document to generate AI-powered quizzes and flashcards</p>
          <Button variant="primary" size="sm"><UploadCloud size={16} /> Upload Material</Button>
        </div>
      )}
    </div>
  );
}
