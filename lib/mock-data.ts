import { type CommunityMatch, type Interest, type NetworkGraph, type UserMatch, type UserProfile } from "./types"

export const mockInterests: Interest[] = [
  { id: "interest-uuid-1", name: "Python" },
  { id: "interest-uuid-2", name: "Hiking" },
  { id: "interest-uuid-3", name: "React" },
  { id: "interest-uuid-4", name: "Pickleball" },
  { id: "interest-uuid-5", name: "AI Ethics" },
  { id: "interest-uuid-6", name: "Coffee Chats" },
  { id: "interest-uuid-7", name: "Hackathons" },
  { id: "interest-uuid-8", name: "Data Viz" },
]

export const mockProfile: UserProfile = {
  userId: "a1b2c3d4",
  username: "jdoe",
  fullName: "Jordan Doe",
  profilePhotoUrl: null,
  location: "McLean, VA",
  org: "Card Tech",
  workspace: "HQ1",
  interests: [mockInterests[0], mockInterests[2], mockInterests[6]],
  bio: "I love pairing engineers together to ship community-focused experiments.",
  goals: "Meet more folks who enjoy building mentorship programs.",
}

export const mockUserMatches: UserMatch[] = [
  {
    matchScore: 0.92,
    commonInterests: ["React", "Hackathons"],
    context: "You both volunteered at the 2024 Tech for Good hackathon.",
    user: {
      userId: "b2c3d4e5",
      fullName: "Ananya Patel",
      profilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=256&h=256",
      location: "McLean, VA",
      org: "Card Tech",
      role: "Senior Engineer",
    },
  },
  {
    matchScore: 0.88,
    commonInterests: ["Python", "Data Viz"],
    context: "Worked with you on the Data Discovery guild onboarding.",
    user: {
      userId: "c3d4e5f6",
      fullName: "Matthew Liu",
      profilePhotoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=256&h=256",
      location: "Plano, TX",
      org: "Enterprise Data",
      role: "Data Scientist",
    },
  },
  {
    matchScore: 0.81,
    commonInterests: ["Pickleball", "Hackathons"],
    context: "Matthew suggested grabbing coffee to chat about the TDP wellness group.",
    user: {
      userId: "d4e5f6g7",
      fullName: "Rithvik Narayan",
      profilePhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=256&h=256",
      location: "Richmond, VA",
      org: "Cloud Platform",
      role: "Associate Software Engineer",
    },
  },
]

export const mockCommunityMatches: CommunityMatch[] = [
  {
    matchScore: 0.96,
    matchingInterests: ["Hackathons", "React"],
    community: {
      communityId: "comm-uuid-1",
      name: "Capital One Builders Guild",
      description: "Build, ship, and demo passion projects alongside fellow TDPs across tech stacks.",
      slackChannel: "#tdp-builders",
    },
  },
  {
    matchScore: 0.91,
    matchingInterests: ["Pickleball", "Coffee Chats"],
    community: {
      communityId: "comm-uuid-2",
      name: "Wellness Warriors DFW",
      description: "Weekend pickleball ladders, hiking meetups, and coffee chat pairings in DFW.",
      slackChannel: "#tdp-wellness-dfw",
    },
  },
  {
    matchScore: 0.87,
    matchingInterests: ["AI Ethics", "Data Viz"],
    community: {
      communityId: "comm-uuid-3",
      name: "Responsible AI Roundtable",
      description: "Monthly salons to explore fairness, transparency, and responsible AI in Capital One products.",
      slackChannel: "#tdp-ai-ethics",
    },
  },
]

export const mockNetwork: NetworkGraph = {
  nodes: [
    { id: "a1b2c3d4", name: "Jordan Doe", group: 1 },
    { id: "b2c3d4e5", name: "Ananya Patel", group: 2 },
    { id: "c3d4e5f6", name: "Matthew Liu", group: 2 },
    { id: "d4e5f6g7", name: "Rithvik Narayan", group: 3 },
    { id: "e5f6g7h8", name: "Jacky Smith", group: 3 },
    { id: "f6g7h8i9", name: "Kausar Ahmed", group: 2 },
  ],
  links: [
    { source: "a1b2c3d4", target: "b2c3d4e5", relationship: "Hackathon Teammate" },
    { source: "a1b2c3d4", target: "c3d4e5f6", relationship: "Coffee Chat" },
    { source: "a1b2c3d4", target: "d4e5f6g7", relationship: "Mentor" },
    { source: "b2c3d4e5", target: "e5f6g7h8", relationship: "Same Org" },
    { source: "c3d4e5f6", target: "f6g7h8i9", relationship: "Project Squad" },
  ],
}
