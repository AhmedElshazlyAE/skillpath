"use client"

import { useState } from "react"
import { Link } from "lucide-react"

type JobInputProps = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  isLoading: boolean
}

type FetchJobResponse = {
  text?: string
  error?: string
}

const VIBRANT_GRADIENT = "linear-gradient(135deg, #7C3AED, #a855f7)"
const MUTED_GRADIENT = "linear-gradient(135deg, #c4b5fd, #d8b4fe)"

export default function JobInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: JobInputProps) {
  const [activeTab, setActiveTab] = useState<"url" | "description">("url")
  const [url, setUrl] = useState("")
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  async function handleFetchJob() {
    setFetchError(null)
    setIsFetching(true)

    try {
      const res = await fetch("/api/fetch-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = (await res.json()) as FetchJobResponse

      if (data.error) throw new Error(data.error)
      if (!data.text) throw new Error("Could not fetch job description")

      onChange(data.text)
      setActiveTab("description")
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Could not fetch job description"
      )
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <section>
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-400 text-xs">or target a specific job</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-slate-900">
          Have a specific job posting?
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Paste the URL or the job description for a tailored roadmap.
        </p>

        <div className="inline-flex rounded-full bg-slate-100 p-1 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            style={activeTab === "url" ? { background: VIBRANT_GRADIENT } : undefined}
            className={
              activeTab === "url"
                ? "text-white rounded-full px-4 py-1.5 text-sm"
                : "text-slate-500 text-sm px-4 py-1.5"
            }
          >
            Paste URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            style={
              activeTab === "description"
                ? { background: VIBRANT_GRADIENT }
                : undefined
            }
            className={
              activeTab === "description"
                ? "text-white rounded-full px-4 py-1.5 text-sm"
                : "text-slate-500 text-sm px-4 py-1.5"
            }
          >
            Paste Description
          </button>
        </div>

        {activeTab === "url" ? (
          <div className="mt-4">
            <div className="relative">
              <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://jobs.example.com/..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <p className="text-slate-400 text-xs mt-1">
              &#9888; LinkedIn links aren't supported
            </p>
            {fetchError && (
              <p className="text-red-500 text-xs mt-2">{fetchError}</p>
            )}
            <button
              type="button"
              onClick={handleFetchJob}
              disabled={url.trim() === "" || isFetching}
              className="mt-3 rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-600 hover:border-violet-400 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isFetching ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                  Fetching...
                </span>
              ) : (
                "Fetch Description"
              )}
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[120px] w-full rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none p-3 text-sm outline-none"
            />
            <p className="text-right text-xs text-slate-400 mt-1">
              {value.length} characters
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={value.trim() === "" || isLoading}
          style={{
            background: value.trim() === "" ? MUTED_GRADIENT : VIBRANT_GRADIENT,
          }}
          className="w-full text-white font-semibold rounded-xl py-3.5 text-sm mt-5 hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Generating roadmap...
            </span>
          ) : (
            "Generate My Roadmap \u2192"
          )}
        </button>
      </div>
    </section>
  )
}
