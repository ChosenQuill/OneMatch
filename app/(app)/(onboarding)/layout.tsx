export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">{children}</div>
    </div>
  )
}
