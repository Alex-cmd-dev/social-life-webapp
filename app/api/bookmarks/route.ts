import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  const session = await requireAuth();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            imageUrl: true,
            createdAt: true,
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
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({ bookmarks });
  } catch (err) {
    console.error("Bookmarks GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: session.user.id,
        postId: postId,
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        {
          message: "Post already bookmarked",
          bookmark: existingBookmark,
        },
        { status: 200 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        postId: postId,
      },
    });
    return NextResponse.json({ bookmark });
  } catch (err) {
    console.error("Bookmarks POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
