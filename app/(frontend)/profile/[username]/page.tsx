import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"
import { UserIdeas } from "@/components/user-ideas"

export default function ProfilePage({ params }: { params: { username: string } }) {
  // Mock user data - will be replaced with real data from backend
  const user = {
    name: "Sarah Chen",
    username: params.username,
    avatar: "/diverse-woman-avatar.png",
    bio: "Product designer & entrepreneur. Building tools to help developers work smarter. Always exploring new ideas in AI and productivity.",
    location: "San Francisco, CA",
    website: "sarahchen.com",
    joinedDate: "January 2024",
    stats: {
      ideas: 24,
      followers: 1234,
      following: 567,
    },
    isFollowing: false,
  }

  // Mock user's ideas
  const userIdeas = [
    {
      id: "1",
      author: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      title: "AI-Powered Code Review Assistant",
      content:
        "I've been thinking about building an AI assistant that helps developers with code reviews. It would analyze pull requests, suggest improvements, catch common bugs, and even learn from your team's coding standards over time.",
      tags: ["AI", "Developer Tools", "Productivity"],
      likes: 234,
      comments: 18,
      timestamp: "2h ago",
    },
    {
      id: "2",
      author: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      title: "Collaborative Design System Builder",
      content:
        "What if teams could build and maintain design systems together in real-time? Thinking about a tool that makes it easy to create, document, and share design components across organizations.",
      tags: ["Design", "Collaboration", "Tools"],
      likes: 189,
      comments: 12,
      timestamp: "1d ago",
    },
    {
      id: "3",
      author: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      title: "Smart Meeting Scheduler with Time Zone Intelligence",
      content:
        "Scheduling meetings across time zones is painful. I want to build a scheduler that understands everyone's working hours, preferences, and automatically finds the best times for everyone.",
      tags: ["Productivity", "SaaS", "Remote Work"],
      likes: 156,
      comments: 9,
      timestamp: "3d ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <UserProfile user={user} />
        <UserIdeas ideas={userIdeas} />
      </main>
    </div>
  )
}
