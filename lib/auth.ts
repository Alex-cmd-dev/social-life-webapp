/**
 * NextAuth Configuration
 *
 * This file contains the configuration for NextAuth.js, which handles
 * authentication in our social media app using JWT and email/password.
 *
 * Learn more: https://next-auth.js.org/configuration/options
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * NextAuth configuration options
 * Using JWT strategy with email/password credentials
 */
export const authOptions: NextAuthOptions = {
  // Authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Return user object (will be stored in JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  // Custom pages for authentication
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error',
  },

  // Session configuration - using JWT instead of database
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks allow you to control what happens during the authentication process
  callbacks: {
    // JWT callback - called when token is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Session callback - called when session is checked
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};
