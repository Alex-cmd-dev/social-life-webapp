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
            <div className="text-center py-12 text-muted-foreground">
              <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No projects yet</p>
              <p className="text-sm mt-2">Follow projects to see their updates here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
