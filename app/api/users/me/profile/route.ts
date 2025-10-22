import { NextResponse } from "next/server"
import { mockInterests, mockProfile } from "@/lib/mock-data"

export async function GET() {
  console.log("[Mock API] GET /api/users/me/profile")
  return NextResponse.json({
    status: "success",
    data: mockProfile,
  })
}

export async function PUT(request: Request) {
  console.log("[Mock API] PUT /api/users/me/profile")
  const body = await request.json()

  Object.assign(mockProfile, {
    fullName: body.fullName ?? mockProfile.fullName,
    profilePhotoUrl: body.profilePhotoUrl ?? mockProfile.profilePhotoUrl,
    location: body.location ?? mockProfile.location,
    org: body.org ?? mockProfile.org,
    workspace: body.workspace ?? mockProfile.workspace,
    bio: body.bio ?? mockProfile.bio,
    goals: body.goals ?? mockProfile.goals,
  })

  const interestIds: string[] = Array.isArray(body.interestIds) ? body.interestIds : []
  const newInterests: string[] = Array.isArray(body.newInterests) ? body.newInterests : []

  const selectedExisting = mockInterests.filter((interest) =>
    interestIds.includes(interest.id)
  )

  const createdInterests = newInterests
    .map((name: string) => name?.trim())
    .filter((name: string | undefined): name is string => Boolean(name))
    .map((name) => {
      const existing = mockInterests.find(
        (interest) => interest.name.toLowerCase() === name.toLowerCase()
      )
      if (existing) {
        return existing
      }

      const created = { id: crypto.randomUUID(), name }
      mockInterests.push(created)
      return created
    })

  mockProfile.interests = Array.from(
    new Map([...selectedExisting, ...createdInterests].map((interest) => [interest.id, interest]))
  ).map(([, interest]) => interest)

  return NextResponse.json({
    status: "success",
    data: mockProfile,
  })
}
