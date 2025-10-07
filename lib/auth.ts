/**
 * NextAuth Configuration
 *
 * This file contains the configuration for NextAuth.js, which handles
 * authentication in our social media app.
 *
 * Learn more: https://next-auth.js.org/configuration/options
 */

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

// You can add authentication providers here later (Google, GitHub, etc.)
// import GoogleProvider from "next-auth/providers/google"
// import GitHubProvider from "next-auth/providers/github"

/**
 * NextAuth configuration options
 * This is where you configure authentication providers, callbacks, and more
 */
export const authOptions: NextAuthOptions = {
  // Use Prisma adapter to store user data in our PostgreSQL database
  adapter: PrismaAdapter(prisma) as any,

  // Authentication providers (add your providers here)
  providers: [
    // Example: Google OAuth
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // Example: GitHub OAuth
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // Add more providers here as needed
  ],

  // Custom pages for authentication
  pages: {
    signIn: "/auth/signin", // Custom sign-in page (create this later)
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
  },

  // Session configuration
  session: {
    strategy: "database", // Store sessions in the database
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks allow you to control what happens during the authentication process
  callbacks: {
    // This callback is called whenever a session is checked
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};
