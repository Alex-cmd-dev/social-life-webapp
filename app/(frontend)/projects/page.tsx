"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { 
  Folder, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  ExternalLink,
  Github,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const statusEmojis: Record<string, string> = {
  IDEA: "💡",
  PLANNING: "📋",
  IN_PROGRESS: "🚧",
  COMPLETED: "✅",
  ON_HOLD: "⏸️",
  CANCELLED: "❌",
}

const statusColors: Record<string, string> = {
  IDEA: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PLANNING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  ON_HOLD: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("my-projects")

  useEffect(() => {
    if (session?.user?.id) {
      fetchProjects()
    }
  }, [session?.user?.id, activeTab])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const url = activeTab === "my-projects" 
        ? `/api/projects?userId=${session?.user?.id}`
        : `/api/projectfollows`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (activeTab === "following") {
        // Extract projects from follows
        setProjects(data.map((follow: any) => follow.project))
      } else {
        setProjects(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject: any) => {
    setProjects([newProject, ...projects])
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      return
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectId))
      } else {
        alert("Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and track their progress
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <Card className="p-12 text-center">
                <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first project to start tracking your ideas
                </p>
                <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Folder className="h-6 w-6 text-purple-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link href={`/projects/${project.id}`}>
                            <h3 className="font-bold text-lg hover:text-primary transition-colors truncate">
                              {project.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[project.status]}`}>
                              {statusEmojis[project.status]} {project.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {activeTab === "my-projects" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${project.id}/edit`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                      </div>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <Card className="p-12 text-center">
                <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Not following any projects</h2>
                <p className="text-muted-foreground">
                  Discover and follow projects to see them here
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-4">
                      <Folder className="h-6 w-6 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/projects/${project.id}`}>
                          <h3 className="font-bold text-lg hover:text-primary transition-colors truncate">
                            {project.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by {project.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[project.status]}`}>
                            {statusEmojis[project.status]} {project.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
}

