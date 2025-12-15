"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { FollowingFeed } from "@/components/following-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState("all");

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="people" className="gap-2">
              <Users className="h-4 w-4" />
              People
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <FollowingFeed />
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
