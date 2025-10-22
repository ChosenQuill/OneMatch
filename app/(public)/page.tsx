import Link from "next/link"
import { Hero } from "@/components/dashboard/hero"
import { CommunityCard } from "@/components/dashboard/community-card"
import { MatchCard } from "@/components/dashboard/match-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockCommunityMatches, mockUserMatches } from "@/lib/mock-data"
import { Coffee, Network, Users } from "lucide-react"

const highlights = [
  {
    icon: Users,
    title: "Curated introductions",
    description: "See the people who share your interests, org context, and onboarding timeline in seconds.",
  },
  {
    icon: Coffee,
    title: "Coffee chats made easy",
    description: "Launch 1:1s with ready-to-send prompts and match context baked in.",
  },
  {
    icon: Network,
    title: "Communities & network",
    description: "Join Plano-based communities and watch your network graph fill in automatically.",
  },
]

export default function LandingPage() {
  const sampleMatch = mockUserMatches[0]
  const sampleCommunity = mockCommunityMatches[0]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_600px_at_top,_rgba(59,130,246,0.15),_transparent)]" />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Hero primaryHref="/auth/login" secondaryLabel="How it works" secondaryHref="#how-it-works" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3 text-center">
          <Badge variant="secondary" className="rounded-full bg-muted/60">
            Preview the experience
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight">Here’s how matches and communities actually look</h2>
          <p className="text-sm text-muted-foreground">
            These are real Plano-based examples from our mock data—exactly what you&apos;ll see once you log in.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <MatchCard match={sampleMatch} isProcessing={false} />
          <CommunityCard match={sampleCommunity} />
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border/60 bg-background/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <Badge variant="secondary" className="rounded-full bg-muted/60">
              How it works
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight">A simple onboarding-to-community journey</h2>
            <p className="text-sm text-muted-foreground">
              Three quick steps—login, personalize your profile, and unlock curated matches and communities.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="border-border/60 bg-card/80 backdrop-blur">
                <CardContent className="space-y-4 p-6">
                  <item.icon className="h-6 w-6 text-primary" />
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <Badge className="bg-primary/10 text-primary">TL;DR</Badge>
          <h3 className="text-3xl font-semibold tracking-tight">Grow your Capital One network from day zero</h3>
          <p className="text-base text-muted-foreground">
            OneMatch is built for Capital One TDPs who want to build, learn, and belong faster. Join the experiment,
            share your interests, and unlock connections that last beyond onboarding.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Request a demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
