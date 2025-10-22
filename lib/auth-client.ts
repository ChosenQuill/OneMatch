"use client"

const USER_COOKIE_KEY = "onematch_user"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // one year
const ONBOARDING_COOKIE_KEY = "onematch_onboarded"

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

export function setUserIdCookie(userId: string) {
  setCookie(USER_COOKIE_KEY, userId)
}

export function markOnboardingComplete() {
  setCookie(ONBOARDING_COOKIE_KEY, "1")
}

export function markOnboardingIncomplete() {
  setCookie(ONBOARDING_COOKIE_KEY, "0")
}

export function getUserIdFromDocument(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${USER_COOKIE_KEY}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearUserIdCookie() {
  document.cookie = `${USER_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`
  document.cookie = `${ONBOARDING_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`
}
