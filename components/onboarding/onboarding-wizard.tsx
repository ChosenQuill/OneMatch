"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { markOnboardingComplete } from "@/lib/auth-client"
import type { Interest, UserProfile } from "@/lib/types"
import { CheckCircle2, Loader2, Rocket, Sparkles } from "lucide-react"

const steps = [
  {
    key: "basics",
    title: "Set the basics",
    description: "Tell us who you are and where you’re based so we can match you with nearby teammates.",
  },
  {
    key: "interests",
    title: "Pick your interests",
    description: "Select interests to unlock better people and community recommendations.",
  },
  {
    key: "story",
    title: "Share your story",
    description: "Add a quick bio and connection goals so we can personalize prompts.",
  },
] as const

type StepKey = (typeof steps)[number]["key"]

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

function createInitialState(): FormState {
  return {
    fullName: "",
    profilePhotoUrl: "",
    location: "",
    org: "",
    workspace: "",
    bio: "",
    goals: "",
    interestIds: [],
    newInterests: [],
  }
}

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<StepKey>("basics")
  const [formState, setFormState] = useState<FormState>(createInitialState)
  const [interests, setInterests] = useState<Interest[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading")
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
          setFormState({
            fullName: profile.fullName ?? "",
            profilePhotoUrl: profile.profilePhotoUrl ?? "",
            location: profile.location ?? "",
            org: profile.org ?? "",
            workspace: profile.workspace ?? "",
            bio: profile.bio ?? "",
            goals: profile.goals ?? "",
            interestIds: profile.interests?.map((interest) => interest.id) ?? [],
            newInterests: [],
          })
        }

        setStatus("idle")
      } catch (error) {
        console.error("Failed to bootstrap onboarding wizard", error)
        setStatus("error")
        setErrorMessage("We couldn’t load your profile details. Try refreshing the page.")
      }
    }

    bootstrap()
  }, [])

  const activeInterestChips = useMemo(() => {
    const selectedExisting = formState.interestIds
      .map((id) => interests.find((interest) => interest.id === id))
      .filter((interest): interest is Interest => Boolean(interest))

    const created = formState.newInterests.map((name) => ({ id: name, name }))

    return [...selectedExisting, ...created]
  }, [formState.interestIds, formState.newInterests, interests])

  const basicsComplete = useMemo(() => {
    return ["fullName", "location", "org", "workspace"].every((field) => {
      const value = formState[field as keyof FormState]
      return typeof value === "string" && value.trim().length > 0
    })
  }, [formState])

  const hasInterestsSelected = activeInterestChips.length > 0

  const isCurrentStepValid = useMemo(() => {
    if (currentStep === "basics") return basicsComplete
    if (currentStep === "interests") return hasInterestsSelected
    return basicsComplete && hasInterestsSelected
  }, [basicsComplete, currentStep, hasInterestsSelected])

  const canCompleteOnboarding = basicsComplete && hasInterestsSelected

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
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

  function handleAddInterest() {
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

  function goToStep(step: StepKey) {
    setCurrentStep(step)
    setErrorMessage(null)
  }

  async function completeOnboarding() {
    if (!canCompleteOnboarding) {
      setErrorMessage("Add your basics and at least one interest to finish onboarding.")
      return
    }

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

      if (!response.ok) {
        const json = await response.json()
        throw new Error(json?.message ?? "Unable to save profile right now.")
      }

      markOnboardingComplete()
      router.replace("/dashboard")
    } catch (error) {
      console.error("Failed to complete onboarding", error)
      setStatus("error")
      setErrorMessage("We couldn’t save your profile. Please try again.")
    } finally {
      setStatus("idle")
    }
  }

  const stepIndex = steps.findIndex((step) => step.key === currentStep)
  const totalSteps = steps.length
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100)

  const isLastStep = currentStep === steps[steps.length - 1].key

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <Card className="border-border/70 bg-card/80 shadow-2xl backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Step {stepIndex + 1} of {totalSteps}
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold">{steps[stepIndex].title}</CardTitle>
            <CardDescription className="mt-2 text-base text-muted-foreground">
              {steps[stepIndex].description}
            </CardDescription>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          {status === "loading" ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading your profile...
            </div>
          ) : (
            <>
              {currentStep === "basics" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      placeholder="Rithvik Senthilkumar"
                      value={formState.fullName}
                      onChange={(event) => updateForm("fullName", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePhotoUrl">Profile photo URL</Label>
                    <Input
                      id="profilePhotoUrl"
                      placeholder="https://..."
                      value={formState.profilePhotoUrl}
                      onChange={(event) => updateForm("profilePhotoUrl", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Plano, TX"
                      value={formState.location}
                      onChange={(event) => updateForm("location", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org">Org</Label>
                    <Input
                      id="org"
                      placeholder="Cloud Platform"
                      value={formState.org}
                      onChange={(event) => updateForm("org", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace">Workspace</Label>
                    <Input
                      id="workspace"
                      placeholder="Plano Campus"
                      value={formState.workspace}
                      onChange={(event) => updateForm("workspace", event.target.value)}
                    />
                  </div>
                </div>
              )}

              {currentStep === "interests" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pick your interests</Label>
                    <div className="rounded-xl border border-border bg-background/60 p-4">
                      <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
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
                      <Button type="button" variant="secondary" onClick={handleAddInterest}>
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We’ll seed new community ideas based on the interests you add here.
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    {activeInterestChips.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {activeInterestChips.map((interest) => (
                          <Badge key={interest.id} variant="secondary" className="px-3 py-1">
                            {interest.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select at least one interest so we can surface relevant matches.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === "story" && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bio">About you</Label>
                      <Textarea
                        id="bio"
                        placeholder="Share a short hello and what excites you."
                        value={formState.bio}
                        onChange={(event) => updateForm("bio", event.target.value)}
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goals">Connection goals</Label>
                      <Textarea
                        id="goals"
                        placeholder="Ex: Find hackathon teammates or mentorship buddies."
                        value={formState.goals}
                        onChange={(event) => updateForm("goals", event.target.value)}
                        rows={5}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4 rounded-3xl border border-border/60 bg-muted/40 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      You&apos;re all set!
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Once you finish, we’ll unlock your matches, top communities, and network visualization. You can
                      update your profile anytime from the dashboard.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={status === "loading" || status === "saving" || stepIndex === 0}
              onClick={() => goToStep(steps[Math.max(stepIndex - 1, 0)].key)}
            >
              Back
            </Button>
            {isLastStep ? (
              <Button
                type="button"
                size="lg"
                disabled={status === "saving"}
                onClick={() => completeOnboarding()}
                className="ml-auto"
              >
                {status === "saving" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finishing up...
                  </>
                ) : (
                  <>
                    Launch dashboard
                    <Rocket className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                className="ml-auto"
                disabled={status === "loading" || !isCurrentStepValid}
                onClick={() => goToStep(steps[Math.min(stepIndex + 1, totalSteps - 1)].key)}
              >
                Continue
              </Button>
            )}
          </div>
          {!isCurrentStepValid && currentStep !== "story" && (
            <p className="text-xs text-muted-foreground">
              {currentStep === "basics"
                ? "Fill in your name, location, org, and workspace to continue."
                : "Pick at least one interest to unlock tailored matches."}
            </p>
          )}
          {isLastStep && !canCompleteOnboarding && (
            <p className="text-xs text-muted-foreground">
              Make sure your basics are complete and you&apos;ve selected an interest before finishing.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
