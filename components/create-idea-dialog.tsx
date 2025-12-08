"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface CreateIdeaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateIdeaDialog({ open, onOpenChange }: CreateIdeaDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isProject, setIsProject] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const fullContent = `${title}\n\n${content}${tags.length > 0 ? `\n\nTags: ${tags.join(", ")}` : ""}`

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: fullContent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      // Reset form on success
      setTitle("")
      setContent("")
      setTags([])
      setTagInput("")
      setIsProject(false)
      onOpenChange(false)

      // Refresh the page to show the new post
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Share Your Idea</DialogTitle>
          <DialogDescription>Tell the community about your idea and get valuable feedback</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your idea a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              placeholder="Describe your idea in detail. What problem does it solve? What makes it unique?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag (e.g., tech, design, startup)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium flex items-center gap-2"
                  >
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isProject"
              checked={isProject}
              onCheckedChange={(checked) => setIsProject(checked === true)}
            />
            <Label htmlFor="isProject" className="text-sm font-normal cursor-pointer">
              Mark as project (enables roadmap and progress tracking)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Idea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
