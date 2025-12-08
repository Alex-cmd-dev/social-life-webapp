/**
 * Single User API Route
 * 
 * GET /api/users/[id] - Get user by ID
 * PUT /api/users/[id] - Update user profile
 * DELETE /api/users/[id] - Delete user
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership } from "@/lib/auth-helpers";

/**
 * GET /api/users/[id]
 * 
 * Get a single user by ID with their posts and stats
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const userId = params.id;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            projects: true,
          }
        }
      }
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * 
 * Update user profile
 * Users can only update their own profile
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const userId = params.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if current user is updating their own profile
    const isOwner = await checkOwnership(userId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only update your own profile" },
        { status: 403 }
      );
    }

    // Get updated data from request
    const body = await request.json();
    const { name, username, bio, image } = body;

    // If username is being updated, check if it's available
    if (username && username !== user.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * 
 * Delete user account
 * Users can only delete their own account
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const userId = params.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const isOwner = await checkOwnership(userId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own account" },
        { status: 403 }
      );
    }

    // Delete the user
    // Note: Related posts, comments, likes, etc. will be deleted automatically
    // because we set onDelete: Cascade in the schema
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

