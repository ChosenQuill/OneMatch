import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CommunityMatch } from "@/lib/types"
import { Users } from "lucide-react"

interface CommunityCardProps {
  match: CommunityMatch
  onJoin?: (communityId: string) => void
}

export function CommunityCard({ match, onJoin }: CommunityCardProps) {
  return (
    <Card className="h-full border-border/70 bg-card/80 backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">{match.community.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{match.community.slackChannel}</p>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary">
            {(match.matchScore * 100).toFixed(0)}% match
          </Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{match.community.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {match.matchingInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary" onClick={() => onJoin?.(match.community.communityId)}>
          <Users className="mr-2 h-4 w-4" /> Join community
        </Button>
      </CardFooter>
    </Card>
  )
}
