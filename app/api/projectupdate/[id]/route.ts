import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, checkOwnership} from "@/lib/auth-helpers";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse){
        return session;
    }

    const updateId = params.id;

    try {
        const updates = await prisma.projectUpdate.findMany({
            where: { id: updateId },
            include: { user: { select: { id: true, name: true, username: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(updates);
    }
    catch(err) {
        console.error("ProjectUpdates GET/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse){
        return session;
    }

    const updateId = params.id;

    try{

        //This checks that the user owns the project update before allowing update
        const update = await prisma.projectUpdate.findUnique({ where: { id: updateId } });
        if(!update) {
            return NextResponse.json({ error: "Project update not found" }, { status: 404 });
        }

        //Checks ownership
        const ownershipCheck = checkOwnership(update.userId);
        if(ownershipCheck instanceof NextResponse) {
            return ownershipCheck;
        }

        const body = await request.json();
        const { title, content, version } = body;

        const updated = await prisma.projectUpdate.update({
            where: { id: updateId },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(version && { version }),
            }
        });
        return NextResponse.json(updated);
    }
    catch(err) {
        console.error("ProjectUpdate PUT/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse){
        return session;
    }

    const updateId = params.id;

    try{
        //This checks that the user owns the project update before allowing deletion
        const update = await prisma.projectUpdate.findUnique({ where: { id: updateId } });
        if(!update) {
            return NextResponse.json({ error: "Project update not found" }, { status: 404 });
        }

        //Checks ownership
        const ownershipCheck = checkOwnership(update.userId);
        if(ownershipCheck instanceof NextResponse) {
            return ownershipCheck;
        }

        await prisma.projectUpdate.delete({ where: { id: updateId } });
        return NextResponse.json({ message: "Project update deleted" });
    }
    catch(err) {
        console.error("ProjectUpdate DELETE/[id] error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}