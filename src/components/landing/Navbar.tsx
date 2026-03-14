"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shared";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Solutions", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-200",
        scrolled ? "border-b" : "border-b border-transparent"
      )}
      style={{
        backgroundColor: "rgba(245,242,236,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
      }}
    >
      <div className="container flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}
        >
          PadhAI
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium relative group"
              style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-sans)" }}
            >
              <span className="group-hover:text-[var(--color-ink)] transition-colors duration-200">
                {link.label}
              </span>
              <span
                className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-200"
                style={{ backgroundColor: "var(--color-forest)" }}
              />
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/teacher">
            <Button variant="ghost" size="sm">Login as Teacher</Button>
          </Link>
          <Link href="/auth/student">
            <Button variant="primary" size="sm">Login as Student</Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "var(--color-ink)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-[72px] z-40 flex flex-col p-6 gap-4 md:hidden"
          style={{ backgroundColor: "var(--color-card)" }}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="text-lg font-medium py-3 border-b"
              style={{
                color: "var(--color-ink)",
                borderColor: "var(--color-border)",
                animationDelay: `${i * 50}ms`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link href="/auth/teacher">
              <Button variant="ghost" fullWidth>Login as Teacher</Button>
            </Link>
            <Link href="/auth/student">
              <Button variant="primary" fullWidth>Login as Student</Button>
            </Link>
          </div>
          <div className="mt-2 flex gap-4 text-xs" style={{ color: "var(--color-ink-subtle)" }}>
            <Link href="/auth/admin">Admin Login</Link>
            <Link href="/auth/parent">Parent Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
