"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="parent" userName="Parent">
      {children}
    </DashboardLayout>
  );
}
