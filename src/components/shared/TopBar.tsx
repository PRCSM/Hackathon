"use client";

import { Bell, Search, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";

interface TopBarProps {
  userName?: string;
  role?: string;
}

export function TopBar({ userName = "User", role = "student" }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search size={18} style={{ color: "var(--color-ink-subtle)" }} />
        <input
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{
            color: "var(--color-ink)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          className="p-2.5 rounded-lg transition-colors hover:bg-[var(--color-card-hover)]"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={18} style={{ color: "var(--color-ink-muted)" }} />
          ) : (
            <Moon size={18} style={{ color: "var(--color-ink-muted)" }} />
          )}
        </button>

        {/* Notifications */}
        <button
          className="p-2.5 rounded-lg transition-colors hover:bg-[var(--color-card-hover)] relative"
          onClick={() => setNotifOpen(!notifOpen)}
          aria-label="Notifications"
        >
          <Bell size={18} style={{ color: "var(--color-ink-muted)" }} />
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-danger)" }}
          />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 ml-2 pl-4 border-l" style={{ borderColor: "var(--color-border)" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: "var(--color-sage)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              {userName}
            </p>
            <p className="text-xs capitalize" style={{ color: "var(--color-ink-subtle)" }}>
              {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
