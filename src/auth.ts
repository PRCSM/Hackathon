import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import type { NextAuthConfig } from "next-auth";

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
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: true,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || account?.provider !== "google") return false;

      // Allow sign-in — the adapter will auto-create the user in the users table.
      // We ensure the user record exists with a default role.
      // Role will be set/updated after sign-in via the API or redirect flow.
      try {
        await pool.query(
          `UPDATE users SET updated_at = NOW() WHERE email = $1`,
          [user.email]
        );
      } catch {
        // User may not exist yet — adapter will create them
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
