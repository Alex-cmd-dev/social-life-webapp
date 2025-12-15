"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id: string;
    content: string;
  };
  onSuccess?: () => void;
}

export function EditPostDialog({
  open,
  onOpenChange,
  post,
  onSuccess,
}: EditPostDialogProps) {
  // Parse the content to extract title and description
  const parseContent = (content: string) => {
    // Remove tags line if present
    const cleanContent = content.replace(/#tags:\s*.+$/m, "").trim();
    const lines = cleanContent.split("\n");
    const title = lines[0] || "";
    const description = lines.slice(1).join("\n").trim();
    return { title, description };
  };

  const { title: initialTitle, description: initialDescription } = parseContent(post.content);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update title and description when post changes
  useEffect(() => {
    const { title: newTitle, description: newDescription } = parseContent(post.content);
    setTitle(newTitle);
    setDescription(newDescription);
  }, [post.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    if (!description.trim()) {
      setError("Description cannot be empty");
      return;
    }

    setLoading(true);

    try {
      // Parse tags from original content to preserve them
      const tagsMatch = post.content.match(/#tags:\s*(.+)$/m);
      const tagsLine = tagsMatch ? `\n\n${tagsMatch[0]}` : "";

      // Combine title and description
      const fullContent = `${title}\n${description}${tagsLine}`;

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: fullContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post. Your changes will be visible
              immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your idea a catchy title..."
                required
                className="text-lg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your idea in detail..."
                rows={6}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
