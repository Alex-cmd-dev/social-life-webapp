import { IdeaCard } from "@/components/idea-card"

// Mock data for demonstration
const mockIdeas = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "/placeholder.svg",
    },
    title: "AI-Powered Recipe Generator",
    content:
      "An app that generates personalized recipes based on ingredients you have at home, dietary restrictions, and cooking skill level. Uses computer vision to identify ingredients from photos.",
    tags: ["AI", "Food Tech", "Mobile App"],
    likes: 42,
    comments: 12,
    timestamp: "2h ago",
  },
  {
    id: "2",
    author: {
      name: "Marcus Johnson",
      username: "marcusj",
      avatar: "/placeholder.svg",
    },
    title: "Sustainable Fashion Marketplace",
    content:
      "A platform connecting sustainable fashion brands with conscious consumers. Features carbon footprint tracking, material transparency, and a resale marketplace for extending garment lifecycles.",
    tags: ["Sustainability", "E-commerce", "Fashion"],
    likes: 87,
    comments: 23,
    timestamp: "5h ago",
  },
  {
    id: "3",
    author: {
      name: "Alex Rivera",
      username: "alexr",
      avatar: "/placeholder.svg",
    },
    title: "Local Community Skill Exchange",
    content:
      "A neighborhood-based app where people can trade skills instead of money. Learn guitar from your neighbor while teaching them web design. Builds community and reduces costs.",
    tags: ["Community", "Education", "Social Impact"],
    likes: 156,
    comments: 34,
    timestamp: "1d ago",
  },
]

export function IdeaFeed() {
  return (
    <div className="space-y-6">
      {mockIdeas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  )
}
