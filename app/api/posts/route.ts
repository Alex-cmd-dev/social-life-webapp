/**
 * Posts API Route - Example Implementation
 *
 * This file shows you HOW to build API endpoints with:
 * - JWT authentication
 * - Prisma database queries
 * - Error handling
 * - Input validation
 *
 * BACKEND TEAM: Use this as a template for building other endpoints!
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * GET /api/posts
 *
 * Get all posts (newest first)
 * Anyone can view posts (no authentication required for reading)
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for pagination (optional)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const userId = searchParams.get("userId");
    const following = searchParams.get("following") === "true";
    const search = searchParams.get("search");

    // Build where clause
    let whereClause: any = {};

    // Filter by search query
    if (search) {
      whereClause.content = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Filter by specific user
    if (userId) {
      whereClause.userId = userId;
    }

    // Filter by following (only show posts from users I follow)
    if (following) {
      const session = await requireAuth();
      if (session instanceof NextResponse) return session;

      // Get list of users the current user follows
      const followingList = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      });

      const followingIds = followingList.map((f) => f.followingId);

      // If not following anyone, return empty array
      if (followingIds.length === 0) {
        return NextResponse.json([]);
      }

      whereClause.userId = { in: followingIds };
    }

    // Query database using Prisma
    const posts = await prisma.post.findMany({
      where: whereClause,
      take: limit, // How many posts to get
      skip: offset, // How many to skip (for pagination)
      orderBy: {
        createdAt: "desc", // Newest first
      },
      // Include related data (JOIN in SQL)
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        likes: true, // Include all likes
        comments: true, // Include all comments
        bookmarks: true, // Include all bookmarks
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Return the posts as JSON
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 *
 * Create a new post
 * Requires authentication (user must be logged in)
 */
export async function POST(request: NextRequest) {
  try {
    // STEP 1: Check if user is logged in
    const session = await requireAuth();
    if (session instanceof NextResponse) return session; // Returns 401 error if not logged in

    // STEP 2: Get data from request body
    const body = await request.json();
    const { content, imageUrl, projectId } = body;

    // STEP 3: Validate the data
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Content is too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    // STEP 4: Create the post in the database
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        imageUrl: imageUrl || null,
        projectId: projectId || null,
        userId: session.user.id, // Current logged-in user
      },
      // Include user data in the response
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // STEP 5: Return the created post
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
