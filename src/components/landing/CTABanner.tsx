"use client";

import { Button } from "@/components/shared";
import Link from "next/link";
import React from "react";

export function CTABanner() {
  return (
    <section
      className="py-20 md:py-28 text-center"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="container">
        <h2
          className="text-h1 mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Ready to transform your classroom?
        </h2>
        <p
          className="text-body-lg mb-10 mx-auto"
          style={{ color: "var(--color-ink-muted)", maxWidth: "460px" }}
        >
          Start using PadhAI today — upload your first material and watch AI create
          interactive content in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/teacher">
            <Button variant="primary" size="lg">Get Started as Teacher</Button>
          </Link>
          <Link href="/auth/student">
            <Button variant="ghost" size="lg">Join as Student</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
