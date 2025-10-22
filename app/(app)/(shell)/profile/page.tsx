import Link from "next/link"
import { ProfilePageContent } from "@/components/profile/profile-page-content"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { fetchFromApi } from "@/lib/server-api"
import type { UserProfile } from "@/lib/types"

async function getProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetchFromApi("/api/users/me/profile")
    if (!response.ok) {
      return null
    }
    const json = await response.json()
    return (json?.data as UserProfile) ?? null
  } catch (error) {
    console.error("Failed to load profile", error)
    return null
  }
}

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Profile"
        title="Refresh your profile to unlock better matches"
        description="Your onboarding profile powers every recommendation in OneMatch—from coffee chats to community Slack channels. Update it anytime you pivot interests or locations."
        actions={
          <Button asChild size="lg">
            <Link href="/matches">View matches</Link>
          </Button>
        }
      />

      <ProfilePageContent initialProfile={profile} />
    </div>
  )
}
