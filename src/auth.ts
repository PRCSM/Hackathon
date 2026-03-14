import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authConfig: NextAuthConfig = {
  adapter: PostgresAdapter(pool),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/student",
    error: "/access-denied",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || account?.provider !== "google") return false;

      // Read the intended role from the cookie set by AuthPage
      let intendedRole: string | null = null;
      try {
        const cookieStore = await cookies();
        intendedRole = cookieStore.get("padhai_intended_role")?.value || null;
      } catch {
        // cookies() may not be available in all contexts
      }

      // If trying to sign in as admin, check the approved_admins table
      if (intendedRole === "admin") {
        const result = await pool.query(
          "SELECT email FROM approved_admins WHERE LOWER(email) = LOWER($1)",
          [user.email]
        );
        if (result.rows.length === 0) {
          return false; // Block sign-in entirely — user won't be created
        }
      }

      // If trying to sign in as teacher, check the approved_teachers table
      if (intendedRole === "teacher") {
        const result = await pool.query(
          "SELECT email FROM approved_teachers WHERE LOWER(email) = LOWER($1)",
          [user.email]
        );
        if (result.rows.length === 0) {
          return false; // Block sign-in entirely — user won't be created
        }
      }

      // Student and parent are allowed for everyone
      // Update the user's role if they already exist
      if (intendedRole) {
        try {
          await pool.query(
            `UPDATE users SET role = $1, updated_at = NOW() WHERE email = $2`,
            [intendedRole, user.email]
          );
        } catch {
          // User may not exist yet — adapter will create them
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },

    async session({ session }) {
      if (session.user?.email) {
        const result = await pool.query(
          "SELECT id, role, onboarding_completed, preferred_language FROM users WHERE email = $1",
          [session.user.email]
        );
        if (result.rows[0]) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const u = session.user as any;
          u.id = result.rows[0].id;
          u.role = result.rows[0].role;
          u.onboardingCompleted = result.rows[0].onboarding_completed;
          u.preferredLanguage = result.rows[0].preferred_language;
        }
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
