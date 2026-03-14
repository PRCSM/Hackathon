"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  User,
  GraduationCap,
  BarChart2,
  Settings2,
  BookOpen,
  ClipboardList,
  Activity,
  MessageSquare,
  FileText,
  PenTool,
  RefreshCcw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type NavItem = { label: string; href: string; icon: LucideIcon };

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
    { label: "Students", href: "/dashboard/admin/students", icon: User },
    { label: "Classrooms", href: "/dashboard/admin/classrooms", icon: GraduationCap },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart2 },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings2 },
  ],
  teacher: [
    { label: "Overview", href: "/dashboard/teacher", icon: LayoutDashboard },
    { label: "Classrooms", href: "/dashboard/teacher/classrooms", icon: GraduationCap },
    { label: "Topics", href: "/dashboard/teacher/topics", icon: FileText },
    { label: "Analytics", href: "/dashboard/teacher/analytics", icon: BarChart2 },
    { label: "Interventions", href: "/dashboard/teacher/interventions", icon: PenTool },
  ],
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "Topics", href: "/dashboard/student/topics", icon: BookOpen },
    { label: "Quiz", href: "/dashboard/student/quiz", icon: ClipboardList },
    { label: "Revision", href: "/dashboard/student/revision", icon: RefreshCcw },
    { label: "Progress", href: "/dashboard/student/progress", icon: TrendingUp },
  ],
  parent: [
    { label: "Overview", href: "/dashboard/parent", icon: LayoutDashboard },
    { label: "Subjects", href: "/dashboard/parent/subjects", icon: BookOpen },
    { label: "Assignments", href: "/dashboard/parent/assignments", icon: ClipboardList },
    { label: "Activity", href: "/dashboard/parent/activity", icon: Activity },
    { label: "Feedback", href: "/dashboard/parent/feedback", icon: MessageSquare },
  ],
};

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = navByRole[role] || [];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
      style={{
        backgroundColor: "var(--color-forest)",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center px-5 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span
          className="text-white font-bold text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {collapsed ? "P" : "PadhAI"}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative",
                isActive
                  ? "bg-white/12 text-white font-semibold"
                  : "text-white/60 hover:text-white/90 hover:bg-white/6"
              )}
            >
              {isActive && (
                <div
                  className="absolute left-0 w-1 h-6 rounded-r-full"
                  style={{ backgroundColor: "var(--color-sage-light)" }}
                />
              )}
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Version */}
      {!collapsed && (
        <div className="px-5 py-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          v0.1.0
        </div>
      )}
    </aside>
  );
}
