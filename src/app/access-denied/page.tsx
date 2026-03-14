"use client";

import { Button } from "@/components/shared";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const messages: Record<string, string> = {
    not_approved:
      "Your email is not on the approved list. Please contact your school administrator.",
    role_mismatch:
      "You already have an account with a different role. Please use the correct login page.",
    default:
      "You do not have permission to access this resource.",
  };

  const message = messages[reason || "default"] || messages.default;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(224,82,82,0.08)" }}
        >
          <ShieldX size={32} style={{ color: "var(--color-danger)" }} />
        </div>
        <h1
          className="text-h2 mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          Access Denied
        </h1>
        <p
          className="text-body mb-8"
          style={{ color: "var(--color-ink-muted)" }}
        >
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
          <Link href="/auth/student">
            <Button variant="ghost">Try Again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--color-bg)" }} />}>
      <AccessDeniedContent />
    </Suspense>
  );
}
