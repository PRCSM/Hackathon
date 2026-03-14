"use client";

import { Brain, BarChart2, Languages, Sparkles } from "lucide-react";
import React from "react";

const solutions = [
  {
    icon: Brain,
    title: "AI-Powered Content",
    description: "Automatically generate quizzes, explanations, flashcards, and assignments from any uploaded material.",
    color: "var(--color-forest)",
    bg: "rgba(45,74,30,0.08)",
  },
  {
    icon: BarChart2,
    title: "Adaptive Analytics",
    description: "Track student confidence, identify weak topics, and get data-driven insights for every classroom.",
    color: "var(--color-info)",
    bg: "rgba(74,144,217,0.08)",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Translate content into regional languages so every student can learn in their preferred language.",
    color: "var(--accent-english)",
    bg: "rgba(155,89,182,0.08)",
  },
  {
    icon: Sparkles,
    title: "Adaptive Learning",
    description: "Personalized revision modes, weak-topic quizzes, and smart flashcards that adapt to each student.",
    color: "var(--color-success)",
    bg: "rgba(76,175,125,0.08)",
  },
];

export function SolutionSection() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--color-card)" }}
    >
      <div className="container">
        <p className="text-label mb-4 text-center">THE SOLUTION</p>
        <h2
          className="text-h2 text-center mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Learning, reimagined with AI
        </h2>
        <p
          className="text-body text-center mb-16 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "540px" }}
        >
          PadhAI transforms static materials into structured, interactive learning
          resources using AWS AI services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 flex gap-5"
              style={{
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-card)",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: item.bg }}
              >
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <div>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
