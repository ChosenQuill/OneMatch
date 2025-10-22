"use client"

import { useEffect, useState } from "react"
import { CommunityCard } from "@/components/dashboard/community-card"
import { Card, CardContent } from "@/components/ui/card"
import { postJoinCommunity } from "@/lib/frontend-api"
import type { CommunityMatch } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CommunityGridProps {
  matches: CommunityMatch[]
}

export function CommunityGrid({ matches }: CommunityGridProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ message: string; slackUrl?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!feedback && !error) return
    const timeout = setTimeout(() => {
      setFeedback(null)
      setError(null)
    }, 3500)
    return () => clearTimeout(timeout)
  }, [feedback, error])

  async function handleJoin(communityId: string) {
    if (pendingId) return
    setPendingId(communityId)
    setError(null)

    try {
      const result = await postJoinCommunity(communityId)
      setFeedback(result)
    } catch (err) {
      console.error("Failed to join community", err)
      setError("Unable to join that community right now. Please retry.")
    } finally {
      setPendingId(null)
    }
  }

  if (matches.length === 0) {
    return (
      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-lg font-semibold text-foreground">Communities coming soon</p>
          <p className="text-sm text-muted-foreground">
            As more people fill out their profiles, we&apos;ll highlight communities that match your interests.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {(feedback || error) && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-3 rounded-full border px-5 py-3 text-sm shadow-sm backdrop-blur",
            feedback
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          )}
        >
          <span>{feedback?.message ?? error}</span>
          {feedback?.slackUrl && (
            <a href={feedback.slackUrl} className="font-semibold text-primary underline-offset-2 hover:underline">
              Open Slack
            </a>
          )}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <CommunityCard
            key={match.community.communityId}
            match={match}
            onJoin={handleJoin}
            isProcessing={pendingId === match.community.communityId}
          />
        ))}
      </div>
    </div>
  )
}
