"use client";

import { Button } from "@/components/shared";
import React, { useState } from "react";

interface OnboardingShellProps {
  title: string;
  subtitle: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function OnboardingShell({
  title,
  subtitle,
  step,
  totalSteps,
  children,
  onSubmit,
  isSubmitting,
}: OnboardingShellProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--color-bg)" }}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl border p-8"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full flex-1 transition-all duration-300"
              style={{
                backgroundColor:
                  i < step
                    ? "var(--color-forest)"
                    : i === step
                      ? "var(--color-sage)"
                      : "var(--color-border)",
              }}
            />
          ))}
        </div>

        <h1
          className="text-h3 mb-1"
          style={{ color: "var(--color-ink)" }}
        >
          {title}
        </h1>
        <p
          className="text-body-sm mb-8"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {subtitle}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-5">{children}</div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* Floating-label input component */
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FloatingInput({ label, id, ...props }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value && String(props.value).length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        className="peer w-full px-4 pt-6 pb-2 rounded-xl border text-[15px] outline-none transition-all duration-200"
        style={{
          borderColor: focused ? "var(--color-forest)" : "var(--color-border)",
          backgroundColor: "transparent",
          fontFamily: "var(--font-sans)",
          color: "var(--color-ink)",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 transition-all duration-200 pointer-events-none"
        style={{
          top: focused || hasValue ? "8px" : "50%",
          transform: focused || hasValue ? "translateY(0)" : "translateY(-50%)",
          fontSize: focused || hasValue ? "11px" : "14px",
          color: focused ? "var(--color-forest)" : "var(--color-ink-subtle)",
          fontWeight: focused || hasValue ? 600 : 400,
          fontFamily: "var(--font-sans)",
        }}
      >
        {label}
      </label>
    </div>
  );
}

/* Select component */
interface FloatingSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function FloatingSelect({ label, id, options, ...props }: FloatingSelectProps) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-xs font-semibold mb-1.5"
        style={{ color: "var(--color-ink-subtle)", fontFamily: "var(--font-sans)" }}
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full px-4 py-3 rounded-xl border text-[15px] outline-none transition-all duration-200 appearance-none"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "transparent",
          fontFamily: "var(--font-sans)",
          color: "var(--color-ink)",
        }}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
