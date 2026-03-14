import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function getConfidenceLabel(score: number): "Weak" | "Developing" | "Proficient" {
  if (score < 0.4) return "Weak";
  if (score < 0.7) return "Developing";
  return "Proficient";
}

export function getConfidenceColor(label: string): string {
  switch (label) {
    case "Weak":
      return "var(--color-danger)";
    case "Developing":
      return "var(--color-warning)";
    case "Proficient":
      return "var(--color-success)";
    default:
      return "var(--color-info)";
  }
}
