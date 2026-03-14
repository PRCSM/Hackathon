"use client";

import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { RoleSetter } from "@/components/shared/RoleSetter";
import { Suspense } from "react";
import React from "react";

interface DashboardLayoutProps {
  role: string;
  userName?: string;
  children: React.ReactNode;
}

export function DashboardLayout({ role, userName, children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <RoleSetter />
      </Suspense>
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar userName={userName} role={role} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
