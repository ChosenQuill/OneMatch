"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CommunityMatch } from "@/lib/types"
import { Loader2, Users } from "lucide-react"

interface CommunityCardProps {
  match: CommunityMatch
  onJoin?: (communityId: string) => void
  isProcessing?: boolean
}

export function CommunityCard({ match, onJoin, isProcessing }: CommunityCardProps) {
  const canJoin = typeof onJoin === "function"
  return (
    <Card className="group relative h-full overflow-hidden border border-border/70 bg-card/85 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader className="relative space-y-3">
        <Badge className="w-fit rounded-full bg-primary/10 text-primary">{(match.matchScore * 100).toFixed(0)}% match</Badge>
        <CardTitle className="text-lg font-semibold text-foreground">{match.community.name}</CardTitle>
        <CardDescription>{match.community.description}</CardDescription>
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Slack: {match.community.slackChannel}
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4 px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {match.matchingInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
              {interest}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            variant="secondary"
            disabled={isProcessing || !canJoin}
            onClick={() => onJoin?.(match.community.communityId)}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining…
              </>
            ) : !canJoin ? (
              <>Log in to join</>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" /> Join community
              </>
            )}
          </Button>
          <Button asChild variant="ghost" className="flex-1">
            <Link href="/communities">View details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
