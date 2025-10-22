"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { clearUserIdCookie, markOnboardingIncomplete } from "@/lib/auth-client"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" })
      } catch (error) {
        console.error("Failed to log out", error)
      } finally {
        clearUserIdCookie()
        markOnboardingIncomplete()
        router.replace("/auth/login")
      }
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Logging out…" : "Logout"}
    </Button>
  )
}
