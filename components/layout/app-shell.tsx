"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/auth/logout-button"
import { Avatar } from "@/components/ui/avatar"
import type { UserProfile } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  profile: UserProfile | null
}

interface NavItem {
  href: string
  label: string
  match?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", match: (pathname) => pathname === "/dashboard" },
  { href: "/matches", label: "Matches", match: (pathname) => pathname.startsWith("/matches") },
  {
    href: "/communities",
    label: "Communities",
    match: (pathname) => pathname.startsWith("/communities"),
  },
  { href: "/network", label: "Network" },
  { href: "/profile", label: "Profile" },
]

function getInitials(name?: string | null) {
  if (!name) return "OM"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function AppShell({ children, profile }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              OM
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">OneMatch</p>
              <p className="text-sm font-medium text-foreground">TDP Connections</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-1 py-1 backdrop-blur md:flex">
            {navItems.map((item) => {
              const isActive = item.match ? item.match(pathname) : pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">
                {profile?.fullName?.trim() || "Complete your profile"}
              </p>
              <p className="text-xs text-muted-foreground">
                {[profile?.org, profile?.location].filter(Boolean).join(" · ") || "Finish onboarding to personalize"}
              </p>
            </div>
            <Avatar
              src={profile?.profilePhotoUrl ?? undefined}
              fallback={getInitials(profile?.fullName)}
              className="h-11 w-11"
            />
            <LogoutButton />
          </div>
        </div>
        <div className="border-t border-border/60 bg-background/80 backdrop-blur md:hidden">
          <nav className="flex gap-2 overflow-x-auto px-4 py-3">
            {navItems.map((item) => {
              const isActive = item.match ? item.match(pathname) : pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/70 text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="px-4 pb-4">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
