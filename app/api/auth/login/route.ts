import { NextResponse } from "next/server"
import { findUserByIdentifier, getOrCreateUser, getUserProfile } from "@/lib/mock-store"

export async function POST(request: Request) {
  const body = await request.json()
  const username = body?.username?.trim()

  console.log(`[Mock API] POST /api/auth/login for ${username}`)

  if (!username) {
    return NextResponse.json(
      {
        status: "error",
        message: "username is required",
      },
      { status: 400 }
    )
  }

  const existing = findUserByIdentifier(username)

  const user = existing ?? getOrCreateUser(username)

  return NextResponse.json({
    status: "success",
    data: {
      userId: user.userId,
      username: user.username,
      profile: getUserProfile(user.userId),
    },
  })
}
