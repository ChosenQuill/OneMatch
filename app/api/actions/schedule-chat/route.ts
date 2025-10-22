import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  console.log("[Mock API] POST /api/actions/schedule-chat", body)

  const inviteeUserId: string | undefined = body?.inviteeUserId

  if (!inviteeUserId) {
    return NextResponse.json(
      {
        status: "error",
        message: "inviteeUserId is required",
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    status: "success",
    data: {
      message: "Coffee chat suggested!",
      inviteeUserId,
    },
  })
}
