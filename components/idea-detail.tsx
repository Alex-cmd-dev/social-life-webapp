"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Bookmark, FolderKanban } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface IdeaDetailProps {
  idea: {
    id: string
    author: {
      name: string
      username: string
      avatar: string
    }
    title: string
    content: string
    tags: string[]
    likes: number
    comments: number
    timestamp: string
    isLiked?: boolean
    isBookmarked?: boolean
    isProject?: boolean
    isFollowingProject?: boolean
    project?: {
      id: string
      title: string
      status: string
    }
  }
  isOwner?: boolean
}

export function IdeaDetail({ idea, isOwner }: IdeaDetailProps) {
  const [isLiked, setIsLiked] = useState(idea.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(idea.isBookmarked || false)
  const [likes, setLikes] = useState(idea.likes)
  const [isFollowingProject, setIsFollowingProject] = useState(idea.isFollowingProject || false)

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Unlike
        const response = await fetch(`/api/likes/${idea.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsLiked(false);
          setLikes(likes - 1);
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: `HTTP ${response.status}` };
          }
          console.error("Error unliking post:", errorData);
          // If the like doesn't exist (404), sync the state
          if (response.status === 404) {
            setIsLiked(false);
          }
        }
      } else {
        // Like
        const response = await fetch(`/api/likes/${idea.id}`, {
          method: "POST",
        });

        if (response.ok) {
          setIsLiked(true);
          setLikes(likes + 1);
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: `HTTP ${response.status}` };
          }
          console.error("Error liking post:", errorData);
          // If already liked (400), sync the state
          if (response.status === 400 && errorData.error?.includes("Already liked")) {
            setIsLiked(true);
          }
          // If not authenticated (401), show message
          if (response.status === 401) {
            alert("Please sign in to like posts");
          }
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/${idea.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsBookmarked(false);
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: `HTTP ${response.status}` };
          }
          console.error("Error removing bookmark:", errorData);
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: idea.id }),
        });

        if (response.ok) {
          setIsBookmarked(true);
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: `HTTP ${response.status}` };
          }
          console.error("Error bookmarking post:", errorData);
          // If not authenticated (401), show message
          if (response.status === 401) {
            alert("Please sign in to bookmark posts");
          }
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleFollowProject = async () => {
    if (!idea.project?.id) return;

    try {
      if (isFollowingProject) {
        // Unfollow
        const response = await fetch(`/api/projectfollows?projectId=${idea.project.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFollowingProject(false);
        } else {
          console.error("Error unfollowing project");
        }
      } else {
        // Follow
        const response = await fetch("/api/projectfollows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: idea.project.id }),
        });

        if (response.ok) {
          setIsFollowingProject(true);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error following project:", errorData);
          // If not authenticated
          if (response.status === 401) {
            alert("Please sign in to follow projects");
          }
        }
      }
    } catch (error) {
      console.error("Error toggling project follow:", error);
    }
  }

  return (
    <Card className="p-8 mb-6">
      <div className="flex items-start gap-4 mb-6">
        <Link href={`/profile/${idea.author.username}`}>
          <Image
            src={idea.author.avatar || "/placeholder.svg"}
            alt={idea.author.name}
            width={48}
            height={48}
            className="rounded-full hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${idea.author.username}`} className="font-semibold hover:underline">
              {idea.author.name}
            </Link>
            <span className="text-muted-foreground text-sm">@{idea.author.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{idea.timestamp}</span>
            {idea.isProject && (
              <>
                <span className="text-muted-foreground text-sm">·</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium flex items-center gap-1">
                  <FolderKanban className="h-3 w-3" />
                  Project
                </span>
              </>
            )}
          </div>
        </div>

        {idea.isProject && !isOwner && (
          <Button
            onClick={handleFollowProject}
            variant={isFollowingProject ? "outline" : "default"}
            className={isFollowingProject ? "" : "bg-primary hover:bg-primary/90"}
          >
            {isFollowingProject ? "Following Project" : "Follow Project"}
          </Button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-4 text-balance">{idea.title}</h1>

      <p className="text-lg text-foreground mb-6 text-pretty leading-relaxed whitespace-pre-wrap">{idea.content}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {idea.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          <span className="font-medium">{likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">{idea.comments}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`ml-auto ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>
    </Card>
  )
}
