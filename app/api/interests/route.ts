import { NextResponse } from "next/server"
import { mockInterests } from "@/lib/mock-data"

export async function GET() {
  console.log("[Mock API] GET /api/interests")
  return NextResponse.json({
    status: "success",
    data: mockInterests,
  })
}
