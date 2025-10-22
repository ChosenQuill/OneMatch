import { NextResponse } from "next/server"
import { mockCommunityMatches } from "@/lib/mock-data"

export async function GET() {
  console.log("[Mock API] GET /api/matches/communities")
  return NextResponse.json({
    status: "success",
    data: mockCommunityMatches,
  })
}
