"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const faqs = [
  {
    q: "What file formats can teachers upload?",
    a: "PDF, PPT/PPTX, and images (JPG, PNG). The AI pipeline extracts text from all formats using Amazon Rekognition and PyMuPDF.",
  },
  {
    q: "How does the AI content generation work?",
    a: "When a teacher uploads a file, it goes to S3, which triggers a Lambda function. The pipeline uses Rekognition for text extraction, Comprehend for key phrase analysis, Bedrock for content generation, Translate for multi-language support, and SageMaker for difficulty scoring.",
  },
  {
    q: "Can teachers control the AI-generated content?",
    a: "Yes! All AI content requires teacher approval before students can see it. Teachers can approve, edit, regenerate, or delete content. They can also adjust difficulty levels.",
  },
  {
    q: "What languages are supported?",
    a: "Content can be auto-translated into 10+ regional Indian languages using Amazon Translate, including Hindi, Tamil, Telugu, Kannada, and more.",
  },
  {
    q: "How are students' weak topics identified?",
    a: "The system tracks quiz scores and assigns a confidence label (Weak / Developing / Proficient) per topic per student using SageMaker's confidence scoring model.",
  },
  {
    q: "What roles does PadhAI support?",
    a: "Four roles: Admin (school management, teacher approvals, analytics), Teacher (content management, analytics, interventions), Student (learning, quizzes, revision), Parent (read-only child progress, alerts, assignment tracking).",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-20 md:py-28"
      style={{ background: "var(--color-card)" }}
    >
      <div className="container-narrow">
        <p className="text-label mb-4 text-center">FAQ</p>
        <h2
          className="text-h2 text-center mb-16"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Common questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border overflow-hidden transition-all duration-200"
                style={{
                  borderColor: "var(--color-border)",
                  boxShadow: isOpen ? "var(--shadow-sm)" : "none",
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[15px] font-semibold pr-4"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: "var(--color-ink-subtle)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "300px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p
                    className="px-5 pb-5 text-body-sm"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
