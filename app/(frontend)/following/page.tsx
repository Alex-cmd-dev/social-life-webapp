"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { IdeaFeed } from "@/components/idea-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for followed projects
  const followedProjects = [
    {
      id: "1",
      title: "AI-Powered Code Review Assistant",
      author: {
        name: "Sarah Chen",
        username: "sarahchen",
        avatar: "/diverse-woman-avatar.png",
      },
      description: "Building an AI assistant for better code reviews",
      followers: 156,
      updates: 3,
      lastUpdated: "2 days ago", // Added last updated date
    },
    {
      id: "2",
      title: "Sustainable Fashion Marketplace",
      author: {
        name: "Marcus Johnson",
        username: "marcusj",
        avatar: "/man-avatar.png",
      },
      description: "Connecting eco-conscious consumers with sustainable brands",
      followers: 89,
      updates: 5,
      lastUpdated: "1 week ago", // Added last updated date
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-balance">Following</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            See the latest from people and projects you follow.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="people" className="gap-2">
              <Users className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <IdeaFeed />
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <IdeaFeed />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Followed Projects</h2>
              {followedProjects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Link href={`/profile/${project.author.username}`}>
                      <Image
                        src={project.author.avatar || "/placeholder.svg"}
                        alt={project.author.name}
                        width={48}
                        height={48}
                        className="rounded-full hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium flex items-center gap-1">
                          <FolderKanban className="h-3 w-3" />
                          Project
                        </span>
                      </div>

                      <Link href={`/idea/${project.id}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{project.title}</h3>
                      </Link>

                      <p className="text-muted-foreground mb-3">{project.description}</p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span>by</span>
                        <Link href={`/profile/${project.author.username}`} className="font-semibold hover:underline">
                          {project.author.name}
                        </Link>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{project.followers}</span> followers
                        </span>
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{project.updates}</span> updates
                        </span>
                        <span className="text-muted-foreground">
                          Last updated <span className="font-semibold text-foreground">{project.lastUpdated}</span>
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" asChild>
                      <Link href={`/idea/${project.id}`}>View Roadmap</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
