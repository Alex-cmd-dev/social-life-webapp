import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

/**
 * GET /api/projectfollows
 * 
 * Get project follows for current user or check if following a specific project
 */
export async function GET(request: NextRequest) {
  const session = await requireAuth();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (projectId) {
      // Check if current user follows this project
      const follow = await prisma.projectFollow.findUnique({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: projectId,
          },
        },
      });

      return NextResponse.json({ isFollowing: !!follow });
    }

    // Get all projects the user follows
    const follows = await prisma.projectFollow.findMany({
      where: { userId: session.user.id },
      include: {
        project: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(follows);
  } catch (err) {
    console.error("ProjectFollows GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/projectfollows
 * 
 * Follow a project
 */
export async function POST(request: NextRequest) {
  const session = await requireAuth();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await prisma.projectFollow.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { message: "Already following this project" },
        { status: 200 }
      );
    }

    // Create follow
    const follow = await prisma.projectFollow.create({
      data: {
        userId: session.user.id,
        projectId: projectId,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (err) {
    console.error("ProjectFollows POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/projectfollows
 * 
 * Unfollow a project
 */
export async function DELETE(request: NextRequest) {
  const session = await requireAuth();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // Find the follow relationship
    const follow = await prisma.projectFollow.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId: projectId,
        },
      },
    });

    if (!follow) {
      return NextResponse.json(
        { error: "Not following this project" },
        { status: 404 }
      );
    }

    // Delete the follow
    await prisma.projectFollow.delete({
      where: { id: follow.id },
    });

    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("ProjectFollows DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

