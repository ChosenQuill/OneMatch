import Link from "next/link"
import { redirect } from "next/navigation"
import { NetworkPreview } from "@/components/dashboard/network-preview"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MOCK_USER_ID } from "@/lib/constants"
import { fetchFromApi, isOnboardingCompleteFromCookies } from "@/lib/server-api"
import { isProfileComplete } from "@/lib/profile"
import type { NetworkGraph, UserProfile } from "@/lib/types"

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
    console.error("Failed to load profile for network page", error)
    return null
  }
}

async function getNetwork(): Promise<NetworkGraph | null> {
  try {
    const response = await fetchFromApi(`/api/network/${MOCK_USER_ID}`)
    if (!response.ok) {
      return null
    }
    const json = await response.json()
    return (json?.data as NetworkGraph) ?? null
  } catch (error) {
    console.error("Failed to load network graph", error)
    return null
  }
}

export default async function NetworkPage() {
  const profile = await getProfile()

  if (!(await isOnboardingCompleteFromCookies()) || !profile || !isProfileComplete(profile)) {
    redirect("/onboarding")
  }

  const network = await getNetwork()
  const nodeCount = network?.nodes.length ?? 0
  const linkCount = network?.links.length ?? 0
  const nodesById = new Map(network?.nodes.map((node) => [node.id, node]))
  const spotlightLink = network?.links[0] ?? null
  const spotlight = spotlightLink
    ? {
        source: nodesById.get(String(spotlightLink.source))?.name,
        target: nodesById.get(String(spotlightLink.target))?.name,
        relationship: spotlightLink.relationship,
      }
    : null
  const groupsRepresented = new Set(network?.nodes.map((node) => node.group ?? ""))

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Network"
        title="Visualize the mentors, peers, and teammates one intro away"
        description="Use the network radar to understand who can help you onboard faster. Each relationship highlights why the intro matters and how to keep the momentum going."
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/communities">Explore communities</Link>
          </Button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="secondary" className="w-fit rounded-full bg-primary/10 text-primary">
              Spotlight connection
            </Badge>
            <CardTitle className="text-2xl font-semibold text-foreground">Map your warmest intro</CardTitle>
            <CardDescription>
              {spotlight
                ? `${spotlight.source} → ${spotlight.target} (${spotlight.relationship})`
                : "Once connections are mapped, we&apos;ll highlight the most relevant bridge here."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Use this as your starting point for a warm introduction. Mention the relationship shown to make your outreach feel natural and mutual.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm" variant="secondary">
                <Link href="/matches">See related matches</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href="/communities">Find shared communities</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Network stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
              <span className="font-medium text-foreground">Connections mapped</span>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                {linkCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
              <span className="font-medium text-foreground">People in orbit</span>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                {nodeCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
              <span className="font-medium text-foreground">Groups represented</span>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                {groupsRepresented.size}
              </Badge>
            </div>
            <p>
              Want someone added to your map? Add them as a mentor or recurring collaborator in your profile and OneMatch pulls them in automatically.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,_1.15fr)_minmax(0,_0.85fr)]">
        <NetworkPreview graph={network} />
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Keep the graph warm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-semibold text-foreground">Check in weekly</p>
                <p className="mt-1">Pick one connection from the outer ring and schedule a quick sync.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-semibold text-foreground">Share resources</p>
                <p className="mt-1">Drop a helpful link or note in the community you joined this week.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-semibold text-foreground">Log new collaborators</p>
                <p className="mt-1">Add active collaborators to your profile so this map keeps evolving.</p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <Link href="/matches">Open matches</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/profile">Edit collaborators</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
