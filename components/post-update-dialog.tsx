"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PostUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectTitle: string
}

export function PostUpdateDialog({ open, onOpenChange, projectId, projectTitle }: PostUpdateDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Update posted:", { projectId, title, content })

    // Reset form
    setTitle("")
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Post Project Update</DialogTitle>
          <DialogDescription>
            Share progress on <span className="font-semibold text-foreground">{projectTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="update-title">Update Title</Label>
            <Input
              id="update-title"
              placeholder="What's new with your project?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-content">Details</Label>
            <Textarea
              id="update-content"
              placeholder="Describe what you've accomplished, challenges faced, or next steps..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Post Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
