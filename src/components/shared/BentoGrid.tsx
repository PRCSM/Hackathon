"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface BentoGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function BentoGrid({
  children,
  columns = 4,
  className,
}: BentoGridProps) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        colClass[columns],
        className
      )}
      style={{ gridAutoRows: "minmax(120px, auto)" }}
    >
      {children}
    </div>
  );
}
