"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { IdeaDetail } from "@/components/idea-detail";
import { CommentSection } from "@/components/comment-section";
import { formatDistanceToNow } from "date-fns";

export default function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowingProject, setIsFollowingProject] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);

        // If this is a project post, check if user is following it
        if (data.projectId && session?.user?.id) {
          const followResponse = await fetch(`/api/projectfollows?projectId=${data.projectId}`);
          if (followResponse.ok) {
            const followData = await followResponse.json();
            setIsFollowingProject(followData.isFollowing || false);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, session?.user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-muted-foreground">
            Loading post...
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-destructive">
            Error: {error || "Post not found"}
          </div>
        </main>
      </div>
    );
  }

  // Parse tags from content
  const tagsMatch = post.content.match(/#tags:\s*(.+)$/m);
  const tags = tagsMatch
    ? tagsMatch[1].split(",").map((t: string) => t.trim())
    : [];

  // Remove tags line from content
  const cleanContent = post.content.replace(/#tags:\s*.+$/m, "").trim();

  // Extract title from first line and content from rest
  const lines = cleanContent.split("\n");
  const titleText = lines[0] || "";
  const contentWithoutTitle = lines.slice(1).join("\n").trim();

  const idea = {
    id: post.id,
    author: {
      name: post.user.name || "Anonymous",
      username: post.user.id,
      avatar: post.user.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.user.name || "User") + "&background=random",
    },
    title: titleText,
    content: contentWithoutTitle,
    tags: tags,
    likes: post._count?.likes || 0,
    comments: post._count?.comments || 0,
    timestamp: formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
    }),
    isLiked:
      post.likes?.some(
        (like: any) => like.userId === session?.user?.id
      ) || false,
    isBookmarked:
      post.bookmarks?.some(
        (bookmark: any) => bookmark.userId === session?.user?.id
      ) || false,
    isProject: !!post.projectId,
    isFollowingProject: isFollowingProject,
    project: post.project,
  };

  const isOwner = session?.user?.id === post.userId;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <IdeaDetail idea={idea} isOwner={isOwner} />

        <CommentSection ideaId={id} />
      </main>
    </div>
  );
}
