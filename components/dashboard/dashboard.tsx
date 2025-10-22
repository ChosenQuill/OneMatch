"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CommunityCard } from "@/components/dashboard/community-card"
import { Hero } from "@/components/dashboard/hero"
import { MatchCard } from "@/components/dashboard/match-card"
import { NetworkPreview } from "@/components/dashboard/network-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MOCK_USER_ID } from "@/lib/constants"
import { postJoinCommunity, postScheduleChat } from "@/lib/frontend-api"
import type { CommunityMatch, NetworkGraph, UserMatch, UserProfile } from "@/lib/types"
import { CalendarCheck, Flame, Handshake, Loader2, RefreshCcw, Sparkles, UsersRound } from "lucide-react"

export function Dashboard() {
  const router = useRouter()
  const [userMatches, setUserMatches] = useState<UserMatch[]>([])
  const [communityMatches, setCommunityMatches] = useState<CommunityMatch[]>([])
  const [network, setNetwork] = useState<NetworkGraph | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

    return [
      {
        icon: Handshake,
        label: "People matches",
        value: userMatches.length,
        caption: "Top potential coffee chats",
      },
      {
        icon: UsersRound,
        label: "Communities",
        value: communityMatches.length,
        caption: "Tailored to your interests",
      },
      {
        icon: Flame,
        label: "Shared interests",
        value: sharedInterests.size,
        caption: "Conversation starters",
      },
      {
        icon: CalendarCheck,
        label: "Next steps",
        value: 2,
        caption: "Schedule chats & join Slack",
      },
    ]
  }, [communityMatches, userMatches])

  async function handleScheduleChat(userId: string) {
    try {
      const message = await postScheduleChat(userId)
      setActionMessage(message)
    } catch (error) {
      console.error("Failed to schedule chat", error)
      setActionMessage("Something went wrong. Try again soon.")
    }
  }

  async function handleJoinCommunity(communityId: string) {
    try {
      const { message } = await postJoinCommunity(communityId)
      setActionMessage(message)
    } catch (error) {
      console.error("Failed to join community", error)
      setActionMessage("Unable to join right now. Please retry.")
    }
  }

  return (
    <div className="space-y-14">
      <Hero onPrimaryAction={() => router.push("/profile")} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <Card
            key={metric.label}
            className="border border-border/70 bg-card/80 p-6 backdrop-blur transition hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <metric.icon className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="rounded-full bg-muted/60 text-xs uppercase tracking-wider">
                {metric.caption}
              </Badge>
            </div>
            <div className="mt-6 text-3xl font-semibold">{metric.value}</div>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,_1.15fr)_minmax(0,_0.85fr)]">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" /> Next best actions
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Keep the momentum going</h3>
              <p className="text-sm text-muted-foreground">
                Line up your next conversation and explore a community to stay connected after onboarding week.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={() => router.push("/matches")}>
                Open matches
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => router.push("/communities")}>
                Explore communities
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardContent className="space-y-5 p-6">
            <Badge variant="secondary" className="rounded-full bg-muted/60 text-xs uppercase tracking-widest">
              Profile snapshot
            </Badge>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {profile?.fullName ?? "Complete your profile details"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {[profile?.location, profile?.org, profile?.workspace].filter(Boolean).join(" · ") ||
                  "Add your location and workspace to unlock hyper-relevant matches."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.interests?.length ? (
                profile.interests.map((interest) => (
                  <Badge key={interest.id} variant="secondary" className="rounded-full px-3 py-1">
                    {interest.name}
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  Add interests during onboarding to unlock curated introductions.
                </p>
              )}
            </div>
            <Button variant="outline" onClick={() => router.push("/profile")}>
              Update profile
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Your top matches</h2>
            <p className="text-sm text-muted-foreground">
              People who share your interests, location, and org context.
            </p>
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
              <Link href="/matches">View all</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {userMatches.map((match) => (
            <MatchCard key={match.user.userId} match={match} onScheduleChat={handleScheduleChat} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold">Communities to explore</h2>
          <p className="text-sm text-muted-foreground md:max-w-lg">
            Join Slack spaces tailored to your shared interests.
          </p>
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href="/communities">Open community hub</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {communityMatches.map((match) => (
            <CommunityCard key={match.community.communityId} match={match} onJoin={handleJoinCommunity} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)]">
        <NetworkPreview graph={network} />
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-xl font-semibold">Make the first move</h3>
              <p className="text-sm text-muted-foreground">
                Keep momentum going after onboarding with quick prompts tailored to your matches.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Coffee chat idea</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask Matthew about his recent work on the Data Discovery guild and how it can help your org.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">Community spotlight</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Wellness Warriors is hosting a pickleball mixer next Thursday—perfect for casual intros.
                </p>
              </div>
            </div>
            <Separator />
            <Button asChild size="sm" variant="secondary" className="w-full">
              <Link href="/network">View full network</Link>
            </Button>
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
