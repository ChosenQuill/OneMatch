import { NextResponse } from "next/server"
import { mockUserMatches } from "@/lib/mock-data"

export async function GET() {
  console.log("[Mock API] GET /api/matches/users")
  return NextResponse.json({
    status: "success",
    data: mockUserMatches,
  })
}
