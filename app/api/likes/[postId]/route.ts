/**
 * Like API Route
 * 
 * POST /api/likes/[postId] - Like a post
 * DELETE /api/likes/[postId] - Unlike a post
 * 
 * This matches the API specification at /api/likes/{postId}
 */

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Ctx = { params: { postId: string } };

/**
 * POST /api/likes/[postId]
 * 
 * Like a post
 * Requires authentication
 */
export async function POST(request: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id as string | undefined;
  
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: params.postId,
          userId: userId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Already liked this post" }, 
        { status: 400 }
      );
    }

    // Create the like
    const like = await prisma.like.create({
      data: { 
        postId: params.postId,
        userId 
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (e) {
    console.error("Error liking post:", e);
    return NextResponse.json({ error: "Could not like post" }, { status: 500 });
  }
}

/**
 * DELETE /api/likes/[postId]
 * 
 * Unlike a post (remove like)
 * Requires authentication
 */
export async function DELETE(request: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id as string | undefined;
  
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: params.postId,
          userId: userId
        }
      }
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: "Like not found" }, 
        { status: 404 }
      );
    }

    // Delete the like
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId: params.postId,
          userId: userId
        }
      }
    });

    return NextResponse.json({ message: "Like removed" }, { status: 200 });
  } catch (e) {
    console.error("Error unliking post:", e);
    return NextResponse.json({ error: "Could not unlike post" }, { status: 500 });
  }
}

