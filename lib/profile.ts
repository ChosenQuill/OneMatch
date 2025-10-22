import type { UserProfile } from "./types"

const REQUIRED_FIELDS: Array<keyof UserProfile> = ["fullName", "location", "org", "workspace"]

export function isProfileComplete(profile: UserProfile | null): profile is UserProfile {
  if (!profile) return false

  const hasRequired = REQUIRED_FIELDS.every((field) => {
    const value = profile[field]
    return typeof value === "string" && value.trim().length > 0
  })

  const hasInterests = Array.isArray(profile.interests) && profile.interests.length > 0

  return hasRequired && hasInterests
}
