"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, LinkIcon, Calendar, UserPlus, UserCheck } from "lucide-react"
import Image from "next/image"

interface UserProfileProps {
  user: {
    name: string
    username: string
    avatar: string
    bio: string
    location?: string
    website?: string
    joinedDate: string
    stats: {
      ideas: number
      followers: number
      following: number
    }
    isFollowing: boolean
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [followers, setFollowers] = useState(user.stats.followers)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setFollowers(isFollowing ? followers - 1 : followers + 1)
  }

  return (
    <Card className="p-8 mb-8">
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <Image
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-full"
        />

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground text-lg">@{user.username}</p>
            </div>

            <Button
              onClick={handleFollow}
              className={
                isFollowing
                  ? "bg-background border border-primary text-primary hover:bg-primary/10"
                  : "bg-primary hover:bg-primary/90"
              }
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          </div>

          <p className="text-foreground mb-4 text-pretty leading-relaxed">{user.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a href={`https://${user.website}`} className="hover:text-primary transition-colors">
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {user.joinedDate}</span>
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <span className="font-bold text-foreground">{user.stats.ideas}</span>
              <span className="text-muted-foreground ml-1">Ideas</span>
            </div>
            <button className="hover:underline">
              <span className="font-bold text-foreground">{followers}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-foreground">{user.stats.following}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
