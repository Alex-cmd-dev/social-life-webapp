/**
 * Prisma Client Instance
 *
 * This file creates a single instance of the Prisma Client that can be used
 * throughout the application. This is important in Next.js development mode
 * because Next.js hot-reloads the server, which can create multiple instances
 * of the Prisma Client and exhaust your database connections.
 *
 * Learn more: https://pris.ly/d/help/next-js-best-practices
 */

import { PrismaClient } from "@prisma/client";

// Extend the global type to include our prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Create a single instance of PrismaClient
 * In development, we use a global variable to prevent multiple instances
 * In production, we create a new instance for each deployment
 */
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In development mode, store the instance globally to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
