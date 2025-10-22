import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40 text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              OM
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">OneMatch</p>
              <p className="text-sm font-medium text-foreground">TDP Connections</p>
            </div>
          </Link>
          <Button asChild variant="secondary">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
