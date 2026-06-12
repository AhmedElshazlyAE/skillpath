import { NextResponse } from "next/server"

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
const RETRY_DELAYS_MS = [3000, 6000, 9000]

class GeminiBusyError extends Error {}
class MissingGeminiKeyError extends Error {}

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string
      }[]
    }
  }[]
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stripJsonFences(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
}

async function generateGeminiJson(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) throw new MissingGeminiKeyError("GEMINI_API_KEY missing")

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
        },
      }),
    })

    if (res.status === 503) {
      if (attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt])
        continue
      }

      throw new GeminiBusyError("AI is busy")
    }

    if (!res.ok) {
      throw new Error(await res.text())
    }

    const data = (await res.json()) as GeminiResponse
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("") ?? ""

    return JSON.parse(stripJsonFences(text))
  }

  throw new GeminiBusyError("AI is busy")
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      skills?: unknown
      targetRole?: unknown
      jobDescription?: unknown
    }
    const skills = Array.isArray(body.skills)
      ? body.skills.filter((skill): skill is string => typeof skill === "string")
      : []
    const targetRole =
      typeof body.targetRole === "string" ? body.targetRole.trim() : ""
    const jobDescription =
      typeof body.jobDescription === "string" ? body.jobDescription.trim() : ""

    if (!targetRole && !jobDescription) {
      return NextResponse.json(
        { error: "Choose a role or provide a job description" },
        { status: 400 }
      )
    }

    const basePrompt = jobDescription
      ? `Analyze this job posting and create a personalized
learning roadmap. Job Description:
${jobDescription}

Candidate's current skills: ${skills.join(", ")}`
      : `Create a personalized learning roadmap for someone
who wants to become a ${targetRole}.
Their current skills: ${skills.join(", ")}`

    const prompt = `${basePrompt}

Use only completely free resources: freeCodeCamp, The Odin Project,
CS50, MIT OpenCourseWare, Coursera (audit mode), edX (audit mode),
official documentation, YouTube channels.

Return ONLY raw JSON — no markdown, no code fences:
{
  "targetRole": "string",
  "totalDurationWeeks": 20,
  "skillGaps": ["string"],
  "steps": [
    {
      "id": "step-1",
      "title": "string",
      "type": "course",
      "description": "string",
      "resources": [
        { "name": "string", "url": "string",
          "free": true, "platform": "string" }
      ],
      "durationWeeks": 3,
      "skills": ["string"]
    }
  ],
  "topCertificates": [
    { "name": "string", "provider": "string", "url": "string" }
  ],
  "suggestedProjects": ["string"]
}

Include 8 to 12 steps. Be specific and practical.`

    const data = await generateGeminiJson(prompt)

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof MissingGeminiKeyError) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 500 }
      )
    }

    if (error instanceof GeminiBusyError) {
      return NextResponse.json(
        { error: "AI is busy — retry in 1 minute" },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: "Could not generate roadmap" },
      { status: 500 }
    )
  }
}
