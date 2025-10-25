import { useState } from "react"
import { Header } from "@/components/header"
import { IdeaDetail } from "@/components/idea-detail"
import { CommentSection } from "@/components/comment-section"
import { ProjectRoadmap } from "@/components/project-roadmap"
import { PostUpdateDialog } from "@/components/post-update-dialog"

export default function IdeaPage({ params }: { params: { id: string } }) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  const idea = {
    id: params.id,
    author: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "/diverse-woman-avatar.png",
    },
    title: "AI-Powered Code Review Assistant",
    content:
      "I've been thinking about building an AI assistant that helps developers with code reviews. It would analyze pull requests, suggest improvements, catch common bugs, and even learn from your team's coding standards over time. The goal is to make code reviews faster and more consistent while helping junior developers learn best practices.",
    tags: ["AI", "Developer Tools", "Productivity"],
    likes: 234,
    comments: 18,
    timestamp: "2h ago",
    isLiked: false,
    isBookmarked: false,
    isProject: true,
    isFollowingProject: false,
  }

  // Mock data for project roadmap
  const roadmapUpdates = [
    {
      id: "1",
      title: "AI-Powered Code Review Assistant",
      content:
        "I've been thinking about building an AI assistant that helps developers with code reviews. It would analyze pull requests, suggest improvements, catch common bugs, and even learn from your team's coding standards over time.",
      author: idea.author,
      timestamp: "2 weeks ago",
      isInitial: true,
    },
    {
      id: "2",
      title: "Completed Initial Prototype",
      content:
        "Built the first working version! It can now analyze JavaScript and TypeScript code, detect common issues, and suggest improvements. Testing it with a few small projects to gather feedback.",
      author: idea.author,
      timestamp: "1 week ago",
    },
    {
      id: "3",
      title: "Added Team Learning Feature",
      content:
        "Implemented the ability for the AI to learn from your team's past code reviews. It now adapts to your coding standards and preferences over time. This was one of the most requested features!",
      author: idea.author,
      timestamp: "3 days ago",
    },
  ]

  // Mock: Check if current user is the owner
  const isOwner = true

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <IdeaDetail idea={idea} isOwner={isOwner} />

        {idea.isProject && (
          <ProjectRoadmap
            projectId={idea.id}
            projectTitle={idea.title}
            updates={roadmapUpdates}
            isOwner={isOwner}
            onAddUpdate={() => setUpdateDialogOpen(true)}
          />
        )}

        <CommentSection ideaId={params.id} />

        <PostUpdateDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          projectId={idea.id}
          projectTitle={idea.title}
        />
      </main>
    </div>
  )
}
