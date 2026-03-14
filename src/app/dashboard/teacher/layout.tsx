"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="teacher" userName="Teacher">
      {children}
    </DashboardLayout>
  );
}
