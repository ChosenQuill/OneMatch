import { redirect } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { PageHeader } from "@/components/layout/page-header"
import { isOnboardingCompleteFromCookies } from "@/lib/server-api"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
  if (await isOnboardingCompleteFromCookies()) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Onboarding"
        title="Let’s tailor OneMatch to your goals"
        description="Your profile drives every introduction, community, and network insight. Spend two minutes now to unlock curated matches instantly."
      />
      <OnboardingWizard />
    </div>
  )
}
