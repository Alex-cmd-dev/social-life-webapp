"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Pencil,
  Trash2,
  Folder,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPostDialog } from "@/components/edit-post-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

interface IdeaCardProps {
  idea: {
    id: string;
    author: {
      name: string;
      username: string;
      avatar: string;
    };
    title: string;
    content: string;
    tags: string[];
    likes: number;
    comments: number;
    timestamp: string;
    isLiked?: boolean;
    isBookmarked?: boolean;
    project?: {
      id: string;
      title: string;
      status: string;
    } | null;
  };
  currentUserId?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
  onBookmarkChange?: (bookmarked: boolean) => void;
}

export function IdeaCard({
  idea,
  currentUserId,
  onUpdate,
  onDelete,
  onBookmarkChange,
}: IdeaCardProps) {
  const [liked, setLiked] = useState(idea.isLiked || false);
  const [likeCount, setLikeCount] = useState(idea.likes);
  const [bookmarked, setBookmarked] = useState(idea.isBookmarked || false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = currentUserId === idea.author.username;

  const handleLike = async () => {
    try {
      if (liked) {
        // Unlike
        const response = await fetch(`/api/likes/${idea.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      } else {
        // Like
        const response = await fetch(`/api/likes/${idea.id}`, {
          method: "POST",
        });
        if (response.ok) {
          setLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/${idea.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setBookmarked(false);
          // Notify parent component
          if (onBookmarkChange) {
            onBookmarkChange(false);
          }
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
          setBookmarked(true);
          // Notify parent component
          if (onBookmarkChange) {
            onBookmarkChange(true);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/posts/${idea.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteDialogOpen(false);
        if (onDelete) {
          onDelete();
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${idea.author.username}`}>
          {idea.author.avatar && idea.author.avatar !== "/placeholder.svg" ? (
            <img
              src={idea.author.avatar}
              alt={idea.author.name}
              className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold hover:opacity-80 transition-opacity">
              {idea.author.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/profile/${idea.author.username}`}
              className="font-semibold hover:underline"
            >
              {idea.author.name}
            </Link>
            <span className="text-muted-foreground text-sm">
              @{idea.author.username}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">
              {idea.timestamp}
            </span>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {idea.project && (
            <Link
              href={`/projects/${idea.project.id}`}
              className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors group"
            >
              <Folder className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {idea.project.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {idea.project.status}
              </span>
            </Link>
          )}

          <Link href={`/idea/${idea.id}`}>
            <h3 className="text-xl font-bold mb-2 text-balance hover:text-primary transition-colors">
              {idea.title}
            </h3>
          </Link>

          <p className="text-foreground mb-4 text-pretty leading-relaxed line-clamp-3">
            {idea.content}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${
                liked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{idea.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`ml-auto ${
                bookmarked
                  ? "text-blue-500"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      <EditPostDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        post={{ id: idea.id, content: idea.content }}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </Card>
  );
}
