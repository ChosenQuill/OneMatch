"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CommunityCard } from "@/components/dashboard/community-card"
import { Hero } from "@/components/dashboard/hero"
import { MatchCard } from "@/components/dashboard/match-card"
import { NetworkPreview } from "@/components/dashboard/network-preview"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CommunityMatch, NetworkGraph, UserMatch, UserProfile } from "@/lib/types"
import { CalendarCheck, Flame, Handshake, LogIn, UsersRound } from "lucide-react"

const MOCK_USER_ID = "a1b2c3d4"

export function Dashboard() {
  const onboardingRef = useRef<HTMLDivElement | null>(null)
  const [userMatches, setUserMatches] = useState<UserMatch[]>([])
  const [communityMatches, setCommunityMatches] = useState<CommunityMatch[]>([])
  const [network, setNetwork] = useState<NetworkGraph | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
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
        console.error("Failed to bootstrap dashboard", error)
      }
    }

    fetchData()
  }, [])

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

  function scrollToOnboarding() {
    onboardingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  async function handleScheduleChat(userId: string) {
    try {
      const response = await fetch("/api/actions/schedule-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeUserId: userId }),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? "Unable to schedule chat")
      }
      setActionMessage(json?.data?.message ?? "Coffee chat requested!")
    } catch (error) {
      console.error("Failed to schedule chat", error)
      setActionMessage("Something went wrong. Try again soon.")
    }
  }

  async function handleJoinCommunity(communityId: string) {
    try {
      const response = await fetch("/api/actions/join-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityId }),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? "Unable to join community")
      }
      setActionMessage(json?.data?.message ?? "Joined community!")
    } catch (error) {
      console.error("Failed to join community", error)
      setActionMessage("Unable to join right now. Please retry.")
    }
  }

  function handleProfileSaved(updatedProfile: UserProfile) {
    setProfile(updatedProfile)
  }

  return (
    <div className="space-y-14">
      <Hero onScrollToOnboarding={scrollToOnboarding} />

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

      <section ref={onboardingRef}>
        <ProfileForm onSaved={handleProfileSaved} />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Your top matches</h2>
            <p className="text-sm text-muted-foreground">
              People who share your interests, location, and org context.
            </p>
          </div>
          <Button variant="outline" className="w-full md:w-auto" onClick={() => scrollToOnboarding()}>
            <LogIn className="mr-2 h-4 w-4" /> Refresh matches
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {userMatches.map((match) => (
            <MatchCard key={match.user.userId} match={match} onScheduleChat={handleScheduleChat} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Communities to explore</h2>
          <p className="text-sm text-muted-foreground">
            Join Slack spaces tailored to your shared interests.
          </p>
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
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Profile snapshot</p>
              <p className="mt-2 text-sm leading-6 text-foreground/80">
                {profile?.bio ?? "Share a short bio to help teammates spark a conversation."}
              </p>
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
