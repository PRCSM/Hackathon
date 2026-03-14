"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export function Skeleton({
  className,
  width,
  height,
  borderRadius,
}: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={{
        width: width ?? "100%",
        height: height ?? "20px",
        borderRadius: borderRadius ?? "var(--radius-sm)",
      }}
    />
  );
}

/* Pre-built skeleton patterns */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        "bg-[var(--color-card)] border-[var(--color-border)]",
        className
      )}
    >
      <Skeleton width={20} height={20} borderRadius="4px" className="mb-4" />
      <Skeleton width="60%" height={32} className="mb-2" />
      <Skeleton width="40%" height={14} />
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton height={40} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={48} />
      ))}
    </div>
  );
}
