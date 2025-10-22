import Link from "next/link"
import { CommunityGrid } from "@/components/communities/community-grid"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CommunityMatch } from "@/lib/types"

async function getCommunityMatches(): Promise<CommunityMatch[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/matches/communities`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const json = await response.json()
    return (json?.data as CommunityMatch[]) ?? []
  } catch (error) {
    console.error("Failed to load community matches", error)
    return []
  }
}

export default async function CommunitiesPage() {
  const matches = await getCommunityMatches()

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Communities"
        title="Find the spaces where your interests come alive"
        description="Join Slack channels and community cohorts curated for your interests. Each recommendation surfaces events, leaders, and teammates ready to welcome you."
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/matches">View people matches</Link>
          </Button>
        }
      />

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Recommended Slack channels</h2>
          <p className="text-sm text-muted-foreground">
            Communities update as you add interests or after you join new groups.
          </p>
        </div>
        <CommunityGrid matches={matches} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Badge variant="secondary" className="rounded-full bg-muted/60">
                Channel primer
              </Badge>
              What happens after you join?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>We&apos;ll notify community leads and share a short intro so you can skip the awkward hello.</p>
            <p>Channel activity—from events to open roles—feeds right back into OneMatch to refine your suggestions.</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Looking for something niche?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc space-y-2 pl-5">
              <li>Propose a new interest in your profile—we&apos;ll spin up channels as momentum grows.</li>
              <li>Invite peers directly by sharing this page or the Slack link.</li>
              <li>Drop ideas in #tdp-builders so the team can curate future experiences.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
