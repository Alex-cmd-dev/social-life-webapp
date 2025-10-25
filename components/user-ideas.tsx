import { IdeaCard } from "./idea-card"

interface UserIdeasProps {
  ideas: Array<{
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
  }>
}

export function UserIdeas({ ideas }: UserIdeasProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ideas</h2>
      <div className="space-y-4">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  )
}
