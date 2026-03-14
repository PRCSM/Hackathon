"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="student" userName="Student">
      {children}
    </DashboardLayout>
  );
}
