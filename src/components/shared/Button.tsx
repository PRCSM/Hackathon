"use client";

import { cn } from "@/lib/utils";
import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-lg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-forest)] disabled:opacity-50 disabled:pointer-events-none";

  const variantStyles = {
    primary:
      "bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-light)] active:scale-[0.97]",
    ghost:
      "bg-transparent border-[1.5px] border-[var(--color-forest)] text-[var(--color-forest)] hover:bg-[rgba(45,74,30,0.06)] active:scale-[0.97]",
    danger:
      "bg-[var(--color-danger)] text-white hover:opacity-90 active:scale-[0.97]",
    icon:
      "bg-transparent hover:bg-[var(--color-card-hover)] rounded-lg w-10 h-10 p-0 grid place-items-center",
  };

  const sizeStyles = {
    sm: "text-sm px-4 py-2",
    md: "text-[15px] px-6 py-3",
    lg: "text-base px-8 py-3.5",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        variant !== "icon" && sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      style={{
        fontFamily: "var(--font-sans)",
        transitionTimingFunction: "var(--ease-in-out)",
        transitionDuration: "var(--duration-fast)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
