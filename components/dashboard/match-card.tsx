import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserMatch } from "@/lib/types"
import { Coffee, Loader2, Send } from "lucide-react"

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

  return (
    <Card className="h-full border-border/70 bg-card/80 backdrop-blur">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar src={user.profilePhotoUrl ?? undefined} fallback={initials} />
        <div>
          <CardTitle className="text-lg font-semibold">{user.fullName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {user.role} · {user.org}
          </p>
        </div>
        <Badge className="ml-auto rounded-full bg-primary/10 text-primary">
          {(match.matchScore * 100).toFixed(0)}% match
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Why we matched you</p>
          <p className="text-sm leading-6 text-foreground/80">{match.context}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {match.commonInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
              {interest}
            </Badge>
          ))}
        </div>
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
          <p>
            {user.location} · {user.org}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" disabled={isProcessing} onClick={() => onScheduleChat?.(user.userId)}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working...
            </>
          ) : (
            <>
              <Coffee className="mr-2 h-4 w-4" /> Suggest coffee chat
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="flex-1"
          disabled={isProcessing}
          onClick={() => onScheduleChat?.(user.userId)}
        >
          <Send className="mr-2 h-4 w-4" /> Message intro
        </Button>
      </CardFooter>
    </Card>
  )
}
