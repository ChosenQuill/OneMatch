import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppShell } from "@/components/layout/app-shell"
import type { UserProfile } from "@/lib/types"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "OneMatch | Capital One TDP Connections",
  description:
    "Discover Capital One teammates, join communities, and schedule coffee chats with OneMatch.",
}

async function getShellProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/users/me/profile`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const json = await response.json()
    return (json?.data as UserProfile) ?? null
  } catch (error) {
    console.error("Failed to load shell profile", error)
    return null
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getShellProfile()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppShell profile={profile}>{children}</AppShell>
      </body>
    </html>
  )
}
