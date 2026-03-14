"use client";

import { ArrowLeft, BookOpen } from "lucide-react";

export default function ParentSubjectsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <a href="/dashboard/parent" className="p-2 rounded-lg hover:bg-[var(--color-card-hover)] transition-colors">
          <ArrowLeft size={20} style={{ color: "var(--color-ink)" }} />
        </a>
        <div>
          <h1 className="text-h3" style={{ color: "var(--color-ink)" }}>Subjects</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>Your child&apos;s subject performance</p>
        </div>
      </div>
      <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-bento)" }}>
        <BookOpen size={48} className="mx-auto mb-4" style={{ color: "var(--color-ink-subtle)" }} />
        <p className="text-body-sm font-medium" style={{ color: "var(--color-ink)" }}>No subject data yet</p>
        <p className="text-xs mt-1" style={{ color: "var(--color-ink-subtle)" }}>Link your child&apos;s account to see their subject performance</p>
      </div>
    </div>
  );
}
