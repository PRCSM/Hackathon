"use client";

import { Upload, Cpu, BookCheck } from "lucide-react";
import React from "react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Material",
    description: "Teacher uploads PDF, PPT, or images to a classroom topic.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Processes",
    description: "AWS AI pipeline extracts text, generates quizzes, explanations, flashcards, and scores difficulty.",
  },
  {
    icon: BookCheck,
    step: "03",
    title: "Students Learn",
    description: "After teacher approval, students access interactive content, take quizzes, and get AI-powered revision.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--color-card)" }}
    >
      <div className="container">
        <p className="text-label mb-4 text-center">HOW IT WORKS</p>
        <h2
          className="text-h2 text-center mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Three simple steps
        </h2>
        <p
          className="text-body text-center mb-16 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "480px" }}
        >
          From upload to learning in minutes — powered by AWS AI services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection line (desktop only) */}
          <div
            className="hidden md:block absolute top-[72px] left-[16.6%] right-[16.6%] h-[2px]"
            style={{ backgroundColor: "var(--color-border)" }}
          />

          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              {/* Icon circle */}
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                style={{
                  backgroundColor: "var(--color-forest)",
                  boxShadow: "0 4px 24px rgba(45,74,30,0.25)",
                }}
              >
                <item.icon size={28} className="text-white" />
              </div>
              {/* Step number */}
              <p className="text-label mb-2">{item.step}</p>
              <h3
                className="text-h4 mb-3"
                style={{ color: "var(--color-ink)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-body-sm mx-auto"
                style={{ color: "var(--color-ink-muted)", maxWidth: "280px" }}
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
