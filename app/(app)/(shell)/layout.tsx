import { AppShell } from "@/components/layout/app-shell"
import { fetchFromApi } from "@/lib/server-api"
import type { UserProfile } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetchFromApi("/api/users/me/profile")
    if (!response.ok) {
      return null
    }
    const json = await response.json()
    return (json?.data as UserProfile) ?? null
  } catch (error) {
    console.error("Failed to fetch profile for shell layout", error)
    return null
  }
}

export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  return <AppShell profile={profile}>{children}</AppShell>
}
