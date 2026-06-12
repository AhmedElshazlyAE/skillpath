import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown }
    const url = typeof body.url === "string" ? body.url.trim() : ""

    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    if (url.includes("linkedin.com")) {
      return NextResponse.json(
        {
          error:
            "LinkedIn links aren't supported due to their login wall. Please paste the job description as text instead.",
        },
        { status: 400 }
      )
    }

    const headers: Record<string, string> = {
      Accept: "text/plain",
      "X-Return-Format": "text",
    }

    if (process.env.JINA_API_KEY) {
      headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`
    }

    const res = await fetch(`https://r.jina.ai/${url}`, { headers })

    if (!res.ok) throw new Error("Fetch failed")

    let text = await res.text()
    text = text.slice(0, 5000)

    return NextResponse.json({ text, sourceUrl: url })
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not fetch that URL. Please paste the job description as text instead.",
      },
      { status: 500 }
    )
  }
}
