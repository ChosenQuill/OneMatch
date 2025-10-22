import { NextResponse } from "next/server"
import { mockNetwork } from "@/lib/mock-data"

interface Params {
  params: Promise<{ userId: string }>
}

export async function GET(_request: Request, context: Params) {
  const { userId } = await context.params
  console.log(`[Mock API] GET /api/network/${userId}`)
  return NextResponse.json({
    status: "success",
    data: mockNetwork,
  })
}
