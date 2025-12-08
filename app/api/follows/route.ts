import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
    const session = await requireAuth();

    if(session instanceof NextResponse) {
        return session;
    }
    const type = (request.nextUrl.searchParams.get("type") || "followers").toLowerCase();

    if(type !== "followers" && type !== "following") {
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    try{
        if(type === "followers") {
            const followers = await prisma.follow.findMany({
                where: { followingId: session.user.id },
                include: { follower: { select: { id: true, name: true, username: true, image: true, bio: true } } },
                orderBy: { createdAt: "desc" },
            });

            const result = followers.map(f => ({id: f.follower.id, name: f.follower.name, username: f.follower.username, image: f.follower.image, bio: f.follower.bio}));
            return NextResponse.json(result);
        } 
        else {
            const following = await prisma.follow.findMany({
                where: { followerId: session.user.id },
                include: { following: { select: { id: true, name: true, username: true, image: true, bio: true } } },
                orderBy: { createdAt: "desc" },
            });

            const result = following.map(f => ({id: f.following.id, name: f.following.name, username: f.following.username, image: f.following.image, bio: f.following.bio}));
            return NextResponse.json(result);
        }
    } 
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

}

export async function POST(request: NextRequest) {
    const session = await requireAuth();

    if(session instanceof NextResponse) {
        return session;
    }

    try {
        const body = await request.json();
        const followingId = body?.followingId as string | undefined;

        if(!followingId) {
            return NextResponse.json({ error: "followingId is required" }, { status: 400 });
        }

        if(followingId === session.user.id) {
            return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
        }

        const userExists = await prisma.user.findUnique({ where: { id: followingId } });
        if(!userExists) {
            return NextResponse.json({ error: "User does not exist" }, { status: 404 });
        }

        try{
            const follow = await prisma.follow.create({
                data: { followerId: session.user.id, followingId },
            });
            return NextResponse.json(follow, {status: 201});
        }
        catch(e: any){
            //This error code is specific to Prisma for unique constraint violations
            if(e.code === 'P2002') {
                return NextResponse.json({ error: "Already following this user" }, { status: 400 });
            }
            console.error("Follow create error:",e);
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
    }
    catch(err){
        console.error("Follow Post error:",err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

}

export async function DELETE(request: NextRequest) {
    const session = await requireAuth();
    if(session instanceof NextResponse){
        return session;
    }

    try {
        const body = await request.json();
        const followingId = body?.followingId as string | undefined;

        if(!followingId) {
            return NextResponse.json({ error: "followingId is required" }, { status: 400 });
        }
        
        const res = await prisma.follow.deleteMany({
            where: { followerId: session.user.id, followingId },
        });

        if(res.count === 0) {
            return NextResponse.json({ error: "Follow not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Unfollowed successfully" });
    }
    catch(err){
        console.error("Follow Delete error:",err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}