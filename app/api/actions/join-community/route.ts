import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  console.log("[Mock API] POST /api/actions/join-community", body)

  const communityId: string | undefined = body?.communityId

  if (!communityId) {
    return NextResponse.json(
      {
        status: "error",
        message: "communityId is required",
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    status: "success",
    data: {
      message: "Successfully joined community!",
      communityId,
      slackUrl: "slack://channel?team=T12345&id=C67890",
    },
  })
}
