import { LoginForm } from "@/components/auth/login-form"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col items-center justify-center gap-12 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <Badge className="bg-primary/10 text-primary">Step 1 · Login</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Let’s get you matched</h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Log in with your Capital One username. We’ll spin up a profile for you and guide you through onboarding in less
          than three minutes.
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
