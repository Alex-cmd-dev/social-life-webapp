/**
 * NextAuth API Route Handler
 *
 * This route handles all authentication requests for our app.
 * The [...nextauth] folder name is a Next.js catch-all route that
 * handles all auth-related API requests like:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * etc.
 *
 * Learn more: https://next-auth.js.org/configuration/initialization#route-handlers-app
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the NextAuth handler with our configuration
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
