"use client";

import { Button } from "@/components/shared";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";

type UserRole = "admin" | "teacher" | "student" | "parent";

const roleConfig: Record<UserRole, { title: string; subtitle: string; color: string }> = {
  admin: {
    title: "Admin Login",
    subtitle: "Manage your school, teachers, and students",
    color: "var(--accent-history)",
  },
  teacher: {
    title: "Teacher Login",
    subtitle: "Upload content, manage classrooms, track analytics",
    color: "var(--color-forest)",
  },
  student: {
    title: "Student Login",
    subtitle: "Access quizzes, flashcards, and revision tools",
    color: "var(--accent-science)",
  },
  parent: {
    title: "Parent Login",
    subtitle: "View your child's progress and assignments",
    color: "var(--accent-geo)",
  },
};

interface AuthPageProps {
  role: UserRole;
}

export function AuthPage({ role }: AuthPageProps) {
  const config = roleConfig[role];

  const handleSignIn = () => {
    // Store pending role in localStorage before redirect
    if (typeof window !== "undefined") {
      localStorage.setItem("pendingRole", role);
    }
    signIn("google", {
      callbackUrl: `/dashboard/${role}?role=${role}`,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-[60%] relative items-center justify-center"
        style={{ backgroundColor: "var(--color-forest)" }}
      >
        <div className="text-center px-12">
          <h2
            className="text-h1 text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PadhAI
          </h2>
          <p className="text-body-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
            AI-Powered Classroom Learning
          </p>
          <div
            className="mt-8 flex gap-3 justify-center text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span>🔒 Secure</span>
            <span>•</span>
            <span>🧠 AI-Powered</span>
            <span>•</span>
            <span>🌐 Multilingual</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="w-full lg:w-[40%] flex items-center justify-center p-8"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="w-full max-w-sm">
          {/* Logo (mobile only) */}
          <Link
            href="/"
            className="lg:hidden text-xl font-bold mb-8 inline-block"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}
          >
            PadhAI
          </Link>

          <h1
            className="text-h3 mb-2"
            style={{ color: "var(--color-ink)" }}
          >
            {config.title}
          </h1>
          <p
            className="text-body-sm mb-8"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {config.subtitle}
          </p>

          {/* Role indicator */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-8"
            style={{
              backgroundColor: `${config.color}15`,
              color: config.color,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>

          {/* Google Sign-In */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSignIn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
            </svg>
            Sign in with Google
          </Button>

          {/* Secondary links */}
          <div className="mt-6 text-center">
            <p className="text-body-sm" style={{ color: "var(--color-ink-subtle)" }}>
              Not a {role}?{" "}
              {role !== "student" && (
                <Link
                  href="/auth/student"
                  className="font-medium underline"
                  style={{ color: "var(--color-forest)" }}
                >
                  Student Login
                </Link>
              )}
              {role !== "teacher" && (
                <>
                  {role !== "student" && " · "}
                  <Link
                    href="/auth/teacher"
                    className="font-medium underline"
                    style={{ color: "var(--color-forest)" }}
                  >
                    Teacher Login
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Terms */}
          <p
            className="mt-8 text-center text-body-sm"
            style={{ color: "var(--color-ink-subtle)", fontSize: "11px" }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
