"use client";

import { cn } from "@/lib/utils";
import React from "react";

type BadgeStatus =
  | "approved"
  | "pending"
  | "processing"
  | "failed"
  | "weak"
  | "developing"
  | "proficient"
  | "active"
  | "submitted";

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

const statusConfig: Record<
  BadgeStatus,
  { label: string; bg: string; color: string }
> = {
  approved: {
    label: "Approved",
    bg: "rgba(76,175,125,0.10)",
    color: "var(--color-success)",
  },
  pending: {
    label: "Pending",
    bg: "rgba(245,166,35,0.10)",
    color: "var(--color-warning)",
  },
  processing: {
    label: "Processing",
    bg: "rgba(74,144,217,0.10)",
    color: "var(--color-info)",
  },
  failed: {
    label: "Failed",
    bg: "rgba(224,82,82,0.10)",
    color: "var(--color-danger)",
  },
  weak: {
    label: "Weak",
    bg: "rgba(224,82,82,0.10)",
    color: "var(--color-danger)",
  },
  developing: {
    label: "Developing",
    bg: "rgba(245,166,35,0.10)",
    color: "var(--color-warning)",
  },
  proficient: {
    label: "Proficient",
    bg: "rgba(76,175,125,0.10)",
    color: "var(--color-success)",
  },
  active: {
    label: "Active",
    bg: "rgba(76,175,125,0.10)",
    color: "var(--color-success)",
  },
  submitted: {
    label: "Submitted",
    bg: "rgba(76,175,125,0.10)",
    color: "var(--color-success)",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-[11px] font-semibold leading-tight",
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        fontFamily: "var(--font-sans)",
      }}
    >
      {config.label}
    </span>
  );
}
