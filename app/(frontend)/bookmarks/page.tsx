"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { IdeaCard } from "@/components/idea-card"
import { formatDistanceToNow } from "date-fns"
import { Bookmark } from "lucide-react"

export default function BookmarksPage() {
  const { data: session, status } = useSession()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookmarks()
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [status])

  async function fetchBookmarks() {
    try {
      const response = await fetch("/api/bookmarks")
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks")
      }
      const data = await response.json()
      setBookmarks(data.bookmarks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-muted-foreground">Loading bookmarks...</div>
        </main>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view bookmarks</h2>
            <p className="text-muted-foreground">You need to be signed in to save and view bookmarked posts.</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-destructive">Error: {error}</div>
        </main>
      </div>
    )
  }

  // Transform bookmarks to idea card format
  const ideas = bookmarks.map((bookmark: any) => {
    // Parse tags from content
    const tagsMatch = bookmark.post.content.match(/#tags:\s*(.+)$/m)
    const tags = tagsMatch ? tagsMatch[1].split(',').map((t: string) => t.trim()) : []
    
    // Remove tags line from content
    const cleanContent = bookmark.post.content.replace(/#tags:\s*.+$/m, '').trim()
    
    return {
      id: bookmark.post.id,
      author: {
        name: bookmark.post.user.name || "Anonymous",
        username: bookmark.post.user.username || bookmark.post.user.id,
        avatar: bookmark.post.user.image || "/placeholder.svg",
      },
      title: cleanContent.split("\n")[0].substring(0, 100),
      content: cleanContent,
      tags: tags,
      likes: bookmark.post._count?.likes || 0,
      comments: bookmark.post._count?.comments || 0,
      timestamp: formatDistanceToNow(new Date(bookmark.post.createdAt), { addSuffix: true }),
      isBookmarked: true, // Always true on bookmarks page
      project: bookmark.post.project,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Your Bookmarks</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Posts you've saved for later
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground">
              Start bookmarking posts you want to save for later!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea, index) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                currentUserId={session?.user?.id}
                onUpdate={() => {
                  setLoading(true);
                  fetchBookmarks();
                }}
                onDelete={() => {
                  setBookmarks(bookmarks.filter(b => b.post.id !== idea.id));
                }}
                onBookmarkChange={(isBookmarked) => {
                  if (!isBookmarked) {
                    // Remove from bookmarks list immediately when unbookmarked
                    setBookmarks(bookmarks.filter(b => b.post.id !== idea.id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

