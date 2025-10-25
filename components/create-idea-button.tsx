"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { CreateIdeaDialog } from "./create-idea-dialog"

export function CreateIdeaButton() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Got an idea?</h3>
            <p className="text-sm text-muted-foreground">Share it with the community and get valuable feedback</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
            Post Idea
          </Button>
        </div>
      </Card>

      <CreateIdeaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
