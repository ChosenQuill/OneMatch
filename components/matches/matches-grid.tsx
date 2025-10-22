"use client"

import { useEffect, useState } from "react"
import { MatchCard } from "@/components/dashboard/match-card"
import { Card, CardContent } from "@/components/ui/card"
import { postScheduleChat } from "@/lib/frontend-api"
import type { UserMatch } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MatchesGridProps {
  matches: UserMatch[]
}

export function MatchesGrid({ matches }: MatchesGridProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!feedback && !error) return
    const timeout = setTimeout(() => {
      setFeedback(null)
      setError(null)
    }, 3500)
    return () => clearTimeout(timeout)
  }, [feedback, error])

  async function handleScheduleChat(userId: string) {
    if (pendingId) return
    setPendingId(userId)
    setError(null)

    try {
      const message = await postScheduleChat(userId)
      setFeedback(message)
    } catch (err) {
      console.error("Failed to schedule chat", err)
      setError("Unable to schedule chat right now. Please retry.")
    } finally {
      setPendingId(null)
    }
  }

  if (matches.length === 0) {
    return (
      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-lg font-semibold text-foreground">No matches yet</p>
          <p className="text-sm text-muted-foreground">
            Complete your onboarding profile to unlock curated matches in minutes.
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
            "rounded-full border px-5 py-3 text-sm shadow-sm backdrop-blur",
            feedback
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          )}
        >
          {feedback ?? error}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <MatchCard
            key={match.user.userId}
            match={match}
            onScheduleChat={handleScheduleChat}
            isProcessing={pendingId === match.user.userId}
          />
        ))}
      </div>
    </div>
  )
}
