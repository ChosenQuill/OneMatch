import { cookies, headers as getRequestHeaders } from "next/headers"

export const USER_COOKIE_KEY = "onematch_user"
export const ONBOARDING_COOKIE_KEY = "onematch_onboarded"

function buildOrigin(requestHeaders: Headers | null) {
  const configured = process.env.NEXT_PUBLIC_APP_URL
  if (configured) {
    return configured.replace(/\/$/, "")
  }

  if (requestHeaders) {
    const host =
      requestHeaders.get("x-forwarded-host") ??
      requestHeaders.get("host")
    if (host) {
      const proto = requestHeaders.get("x-forwarded-proto") ?? "http"
      return `${proto}://${host}`
    }
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}

function resolveUrl(path: string, requestHeaders: Headers | null) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const origin = buildOrigin(requestHeaders)
  return `${origin}${normalizedPath}`
}

export async function getUserIdFromCookies() {
  const cookieStore = await cookies()
  return cookieStore.get(USER_COOKIE_KEY)?.value ?? null
}

export async function isOnboardingCompleteFromCookies() {
  const cookieStore = await cookies()
  return cookieStore.get(ONBOARDING_COOKIE_KEY)?.value === "1"
}

export async function fetchFromApi(path: string, init: RequestInit = {}) {
  const userId = await getUserIdFromCookies()
  const requestHeaders = await getRequestHeaders()
  const headers = new Headers(init.headers)

  if (userId && !headers.has("X-User-Id")) {
    headers.set("X-User-Id", userId)
  }

  return fetch(resolveUrl(path, requestHeaders), {
    cache: "no-store",
    ...init,
    headers,
  })
}
