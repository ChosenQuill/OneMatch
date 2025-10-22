"use client"

import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserMatch } from "@/lib/types"
import { Coffee, Loader2 } from "lucide-react"

interface MatchCardProps {
  match: UserMatch
  onScheduleChat?: (userId: string) => void
  isProcessing?: boolean
}

export function MatchCard({ match, onScheduleChat, isProcessing }: MatchCardProps) {
  const { user } = match
  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const canSchedule = typeof onScheduleChat === "function"

  return (
    <Card className="group relative h-full overflow-hidden border border-border/70 bg-card/85 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <CardContent className="relative space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar src={user.profilePhotoUrl ?? undefined} fallback={initials} className="h-12 w-12" />
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">{user.fullName}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <p className="text-xs text-muted-foreground/80">
                {user.org} · {user.location}
              </p>
            </div>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary">
            {(match.matchScore * 100).toFixed(0)}% match
          </Badge>
        </div>

        <div className="space-y-2 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Why you pair well</p>
          <p className="leading-6 text-foreground/80">{match.context}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {match.commonInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            disabled={isProcessing || !canSchedule}
            onClick={() => onScheduleChat?.(user.userId)}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suggesting…
              </>
            ) : !canSchedule ? (
              <>Log in to schedule</>
            ) : (
              <>
                <Coffee className="mr-2 h-4 w-4" /> Suggest coffee chat
              </>
            )}
          </Button>
          <Button asChild variant="ghost" className="flex-1">
            <Link href="/matches">View in matches</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
