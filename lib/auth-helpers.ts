/**
 * Authentication Helper Functions
 *
 * These helper functions make it easy to check if a user is logged in
 * and get their information from the JWT token.
 *
 * Use these in your API routes to protect endpoints.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Get the current logged-in user's session
 * Returns null if user is not logged in
 *
 * @example
 * const session = await getCurrentUser();
 * if (!session) {
 *   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * }
 * console.log(session.user.id); // Current user's ID
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Require authentication - returns error response if not logged in
 * Use this at the start of protected API routes
 *
 * @example
 * const session = await requireAuth();
 * if (session instanceof NextResponse) return session; // Returns error if not logged in
 *
 * // If we get here, user is logged in!
 * const userId = session.user.id;
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized - Please sign in" },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Check if the current user owns a resource
 * Useful for checking if user can edit/delete their own posts
 *
 * @param resourceUserId - The userId of the resource (post, comment, etc.)
 * @returns true if current user owns the resource, false otherwise
 *
 * @example
 * const post = await prisma.post.findUnique({ where: { id: postId } });
 * const isOwner = await checkOwnership(post.userId);
 * if (!isOwner) {
 *   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
 * }
 */
export async function checkOwnership(resourceUserId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return false;
  }

  return session.user.id === resourceUserId;
}
