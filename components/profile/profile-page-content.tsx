"use client"

import { useState } from "react"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserProfile } from "@/lib/types"
import { Building2, MapPin, Sparkles, Users } from "lucide-react"

interface ProfilePageContentProps {
  initialProfile: UserProfile | null
}

export function ProfilePageContent({ initialProfile }: ProfilePageContentProps) {
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile)

  const interestCount = profile?.interests?.length ?? 0
  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "JD"

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,_1.4fr)_minmax(0,_0.8fr)]">
      <ProfileForm onSaved={setProfile} />
      <div className="space-y-6">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="flex items-center gap-4">
            <Avatar
              src={profile?.profilePhotoUrl ?? undefined}
              fallback={initials}
              className="h-16 w-16 text-base"
            />
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                {profile?.fullName ?? "Complete your profile"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{profile?.username ?? "Username assigned at login"}</p>
              {profile?.goals && (
                <Badge variant="secondary" className="mt-2 rounded-full bg-primary/10 text-primary">
                  {profile.goals}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {profile?.location ?? "Add location"}
              </span>
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                {profile?.org ?? "Select org"}
              </span>
            </div>
            <p className="leading-6 text-foreground/80">
              {profile?.bio ?? "Share a short bio so teammates know how to kick off the conversation."}
            </p>
            <div className="flex flex-wrap gap-2">
              {interestCount > 0 ? (
                profile?.interests.map((interest) => (
                  <Badge key={interest.id} variant="secondary" className="rounded-full px-3 py-1">
                    {interest.name}
                  </Badge>
                ))
              ) : (
                <span>Add interests to unlock more accurate matches.</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Profile progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Interests
              </span>
              <span>{interestCount}/5 recommended</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Users className="h-4 w-4 text-primary" />
                Communities
              </span>
              <span>{interestCount > 0 ? "Matches unlocked" : "Add interests to unlock"}</span>
            </div>
            <p>
              Keep your details updated so OneMatch can surface the most relevant teammates, communities, and events for you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
