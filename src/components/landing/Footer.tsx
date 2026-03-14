"use client";

import Link from "next/link";
import React from "react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Roles: [
    { label: "Teacher", href: "/auth/teacher" },
    { label: "Student", href: "/auth/student" },
    { label: "Admin", href: "/auth/admin" },
    { label: "Parent", href: "/auth/parent" },
  ],
  Technology: [
    { label: "Amazon Bedrock", href: "#" },
    { label: "Amazon SageMaker", href: "#" },
    { label: "AWS Lambda", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t py-16"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold mb-3 inline-block"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-forest)" }}
            >
              PadhAI
            </Link>
            <p className="text-body-sm" style={{ color: "var(--color-ink-muted)" }}>
              AI-powered classroom learning platform built for the DAKSH &apos;26 Hackathon.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-label mb-4">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-body-sm transition-colors duration-200"
                      style={{ color: "var(--color-ink-muted)" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--color-ink)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--color-ink-muted)")
                      }
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-body-sm" style={{ color: "var(--color-ink-subtle)" }}>
            &copy; {new Date().getFullYear()} PadhAI. Built with ❤️ for DAKSH &apos;26.
          </p>
          <p className="text-body-sm" style={{ color: "var(--color-ink-subtle)" }}>
            Powered by AWS • Next.js • PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
