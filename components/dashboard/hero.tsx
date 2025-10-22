import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroProps {
  onScrollToOnboarding?: () => void
}

export function Hero({ onScrollToOnboarding }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/95 via-primary to-primary/80 px-8 py-16 text-primary-foreground shadow-xl">
      <div className="absolute -top-24 right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-16 left-12 h-48 w-48 rounded-full bg-white/20 blur-3xl" aria-hidden />
      <div className="relative z-10 space-y-8 max-w-3xl">
        <Badge className="bg-white/20 text-white backdrop-blur">
          <Sparkles className="mr-2 h-4 w-4" /> Internal Hackathon 2025
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Bridge the gap between onboarding and belonging with OneMatch.
        </h1>
        <p className="text-lg text-primary-foreground/90 sm:text-xl">
          OneMatch pairs TDPs based on shared interests, org context, and goals so meeting new teammates is as simple as one click.
          Discover curated communities, request coffee chats, and grow your Capital One network.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={onScrollToOnboarding}>
            Complete onboarding
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-primary-foreground/90 hover:bg-white/20">
            <Link href="/matches">Explore matches</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
