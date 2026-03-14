"use client";

import { cn } from "@/lib/utils";
import React from "react";

type BentoCellVariant = "slim" | "wide" | "tall" | "hero" | "accent" | "cta" | "muted";

interface BentoCellProps {
  children: React.ReactNode;
  variant?: BentoCellVariant;
  className?: string;
  onClick?: () => void;
}

export function BentoCell({
  children,
  variant = "slim",
  className,
  onClick,
}: BentoCellProps) {
  const variantClasses = {
    slim: "",
    wide: "sm:col-span-2",
    tall: "sm:row-span-2",
    hero: "sm:col-span-2 sm:row-span-2",
    accent: "!bg-[var(--color-forest)] !border-transparent !text-white",
    cta: "!bg-[var(--color-forest)] !border-transparent !text-white cursor-pointer flex flex-col items-start justify-between",
    muted: "!bg-[var(--color-cream)] !border-[var(--color-border)]",
  };

  const isInteractive = variant === "cta" || !!onClick;

  return (
    <div
      className={cn(
        // Base bento cell styles
        "rounded-2xl border p-6 overflow-hidden",
        "transition-all duration-200",
        // Default colors
        "bg-[var(--color-card)] border-[var(--color-border)]",
        "shadow-[var(--shadow-bento)]",
        // Hover
        "hover:-translate-y-[3px]",
        "hover:shadow-[var(--shadow-card-hover)]",
        "hover:border-[var(--color-border-strong)]",
        // Variant
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
