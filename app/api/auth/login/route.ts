import { NextResponse } from "next/server"
import { mockProfile } from "@/lib/mock-data"

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

  if (username.toLowerCase() === mockProfile.username.toLowerCase()) {
    return NextResponse.json({
      status: "success",
      data: {
        userId: mockProfile.userId,
        username: mockProfile.username,
        profile: mockProfile,
      },
    })
  }

  return NextResponse.json({
    status: "success",
    data: {
      userId: crypto.randomUUID(),
      username,
      profile: null,
    },
  })
}
