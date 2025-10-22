"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Interest, UserProfile } from "@/lib/types"
import { Loader2, Plus } from "lucide-react"

interface ProfileFormProps {
  onSaved?: (profile: UserProfile) => void
}

type FormState = {
  fullName: string
  profilePhotoUrl: string
  location: string
  org: string
  workspace: string
  bio: string
  goals: string
  interestIds: string[]
  newInterests: string[]
}

export function ProfileForm({ onSaved }: ProfileFormProps) {
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    profilePhotoUrl: "",
    location: "",
    org: "",
    workspace: "",
    bio: "",
    goals: "",
    interestIds: [],
    newInterests: [],
  })
  const [interests, setInterests] = useState<Interest[]>([])
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const newInterestRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    async function bootstrap() {
      try {
        const [profileRes, interestsRes] = await Promise.all([
          fetch("/api/users/me/profile", { cache: "no-store" }),
          fetch("/api/interests", { cache: "no-store" }),
        ])

        const profileJson = await profileRes.json()
        const interestsJson = await interestsRes.json()

        const profile: UserProfile | null = profileJson?.data ?? null
        const fetchedInterests: Interest[] = interestsJson?.data ?? []

        setInterests(fetchedInterests)

        if (profile) {
          setFormState((prev) => ({
            ...prev,
            fullName: profile.fullName ?? "",
            profilePhotoUrl: profile.profilePhotoUrl ?? "",
            location: profile.location ?? "",
            org: profile.org ?? "",
            workspace: profile.workspace ?? "",
            bio: profile.bio ?? "",
            goals: profile.goals ?? "",
            interestIds: profile.interests?.map((interest) => interest.id) ?? [],
          }))
        }
      } catch (error) {
        console.error("Failed to bootstrap profile form", error)
      }
    }

    bootstrap()
  }, [])

  useEffect(() => {
    if (status === "saved") {
      const timeout = setTimeout(() => setStatus("idle"), 3000)
      return () => clearTimeout(timeout)
    }
  }, [status])

  const activeInterestChips = useMemo(() => {
    const selectedExisting = formState.interestIds
      .map((id) => interests.find((interest) => interest.id === id))
      .filter((interest): interest is Interest => Boolean(interest))

    const created = formState.newInterests.map((name) => ({ id: name, name }))

    return [...selectedExisting, ...created]
  }, [formState.interestIds, formState.newInterests, interests])

  function handleInputChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  function handleToggleInterest(id: string) {
    setFormState((prev) => ({
      ...prev,
      interestIds: prev.interestIds.includes(id)
        ? prev.interestIds.filter((interestId) => interestId !== id)
        : [...prev.interestIds, id],
    }))
  }

  function handleAddNewInterest() {
    const value = newInterestRef.current?.value.trim()
    if (!value) return

    setFormState((prev) => ({
      ...prev,
      newInterests: Array.from(new Set([...prev.newInterests, value])),
    }))

    if (newInterestRef.current) {
      newInterestRef.current.value = ""
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("saving")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/users/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      const json = await response.json()

      if (!response.ok) {
        setStatus("error")
        setErrorMessage(json?.message ?? "Unable to save profile")
        return
      }

      setStatus("saved")
      const profile = json?.data as UserProfile
      onSaved?.(profile)
    } catch (error) {
      console.error("Failed to save profile", error)
      setStatus("error")
      setErrorMessage("Unexpected error. Please try again.")
    }
  }

  return (
    <Card id="onboarding" className="border-none bg-card/70 backdrop-blur">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl font-semibold">Tell us about you</CardTitle>
        <CardDescription>
          The more context you share, the better OneMatch can pair you with the right people and communities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                placeholder="Jordan Doe"
                value={formState.fullName}
                onChange={(event) => handleInputChange("fullName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePhotoUrl">Profile photo URL</Label>
              <Input
                id="profilePhotoUrl"
                placeholder="https://..."
                value={formState.profilePhotoUrl}
                onChange={(event) => handleInputChange("profilePhotoUrl", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="McLean, VA"
                value={formState.location}
                onChange={(event) => handleInputChange("location", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Org</Label>
              <Input
                id="org"
                placeholder="Card Tech"
                value={formState.org}
                onChange={(event) => handleInputChange("org", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace</Label>
              <Input
                id="workspace"
                placeholder="HQ1"
                value={formState.workspace}
                onChange={(event) => handleInputChange("workspace", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Connection goals</Label>
              <Input
                id="goals"
                placeholder="Find hackathon teammates"
                value={formState.goals}
                onChange={(event) => handleInputChange("goals", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bio">About you</Label>
              <Textarea
                id="bio"
                placeholder="Share a quick hello and what excites you."
                value={formState.bio}
                onChange={(event) => handleInputChange("bio", event.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pick your interests</Label>
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                    {interests.map((interest) => {
                      const checked = formState.interestIds.includes(interest.id)
                      return (
                        <label
                          key={interest.id}
                          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition hover:bg-accent"
                        >
                          <span className="text-sm font-medium">{interest.name}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleInterest(interest.id)}
                            className="h-4 w-4 accent-primary"
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newInterest">Add a new interest</Label>
                <div className="flex items-center gap-2">
                  <Input id="newInterest" ref={newInterestRef} placeholder="i.e. Design Systems" />
                  <Button type="button" variant="secondary" onClick={handleAddNewInterest}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {activeInterestChips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeInterestChips.map((interest) => (
                <Badge key={interest.id} variant="secondary" className="px-3 py-1">
                  {interest.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select at least one interest to unlock tailored matches.</p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={status === "saving"}>
              {status === "saving" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                <>Save profile</>
              )}
            </Button>
            {status === "saved" && <span className="text-sm font-medium text-green-600">Profile updated!</span>}
            {status === "error" && (
              <span className="text-sm font-medium text-destructive">{errorMessage}</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
