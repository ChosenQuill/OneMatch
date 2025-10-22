import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { mockInterests } from "@/lib/mock-data"
import { ensureUser, getUserProfile, saveUserProfile } from "@/lib/mock-store"
import { USER_COOKIE_KEY } from "@/lib/server-api"

async function extractUserId(requestHeaders: Headers): Promise<string | null> {
  const headerValue =
    requestHeaders.get("x-user-id") ??
    requestHeaders.get("X-User-Id") ??
    requestHeaders.get("X-USER-ID")

  if (headerValue?.trim()) {
    return headerValue.trim()
  }

  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(USER_COOKIE_KEY)?.value
  return cookieValue?.trim() ?? null
}

export async function GET(request: Request) {
  console.log("[Mock API] GET /api/users/me/profile")
  const userId = await extractUserId(request.headers)

  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Missing X-User-Id header" },
      { status: 401 }
    )
  }

  const profile = getUserProfile(userId)

  return NextResponse.json({
    status: "success",
    data: profile,
  })
}

export async function PUT(request: Request) {
  console.log("[Mock API] PUT /api/users/me/profile")
  const userId = await extractUserId(request.headers)

  if (!userId) {
    return NextResponse.json(
      { status: "error", message: "Missing X-User-Id header" },
      { status: 401 }
    )
  }

  const body = await request.json()
  const stored = ensureUser(userId)

  const interestIds: string[] = Array.isArray(body.interestIds) ? body.interestIds : []
  const newInterests: string[] = Array.isArray(body.newInterests) ? body.newInterests : []

  const selectedExisting = mockInterests.filter((interest) => interestIds.includes(interest.id))

  const createdInterests = newInterests
    .map((name: string) => name?.trim())
    .filter((name: string | undefined): name is string => Boolean(name))
    .map((name) => {
      const existing = mockInterests.find((interest) => interest.name.toLowerCase() === name.toLowerCase())
      if (existing) {
        return existing
      }

      const created = { id: crypto.randomUUID(), name }
      mockInterests.push(created)
      return created
    })

  const dedupedInterests = Array.from(
    new Map([...selectedExisting, ...createdInterests].map((interest) => [interest.id, interest]))
  ).map(([, interest]) => interest)

  const previousProfile = stored.profile

  const profile = saveUserProfile(userId, {
    fullName: body.fullName ?? previousProfile?.fullName ?? "",
    profilePhotoUrl: body.profilePhotoUrl ?? previousProfile?.profilePhotoUrl ?? null,
    location: body.location ?? previousProfile?.location ?? "",
    org: body.org ?? previousProfile?.org ?? "",
    workspace: body.workspace ?? previousProfile?.workspace ?? "",
    bio: body.bio ?? previousProfile?.bio ?? "",
    goals: body.goals ?? previousProfile?.goals ?? "",
    interests: dedupedInterests,
  })

  return NextResponse.json({
    status: "success",
    data: profile,
  })
}
