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
          maxOutputTokens: 1024,
          temperature: 0.5,
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
    const body = (await request.json()) as { skills?: unknown }
    const skills = Array.isArray(body.skills)
      ? body.skills.filter((skill): skill is string => typeof skill === "string")
      : []

    if (skills.length === 0) {
      return NextResponse.json(
        { error: "Add at least one skill before analyzing" },
        { status: 400 }
      )
    }

    const prompt = `You are a senior tech career advisor. A candidate has these skills:
${skills.join(", ")}.

Analyze their profile and return a granular breakdown of which specific
tech roles they are suited for. Be very specific — not just 'Data Science'
but 'Data Analyst', 'ML Engineer', 'Data Engineer', 'BI Developer' etc.
as separate entries.

Return ONLY raw JSON — no markdown, no code fences, nothing else:
{
  "matches": [
    {
      "role": "exact role title",
      "field": "one of: frontend/backend/fullstack/data-science/devops/cybersecurity/mobile/ui-ux",
      "matchPercent": 75,
      "description": "One sentence about what this role does.",
      "missingSkills": ["skill1", "skill2", "skill3"]
    }
  ]
}

Rules:
- Return 6 to 10 matches sorted by matchPercent descending
- Only include roles with matchPercent >= 15
- Be honest — if they have no relevant skills for a field, exclude it
- Be granular — multiple specific sub-roles per field is good
- missingSkills: the 3 most important missing skills for that role`

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
      { error: "Could not analyze skills" },
      { status: 500 }
    )
  }
}
