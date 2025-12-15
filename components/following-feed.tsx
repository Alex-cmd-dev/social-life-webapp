"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IdeaCard } from "@/components/idea-card";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";

export function FollowingFeed() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFollowingPosts();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  async function fetchFollowingPosts() {
    try {
      const response = await fetch("/api/posts?following=true");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = () => {
    setLoading(true);
    fetchFollowingPosts();
  };

  const handleDelete = (deletedPostId: string) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

  if (status === "loading" || loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading posts...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Sign in to see your feed</h2>
        <p className="text-muted-foreground">
          Follow people to see their latest posts here.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">Error: {error}</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
        <p className="text-muted-foreground">
          Start following people to see their posts in your feed!
        </p>
      </div>
    );
  }

  // Transform posts to idea card format
  const ideas = posts.map((post: any) => {
    // Parse tags from content
    const tagsMatch = post.content.match(/#tags:\s*(.+)$/m);
    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((t: string) => t.trim())
      : [];

    // Remove tags line from content
    const cleanContent = post.content.replace(/#tags:\s*.+$/m, "").trim();

    // Extract title from first line and content from rest
    const lines = cleanContent.split("\n");
    const title = lines[0] || "";
    const contentWithoutTitle = lines.slice(1).join("\n").trim();

    return {
      id: post.id,
      author: {
        name: post.user.name || "Anonymous",
        username: post.user.username || post.user.id,
        avatar: post.user.image || "/placeholder.svg",
      },
      title: title,
      content: contentWithoutTitle,
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
    <div className="space-y-6">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          currentUserId={session?.user?.id}
          onUpdate={handleUpdate}
          onDelete={() => handleDelete(idea.id)}
        />
      ))}
    </div>
  );
}
