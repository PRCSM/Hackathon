"use client";

import { ArrowLeft, RefreshCcw } from "lucide-react";

export default function StudentRevisionPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/student" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Revision Mode</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>AI-powered spaced repetition flashcards</p>
        </div>
      </div>

      <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <RefreshCcw size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
        <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No flashcards to revise yet</p>
        <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Flashcards will be generated when your teacher uploads content and it&apos;s processed by AI</p>
      </div>
    </div>
  );
}
