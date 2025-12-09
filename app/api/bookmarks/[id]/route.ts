import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership } from "@/lib/auth-helpers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id: postId } = await params;

    // Find bookmark by postId and userId combination
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        postId: postId,
        userId: session.user.id,
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({ where: { id: bookmark.id } });
    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    console.error("Bookmarks DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
