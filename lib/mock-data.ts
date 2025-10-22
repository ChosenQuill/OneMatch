import { type CommunityMatch, type Interest, type NetworkGraph, type UserMatch, type UserProfile } from "./types"

export const mockInterests: Interest[] = [
  { id: "interest-uuid-1", name: "Design Systems" },
  { id: "interest-uuid-2", name: "Hackathons" },
  { id: "interest-uuid-3", name: "Mentorship" },
  { id: "interest-uuid-4", name: "AI Ethics" },
  { id: "interest-uuid-5", name: "Community Building" },
  { id: "interest-uuid-6", name: "Product Strategy" },
  { id: "interest-uuid-7", name: "Data Storytelling" },
  { id: "interest-uuid-8", name: "Coffee Chats" },
]

export const seedProfiles: UserProfile[] = [
  {
    userId: "ENA487",
    username: "rsenthilkumar",
    fullName: "Rithvik Senthilkumar",
    profilePhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=256&h=256",
    location: "Plano, TX",
    org: "Cloud Platform",
    workspace: "Plano Campus",
    interests: [mockInterests[1], mockInterests[2], mockInterests[3], mockInterests[7]],
    bio: "Associate Software Engineer helping TDPs ship ideas and grow their networks.",
    goals: "Pair every new hire with a cross-site mentor in week one.",
  },
  {
    userId: "ENA492",
    username: "avangoor",
    fullName: "Ananya Vangoor",
    profilePhotoUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=256&h=256",
    location: "Plano, TX",
    org: "Enterprise Product & Experience",
    workspace: "Plano Campus",
    interests: [mockInterests[0], mockInterests[1], mockInterests[2], mockInterests[5]],
    bio: "Associate Software Engineer building programs that help TDPs find their people from day zero.",
    goals: "Pilot OneMatch across cohorts and spark cross-site collaboration.",
  },
  {
    userId: "ENA493",
    username: "jlin",
    fullName: "Jacky Lin",
    profilePhotoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&w=256&h=256",
    location: "Plano, TX",
    org: "Card Tech",
    workspace: "Plano Campus",
    interests: [mockInterests[0], mockInterests[4], mockInterests[5]],
    bio: "Associate Software Engineer focused on inclusive experiences and mentorship programs.",
    goals: "Scale the design system guild across cohorts.",
  },
  {
    userId: "ENA494",
    username: "kalkaderi",
    fullName: "Kausar Alkaderi",
    profilePhotoUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=256&h=256",
    location: "Plano, TX",
    org: "Enterprise Platforms",
    workspace: "Plano Campus",
    interests: [mockInterests[4], mockInterests[7]],
    bio: "Associate Software Engineer matching people to conversations that move careers forward.",
    goals: "Pilot weekly coffee chat rotations for TDP newcomers.",
  },
  {
    userId: "ENA495",
    username: "mstraughn",
    fullName: "Matthew Straughn",
    profilePhotoUrl: "https://images.unsplash.com/photo-1529539795054-3c162aab037a?auto=format&fit=facearea&w=256&h=256",
    location: "Plano, TX",
    org: "Enterprise Data",
    workspace: "Plano Campus",
    interests: [mockInterests[3], mockInterests[6]],
    bio: "Associate Software Engineer running responsible AI salons and storytelling workshops.",
    goals: "Bring more voices into the Responsible AI roundtable.",
  },
]

export const mockUserMatches: UserMatch[] = [
  {
    matchScore: 0.92,
    commonInterests: ["Hackathons", "Mentorship"],
    context: "You co-led the Spring 2024 TDP hackathon onboarding circle.",
    user: {
      userId: "ENA492",
      fullName: "Ananya Vangoor",
      profilePhotoUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=facearea&w=256&h=256",
      location: "Plano, TX",
      org: "Enterprise Product & Experience",
      role: "Associate Software Engineer",
    },
  },
  {
    matchScore: 0.88,
    commonInterests: ["Hackathons", "Coffee Chats"],
    context: "Partnered with you on a hackathon showcase and the design system sprint for the TDP welcome portal.",
    user: {
      userId: "ENA493",
      fullName: "Jacky Lin",
      profilePhotoUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=facearea&w=256&h=256",
      location: "Plano, TX",
      org: "Card Tech",
      role: "Associate Software Engineer",
    },
  },
  {
    matchScore: 0.81,
    commonInterests: ["Coffee Chats", "Mentorship"],
    context: "You both run weekly coffee chat rotations for new hires and share mentorship playbooks.",
    user: {
      userId: "ENA494",
      fullName: "Kausar Alkaderi",
      profilePhotoUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=256&h=256",
      location: "Plano, TX",
      org: "Enterprise Platforms",
      role: "Associate Software Engineer",
    },
  },
  {
    matchScore: 0.78,
    commonInterests: ["AI Ethics", "Coffee Chats"],
    context: "Matthew is piloting responsible AI sessions that align with your community goals.",
    user: {
      userId: "ENA495",
      fullName: "Matthew Straughn",
      profilePhotoUrl: "https://images.unsplash.com/photo-1529539795054-3c162aab037a?auto=format&fit=facearea&w=256&h=256",
      location: "McLean, VA",
      org: "Enterprise Data",
      role: "Associate Software Engineer",
    },
  },
]

export const mockCommunityMatches: CommunityMatch[] = [
  {
    matchScore: 0.96,
    matchingInterests: ["Hackathons", "Design Systems"],
    community: {
      communityId: "comm-uuid-1",
      name: "Capital One Builders Guild",
      description: "Build, ship, and demo passion projects alongside fellow TDPs across tech stacks.",
      slackChannel: "#tdp-builders",
    },
  },
  {
    matchScore: 0.91,
    matchingInterests: ["Community Building", "Coffee Chats"],
    community: {
      communityId: "comm-uuid-2",
      name: "Wellness Warriors DFW",
      description: "Weekend pickleball ladders, hiking meetups, and coffee chat pairings in DFW.",
      slackChannel: "#tdp-wellness-dfw",
    },
  },
  {
    matchScore: 0.87,
    matchingInterests: ["AI Ethics", "Data Storytelling"],
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
    { id: "ENA487", name: "Rithvik Senthilkumar", group: 1 },
    { id: "ENA492", name: "Ananya Vangoor", group: 2 },
    { id: "ENA493", name: "Jacky Lin", group: 3 },
    { id: "ENA494", name: "Kausar Alkaderi", group: 2 },
    { id: "ENA495", name: "Matthew Straughn", group: 3 },
  ],
  links: [
    { source: "ENA487", target: "ENA492", relationship: "Hackathon Teammate" },
    { source: "ENA487", target: "ENA493", relationship: "Design System Sprint" },
    { source: "ENA487", target: "ENA494", relationship: "Coffee Chat Rotation" },
    { source: "ENA492", target: "ENA495", relationship: "AI Guild" },
    { source: "ENA493", target: "ENA494", relationship: "Community Launch" },
  ],
}
