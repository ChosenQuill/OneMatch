"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { markOnboardingComplete, markOnboardingIncomplete, setUserIdCookie } from "@/lib/auth-client"
import type { UserProfile } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface LoginResponse {
  status: string
  data?: {
    userId: string
    username: string
    profile: UserProfile | null
  }
  message?: string
}

function profileIsComplete(profile: UserProfile | null | undefined) {
  if (!profile) return false
  const requiredFields: Array<keyof UserProfile> = ["fullName", "location", "org", "workspace"]
  const hasRequired = requiredFields.every((field) => {
    const value = profile[field]
    return typeof value === "string" && value.trim().length > 0
  })
  const hasInterests = Array.isArray(profile.interests) && profile.interests.length > 0
  return hasRequired && hasInterests
}

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!username.trim()) {
      setErrorMessage("Please enter your Capital One EID (e.g., ENA487).")
      return
    }

    try {
      setStatus("loading")
      setErrorMessage(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      const json = (await response.json()) as LoginResponse

      if (!response.ok || json.status !== "success" || !json.data) {
        throw new Error(json?.message ?? "Unable to log in right now.")
      }

      setUserIdCookie(json.data.userId)
      localStorage.setItem("onematch_username", json.data.username)

      if (profileIsComplete(json.data.profile)) {
        markOnboardingComplete()
        router.replace("/dashboard")
      } else {
        markOnboardingIncomplete()
        router.replace("/onboarding")
      }
    } catch (error) {
      console.error("Failed to login", error)
      setStatus("error")
      setErrorMessage("We hit a snag logging you in. Try again.")
    } finally {
      setStatus("idle")
    }
  }

  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold">Log in to OneMatch</CardTitle>
        <CardDescription className="text-sm">
          Enter your Capital One EID to spin up a profile and get matched with fellow TDPs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Employee ID (EID)</Label>
            <Input
              id="username"
              placeholder="ENA487"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="off"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing you in...
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
          {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
          <p className="text-xs text-muted-foreground">
            New to OneMatch? We’ll create a lightweight profile for you after login—no passwords required for this
            internal prototype.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
