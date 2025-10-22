import Link from "next/link"
import { redirect } from "next/navigation"
import { MatchesGrid } from "@/components/matches/matches-grid"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchFromApi, isOnboardingCompleteFromCookies } from "@/lib/server-api"
import { isProfileComplete } from "@/lib/profile"
import type { UserMatch, UserProfile } from "@/lib/types"

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
    console.error("Failed to load profile for matches page", error)
    return null
  }
}

async function getUserMatches(): Promise<UserMatch[]> {
  try {
    const response = await fetchFromApi("/api/matches/users")
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
  const profile = await getProfile()

  if (!(await isOnboardingCompleteFromCookies()) || !profile || !isProfileComplete(profile)) {
    redirect("/onboarding")
  }

  const matches = await getUserMatches()
  const featuredMatch = matches[0] ?? null
  const remainingMatches = featuredMatch ? matches.slice(1) : []

  const interestSet = new Set<string>()
  matches.forEach((match) => match.commonInterests.forEach((interest) => interestSet.add(interest)))
  const orgSet = new Set(matches.map((match) => match.user.org))
  const locationSet = new Set(matches.map((match) => match.user.location))

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="People Matches"
        title="Find the teammates who will accelerate your ramp-up"
        description="Every introduction is tuned to your Plano location, interests, and org context. Start with the featured match below or explore the full list."
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/profile">Refresh profile</Link>
          </Button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)]">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="secondary" className="w-fit rounded-full bg-primary/10 text-primary">
              Featured match
            </Badge>
            <CardTitle className="text-2xl font-semibold text-foreground">
              {featuredMatch ? featuredMatch.user.fullName : "Matches unlock after onboarding"}
            </CardTitle>
            <CardDescription>
              {featuredMatch
                ? featuredMatch.context
                : "Add your interests and location to start receiving curated intros."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredMatch ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Shared interests</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {featuredMatch.commonInterests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                    <p className="font-semibold text-foreground">Role</p>
                    <p>
                      {featuredMatch.user.role} · {featuredMatch.user.org}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                    <p className="font-semibold text-foreground">Location</p>
                    <p>{featuredMatch.user.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href="#matches-list">Jump to matches</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/network">See shared network</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Finish onboarding to see your first introduction. We&apos;ll highlight it here once it&apos;s ready.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Match insights</CardTitle>
            <CardDescription>
              A quick snapshot of how your intros are shaping up across Plano.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Total matches</p>
                <p>{matches.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Org coverage</p>
                <p>{orgSet.size} org{orgSet.size === 1 ? "" : "s"}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Locations represented</p>
                <p>{locationSet.size}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/70 p-3">
                <p className="font-semibold text-foreground">Shared interests</p>
                <p>{interestSet.size}</p>
              </div>
            </div>
            <p>
              Keep refining your interests or adjust your goals to diversify these numbers. One tweak can open an entirely new set of intros.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="matches-list" className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">All matches</h2>
          <p className="text-sm text-muted-foreground">
            Ready when you are—send an intro, propose a coffee chat, or save for later.
          </p>
        </div>
        {matches.length === 0 ? (
          <Card className="border-border/70 bg-card/80 backdrop-blur">
            <CardContent className="space-y-4 p-8 text-center text-sm text-muted-foreground">
              <p>No matches yet.</p>
              <p>Update your profile with interests, goals, and a short bio to unlock your first introduction.</p>
            </CardContent>
          </Card>
        ) : remainingMatches.length > 0 ? (
          <MatchesGrid matches={remainingMatches} />
        ) : null}
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
              We look at shared interests, org structure, recent collaborations, and participation in onboarding events to calculate your similarity score.
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
