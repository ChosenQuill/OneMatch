"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { NetworkPreview } from "@/components/dashboard/network-preview"
import { MOCK_USER_ID } from "@/lib/constants"
import { postJoinCommunity, postScheduleChat } from "@/lib/frontend-api"
import type { CommunityMatch, NetworkGraph, UserMatch, UserProfile } from "@/lib/types"
import { CheckCircle2, Flame, Handshake, Loader2, RefreshCcw, Share2, UsersRound } from "lucide-react"

const REQUIRED_FIELDS: Array<keyof UserProfile> = ["fullName", "location", "org", "workspace"]

export function Dashboard() {
  const router = useRouter()
  const [userMatches, setUserMatches] = useState<UserMatch[]>([])
  const [communityMatches, setCommunityMatches] = useState<CommunityMatch[]>([])
  const [network, setNetwork] = useState<NetworkGraph | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pendingActionId, setPendingActionId] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const [userMatchesRes, communityMatchesRes, networkRes, profileRes] = await Promise.all([
        fetch("/api/matches/users", { cache: "no-store" }),
        fetch("/api/matches/communities", { cache: "no-store" }),
        fetch(`/api/network/${MOCK_USER_ID}`, { cache: "no-store" }),
        fetch("/api/users/me/profile", { cache: "no-store" }),
      ])

      const userMatchesJson = await userMatchesRes.json()
      const communityMatchesJson = await communityMatchesRes.json()
      const networkJson = await networkRes.json()
      const profileJson = await profileRes.json()

      setUserMatches(userMatchesJson?.data ?? [])
      setCommunityMatches(communityMatchesJson?.data ?? [])
      setNetwork(networkJson?.data ?? null)
      setProfile(profileJson?.data ?? null)
    } catch (error) {
      console.error("Failed to load dashboard data", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    if (!actionMessage) return
    const timeout = setTimeout(() => setActionMessage(null), 3500)
    return () => clearTimeout(timeout)
  }, [actionMessage])

  const summaryMetrics = useMemo(() => {
    const sharedInterests = new Set<string>()
    userMatches.forEach((match) => match.commonInterests.forEach((interest) => sharedInterests.add(interest)))

    const activeInterests = profile?.interests?.length ?? 0
    const networkNodes = network?.nodes.length ?? 0
    const networkLinks = network?.links.length ?? 0

    return [
      {
        icon: Handshake,
        label: "People matches",
        value: userMatches.length,
        caption: "Ready for intros",
        href: "/matches",
      },
      {
        icon: UsersRound,
        label: "Communities",
        value: communityMatches.length,
        caption: "Spaces to join",
        href: "/communities",
      },
      {
        icon: Flame,
        label: "Active interests",
        value: Math.max(activeInterests, sharedInterests.size),
        caption: "Fueling your matches",
        href: "/profile",
      },
      {
        icon: Share2,
        label: "Network reach",
        value: networkNodes,
        caption: `${networkLinks} connections mapped`,
        href: "/network",
      },
    ]
  }, [communityMatches, network, profile?.interests, userMatches])

  const topMatch = userMatches[0] ?? null
  const topCommunity = communityMatches[0] ?? null

  const profileReadiness = useMemo(() => {
    if (!profile) {
      return { complete: false, missing: ["Profile details", "Interests"] }
    }

    const missingBasics = REQUIRED_FIELDS.filter((field) => {
      const value = profile[field]
      return typeof value !== "string" || value.trim().length === 0
    })
    const hasInterests = Array.isArray(profile.interests) && profile.interests.length > 0

    const missing: string[] = []
    if (missingBasics.length > 0) missing.push("Complete your basics")
    if (!hasInterests) missing.push("Add interests")

    return {
      complete: missing.length === 0,
      missing,
    }
  }, [profile])

  async function handleScheduleChat(userId: string) {
    try {
      setPendingActionId(userId)
      const message = await postScheduleChat(userId)
      setActionMessage(message)
    } catch (error) {
      console.error("Failed to schedule chat", error)
      setActionMessage("Something went wrong. Try again soon.")
    } finally {
      setPendingActionId(null)
    }
  }

  async function handleJoinCommunity(communityId: string) {
    try {
      setPendingActionId(communityId)
      const { message } = await postJoinCommunity(communityId)
      setActionMessage(message)
    } catch (error) {
      console.error("Failed to join community", error)
      setActionMessage("Unable to join right now. Please retry.")
    } finally {
      setPendingActionId(null)
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary/95 via-primary to-primary/80 p-8 text-primary-foreground shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white">Dashboard</Badge>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {profile?.fullName?.split(" ")?.[0] ?? "there"}.
              </h1>
              <p className="max-w-xl text-base text-primary-foreground/90">
                Keep the momentum going with a quick check-in on your matches, communities, and network prompts. Everything else lives in the tabs when you&apos;re ready to dive deeper.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => router.push("/matches")}
            >
              Review matches
            </Button>
            <Button variant="ghost" className="text-primary-foreground/90 hover:bg-white/20" onClick={() => router.push("/profile")}>
              Update profile
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <Card key={metric.label} className="border border-border/70 bg-card/80 p-6 backdrop-blur transition hover:border-primary/40">
            <div className="flex items-center justify-between">
              <metric.icon className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="rounded-full bg-muted/60 text-xs uppercase tracking-wider">
                {metric.caption}
              </Badge>
            </div>
            <div className="mt-6 text-3xl font-semibold">{metric.value}</div>
            <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>{metric.label}</span>
              <Link href={metric.href} className="font-medium text-primary hover:underline">
                View
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full border-primary/40 bg-primary/10 text-primary">
              Connection highlight
            </Badge>
            <CardTitle className="text-xl">
              {topMatch ? `Say hi to ${topMatch.user.fullName}` : "Matches unlock after onboarding"}
            </CardTitle>
            <CardDescription>
              {topMatch
                ? "Break the ice with a quick note about your shared interests."
                : "Complete your profile to receive curated introductions."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topMatch ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={topMatch.user.profilePhotoUrl ?? undefined}
                    fallback={topMatch.user.fullName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                    className="h-12 w-12"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{topMatch.user.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {topMatch.user.org} · {topMatch.user.location}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Prompt</p>
                  <p>{topMatch.context}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topMatch.commonInterests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="flex-1"
                    onClick={() => topMatch && handleScheduleChat(topMatch.user.userId)}
                    disabled={pendingActionId === topMatch.user.userId}
                  >
                    {pendingActionId === topMatch.user.userId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scheduling…
                      </>
                    ) : (
                      <>Suggest coffee chat</>
                    )}
                  </Button>
                  <Button asChild variant="ghost" className="flex-1">
                    <Link href="/matches">Open matches</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
                Add interests and location to unlock your first curated introduction.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full border-primary/40 bg-primary/10 text-primary">
              Community spotlight
            </Badge>
            <CardTitle className="text-xl">
              {topCommunity ? topCommunity.community.name : "Communities waiting"}
            </CardTitle>
            <CardDescription>
              {topCommunity
                ? topCommunity.community.description
                : "Fill out your interests to get placed into curated spaces."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCommunity ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {topCommunity.matchingInterests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                  Slack: {topCommunity.community.slackChannel}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="flex-1"
                    onClick={() => handleJoinCommunity(topCommunity.community.communityId)}
                    disabled={pendingActionId === topCommunity.community.communityId}
                    variant="secondary"
                  >
                    {pendingActionId === topCommunity.community.communityId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining…
                      </>
                    ) : (
                      <>Join community</>
                    )}
                  </Button>
                  <Button asChild variant="ghost" className="flex-1">
                    <Link href="/communities">Explore all</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
                Tell us what you&apos;re into and we&apos;ll line up communities ready to welcome you.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full border-primary/40 bg-primary/10 text-primary">
              Profile health
            </Badge>
            <CardTitle className="text-xl">Make your matches sharper</CardTitle>
            <CardDescription>
              Keep these details current so the matching engine knows who to introduce next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className={`h-4 w-4 ${profileReadiness.complete ? "text-emerald-500" : "text-muted-foreground"}`} />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Basics complete</p>
                  <p className="text-muted-foreground">
                    {profileReadiness.complete
                      ? "Your profile is ready for new matches."
                      : "A few basics are missing—update them to unlock better intros."}
                  </p>
                </div>
              </div>
              {!profileReadiness.complete && (
                <ul className="ml-7 list-disc text-xs text-muted-foreground">
                  {profileReadiness.missing.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Last updated</p>
              <p>
                {profile ? "Moments ago" : "Not yet saved. Complete your onboarding to personalize the dashboard."}
              </p>
            </div>
            <Button onClick={() => router.push("/profile")} variant="outline">
              Refresh profile
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Stay up to date</h2>
            <p className="text-sm text-muted-foreground">Refresh data anytime to pull in the latest matches and communities.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => fetchDashboardData()}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refreshing
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Refresh data
                </>
              )}
            </Button>
            <Button asChild className="w-full md:w-auto" variant="secondary">
              <Link href="/matches">Open matches</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)]">
        <NetworkPreview graph={network} />
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <Badge variant="outline" className="w-fit rounded-full border-primary/40 bg-primary/10 text-primary">
              Quick wins
            </Badge>
            <CardTitle className="text-xl">What to tackle this week</CardTitle>
            <CardDescription>
              These small actions keep the connections you&apos;ve unlocked feeling fresh.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-semibold text-foreground">Follow up on your latest match</p>
                <p className="mt-1 text-muted-foreground">
                  Drop a quick ping referencing {topMatch ? topMatch.commonInterests[0] : "a shared interest"} and propose two times for a chat.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-semibold text-foreground">Share a community update</p>
                <p className="mt-1 text-muted-foreground">
                  Post a welcome message in {topCommunity ? topCommunity.community.slackChannel : "your newest channel"}.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-semibold text-foreground">Refresh your story</p>
                <p className="mt-1 text-muted-foreground">
                  Update your goals so OneMatch suggests connections that align with what&apos;s next.
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shortcuts</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href="/matches">Matches</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/communities">Communities</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/network">Network</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/profile">Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {actionMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-full border border-border/80 bg-background/95 px-6 py-3 text-sm shadow-xl backdrop-blur">
            {actionMessage}
          </div>
        </div>
      )}
    </div>
  )
}
