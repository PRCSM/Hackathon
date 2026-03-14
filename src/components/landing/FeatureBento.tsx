"use client";

import {
  Zap,
  Shield,
  Cpu,
  Globe,
  BookOpen,
  BarChart,
  Users,
  FileQuestion,
} from "lucide-react";
import React from "react";

const features = [
  {
    icon: Cpu,
    title: "AI Content Generation",
    description: "Upload PDF, PPT, or images — get AI-generated quizzes, explanations, flashcards instantly.",
    span: "col-span-1 sm:col-span-2",
    accent: "var(--color-forest)",
    bgAccent: "rgba(45,74,30,0.06)",
  },
  {
    icon: BarChart,
    title: "Real-time Analytics",
    description: "Topic difficulty heatmaps, student performance tracking, and class-wide insights.",
    span: "col-span-1",
    accent: "var(--accent-science)",
    bgAccent: "rgba(74,144,217,0.06)",
  },
  {
    icon: FileQuestion,
    title: "Adaptive Quizzes",
    description: "AI explanations for wrong answers. Students learn from every mistake.",
    span: "col-span-1",
    accent: "var(--accent-math)",
    bgAccent: "rgba(245,166,35,0.06)",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description: "Content auto-translated to 10+ regional languages.",
    span: "col-span-1",
    accent: "var(--accent-english)",
    bgAccent: "rgba(155,89,182,0.06)",
  },
  {
    icon: Zap,
    title: "Flashcards & Revision",
    description: "Interactive 3D flip cards and smart revision modes targeting weak areas.",
    span: "col-span-1",
    accent: "var(--color-success)",
    bgAccent: "rgba(76,175,125,0.06)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "KMS encryption, role-based access, data isolation between schools.",
    span: "col-span-1",
    accent: "var(--color-forest)",
    bgAccent: "rgba(45,74,30,0.06)",
  },
  {
    icon: Users,
    title: "4 Role Dashboards",
    description: "Admin, Teacher, Student, and Parent — each with tailored views.",
    span: "col-span-1",
    accent: "var(--accent-geo)",
    bgAccent: "rgba(46,204,113,0.06)",
  },
  {
    icon: BookOpen,
    title: "Teacher Controls",
    description: "Approve, edit, or regenerate AI content before students see it.",
    span: "col-span-1 sm:col-span-2",
    accent: "var(--accent-history)",
    bgAccent: "rgba(230,126,34,0.06)",
  },
];

export function FeatureBento() {
  return (
    <section
      id="features"
      className="py-20 md:py-28"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="container">
        <p className="text-label mb-4 text-center">FEATURES</p>
        <h2
          className="text-h2 text-center mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Everything a classroom needs
        </h2>
        <p
          className="text-body text-center mb-16 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "540px" }}
        >
          From AI content generation to adaptive learning, PadhAI covers every
          aspect of the modern classroom.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${f.span}`}
              style={{
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-bento)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: f.bgAccent }}
              >
                <f.icon size={20} style={{ color: f.accent }} />
              </div>
              <h3
                className="text-h5 mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-body-sm"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
