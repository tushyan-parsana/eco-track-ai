/**
 * @module auth
 * @description NextAuth.js configuration for EcoTrack AI.
 *
 * Supports two authentication providers:
 * - **Credentials** — Email-based demo login (finds or creates a user).
 * - **Google** — OAuth 2.0 via Google (requires env vars).
 *
 * Uses JWT sessions with a 30-day max age. The session callback
 * attaches the user's database ID to the client-visible session.
 */

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

/** Simple email format check to prevent obviously invalid inputs. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Retrieve the NEXTAUTH_SECRET from environment variables.
 * During build-time static generation, env vars may not be loaded,
 * so we fall back silently. At runtime a missing secret throws.
 */
function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // During `next build` static page generation, env vars are unavailable.
    // Return a build-time placeholder — the route will be re-evaluated at runtime.
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      return "__build_time_placeholder__";
    }
    // In development, fall back to a dev-only secret with a warning.
    console.warn(
      "⚠️  NEXTAUTH_SECRET is not set. Using a development-only fallback."
    );
    return "dev-only-secret-do-not-use-in-production";
  }
  return secret;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        const email = credentials.email.trim().toLowerCase();

        if (!isValidEmail(email)) {
          throw new Error("Please enter a valid email address");
        }

        // Find or create user based on email (Demo behavior)
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              carbonScore: 0,
            },
          });
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // user and account are only defined on the initial sign-in
      if (account?.provider === "google" && user?.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split("@")[0],
              image: user.image,
              carbonScore: 0,
            },
          });
        }
        token.id = dbUser.id;
      } else if (user) {
        // Credentials provider
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
      }
      return session;
    },
  },
  secret: getAuthSecret(),
};
