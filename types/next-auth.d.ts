/**
 * NextAuth Type Declarations
 *
 * This file extends the NextAuth types to include custom properties
 * that we want to add to the session and user objects.
 */

import NextAuth from "next-auth";

/**
 * Extend the built-in session type to include the user id
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
