import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Coffee, Network, Users } from "lucide-react"

const highlights = [
  {
    icon: Users,
    title: "Curated introductions",
    description: "Match with fellow TDPs who share your interests, org, and onboarding journey.",
  },
  {
    icon: Coffee,
    title: "Coffee chats made easy",
    description: "Suggest 1:1s and grab calendar-ready prompts without the awkward scheduling back-and-forth.",
  },
  {
    icon: Network,
    title: "Communities & network",
    description: "Join Slack groups and visualize the mentors, peers, and collaborators around you.",
  },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_600px_at_top,_rgba(59,130,246,0.15),_transparent)]" />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)] lg:items-center">
          <div className="space-y-8">
            <Badge className="bg-primary/10 text-primary">Capital One Internal Hackathon</Badge>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Bridge the gap between onboarding and belonging with OneMatch.
              </h1>
              <p className="text-lg text-muted-foreground">
                OneMatch pairs TDPs based on shared interests, locations, and org context—helping new teammates find their
                people faster than ever.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/login">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>
          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Matching snapshot</p>
                <p className="text-2xl font-semibold text-foreground">“We matched you with Ananya for a coffee chat.”</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-muted/40 p-5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Why it works:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Shared interests in React, Hackathons</li>
                  <li>• Volunteer history in Data Discovery guild</li>
                  <li>• Based in McLean, VA</li>
                </ul>
              </div>
              <div className="space-y-2 rounded-3xl border border-border/70 bg-muted/30 p-5">
                <p className="text-sm font-semibold text-foreground">Next action</p>
                <p className="text-sm text-muted-foreground">
                  Suggest a 20-minute intro and we’ll prep message prompts you can drop directly in Slack.
                </p>
                <Button size="sm" className="mt-2 w-full">Schedule coffee chat</Button>
              </div>
            </CardContent>
          </Card>
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
