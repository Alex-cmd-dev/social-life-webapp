import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface IdeaCardProps {
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
  }
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${idea.author.username}`}>
          <Image
            src={idea.author.avatar || "/placeholder.svg"}
            alt={idea.author.name}
            width={40}
            height={40}
            className="rounded-full hover:opacity-80 transition-opacity"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/profile/${idea.author.username}`} className="font-semibold hover:underline">
              {idea.author.name}
            </Link>
            <span className="text-muted-foreground text-sm">@{idea.author.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{idea.timestamp}</span>
          </div>

          <Link href={`/idea/${idea.id}`}>
            <h3 className="text-xl font-bold mb-2 text-balance hover:text-primary transition-colors">{idea.title}</h3>
          </Link>

          <p className="text-foreground mb-4 text-pretty leading-relaxed line-clamp-3">{idea.content}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Heart className="h-4 w-4" />
              <span>{idea.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              <span>{idea.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground hover:text-primary">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
