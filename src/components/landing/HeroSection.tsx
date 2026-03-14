"use client";

import { Button } from "@/components/shared";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

export function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative pt-[72px]"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="text-center max-w-2xl px-6">
        {/* Overline */}
        <p className="text-label mb-6 tracking-widest">DAKSH &apos;26 HACKATHON</p>

        {/* Headline */}
        <h1
          className="text-hero mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Built for <em className="italic">Every</em> Classroom
        </h1>

        {/* Subtext */}
        <p
          className="text-body-lg mb-8 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "500px" }}
        >
          Transform static educational materials into interactive, AI-powered
          learning experiences for students and teachers.
        </p>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2"
                style={{
                  borderColor: "var(--color-card)",
                  backgroundColor: `hsl(${120 + i * 30}, 40%, ${60 + i * 5}%)`,
                }}
              />
            ))}
          </div>
          <span className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Trusted by educators across India
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/teacher">
            <Button variant="ghost" size="lg">Login as Teacher</Button>
          </Link>
          <Link href="/auth/student">
            <Button variant="primary" size="lg">Login as Student</Button>
          </Link>
        </div>

        {/* Secondary role links */}
        <div
          className="mt-4 flex gap-6 justify-center text-sm font-medium"
          style={{ color: "var(--color-ink-subtle)" }}
        >
          <Link href="/auth/admin" className="hover:text-[var(--color-ink-muted)] transition-colors">
            Admin Login
          </Link>
          <Link href="/auth/parent" className="hover:text-[var(--color-ink-muted)] transition-colors">
            Parent Login
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={24} style={{ color: "var(--color-ink-subtle)" }} />
      </div>
    </section>
  );
}
