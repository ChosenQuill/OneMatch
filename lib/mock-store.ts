import { seedProfiles } from "@/lib/mock-data"
import type { UserProfile } from "@/lib/types"

type StoredUser = {
  userId: string
  username: string
  profile: UserProfile | null
}

const usersById = new Map<string, StoredUser>()
const identityIndex = new Map<string, string>()

function normalize(value: string | null | undefined) {
  return value ? value.trim().toLowerCase() : ""
}

function indexIdentity(user: StoredUser, ...identities: Array<string | null | undefined>) {
  identities.forEach((identity) => {
    const key = normalize(identity)
    if (key) {
      identityIndex.set(key, user.userId)
    }
  })
}

function seedUser(profile: UserProfile) {
  const stored: StoredUser = {
    userId: profile.userId,
    username: profile.username,
    profile,
  }
  usersById.set(profile.userId, stored)
  indexIdentity(stored, profile.username, profile.userId, profile.fullName)
}

seedProfiles.forEach(seedUser)

export function generateEid() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let candidate = ""
  do {
    const letterBlock = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join("")
    const digits = Math.floor(100 + Math.random() * 900)
    candidate = `E${letterBlock}${digits}`
  } while (usersById.has(candidate))
  return candidate
}

export function findUserByIdentifier(identifier: string): StoredUser | null {
  const id = identityIndex.get(normalize(identifier))
  if (!id) return null
  return usersById.get(id) ?? null
}

export function getUserById(userId: string): StoredUser | null {
  return usersById.get(userId) ?? null
}

export function getOrCreateUser(identifier: string): StoredUser {
  const existing = findUserByIdentifier(identifier)
  if (existing) return existing

  const trimmed = identifier.trim()
  const isEid = /^E[A-Z0-9]{5}$/i.test(trimmed)

  const userId = isEid ? trimmed.toUpperCase() : generateEid()
  const username = isEid ? trimmed.toLowerCase() : normalize(trimmed).replace(/\s+/g, "") || userId.toLowerCase()

  const stored: StoredUser = {
    userId,
    username,
    profile: null,
  }
  usersById.set(userId, stored)
  indexIdentity(stored, username, userId, trimmed, userId.toLowerCase())
  return stored
}

export function ensureUser(userId: string, fallbackUsername?: string): StoredUser {
  const existing = getUserById(userId)
  if (existing) return existing

  const stored: StoredUser = {
    userId,
    username: fallbackUsername ?? userId.toLowerCase(),
    profile: null,
  }
  usersById.set(userId, stored)
  indexIdentity(stored, stored.username, userId, userId.toLowerCase())
  return stored
}

export function saveUserProfile(userId: string, payload: Omit<UserProfile, "userId" | "username">): UserProfile {
  const stored = ensureUser(userId)

  const profile: UserProfile = {
    userId: stored.userId,
    username: stored.username,
    ...payload,
  }

  stored.profile = profile
  // refresh indices in case name changed
  indexIdentity(stored, stored.username, stored.userId, profile.fullName)
  return profile
}

export function getUserProfile(userId: string): UserProfile | null {
  const stored = getUserById(userId)
  return stored?.profile ?? null
}
