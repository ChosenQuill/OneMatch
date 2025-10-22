import Link from "next/link"
import { redirect } from "next/navigation"
import { NetworkPreview } from "@/components/dashboard/network-preview"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,_1.15fr)_minmax(0,_0.85fr)]">
        <NetworkPreview graph={network} />
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Key stats</CardTitle>
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
            <p>
              Want someone added to your map? Add them as a mentor or recurring collaborator in your profile and OneMatch
              pulls them in automatically.
            </p>
            <p>
              These relationships feed your match recommendations—tighten loops by scheduling coffee chats or joining shared
              communities.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
