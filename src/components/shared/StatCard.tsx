"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  className,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateValue(0, value, 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  function animateValue(start: number, end: number, duration: number) {
    const startTime = performance.now();
    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border p-6",
        "bg-[var(--color-card)] border-[var(--color-border)]",
        "shadow-[var(--shadow-bento)]",
        "transition-all duration-200",
        "hover:-translate-y-[3px] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-border-strong)]",
        className
      )}
    >
      <Icon
        size={20}
        className="mb-4"
        style={{ color: "var(--color-sage)" }}
      />
      <div
        className="font-bold mb-1"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          lineHeight: 1.15,
        }}
      >
        {new Intl.NumberFormat("en-IN").format(displayValue)}
      </div>
      <div
        className="text-sm font-medium"
        style={{ color: "var(--color-ink-muted)" }}
      >
        {label}
      </div>
      {trend && (
        <div className="mt-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: trend.positive
                ? "rgba(76,175,125,0.10)"
                : "rgba(224,82,82,0.10)",
              color: trend.positive
                ? "var(--color-success)"
                : "var(--color-danger)",
            }}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
