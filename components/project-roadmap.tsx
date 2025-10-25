import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RoadmapUpdate {
  id: string
  title: string
  content: string
  author: {
    name: string
    username: string
    avatar: string
  }
  timestamp: string
  isInitial?: boolean
}

interface ProjectRoadmapProps {
  projectId: string
  projectTitle: string
  updates: RoadmapUpdate[]
  isOwner?: boolean
  onAddUpdate?: () => void
}

export function ProjectRoadmap({ projectId, projectTitle, updates, isOwner, onAddUpdate }: ProjectRoadmapProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Project Roadmap</h2>
          <p className="text-muted-foreground">Track the progress and evolution of this project</p>
        </div>
        {isOwner && (
          <Button onClick={onAddUpdate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Update
          </Button>
        )}
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {updates.map((update, index) => (
            <div key={update.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                {update.isInitial ? (
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <Circle className="h-5 w-5 text-primary fill-primary" />
                  </div>
                )}
              </div>

              {/* Update content */}
              <div className="flex-1 pb-8">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <Link href={`/profile/${update.author.username}`}>
                      <Image
                        src={update.author.avatar || "/placeholder.svg"}
                        alt={update.author.name}
                        width={32}
                        height={32}
                        className="rounded-full hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/profile/${update.author.username}`} className="font-semibold hover:underline">
                          {update.author.name}
                        </Link>
                        <span className="text-muted-foreground text-sm">@{update.author.username}</span>
                        {update.isInitial && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            Initial Post
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">{update.timestamp}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{update.title}</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{update.content}</p>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
