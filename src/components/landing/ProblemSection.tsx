"use client";

import { BookX, Clock, UserX, WifiOff } from "lucide-react";
import React from "react";

const problems = [
  {
    icon: BookX,
    title: "Static Content",
    description: "Textbooks and PDFs sit unread, offering no interaction.",
  },
  {
    icon: Clock,
    title: "No Personalization",
    description: "Every student gets the same content regardless of ability.",
  },
  {
    icon: UserX,
    title: "Limited Teacher Insight",
    description: "Teachers lack real-time data on student understanding.",
  },
  {
    icon: WifiOff,
    title: "Language Barriers",
    description: "Regional language students struggle with English-only content.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        <p className="text-label mb-4 text-center">THE PROBLEM</p>
        <h2
          className="text-h2 text-center mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Classrooms are stuck in the past
        </h2>
        <p
          className="text-body text-center mb-16 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "540px" }}
        >
          Traditional educational materials fail to engage students and provide
          teachers with actionable insights.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-card)",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(224,82,82,0.08)" }}
              >
                <item.icon size={20} style={{ color: "var(--color-danger)" }} />
              </div>
              <h3
                className="text-h5 mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-body-sm"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
