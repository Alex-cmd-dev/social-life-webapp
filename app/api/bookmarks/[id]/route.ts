import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership} from "@/lib/auth-helpers";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();

    if(session instanceof NextResponse) {
        return session;
    }

    try {
        const bookmark = await prisma.bookmark.findUnique({ where: { id: params.id } });
        if(!bookmark) {
            return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
        }

        const ownershipCheck = checkOwnership(bookmark.userId);
        if(ownershipCheck instanceof NextResponse) {
            return ownershipCheck;
        }

        await prisma.bookmark.delete({ where: { id: params.id } });
        return NextResponse.json({ message: "Bookmark deleted successfully" });
    } catch (err) {
        console.error("Bookmarks DELETE error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}