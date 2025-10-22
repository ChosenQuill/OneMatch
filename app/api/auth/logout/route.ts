import { NextResponse } from "next/server"
import { ONBOARDING_COOKIE_KEY, USER_COOKIE_KEY } from "@/lib/server-api"

export async function POST() {
  const response = NextResponse.json({ status: "success" })
  response.cookies.set(USER_COOKIE_KEY, "", {
    path: "/",
    maxAge: 0,
  })
  response.cookies.set(ONBOARDING_COOKIE_KEY, "", {
    path: "/",
    maxAge: 0,
  })
  return response
}
