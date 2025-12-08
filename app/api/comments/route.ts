/**
 * Comments API Route
 * 
 * GET /api/comments - Get all comments
 * POST /api/comments - Create a new comment
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * GET /api/comments
 * 
 * Get all comments with user and post information
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    // Get query parameters for pagination (optional)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const postId = searchParams.get("postId"); // Optional filter by post

    // Build where clause
    const whereClause = postId ? { postId } : {};

    // Query database
    const comments = await prisma.comment.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc"
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
          }
        },
        _count: {
          select: {
            replies: true,
          }
        }
      }
    });

    return NextResponse.json(comments);

  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * 
 * Create a new comment on a post
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session;

    // Get data from request body
    const body = await request.json();
    const { content, postId, parentId } = body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        userId: session.user.id,
        parentId: parentId || null,
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

    return NextResponse.json(comment, { status: 201 });

  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

