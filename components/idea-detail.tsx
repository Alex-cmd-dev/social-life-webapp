"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, Bookmark, FolderKanban } from "lucide-react"
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
  }
  isOwner?: boolean
}

export function IdeaDetail({ idea, isOwner }: IdeaDetailProps) {
  const [isLiked, setIsLiked] = useState(idea.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(idea.isBookmarked || false)
  const [likes, setLikes] = useState(idea.likes)
  const [isFollowingProject, setIsFollowingProject] = useState(idea.isFollowingProject || false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleFollowProject = () => {
    setIsFollowingProject(!isFollowingProject)
    console.log("[v0] Project follow toggled:", !isFollowingProject)
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
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`ml-auto ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>
    </Card>
  )
}
