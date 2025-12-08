"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CommentCard } from "./comment-card"
import { formatDistanceToNow } from "date-fns"

interface CommentSectionProps {
  ideaId: string
}

export function CommentSection({ ideaId }: CommentSectionProps) {
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [ideaId])

  async function fetchComments() {
    try {
      const response = await fetch(`/api/comments?postId=${ideaId}`)
      if (response.ok) {
        const data = await response.json()
        const formattedComments = data.map((c: any) => ({
          id: c.id,
          author: {
            name: c.user.name || "Anonymous",
            username: c.user.id,
            avatar: c.user.image || "/placeholder.svg",
          },
          content: c.content,
          timestamp: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }),
          likes: 0,
        }))
        setComments(formattedComments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: ideaId,
          content: comment,
        }),
      })

      if (response.ok) {
        setComment("")
        await fetchComments()
      } else {
        console.error("Failed to post comment")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
      </div>
    )
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
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!comment.trim() || submitting}
              className="bg-gradient-to-br from-purple-600 to-pink-600"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}
