export interface Interest {
  id: string
  name: string
}

export interface UserProfile {
  userId: string
  username: string
  fullName: string
  profilePhotoUrl: string | null
  location: string
  org: string
  workspace: string
  interests: Interest[]
  bio?: string
  goals?: string
}

export interface UserMatch {
  matchScore: number
  commonInterests: string[]
  user: {
    userId: string
    fullName: string
    profilePhotoUrl: string | null
    location: string
    org: string
    role: string
  }
  context: string
}

export interface CommunityMatch {
  matchScore: number
  matchingInterests: string[]
  community: {
    communityId: string
    name: string
    description: string
    slackChannel: string
  }
}

export interface NetworkGraph {
  nodes: Array<{ id: string; name: string; group: number }>
  links: Array<{ source: string; target: string; relationship: string }>
}
