"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IdeaCard } from "@/components/idea-card";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  userId: string;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  project?: {
    id: string;
    title: string;
    status: string;
  } | null;
  likes: any[];
  comments: any[];
  bookmarks?: any[];
  _count: {
    likes: number;
    comments: number;
  };
}

export function IdeaFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
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
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpdate = () => {
    setLoading(true);
    fetchPosts();
  };

  const handleDelete = (deletedPostId: string) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          Loading posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-destructive">Error: {error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          No posts yet. Be the first to share an idea!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        // Parse tags from content
        const tagsMatch = post.content.match(/#tags:\s*(.+)$/m);
        const tags = tagsMatch
          ? tagsMatch[1].split(",").map((t) => t.trim())
          : [];

        // Remove tags line from content
        const cleanContent = post.content.replace(/#tags:\s*.+$/m, "").trim();

        const idea = {
          id: post.id,
          author: {
            name: post.user.name || "Anonymous",
            username: post.user.id,
            avatar: post.user.image || "/placeholder.svg",
          },
          title: cleanContent.split("\n")[0].substring(0, 100),
          content: cleanContent,
          tags: tags,
          likes: post._count.likes,
          comments: post._count.comments,
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
          project: post.project,
        };
        return (
          <IdeaCard
            key={post.id}
            idea={idea}
            currentUserId={session?.user?.id}
            onUpdate={handleUpdate}
            onDelete={() => handleDelete(post.id)}
          />
        );
      })}
    </div>
  );
}
