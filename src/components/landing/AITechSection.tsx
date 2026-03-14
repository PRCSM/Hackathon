"use client";

import React from "react";

const aiServices = [
  { name: "Amazon Bedrock", desc: "Nova Premier for content generation", color: "var(--color-forest)" },
  { name: "Amazon Rekognition", desc: "Text extraction from images", color: "var(--accent-science)" },
  { name: "Amazon Comprehend", desc: "Key phrase & entity analysis", color: "var(--accent-english)" },
  { name: "Amazon Translate", desc: "Multi-language support", color: "var(--accent-geo)" },
  { name: "Amazon SageMaker", desc: "Confidence scoring ML model", color: "var(--accent-math)" },
  { name: "AWS Lambda", desc: "Serverless processing pipeline", color: "var(--accent-history)" },
];

export function AITechSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--color-bg)" }}>
      <div className="container">
        <p className="text-label mb-4 text-center">TECHNOLOGY</p>
        <h2
          className="text-h2 text-center mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Powered by AWS AI
        </h2>
        <p
          className="text-body text-center mb-16 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "500px" }}
        >
          Six AWS services working together to transform raw educational content into
          structured, interactive learning resources.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {aiServices.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-bento)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full mb-4"
                style={{ backgroundColor: s.color }}
              />
              <h4
                className="text-h5 mb-1"
                style={{ color: "var(--color-ink)" }}
              >
                {s.name}
              </h4>
              <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
