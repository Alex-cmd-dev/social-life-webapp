"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { UserProfile } from "@/components/user-profile";
import { UserIdeas } from "@/components/user-ideas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Folder, FileText } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchUserData = async () => {
    try {
      // Fetch user by ID (username is actually the userId in our current implementation)
      const userResponse = await fetch(`/api/users/${username}`);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }
      const userData = await userResponse.json();

      // Fetch user's posts
      const postsResponse = await fetch(`/api/posts?userId=${username}`);
      const postsData = postsResponse.ok ? await postsResponse.json() : [];

      // Fetch user's projects
      const projectsResponse = await fetch(`/api/projects?userId=${username}`);
      const projectsData = projectsResponse.ok
        ? await projectsResponse.json()
        : [];
      setUserProjects(projectsData);

      // Check if this is the current user's profile
      const owner = session?.user?.id === userData.id;
      setIsOwner(owner);

      setUser({
        id: userData.id,
        name: userData.name || "Anonymous",
        username: userData.id,
        avatar: userData.image || "/placeholder.svg",
        bio: userData.bio || "No bio yet",
        location: "",
        website: "",
        joinedDate: formatDistanceToNow(new Date(userData.createdAt), {
          addSuffix: true,
        }),
        stats: {
          ideas: userData._count?.posts || 0,
          followers: userData._count?.followers || 0,
          following: userData._count?.following || 0,
        },
        isFollowing: false,
      });

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
        timestamp: formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
        }),
      }));

      setUserPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-muted-foreground">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-8 text-destructive">
            Error: {error || "User not found"}
          </div>
        </main>
      </div>
    );
  }

  const handleProfileUpdate = () => {
    // Refetch user data after profile update
    setLoading(true);
    fetchUserData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <UserProfile
          user={user}
          isOwner={isOwner}
          onProfileUpdate={handleProfileUpdate}
        />

        <Tabs defaultValue="ideas" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ideas" className="gap-2">
              <FileText className="h-4 w-4" />
              Ideas ({userPosts.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Folder className="h-4 w-4" />
              Projects ({userProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="mt-6">
            <UserIdeas ideas={userPosts} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            {userProjects.length === 0 ? (
              <Card className="p-12 text-center">
                <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                <p className="text-muted-foreground">
                  {isOwner
                    ? "Create your first project to start tracking your ideas"
                    : "This user hasn't created any projects yet"}
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {userProjects.map((project: any) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3 mb-3">
                        <Folder className="h-6 w-6 text-purple-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg hover:text-primary transition-colors truncate">
                            {project.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary inline-block mt-1">
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {project.description}
                      </p>
                      <div className="mt-3 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
