import Link from "next/link"
import { redirect } from "next/navigation"
import { CommunityGrid } from "@/components/communities/community-grid"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchFromApi, isOnboardingCompleteFromCookies } from "@/lib/server-api"
import { isProfileComplete } from "@/lib/profile"
import type { CommunityMatch, UserProfile } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetchFromApi("/api/users/me/profile")
    if (!response.ok) {
      return null
    }
    const json = await response.json()
    return (json?.data as UserProfile) ?? null
  } catch (error) {
    console.error("Failed to load profile for communities page", error)
    return null
  }
}

async function getCommunityMatches(): Promise<CommunityMatch[]> {
  try {
    const response = await fetchFromApi("/api/matches/communities")
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
  const profile = await getProfile()

  if (!(await isOnboardingCompleteFromCookies()) || !profile || !isProfileComplete(profile)) {
    redirect("/onboarding")
  }

  const matches = await getCommunityMatches()
  const featuredCommunity = matches[0] ?? null

  const interestSet = new Set<string>()
  matches.forEach((match) => match.matchingInterests.forEach((interest) => interestSet.add(interest)))
  const slackChannels = new Set(matches.map((match) => match.community.slackChannel))

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Communities"
        title="Plug into Plano-based cohorts that match your interests"
        description="Each recommendation includes the Slack channel, shared interests, and a quick blurb so you know exactly why it matters."
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/matches">View people matches</Link>
          </Button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)]">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="secondary" className="w-fit rounded-full bg-primary/10 text-primary">
              Featured community
            </Badge>
            <CardTitle className="text-2xl font-semibold text-foreground">
              {featuredCommunity ? featuredCommunity.community.name : "Communities unlock after onboarding"}
            </CardTitle>
            <CardDescription>
              {featuredCommunity
                ? featuredCommunity.community.description
                : "Tell us what you care about and we&apos;ll surface Plano-based groups ready to welcome you."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredCommunity ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Slack channel</p>
                  <p>{featuredCommunity.community.slackChannel}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featuredCommunity.matchingInterests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href="#community-list">Jump to recommendations</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/network">See members on the graph</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete onboarding and add a few interests to unlock your top community recommendation.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Community insights</CardTitle>
            <CardDescription>Where your matches are spending their time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Total recommendations</p>
                <p>{matches.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Slack channels</p>
                <p>{slackChannels.size}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Shared interests</p>
                <p>{interestSet.size}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Join rate goal</p>
                <p>2 communities this month</p>
              </div>
            </div>
            <p>
              Join at least one community tied to your top interests this week to keep new introductions flowing without extra effort.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="community-list" className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Tailored communities</h2>
          <p className="text-sm text-muted-foreground">
            Join a channel and we&apos;ll instantly update your matches, prompts, and network graph.
          </p>
        </div>
        {matches.length === 0 ? (
          <Card className="border-border/70 bg-card/80 backdrop-blur">
            <CardContent className="space-y-4 p-8 text-center text-sm text-muted-foreground">
              <p>No community recommendations yet.</p>
              <p>Share a few interests or goals and we&apos;ll queue up Plano-based communities for you.</p>
            </CardContent>
          </Card>
        ) : (
          <CommunityGrid matches={matches} />
        )}
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
