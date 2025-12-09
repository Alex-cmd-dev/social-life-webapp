"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { IdeaCard } from "@/components/idea-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Folder, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function SearchPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim()) {
      handleSearch();
    }
  }, [query, activeTab]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      if (activeTab === "posts") {
        const res = await fetch(
          `/api/posts?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } else if (activeTab === "users") {
        const res = await fetch(
          `/api/users?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === "projects") {
        const res = await fetch(
          `/api/projects?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform posts to idea card format
  const ideas = posts.map((post: any) => {
    const tagsMatch = post.content.match(/#tags:\s*(.+)$/m);
    const tags = tagsMatch
      ? tagsMatch[1].split(",").map((t: string) => t.trim())
      : [];
    const cleanContent = post.content.replace(/#tags:\s*.+$/m, "").trim();

    return {
      id: post.id,
      author: {
        name: post.user.name || "Anonymous",
        username: post.user.id,
        avatar: post.user.image || "/placeholder.svg",
      },
      title: cleanContent.split("\n")[0].substring(0, 100),
      content: cleanContent,
      tags: tags,
      likes: post._count?.likes || 0,
      comments: post._count?.comments || 0,
      timestamp: formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      }),
      isLiked:
        post.likes?.some((like: any) => like.userId === session?.user?.id) ||
        false,
      isBookmarked:
        post.bookmarks?.some(
          (bookmark: any) => bookmark.userId === session?.user?.id
        ) || false,
      project: post.project,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Search</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for posts, users, or projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="posts" className="gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Folder className="h-4 w-4" />
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No posts found</h2>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  currentUserId={session?.user?.id}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No users found</h2>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              users.map((user) => (
                <Link key={user.id} href={`/profile/${user.id}`}>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {user.name || "Anonymous"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @{user.username || user.id}
                        </p>
                        {user.bio && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">
                  No projects found
                </h2>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Folder className="h-5 w-5 text-purple-500" />
                          <h3 className="font-bold text-lg">{project.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>by {project.user.name || "Anonymous"}</span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(project.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
