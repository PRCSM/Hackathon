"use client";

import { Shield, Lock, Eye, Server } from "lucide-react";
import React from "react";

const items = [
  {
    icon: Lock,
    title: "KMS Encryption",
    description: "All uploaded files encrypted at rest with AWS KMS.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Admin, Teacher, Student, Parent — each with strictly isolated permissions.",
  },
  {
    icon: Eye,
    title: "No Frontend AI Keys",
    description: "All AI processing happens server-side via Lambda. No API keys exposed to browser.",
  },
  {
    icon: Server,
    title: "Secure Sessions",
    description: "HTTP-only cookies, PostgreSQL session storage, 30-day expiry.",
  },
];

export function SecuritySection() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--color-forest)" }}
    >
      <div className="container">
        <p
          className="text-label mb-4 text-center"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          SECURITY
        </p>
        <h2
          className="text-h2 text-center mb-4 text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Built secure by default
        </h2>
        <p
          className="text-body text-center mb-16 mx-auto"
          style={{ color: "rgba(255,255,255,0.7)", maxWidth: "480px" }}
        >
          Enterprise-grade security at every layer — from client to cloud.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <item.icon
                size={22}
                className="mb-4"
                style={{ color: "var(--color-sage-light)" }}
              />
              <h3 className="text-h5 mb-2 text-white">{item.title}</h3>
              <p className="text-body-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
