"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/components/idea-card";
import {
  Folder,
  Calendar,
  ExternalLink,
  Github,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowLeft,
  UserPlus,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusEmojis: Record<string, string> = {
  IDEA: "💡",
  PLANNING: "📋",
  IN_PROGRESS: "🚧",
  COMPLETED: "✅",
  ON_HOLD: "⏸️",
  CANCELLED: "❌",
};

const statusColors: Record<string, string> = {
  IDEA: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PLANNING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  ON_HOLD: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProjectData();
    checkFollowStatus();
  }, [id, session?.user?.id]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      // Fetch project details
      const projectRes = await fetch(`/api/projects/${id}`);
      if (!projectRes.ok) throw new Error("Project not found");
      const projectData = await projectRes.json();
      setProject(projectData);

      // Fetch posts related to this project
      const postsRes = await fetch(`/api/posts?projectId=${id}`);
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/projectfollows?projectId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing || false);
      }
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.id) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const res = await fetch(`/api/projectfollows?projectId=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsFollowing(false);
        }
      } else {
        // Follow
        const res = await fetch("/api/projectfollows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id }),
        });
        if (res.ok) {
          setIsFollowing(true);
        }
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/projects");
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="p-12 text-center">
            <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Project not found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "This project doesn't exist or has been deleted"}
            </p>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const isOwner = session?.user?.id === project.userId;

  // Transform posts for IdeaCard
  const ideas = posts.map((post: any) => {
    const tagsMatch = post.content.match(/#tags:\s*(.+)$/m);
    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((t: string) => t.trim())
      : [];
    const cleanContent = post.content.replace(/#tags:\s*.+$/m, "").trim();

    return {
      id: post.id,
      author: {
        name: post.user.name || "Anonymous",
        username: post.user.id,
        avatar: post.user.image || "/placeholder.svg",
      },
      title: cleanContent.split("\n")[0].substring(0, 100),
      content: cleanContent,
      tags: tags,
      likes: post._count?.likes || 0,
      comments: post._count?.comments || 0,
      timestamp: formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      }),
      isLiked:
        post.likes?.some((like: any) => like.userId === session?.user?.id) ||
        false,
      isBookmarked:
        post.bookmarks?.some(
          (bookmark: any) => bookmark.userId === session?.user?.id
        ) || false,
      project: post.project,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/projects">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Folder className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-sm px-3 py-1 rounded-full border ${
                      statusColors[project.status]
                    }`}
                  >
                    {statusEmojis[project.status]}{" "}
                    {project.status.replace("_", " ")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    by {project.user?.name || "Anonymous"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isOwner && session?.user?.id && (
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  variant={isFollowing ? "outline" : "default"}
                  className="gap-2"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Created{" "}
              {formatDistanceToNow(new Date(project.createdAt), {
                addSuffix: true,
              })}
            </div>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Related Posts ({posts.length})
          </h2>
        </div>

        {ideas.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No posts linked to this project yet
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
