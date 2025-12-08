/**
 * Single Comment API Route
 * 
 * GET /api/comments/[id] - Get comment by ID
 * PUT /api/comments/[id] - Update comment
 * DELETE /api/comments/[id] - Delete comment
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership } from "@/lib/auth-helpers";

/**
 * GET /api/comments/[id]
 * 
 * Get a single comment by ID
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

    const commentId = params.id;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        },
        post: {
          select: {
            id: true,
            content: true,
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        },
        _count: {
          select: {
            replies: true,
          }
        }
      }
    });

    // Check if comment exists
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);

  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/comments/[id]
 * 
 * Update a comment
 * Only the comment author can update their comment
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const commentId = params.id;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if current user is the comment owner
    const isOwner = await checkOwnership(comment.userId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Get updated data from request
    const body = await request.json();
    const { content } = body;

    // Validate
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          }
        },
        post: {
          select: {
            id: true,
            content: true,
          }
        }
      }
    });

    return NextResponse.json(updatedComment);

  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comments/[id]
 * 
 * Delete a comment
 * Only the comment author can delete their comment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    const commentId = params.id;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check ownership
    const isOwner = await checkOwnership(comment.userId);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Delete the comment
    // Note: Nested replies will be deleted automatically due to onDelete: Cascade
    await prisma.comment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({
      message: "Comment deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

