"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"
import { UserIdeas } from "@/components/user-ideas"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user by ID (username is actually the userId in our current implementation)
        const userResponse = await fetch(`/api/users/${params.username}`)
        if (!userResponse.ok) {
          throw new Error("User not found")
        }
        const userData = await userResponse.json()

        // Fetch user's posts
        const postsResponse = await fetch(`/api/posts?userId=${params.username}`)
        const postsData = postsResponse.ok ? await postsResponse.json() : []

        setUser({
          name: userData.name || "Anonymous",
          username: userData.id,
          avatar: userData.image || "/placeholder.svg",
          bio: userData.bio || "No bio yet",
          location: "",
          website: "",
          joinedDate: formatDistanceToNow(new Date(userData.createdAt), { addSuffix: true }),
          stats: {
            ideas: userData._count?.posts || 0,
            followers: userData._count?.followers || 0,
            following: userData._count?.following || 0,
          },
          isFollowing: false,
        })

        const formattedPosts = postsData.map((post: any) => ({
          id: post.id,
          author: {
            name: userData.name || "Anonymous",
            username: userData.id,
            avatar: userData.image || "/placeholder.svg",
          },
          title: post.content.split("\n")[0].substring(0, 100),
          content: post.content,
          tags: [],
          likes: post._count?.likes || 0,
          comments: post._count?.comments || 0,
          timestamp: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
        }))

        setUserPosts(formattedPosts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.username])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-muted-foreground">Loading profile...</div>
        </main>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-destructive">Error: {error || "User not found"}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <UserProfile user={user} />
        <UserIdeas ideas={userPosts} />
      </main>
    </div>
  )
}
