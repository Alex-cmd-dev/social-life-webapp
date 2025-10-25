import { Header } from "@/components/header"
import { IdeaFeed } from "@/components/idea-feed"
import { CreateIdeaButton } from "@/components/create-idea-button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-balance">Share your ideas with the world</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Post your ideas, get feedback, and follow inspiring projects and creators.
          </p>
        </div>

        <CreateIdeaButton />

        <IdeaFeed />
      </main>
    </div>
  )
}
