import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership} from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
    const session = await requireAuth();
    if(session instanceof NextResponse){
        return session;
    }

    const { searchParams } = request.nextUrl;
    const projectId = searchParams.get("projectId");

    try {
        const updates = await prisma.projectUpdate.findMany({
            where: {
                ...(projectId && { projectId }),
            },
            include: { user: { select: { id: true, name: true, username: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(updates);
    } catch(err) {
        console.error("ProjectUpdates GET error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await requireAuth();
    if(session instanceof NextResponse){
        return session;
    }

    try{
        const body = await request.json();
        const { projectId, title, content, version } = body;

        // Verify project exists and user owns it
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if(!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const ownershipCheck = checkOwnership(project.userId);
        if(ownershipCheck instanceof NextResponse) {
            return ownershipCheck;
        }

        if(!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        const update = await prisma.projectUpdate.create({
            data: {
                title,
                content,
                version,
                projectId,
                userId: session.user.id,
            },
            include: { user: { select: { id: true, name: true, username: true, image: true } } },
        });
        return NextResponse.json(update, { status: 201 });
    } 
    catch(err) {
        console.error("ProjectUpdates POST error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}