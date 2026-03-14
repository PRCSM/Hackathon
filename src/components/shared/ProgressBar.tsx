"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorVar?: string;
  animate?: boolean;
  height?: number;
}

export function ProgressBar({
  value,
  className,
  colorVar,
  animate = true,
  height = 8,
}: ProgressBarProps) {
  const [width, setWidth] = useState(animate ? 0 : value);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate) {
      setWidth(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Delay 100ms after mount, then animate over 700ms
          setTimeout(() => setWidth(value), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, animate]);

  const barColor =
    colorVar ||
    (value >= 70
      ? "var(--color-success)"
      : value >= 40
        ? "var(--color-warning)"
        : "var(--color-danger)");

  return (
    <div
      ref={ref}
      className={cn("w-full rounded-full", className)}
      style={{
        height: `${height}px`,
        backgroundColor: "var(--color-border)",
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(width, 100)}%`,
          background: `linear-gradient(90deg, var(--color-sage), ${barColor})`,
          transition: animate
            ? "width 700ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      />
    </div>
  );
}
