"use client";

import { use, useState, useEffect } from "react";
import { Header } from "@/components/header";
import { IdeaDetail } from "@/components/idea-detail";
import { CommentSection } from "@/components/comment-section";
import { ProjectRoadmap } from "@/components/project-roadmap";
import { PostUpdateDialog } from "@/components/post-update-dialog";
import { formatDistanceToNow } from "date-fns";

export default function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

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

  const idea = {
    id: post.id,
    author: {
      name: post.user.name || "Anonymous",
      username: post.user.id,
      avatar: post.user.image || "/placeholder.svg",
    },
    title: post.content.split("\n")[0].substring(0, 100),
    content: post.content,
    tags: [],
    likes: post._count?.likes || 0,
    comments: post._count?.comments || 0,
    timestamp: formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
    }),
    isLiked: false,
    isBookmarked: false,
    isProject: false,
    isFollowingProject: false,
  };

  const roadmapUpdates: any[] = [];
  const isOwner = false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <IdeaDetail idea={idea} isOwner={isOwner} />

        {idea.isProject && (
          <ProjectRoadmap
            projectId={idea.id}
            projectTitle={idea.title}
            updates={roadmapUpdates}
            isOwner={isOwner}
            onAddUpdate={() => setUpdateDialogOpen(true)}
          />
        )}

        <CommentSection ideaId={id} />

        <PostUpdateDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          projectId={idea.id}
          projectTitle={idea.title}
        />
      </main>
    </div>
  );
}
