"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="admin" userName="Admin">
      {children}
    </DashboardLayout>
  );
}
