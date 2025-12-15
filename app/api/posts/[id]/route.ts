/**
 * Single Post API Route - Example Implementation
 *
 * This file shows you HOW to work with dynamic routes [id]
 * and protect operations (only owner can edit/delete)
 *
 * URL: /api/posts/[id]
 * Example: /api/posts/clx1234567890
 *
 * BACKEND TEAM: Use this pattern for other [id] routes!
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership } from "@/lib/auth-helpers";

/**
 * GET /api/posts/[id]
 *
 * Get a single post by ID
 * Anyone can view a post (no auth required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Find the post in database
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              }
            },
            replies: true,  // Nested comments
          },
          orderBy: {
            createdAt: "asc"
          }
        },
        likes: true,
        bookmarks: true,
        project: true,  // Include project if post is linked to one
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      }
    });

    // Check if post exists
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 *
 * Update a post
 * Only the post author can update their post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const postId = params.id;

    // STEP 2: Find the post
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // STEP 3: Check if current user is the post owner
    const isOwner = await checkOwnership(post.userId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own posts" },
        { status: 403 }
      );
    }

    // STEP 4: Get updated data from request
    const body = await request.json();
    const { content, imageUrl } = body;

    // STEP 5: Validate
    if (content && content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // STEP 6: Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content && { content: content.trim() }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json(updatedPost);

  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 *
 * Delete a post
 * Only the post author can delete their post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // STEP 1: Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const postId = params.id;

    // STEP 2: Find the post
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // STEP 3: Check ownership
    const isOwner = await checkOwnership(post.userId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own posts" },
        { status: 403 }
      );
    }

    // STEP 4: Delete the post
    // Note: Related likes, comments, bookmarks will be deleted automatically
    // because we set onDelete: Cascade in the schema
    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
