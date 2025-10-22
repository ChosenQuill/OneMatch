import { Dashboard } from "@/components/dashboard/dashboard"

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">OneMatch</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Connect every TDP from day zero
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Capital One&apos;s internal experiment to help TDPs find peers, communities, and purposeful coffee chats.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card/80 px-5 py-3 text-sm shadow-sm backdrop-blur">
          <span className="font-medium text-muted-foreground">Hackathon track</span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Community</span>
        </div>
      </header>
      <Dashboard />
    </main>
  )
}
