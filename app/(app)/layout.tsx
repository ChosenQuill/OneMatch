import { redirect } from "next/navigation"
import { getUserIdFromCookies } from "@/lib/server-api"

export const dynamic = "force-dynamic"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await getUserIdFromCookies()

  if (!userId) {
    redirect("/auth/login")
  }

  return <>{children}</>
}
