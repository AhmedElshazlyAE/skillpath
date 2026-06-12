export type RoleMatch = {
  role: string
  field: string
  matchPercent: number
  description: string
  missingSkills: string[]
}

export type RoadmapResource = {
  name: string
  url: string
  free: boolean
  platform: string
}

export type RoadmapStep = {
  id: string
  title: string
  type: "course" | "certificate" | "book" | "project" | "concept"
  description: string
  resources: RoadmapResource[]
  durationWeeks: number
  skills: string[]
}

export type GeneratedRoadmap = {
  targetRole: string
  totalDurationWeeks: number
  skillGaps: string[]
  steps: RoadmapStep[]
  topCertificates: { name: string; provider: string; url: string }[]
  suggestedProjects: string[]
}
