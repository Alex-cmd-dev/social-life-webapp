import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth} from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
    const session = await requireAuth();

    if(session instanceof NextResponse) {
        return session;
    }
    try {
        const projects = await prisma.project.findMany({
            where: {},
            include: {user: { select: { id: true, name: true, username: true, image: true } },
            updates: { select: { id: true, title: true, createdAt: true} },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(projects);
    } 
    catch (err) {
        console.error("Projects GET error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await requireAuth();
    
    if(session instanceof NextResponse) {
        return session;
    }

    try{
        const body = await request.json();
        const { title, description, status, imageUrl, githubUrl, liveUrl, tags } = body;

        if(!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const newProject = await prisma.project.create({
            data: { title, description, status: status || "IDEA", imageUrl, githubUrl, liveUrl, 
                tags: JSON.stringify(tags || []), userId: session.user.id },

            include: { user: { select: { id: true, name: true, username: true, image: true } } },
        });
        return NextResponse.json(newProject, {status: 201});
    }
    catch (err) {
        console.error("Projects POST error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}