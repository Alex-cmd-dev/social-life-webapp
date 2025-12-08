import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership} from "@/lib/auth-helpers";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse) {
        return session;
    }
    const projectId = params.id;

    try{
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { user: { select: { id: true, name: true, username: true, image: true } },
            updates: { orderBy: { createdAt: "desc" } },
            },
        });

        if(!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    }
    catch(err){
        console.error("Project GET/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse) {
        return session;
    }
    const projectId = params.id;

    try{
        //This checks that the user owns the project before allowing update
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if(!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        //Checks ownership
        const ownershipCheck = checkOwnership(project.userId);
        if(ownershipCheck instanceof NextResponse) {
            return ownershipCheck;
        }

        const body = await request.json();
        const { title, description, status, imageUrl, githubUrl, liveUrl, tags } = body;

        const updated = await prisma.project.update({
            where: { id: projectId },
            data: {
                //The dots unpack only if the value exists
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                ...(imageUrl && { imageUrl }),
                ...(githubUrl && { githubUrl }),
                ...(liveUrl && { liveUrl }),
                ...(tags && { tags: JSON.stringify(tags) }),
            },
            include: { user: { select: { id: true, name: true, username: true, image: true } } },
        });
        return NextResponse.json(updated);
    }
    catch(err){
        console.error("Project PUT/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse) {
        return session;
    }
    const projectId = params.id;

    try{
        //This checks that the user owns the project before allowing update
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if(!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        //Checks ownership
        const ownershipCheck = checkOwnership(project.userId);
        if(ownershipCheck instanceof NextResponse) {
            return ownershipCheck;
        }

        await prisma.project.delete({ where: { id: projectId } });
        return NextResponse.json({ message: "Project deleted" });
    }
    catch(err){
        console.error("Project DELETE/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}