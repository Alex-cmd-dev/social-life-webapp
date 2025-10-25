"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CommentCard } from "./comment-card"

interface CommentSectionProps {
  ideaId: string
}

export function CommentSection({ ideaId }: CommentSectionProps) {
  const [comment, setComment] = useState("")

  // Mock comments data
  const comments = [
    {
      id: "1",
      author: {
        name: "Alex Rivera",
        username: "alexrivera",
        avatar: "/man-avatar.png",
      },
      content:
        "This is a fantastic idea! I've been looking for something like this. Have you considered integrating with popular IDEs like VS Code?",
      timestamp: "1h ago",
      likes: 12,
    },
    {
      id: "2",
      author: {
        name: "Jordan Kim",
        username: "jordankim",
        avatar: "/diverse-person-avatars.png",
      },
      content:
        "Love the concept! One suggestion: maybe add a feature to compare code quality metrics over time so teams can track improvement.",
      timestamp: "45m ago",
      likes: 8,
    },
    {
      id: "3",
      author: {
        name: "Taylor Morgan",
        username: "taylormorgan",
        avatar: "/diverse-woman-avatar.png",
      },
      content: "Would this work with different programming languages? Our team uses Python, JavaScript, and Go.",
      timestamp: "30m ago",
      likes: 5,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Comment submitted:", comment)
    setComment("")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Share your thoughts on this idea..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mb-4 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!comment.trim()} className="bg-primary hover:bg-primary/90">
              Post Comment
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
