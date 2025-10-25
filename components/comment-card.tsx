"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CommentCardProps {
  comment: {
    id: string
    author: {
      name: string
      username: string
      avatar: string
    }
    content: string
    timestamp: string
    likes: number
  }
}

export function CommentCard({ comment }: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(comment.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${comment.author.username}`}>
          <Image
            src={comment.author.avatar || "/placeholder.svg"}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/profile/${comment.author.username}`} className="font-semibold hover:underline">
              {comment.author.name}
            </Link>
            <span className="text-muted-foreground text-sm">@{comment.author.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{comment.timestamp}</span>
          </div>

          <p className="text-foreground mb-3 text-pretty leading-relaxed">{comment.content}</p>

          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 -ml-2 ${isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm">{likes}</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
