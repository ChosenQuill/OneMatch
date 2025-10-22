import Link from "next/link"
import { MatchesGrid } from "@/components/matches/matches-grid"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserMatch } from "@/lib/types"

async function getUserMatches(): Promise<UserMatch[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/matches/users`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const json = await response.json()
    return (json?.data as UserMatch[]) ?? []
  } catch (error) {
    console.error("Failed to load user matches", error)
    return []
  }
}

export default async function MatchesPage() {
  const matches = await getUserMatches()

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="People Matches"
        title="Schedule meaningful intros with one click"
        description="OneMatch uses interests, org context, and prior collaboration to surface teammates who can help you thrive. Follow the prompts or send a coffee chat request to get things rolling."
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/profile">Refresh profile</Link>
          </Button>
        }
      />

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Curated introductions</h2>
          <p className="text-sm text-muted-foreground">
            These top matches update whenever you refine your onboarding profile.
          </p>
        </div>
        <MatchesGrid matches={matches} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge variant="secondary" className="rounded-full bg-muted/60">
                Matching signal
              </Badge>
              How we rank people
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              We look at shared interests, org structure, recent collaborations, and participation in onboarding events to
              calculate your similarity score.
            </p>
            <p>Boost your visibility by adding more interests or joining a community—it unlocks brand-new intros.</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Next steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc space-y-2 pl-5">
              <li>Lead with a quick intro that calls out your shared interests.</li>
              <li>Suggest a 20-minute coffee chat—you can finalize details later.</li>
              <li>Share feedback with the team to keep improving match quality.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
