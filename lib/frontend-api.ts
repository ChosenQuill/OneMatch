type ScheduleChatResponse = {
  data?: {
    message?: string
  }
  message?: string
}

type JoinCommunityResponse = {
  data?: {
    message?: string
    slackUrl?: string
  }
  message?: string
}

export async function postScheduleChat(inviteeUserId: string) {
  const response = await fetch("/api/actions/schedule-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inviteeUserId }),
  })

  const json = (await response.json()) as ScheduleChatResponse

  if (!response.ok) {
    throw new Error(json?.message ?? "Unable to schedule chat")
  }

  return json?.data?.message ?? "Coffee chat requested!"
}

export async function postJoinCommunity(communityId: string) {
  const response = await fetch("/api/actions/join-community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ communityId }),
  })

  const json = (await response.json()) as JoinCommunityResponse

  if (!response.ok) {
    throw new Error(json?.message ?? "Unable to join community")
  }

  return {
    message: json?.data?.message ?? "Joined community!",
    slackUrl: json?.data?.slackUrl,
  }
}
